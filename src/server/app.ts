// HTTP layer: routing, JSON, identity, errors and static files. node:http only.

import { Download } from './download.ts';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import type { RunnerService } from '../app/runner.ts';
import { SearchService } from '../app/search.ts';
import { injectHead, pageMeta, robotsTxt, siteBase, sitemapXml } from './seo.ts';
import { extname, join, normalize, resolve } from 'node:path';
import { timingSafeEqual } from 'node:crypto';
import { AppError, type LearningService } from '../app/service.ts';
import type { ReadingService } from '../reading/service.ts';
import { type InstructorService, seedDemoData } from '../app/instructor.ts';
import type { LearnerService } from '../app/learner.ts';
import type { WatchService } from '../app/watch.ts';
import type { VideoExtrasService } from '../app/video-extras.ts';
import { chatPage } from '../app/ask-context.ts';
import type { LabService } from '../app/labs.ts';
import type { TutorialService } from '../app/tutorials.ts';
import type { AdminService } from '../app/admin.ts';
import type { QuestionBankService } from '../app/question-bank.ts';
import type { ClassService, Staff } from '../app/classes.ts';
import type { OrderService } from '../app/orders.ts';
import { StaleStateError, type Store } from '../store/store.ts';
import { AuthError, clearAnonCookie, type Authenticator } from './auth.ts';
import { LESSONS } from '../content/lessons.ts';
import { allCourses } from '../content/courses.ts';

const MAX_BODY_BYTES = 16 * 1024;

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.mjs': 'text/javascript; charset=utf-8',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
};

export interface AppDeps {
  learning: LearningService;
  reading: ReadingService;
  instructor: InstructorService;
  learner: LearnerService;
  labs: LabService;
  watch: WatchService;
  extras: VideoExtrasService;
  tutorials: TutorialService;
  admin?: AdminService;
  classes?: ClassService;
  questionBank?: QuestionBankService;
  orders?: OrderService;
  runner?: RunnerService;
  search?: SearchService;
  store?: Store;
  auth: Authenticator;
  /** content-kit/tools/lab-model.mjs, served to the browser as /lab-model.js */
  labModelFile: string;
  publicDir: string;
  config: {
    supabaseUrl: string | null;
    supabaseAnonKey: string | null;
    aiDescription: string;
    liveSearch: boolean;
    storeKind: string;
    instructorKey: string | null;
    /** No instructor key on a public deploy: editing course content is refused. */
    editLocked: boolean;
    allowSeed: boolean;
    /** Ask AI answers per learner per day on the free plan. */
    freeDailyAi?: number;
    /** Public address for links in the sitemap and share previews, e.g. https://loopnlogic.com */
    siteUrl?: string | null;
  };
}

type Ctx = { req: IncomingMessage; params: Record<string, string>; query: URLSearchParams; body: any; learnerId: string; email: string | null; anonId?: string; signedIn?: boolean; headers: Record<string, string>; staff?: Staff };
type Handler = (ctx: Ctx) => unknown;
interface Route {
  method: string;
  pattern: RegExp;
  keys: string[];
  handler: Handler;
  /** editor = instructor, but refused outright when editing is locked (public deploy without a key). admin = signed in and an admin. */
  auth: 'learner' | 'instructor' | 'editor' | 'admin' | 'staff' | 'none';
  maxBody?: number;
}

function route(method: string, path: string, handler: Handler, auth: Route['auth'] = 'learner', maxBody?: number): Route {
  const keys: string[] = [];
  const pattern = new RegExp('^' + path.replace(/:(\w+)/g, (_, k: string) => (keys.push(k), '([^/]+)')) + '$');
  return { method, pattern, keys, handler, auth, maxBody };
}

async function readJson(req: IncomingMessage, limit = MAX_BODY_BYTES): Promise<any> {
  if (req.method === 'GET' || req.method === 'HEAD') return {};
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > limit) throw new AppError('payload_too_large', 413, 'Request body is too large.');
    chunks.push(chunk as Buffer);
  }
  if (size === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new AppError('bad_json', 400, 'Request body must be JSON.');
  }
}

function send(res: ServerResponse, status: number, data: unknown, headers: Record<string, string> = {}) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...headers });
  res.end(JSON.stringify(data));
}

function sameSecret(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function buildRoutes(d: AppDeps): Route[] {
  const { learning, reading, instructor, learner, labs, watch, extras, tutorials } = d;
  const lang = (v: unknown) => (v === 'bn' ? 'bn' : 'en');
  const bank = () => { if (!d.questionBank) throw new AppError('unavailable', 503, 'Question bank is unavailable.'); return d.questionBank; };
  const search = d.search ?? (d.search = new SearchService(tutorials, d.admin));
  const cls = () => {
    if (!d.classes) throw new AppError('unavailable', 503, 'Classes are not available on this server.');
    return d.classes;
  };
  const ord = () => {
    if (!d.orders) throw new AppError('unavailable', 503, 'Buying is not available on this server.');
    return d.orders;
  };
  const adm = () => {
    if (!d.admin) throw new AppError('unavailable', 503, 'The admin site is not available on this server.');
    return d.admin;
  };
  return [
    route('GET', '/api/health', () => ({ ok: true, service: 'loop-logic' }), 'none'),
    route('GET', '/api/config', () => ({
      authMode: d.auth.mode,
      supabaseUrl: d.auth.mode !== 'anonymous' ? d.config.supabaseUrl : null,
      supabaseAnonKey: d.auth.mode !== 'anonymous' ? d.config.supabaseAnonKey : null, // public by design
      ai: d.config.aiDescription,
      liveSearch: d.config.liveSearch,
      store: d.config.storeKind,
      instructorKeyRequired: Boolean(d.config.instructorKey),
      editing: d.config.instructorKey ? 'key' : d.config.editLocked ? 'locked' : 'open',
      freeDailyAi: d.config.freeDailyAi ?? 10,
      runner: d.runner ? d.runner.status() : { enabled: false, languages: [] },
      lessons: LESSONS.map((l) => ({ id: l.id, subject: l.subject, title: l.title, summary: l.summary })),
    }), 'none'),
    route('GET', '/api/me', async ({ learnerId, email, signedIn }) => {
      const isIn = Boolean(signedIn) || d.auth.mode === 'supabase';
      if (isIn && d.admin) await d.admin.touchMember(learnerId, email);
      return { learnerId, email, signedIn: isIn, role: isIn && d.admin ? d.admin.roleOf(email) : 'learner' };
    }),
    route('POST', '/api/auth/claim', async ({ req, learnerId, anonId, signedIn, headers }) => {
      if (!signedIn || !anonId || anonId === learnerId || !d.store) return { moved: 0 };
      const moved = await d.store.claimLearner(anonId, learnerId);
      headers['set-cookie'] = clearAnonCookie(req);
      return { moved };
    }),

    // catalog, dashboard, profile
    route('GET', '/api/courses', ({ query }) => learner.catalog(lang(query.get('lang'))), 'none'),
    route('GET', '/api/courses/:id', ({ params, query, learnerId }) => learner.course(params.id!, learnerId, lang(query.get('lang')))),
    route('GET', '/api/dashboard', ({ query, learnerId }) => learner.dashboard(learnerId, lang(query.get('lang')))),
    route('GET', '/api/profile', ({ query, learnerId }) => learner.profileView(learnerId, lang(query.get('lang')))),
    route('GET', '/api/profile/export', ({ learnerId }) => learner.exportData(learnerId)),
    route('POST', '/api/profile/reset', ({ body, learnerId }) => learner.reset(learnerId, body.scope)),

    // video courses (YouTube playlists played in the site)
    route('GET', '/api/courses/:id/videos', ({ params, query, learnerId }) => watch.view(params.id!, learnerId, lang(query.get('lang')), query.get('v'))),
    route('POST', '/api/courses/:id/videos/:vid/quiz', ({ params, body, learnerId }) => watch.quiz(params.id!, params.vid!, learnerId, body.answers)),
    route('GET', '/api/videos/:vid/extras', ({ params }) => extras.forEditor(params.vid!), 'editor'),
    route('POST', '/api/videos/:vid/extras', ({ params, body }) => extras.save(params.vid!, body), 'editor', 1024 * 1024),
    route('GET', '/api/instructor/video-extras', () => extras.exportAll(), 'editor'),
    route('POST', '/api/courses/:id/videos/watched', ({ params, body, learnerId }) => watch.mark(params.id!, learnerId, { videoId: body.videoId, watched: body.watched })),

    // tutorials (content-kit packages)
    route('GET', '/api/learn', ({ query }) => tutorials.list(lang(query.get('lang'))), 'none'),
    // site-wide search (topics, labs, courses, videos, posts); suggest=1 gives the best few for the top-bar box
    route('GET', '/api/search', ({ query }) => search.search(String(query.get('q') ?? ''), lang(query.get('lang')), { limit: query.get('suggest') ? 8 : undefined }), 'none'),
    // run code in an outside sandbox (unchanged examples answer from their verified output)
    route('POST', '/api/run', ({ body, learnerId, signedIn }) => {
      if (!d.runner) throw new AppError('runner_off', 503, 'Running code is not available on this server.');
      return d.runner.run(body ?? {}, { learnerId, signedIn: Boolean(signedIn) || d.auth.mode === 'supabase' });
    }, 'learner', 64 * 1024),
    route('GET', '/api/learn-search', ({ query }) => tutorials.search(String(query.get('q') ?? '').slice(0, 120), lang(query.get('lang'))), 'none'),
    route('POST', '/api/waitlist', async ({ body, learnerId }) => {
      const email = String(body.email ?? '').trim().toLowerCase();
      const L = lang(body.lang);
      if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) throw new AppError('bad_email', 400, L === 'bn' ? 'সঠিক ইমেইল ঠিকানা লেখো।' : 'Enter a valid email address.');
      if (!d.store) throw new AppError('unavailable', 503, 'The waitlist is not available right now.');
      const added = await d.store.addWaitlist({ email, plan: body.plan === 'live' ? 'live' : 'pro', lang: L, learnerId: learnerId || null, createdAt: new Date().toISOString() });
      return { ok: true, already: !added };
    }),
    route('GET', '/api/learn/:track', ({ params, query }) => tutorials.track(params.track!, lang(query.get('lang'))), 'none'),
    route('GET', '/api/learn/:track/:topic', ({ params, query }) => tutorials.topic(params.track!, params.topic!, lang(query.get('lang'))), 'none'),
    route('POST', '/api/learn/:track/:topic/quiz', ({ params, body, learnerId }) => tutorials.gradeQuiz(params.track!, params.topic!, learnerId, body.answers, lang(body.lang))),
    route('GET', '/api/learn/:track/:topic/practice/:pid', ({ params, query }) => tutorials.solution(params.track!, params.topic!, params.pid!, lang(query.get('lang'))), 'none'),
    route('GET', '/api/learn/:track/:topic/labs/:lab', ({ params, query }) => tutorials.lab(params.track!, params.topic!, params.lab!, lang(query.get('lang'))), 'none'),
    route('POST', '/api/learn/:track/:topic/labs/:lab/run', ({ params, body }) => tutorials.runLab(params.track!, params.topic!, params.lab!, body.input, lang(body.lang)), 'none'),

    // labs
    route('GET', '/api/labs', ({ query }) => ({ labs: labs.list(lang(query.get('lang'))) }), 'none'),
    route('GET', '/api/labs/:id', ({ params, query, learnerId }) => labs.get(params.id!, learnerId, lang(query.get('lang')))),
    route('POST', '/api/labs/:id/check', ({ params, body, learnerId }) => labs.check(params.id!, learnerId, { checkId: body.checkId, choice: body.choice, lang: lang(body.lang) })),

    // practice loop
    route('POST', '/api/sessions', ({ body, learnerId }) => learning.startSession({ learnerId, lang: body.lang, demo: body.demo })),
    route('GET', '/api/sessions/:id', ({ params, learnerId }) => learning.getState(params.id!, learnerId)),
    route('POST', '/api/sessions/:id/language', ({ params, body, learnerId }) => learning.setLanguage(params.id!, learnerId, body.lang)),
    route('POST', '/api/sessions/:id/attempts', ({ params, body, learnerId }) =>
      learning.submitAttempt(params.id!, learnerId, { idempotencyKey: body.idempotencyKey, expectedRevision: body.expectedRevision, answer: body.answer }),
    ),
    route('POST', '/api/sessions/:id/help', ({ params, learnerId }) => learning.requestHelp(params.id!, learnerId)),
    route('POST', '/api/sessions/:id/transfer', ({ params, learnerId }) => learning.startTransfer(params.id!, learnerId)),
    route('POST', '/api/sessions/:id/transfer/submit', ({ params, body, learnerId }) =>
      learning.submitTransfer(params.id!, learnerId, { idempotencyKey: body.idempotencyKey, answer: body.answer }),
    ),
    route('GET', '/api/sessions/:id/receipt', ({ params, learnerId }) => learning.receipt(params.id!, learnerId)),
    route('GET', '/api/sessions/:id/trace/:attemptId', ({ params, learnerId }) => learning.trace(params.id!, learnerId, params.attemptId!)),
    route('POST', '/api/sessions/:id/reset', ({ params, learnerId }) => learning.reset(params.id!, learnerId)),

    // personalised reading
    route('GET', '/api/lessons/:id', ({ params, query, learnerId }) => reading.getLesson(params.id!, learnerId, { lang: lang(query.get('lang')), original: query.get('original') === '1' })),
    route('POST', '/api/reading-events', ({ body, learnerId }) => reading.recordEvents(learnerId, body.events)),
    route('POST', '/api/selection-help', ({ body, learnerId }) =>
      reading.help(learnerId, {
        lessonId: String(body.lessonId ?? ''),
        blockId: String(body.blockId ?? ''),
        text: typeof body.text === 'string' ? body.text : undefined,
        action: body.action,
        lang: lang(body.lang),
        prereqAnswer: Number.isInteger(body.prereqAnswer) ? body.prereqAnswer : undefined,
        skipPrereq: body.skipPrereq === true,
        depth: body.depth === 'full' || body.depth === 'enough' ? body.depth : undefined,
        variant: ['simpler', 'example', 'more'].includes(body.variant) ? body.variant : undefined,
        latest: body.latest === true,
        question: typeof body.question === 'string' ? body.question : undefined,
      }),
    ),
    route('POST', '/api/quiz/check', ({ body, learnerId }) => reading.checkQuiz(learnerId, { lessonId: String(body.lessonId ?? ''), blockId: String(body.blockId ?? ''), choice: Number(body.choice), lang: lang(body.lang) })),
    route('POST', '/api/ask', async ({ body, learnerId }) =>
      reading.chat(learnerId, { question: body.question, selection: body.selection, history: body.history, lang: lang(body.lang), page: await chatPage(body.page, lang(body.lang), extras, tutorials, typeof body.question === 'string' ? body.question : '') })),
    route('GET', '/api/ask/limit', ({ learnerId }) => ({ left: reading.aiCallsLeft(learnerId) })),
    route('POST', '/api/selection-help/feedback', ({ body, learnerId }) => reading.feedback(learnerId, { lessonId: String(body.lessonId ?? ''), blockId: String(body.blockId ?? ''), value: String(body.value ?? ''), lang: lang(body.lang) })),


    // public: announcement bar, homepage tabs, ads, posts, course-wise labs, coupons
    route('GET', '/api/site', ({ query }) => adm().publicSite(lang(query.get('lang'))), 'none'),
    route('GET', '/api/ads', ({ query, signedIn }) => adm().publicAds(String(query.get('page') ?? ''), Boolean(signedIn) || d.auth.mode === 'supabase', lang(query.get('lang')))),
    route('POST', '/api/ads/:id/event', ({ params, body }) => adm().adEvent(params.id!, body.type), 'none'),
    route('GET', '/api/posts', ({ query }) => adm().publicPosts(lang(query.get('lang'))), 'none'),
    route('GET', '/api/posts/:slug', ({ params, query }) => adm().publicPost(params.slug!, lang(query.get('lang'))), 'none'),
    route('GET', '/api/learn-labs/:track', ({ params, query }) => tutorials.labIndex(params.track!, lang(query.get('lang'))), 'none'),
    route('POST', '/api/coupons/check', ({ body, email }) => adm().checkCoupon(body.code, String(body.target ?? 'all'), email)),

    // admin site (signed in, and an admin)
    route('GET', '/api/admin/me', ({ email }) => ({ email, role: adm().roleOf(email), config: adm().config() }), 'admin'),
    route('GET', '/api/admin/overview', () => adm().overview(), 'admin'),
    route('GET', '/api/admin/tutorials', () => adm().tutorialsAdmin(), 'admin'),
    route('POST', '/api/admin/tracks/:id/visibility', ({ params, body, email }) => adm().setBuiltInHidden(email!, 'track', params.id!, body.hidden === true), 'admin'),
    route('POST', '/api/admin/custom-tracks', ({ body, email }) => adm().saveTrack(email!, body), 'admin'),
    route('POST', '/api/admin/custom-tracks/:id', ({ params, body, email }) => adm().saveTrack(email!, body, params.id!), 'admin'),
    route('GET', '/api/admin/topics/:id', ({ params }) => adm().getTopic(params.id!), 'admin'),
    route('POST', '/api/admin/topics', ({ body, email }) => adm().saveTopic(email!, body), 'admin', 512 * 1024),
    route('POST', '/api/admin/topics/:id', ({ params, body, email }) => adm().saveTopic(email!, body, params.id!), 'admin', 512 * 1024),
    route('DELETE', '/api/admin/topics/:id', ({ params, email }) => adm().deleteTopic(email!, params.id!), 'admin'),
    route('GET', '/api/admin/courses', () => adm().adminCourses(), 'admin'),
    route('POST', '/api/admin/youtube/playlist', ({ body }) => adm().importPlaylist(body.url), 'admin'),
    route('GET', '/api/admin/courses/:id', ({ params }) => adm().getCourse(params.id!), 'admin'),
    route('POST', '/api/admin/courses', ({ body, email }) => adm().saveCourse(email!, body), 'admin', 256 * 1024),
    route('POST', '/api/admin/courses/:id', ({ params, body, email }) => adm().saveCourse(email!, body, params.id!), 'admin', 256 * 1024),
    route('DELETE', '/api/admin/courses/:id', ({ params, email }) => adm().deleteCourse(email!, params.id!), 'admin'),
    route('POST', '/api/admin/courses/:id/sync', ({ params, email }) => adm().syncCourse(email!, params.id!), 'admin'),
    route('POST', '/api/admin/builtin-courses/:id/visibility', ({ params, body, email }) => adm().setBuiltInHidden(email!, 'course', params.id!, body.hidden === true), 'admin'),
    route('GET', '/api/admin/courses/:id/access', ({ params }) => adm().courseGrants(params.id!), 'admin'),
    route('POST', '/api/admin/courses/:id/access', ({ params, body, email }) => adm().grantAccess(email!, params.id!, body.email), 'admin'),
    route('DELETE', '/api/admin/courses/:id/access/:learner', ({ params, email }) => adm().revokeAccess(email!, params.id!, params.learner!), 'admin'),
    route('GET', '/api/admin/posts', () => ({ posts: adm().posts() }), 'admin'),
    route('GET', '/api/admin/posts/:id', ({ params }) => adm().getPost(params.id!), 'admin'),
    route('POST', '/api/admin/posts', ({ body, email }) => adm().savePost(email!, body), 'admin', 512 * 1024),
    route('POST', '/api/admin/posts/:id', ({ params, body, email }) => adm().savePost(email!, body, params.id!), 'admin', 512 * 1024),
    route('DELETE', '/api/admin/posts/:id', ({ params, email }) => adm().deletePost(email!, params.id!), 'admin'),
    route('GET', '/api/admin/ads', () => ({ ads: adm().ads() }), 'admin'),
    route('POST', '/api/admin/ads', ({ body, email }) => adm().saveAd(email!, body), 'admin'),
    route('POST', '/api/admin/ads/:id', ({ params, body, email }) => adm().saveAd(email!, body, params.id!), 'admin'),
    route('DELETE', '/api/admin/ads/:id', ({ params, email }) => adm().deleteAd(email!, params.id!), 'admin'),
    route('GET', '/api/admin/coupons', () => ({ coupons: adm().coupons() }), 'admin'),
    route('POST', '/api/admin/coupons', ({ body, email }) => adm().saveCoupon(email!, body), 'admin'),
    route('POST', '/api/admin/coupons/:code', ({ params, body, email }) => adm().saveCoupon(email!, body, params.code!), 'admin'),
    route('DELETE', '/api/admin/coupons/:code', ({ params, email }) => adm().deleteCoupon(email!, params.code!), 'admin'),
    route('GET', '/api/admin/announcement', () => adm().announcementAdmin(), 'admin'),
    route('POST', '/api/admin/announcement', ({ body, email }) => adm().saveAnnouncement(email!, body), 'admin'),
    route('POST', '/api/admin/hub-tabs', ({ body, email }) => adm().saveHubTabs(email!, body.tabs), 'admin'),
    route('GET', '/api/admin/users', () => adm().users(), 'admin'),
    route('POST', '/api/admin/roles', ({ body, email }) => adm().setRole(email!, body.email, body.role), 'admin'),
    route('GET', '/api/admin/waitlist', async () => ({ waitlist: await adm().waitlist(), count: await d.store!.waitlistCount() }), 'admin'),
    route('POST', '/api/admin/waitlist/export', async ({ email }) => ({ csv: await adm().waitlistCsv(email!) }), 'admin'),
    route('GET', '/api/admin/ai', () => adm().ai(), 'admin'),
    route('GET', '/api/admin/audit', () => adm().auditLog(), 'admin'),

    // buying a paid course (bKash / Nagad, checked by an admin)
    route('GET', '/api/buy/:course', ({ params, query, learnerId, email, signedIn }) => ord().page(learnerId, email, Boolean(signedIn) || d.auth.mode === 'supabase', params.course!, lang(query.get('lang')))),
    route('POST', '/api/buy/:course/quote', ({ params, body, learnerId, email }) => ord().quote(learnerId, email, params.course!, body.coupon)),
    route('POST', '/api/buy/:course', ({ params, body, learnerId, email, signedIn }) => ord().submit(learnerId, email, Boolean(signedIn) || d.auth.mode === 'supabase', params.course!, body)),
    route('GET', '/api/my-orders', ({ learnerId }) => ord().mine(learnerId)),
    route('POST', '/api/orders/:id/cancel', ({ params, learnerId }) => ord().cancel(learnerId, params.id!)),
    route('GET', '/api/admin/orders', ({ query }) => ord().adminList(String(query.get('status') ?? 'pending')), 'admin'),
    route('POST', '/api/admin/orders/:id/approve', ({ params, email }) => ord().decide(email!, params.id!, true, null), 'admin'),
    route('POST', '/api/admin/orders/:id/reject', ({ params, body, email }) => ord().decide(email!, params.id!, false, body.reason), 'admin'),
    route('GET', '/api/admin/payments', () => adm().paymentSettings(), 'admin'),
    route('POST', '/api/admin/payments', ({ body, email }) => adm().savePaymentSettings(email!, body), 'admin'),

    // students and classes
    route('POST', '/api/learn-activity', ({ body, learnerId }) => tutorials.recordActivity(learnerId, body)),
    route('POST', '/api/classes/join', ({ body, learnerId, email, signedIn }) => cls().join(learnerId, email, Boolean(signedIn) || d.auth.mode === 'supabase', body.code)),
    route('GET', '/api/my-classes', ({ learnerId }) => cls().studentClasses(learnerId)),
    route('POST', '/api/classes/:id/leave', ({ params, learnerId }) => cls().leave(learnerId, params.id!)),

    // instructor dashboard (signed in, instructor or admin)
    route('GET', '/api/instructor/question-bank', ({ staff }) => bank().list(staff!), 'staff'),
    route('POST', '/api/instructor/question-bank', ({ staff, body }) => bank().save(staff!, body), 'staff', 64 * 1024),
    route('PUT', '/api/instructor/question-bank/:id', ({ staff, params, body }) => bank().save(staff!, body, params.id!), 'staff', 64 * 1024),
    route('DELETE', '/api/instructor/question-bank/:id', ({ staff, params }) => bank().delete(staff!, params.id!), 'staff'),
    route('GET', '/api/custom-quizzes/:id', ({ learnerId, params, query }) => bank().quiz(learnerId, params.id!, lang(query.get('lang'))), 'learner'),
    route('POST', '/api/custom-quizzes/:id/grade', ({ learnerId, params, body }) => bank().grade(learnerId, params.id!, body?.answers, lang(body?.lang)), 'learner'),
    route('GET', '/api/instructor/meta', () => ({ tracks: tutorials.adminTracks().filter((t) => t.delivered && !t.hidden).map((t) => ({ id: t.id, title: t.title })), courses: allCourses().map((c) => ({ id: c.id, title: c.title.en })) }), 'staff'),
    route('GET', '/api/instructor/classes', ({ staff }) => cls().myClasses(staff!), 'staff'),
    route('POST', '/api/instructor/classes', ({ body, staff }) => cls().saveClass(staff!, body), 'staff'),
    route('GET', '/api/instructor/classes/:id/gradebook.csv', async ({ params, staff, query }) => new Download(await cls().gradebookCsv(staff!, params.id!, lang(query.get('lang'))), 'text/csv; charset=utf-8', 'gradebook.csv'), 'staff'),
    route('GET', '/api/instructor/classes/:id', ({ params, staff, query }) => cls().dashboard(staff!, params.id!, lang(query.get('lang'))), 'staff'),
    route('POST', '/api/instructor/classes/:id', ({ params, body, staff }) => cls().saveClass(staff!, body, params.id!), 'staff'),
    route('DELETE', '/api/instructor/classes/:id', ({ params, staff }) => cls().archiveClass(staff!, params.id!), 'staff'),
    route('POST', '/api/instructor/classes/:id/code', ({ params, staff }) => cls().newCode(staff!, params.id!), 'staff'),
    route('GET', '/api/instructor/classes/:id/studio', ({ params, staff, query }) => cls().studio(staff!, params.id!, lang(query.get('lang'))), 'staff'),
    route('POST', '/api/instructor/classes/:id/requests/:learner', ({ params, body, staff }) => cls().approve(staff!, params.id!, params.learner!, body.approve === true), 'staff'),
    route('POST', '/api/instructor/classes/:id/assignments', ({ params, body, staff }) => cls().saveAssignment(staff!, params.id!, body), 'staff'),
    route('POST', '/api/instructor/classes/:id/assignments/:aid', ({ params, body, staff }) => cls().saveAssignment(staff!, params.id!, body, params.aid!), 'staff'),
    route('DELETE', '/api/instructor/classes/:id/assignments/:aid', ({ params, staff }) => cls().deleteAssignment(staff!, params.id!, params.aid!), 'staff'),
    route('POST', '/api/instructor/classes/:id/posts', ({ params, body, staff }) => cls().post(staff!, params.id!, body), 'staff'),
    route('DELETE', '/api/instructor/classes/:id/posts/:pid', ({ params, staff }) => cls().deletePost(staff!, params.id!, params.pid!), 'staff'),
    route('GET', '/api/instructor/packs', ({ staff }) => cls().packs(staff!), 'staff'),
    route('POST', '/api/instructor/packs', ({ body, staff }) => cls().savePack(staff!, body), 'staff', 128 * 1024),
    route('POST', '/api/instructor/packs/:id', ({ params, body, staff }) => cls().savePack(staff!, body, params.id!), 'staff', 128 * 1024),
    route('GET', '/api/admin/packs', ({ staff }) => cls().packs(staff!, true), 'admin'),
    route('POST', '/api/admin/packs/:id/review', ({ params, body, staff }) => cls().reviewPack(staff!, params.id!, body.approve === true, body.note), 'admin'),

    // instructor (old practice-loop overview)
    route('GET', '/api/instructor/overview', () => instructor.overview(), 'instructor'),
    route('POST', '/api/instructor/seed-demo', async () => {
      if (!d.config.allowSeed) throw new AppError('forbidden', 403, 'Demo seeding is turned off.');
      return seedDemoData(learning, reading);
    }, 'instructor'),
  ];
}

export function createApp(d: AppDeps) {
  const routes = buildRoutes(d);
  const publicDir = resolve(d.publicDir);
  const connect = ["'self'", d.config.supabaseUrl && d.auth.mode !== 'anonymous' ? new URL(d.config.supabaseUrl).origin : ''].filter(Boolean).join(' ');
  const csp = `default-src 'self'; img-src 'self' data: https://i.ytimg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; connect-src ${connect}; frame-src https://www.youtube-nocookie.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`;

  async function serveStatic(req: IncomingMessage, res: ServerResponse, pathname: string, query: URLSearchParams) {
    const base = siteBase(req.headers, d.config.siteUrl);
    const seo = { tutorials: d.tutorials, admin: d.admin, search: d.search! };
    if (pathname === '/robots.txt' || pathname === '/sitemap.xml') {
      const text = pathname === '/robots.txt' ? robotsTxt(base) : sitemapXml(base, seo);
      res.writeHead(200, { 'content-type': pathname === '/robots.txt' ? 'text/plain; charset=utf-8' : 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600', 'x-content-type-options': 'nosniff' });
      return res.end(req.method === 'HEAD' ? undefined : text);
    }
    const rel = pathname === '/' ? '/index.html' : pathname;
    let file = normalize(join(publicDir, rel));
    if (pathname === '/lab-model.js') file = d.labModelFile;
    else if (pathname.startsWith('/learn-assets/')) {
      const [, , track, topic, name] = pathname.split('/');
      const p = track && topic && name ? d.tutorials.assetPath(track, topic, name) : null;
      if (!p) return send(res, 404, { error: { code: 'not_found', message: 'Not found' } });
      file = p;
    } else if (!file.startsWith(publicDir)) return send(res, 404, { error: { code: 'not_found', message: 'Not found' } });
    try {
      const info = await stat(file);
      if (!info.isFile()) throw new Error('not a file');
      let data: Buffer | string = await readFile(file);
      if (extname(file) === '.html') data = injectHead(data.toString('utf8'), pageMeta(pathname, query, base, seo));
      res.writeHead(200, {
        'content-type': (pathname === '/lab-model.js' ? MIME['.js'] : MIME[extname(file)]) ?? 'application/octet-stream',
        'cache-control': 'no-cache',
        'x-content-type-options': 'nosniff',
        'referrer-policy': 'same-origin',
        'content-security-policy': csp,
      });
      res.end(req.method === 'HEAD' ? undefined : data);
    } catch {
      send(res, 404, { error: { code: 'not_found', message: 'Not found' } });
    }
  }

  return createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const headers: Record<string, string> = {};
    try {
      if (!url.pathname.startsWith('/api/')) return await serveStatic(req, res, url.pathname, url.searchParams);
      const match = routes
        .filter((r) => r.method === req.method)
        .map((r) => ({ r, m: r.pattern.exec(url.pathname) }))
        .find((x) => x.m);
      if (!match) return send(res, 404, { error: { code: 'not_found', message: 'No such endpoint' } });

      let learnerId = '';
      let email: string | null = null;
      let anonId: string | undefined;
      let signedIn: boolean | undefined;
      let staff: Staff | undefined;
      // Signed-in instructors and admins may also use the older instructor and editor endpoints.
      const staffFor = (id: { learnerId: string; email: string | null; signedIn?: boolean }) => {
        const isIn = Boolean(id.signedIn) || d.auth.mode === 'supabase';
        const role = isIn && id.email && d.admin ? d.admin.roleOf(id.email) : 'learner';
        return role === 'admin' || role === 'instructor' ? { learnerId: id.learnerId, email: id.email!, role } as Staff : undefined;
      };
      if ((match.r.auth === 'instructor' || match.r.auth === 'editor') && String(req.headers.authorization ?? '').startsWith('Bearer ')) {
        staff = staffFor(await d.auth.identify(req));
      }
      if (staff) {
        /* signed-in staff: allowed */
      } else if (match.r.auth === 'learner' || match.r.auth === 'admin' || match.r.auth === 'staff') {
        const id = await d.auth.identify(req);
        learnerId = id.learnerId;
        email = id.email;
        anonId = id.anonId;
        signedIn = id.signedIn;
        if (id.setCookie) headers['set-cookie'] = id.setCookie;
        if (match.r.auth === 'admin' || match.r.auth === 'staff') {
          const isIn = Boolean(id.signedIn) || d.auth.mode === 'supabase';
          if (!isIn || !id.email) throw new AuthError(match.r.auth === 'admin' ? 'Sign in with your admin account.' : 'Sign in with your instructor account.');
          staff = staffFor(id);
          if (match.r.auth === 'admin' && staff?.role !== 'admin') throw new AppError('forbidden', 403, 'This account is not an admin. Ask an admin to give you the role.');
          if (match.r.auth === 'staff' && !staff) throw new AppError('forbidden', 403, 'This account is not an instructor yet. Ask an admin to give you the instructor role.');
        }
      } else if (match.r.auth === 'editor' && !d.config.instructorKey && d.config.editLocked) {
        throw new AppError('edit_locked', 403, 'Editing is turned off until an instructor key (INSTRUCTOR_KEY) is set on the server.');
      } else if ((match.r.auth === 'instructor' || match.r.auth === 'editor') && d.config.instructorKey) {
        const given = String(req.headers['x-instructor-key'] ?? '');
        if (!given || !sameSecret(given, d.config.instructorKey)) throw new AppError('forbidden', 403, 'Instructor key required.');
      }

      const params: Record<string, string> = {};
      match.r.keys.forEach((k, i) => (params[k] = decodeURIComponent(match.m![i + 1]!)));
      const body = await readJson(req, match.r.maxBody);
      const result = await match.r.handler({ req, params, query: url.searchParams, body, learnerId, email, anonId, signedIn, headers, staff });
      if (result instanceof Download) {
        res.writeHead(200, { ...headers, 'content-type': result.contentType, 'content-disposition': `attachment; filename="${result.filename}"`, 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
        return res.end(result.body);
      }
      send(res, req.method === 'POST' && url.pathname === '/api/sessions' ? 201 : 200, result, headers);
    } catch (err) {
      if (err instanceof AppError) return send(res, err.status, { error: { code: err.code, message: err.message, details: err.details } }, headers);
      if (err instanceof AuthError) return send(res, 401, { error: { code: err.code, message: err.message } }, headers);
      if (err instanceof StaleStateError) return send(res, 409, { error: { code: err.code, message: err.message } }, headers);
      console.error(err);
      send(res, 500, { error: { code: 'internal', message: 'Something went wrong. Nothing was saved.' } }, headers);
    }
  });
}
