// HTTP layer: routing, JSON, identity, errors and static files. node:http only.

import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { timingSafeEqual } from 'node:crypto';
import { AppError, type LearningService } from '../app/service.ts';
import type { ReadingService } from '../reading/service.ts';
import { type InstructorService, seedDemoData } from '../app/instructor.ts';
import type { LearnerService } from '../app/learner.ts';
import type { LabService } from '../app/labs.ts';
import { StaleStateError } from '../store/store.ts';
import { AuthError, type Authenticator } from './auth.ts';
import { LESSONS } from '../content/lessons.ts';

const MAX_BODY_BYTES = 16 * 1024;

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
};

export interface AppDeps {
  learning: LearningService;
  reading: ReadingService;
  instructor: InstructorService;
  learner: LearnerService;
  labs: LabService;
  auth: Authenticator;
  publicDir: string;
  config: {
    supabaseUrl: string | null;
    supabaseAnonKey: string | null;
    aiDescription: string;
    liveSearch: boolean;
    storeKind: string;
    instructorKey: string | null;
    allowSeed: boolean;
  };
}

type Ctx = { req: IncomingMessage; params: Record<string, string>; query: URLSearchParams; body: any; learnerId: string; email: string | null };
type Handler = (ctx: Ctx) => unknown;
interface Route {
  method: string;
  pattern: RegExp;
  keys: string[];
  handler: Handler;
  auth: 'learner' | 'instructor' | 'none';
}

function route(method: string, path: string, handler: Handler, auth: Route['auth'] = 'learner'): Route {
  const keys: string[] = [];
  const pattern = new RegExp('^' + path.replace(/:(\w+)/g, (_, k: string) => (keys.push(k), '([^/]+)')) + '$');
  return { method, pattern, keys, handler, auth };
}

async function readJson(req: IncomingMessage): Promise<any> {
  if (req.method === 'GET' || req.method === 'HEAD') return {};
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > MAX_BODY_BYTES) throw new AppError('payload_too_large', 413, 'Request body is too large.');
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
  const { learning, reading, instructor, learner, labs } = d;
  const lang = (v: unknown) => (v === 'bn' ? 'bn' : 'en');
  return [
    route('GET', '/api/health', () => ({ ok: true, service: 'loop-logic' }), 'none'),
    route('GET', '/api/config', () => ({
      authMode: d.auth.mode,
      supabaseUrl: d.auth.mode === 'supabase' ? d.config.supabaseUrl : null,
      supabaseAnonKey: d.auth.mode === 'supabase' ? d.config.supabaseAnonKey : null, // public by design
      ai: d.config.aiDescription,
      liveSearch: d.config.liveSearch,
      store: d.config.storeKind,
      instructorKeyRequired: Boolean(d.config.instructorKey),
      lessons: LESSONS.map((l) => ({ id: l.id, subject: l.subject, title: l.title, summary: l.summary })),
    }), 'none'),
    route('GET', '/api/me', ({ learnerId, email }) => ({ learnerId, email })),

    // catalog, dashboard, profile
    route('GET', '/api/courses', ({ query }) => learner.catalog(lang(query.get('lang'))), 'none'),
    route('GET', '/api/courses/:id', ({ params, query, learnerId }) => learner.course(params.id!, learnerId, lang(query.get('lang')))),
    route('GET', '/api/dashboard', ({ query, learnerId }) => learner.dashboard(learnerId, lang(query.get('lang')))),
    route('GET', '/api/profile', ({ query, learnerId }) => learner.profileView(learnerId, lang(query.get('lang')))),
    route('GET', '/api/profile/export', ({ learnerId }) => learner.exportData(learnerId)),
    route('POST', '/api/profile/reset', ({ body, learnerId }) => learner.reset(learnerId, body.scope)),

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
    route('POST', '/api/selection-help/feedback', ({ body, learnerId }) => reading.feedback(learnerId, { lessonId: String(body.lessonId ?? ''), blockId: String(body.blockId ?? ''), value: String(body.value ?? ''), lang: lang(body.lang) })),

    // instructor
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
  const connect = ["'self'", d.config.supabaseUrl && d.auth.mode === 'supabase' ? new URL(d.config.supabaseUrl).origin : ''].filter(Boolean).join(' ');
  const csp = `default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src ${connect}; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`;

  async function serveStatic(req: IncomingMessage, res: ServerResponse, pathname: string) {
    const rel = pathname === '/' ? '/index.html' : pathname;
    const file = normalize(join(publicDir, rel));
    if (!file.startsWith(publicDir)) return send(res, 404, { error: { code: 'not_found', message: 'Not found' } });
    try {
      const info = await stat(file);
      if (!info.isFile()) throw new Error('not a file');
      const data = await readFile(file);
      res.writeHead(200, {
        'content-type': MIME[extname(file)] ?? 'application/octet-stream',
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
      if (!url.pathname.startsWith('/api/')) return await serveStatic(req, res, url.pathname);
      const match = routes
        .filter((r) => r.method === req.method)
        .map((r) => ({ r, m: r.pattern.exec(url.pathname) }))
        .find((x) => x.m);
      if (!match) return send(res, 404, { error: { code: 'not_found', message: 'No such endpoint' } });

      let learnerId = '';
      let email: string | null = null;
      if (match.r.auth === 'learner') {
        const id = await d.auth.identify(req);
        learnerId = id.learnerId;
        email = id.email;
        if (id.setCookie) headers['set-cookie'] = id.setCookie;
      } else if (match.r.auth === 'instructor' && d.config.instructorKey) {
        const given = String(req.headers['x-instructor-key'] ?? '');
        if (!given || !sameSecret(given, d.config.instructorKey)) throw new AppError('forbidden', 403, 'Instructor key required.');
      }

      const params: Record<string, string> = {};
      match.r.keys.forEach((k, i) => (params[k] = decodeURIComponent(match.m![i + 1]!)));
      const body = await readJson(req);
      const result = await match.r.handler({ req, params, query: url.searchParams, body, learnerId, email });
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
