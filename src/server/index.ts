// Wires everything from environment variables. With no variables set, the app
// runs fully offline: in-memory data, anonymous learners, reviewed content only.

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { LearningService } from '../app/service.ts';
import { InstructorService } from '../app/instructor.ts';
import { LearnerService } from '../app/learner.ts';
import { WatchService } from '../app/watch.ts';
import { VideoExtrasService } from '../app/video-extras.ts';
import { AdaptiveQuizService } from '../app/adaptive-quiz.ts';
import { LabService } from '../app/labs.ts';
import { NoteService } from '../app/notes.ts';
import { TutorialService } from '../app/tutorials.ts';
import { ReadingService } from '../reading/service.ts';
import { MasteryService } from '../app/mastery.ts';
import { MemoryStore, type Store } from '../store/store.ts';
import { SupabaseStore } from '../store/supabase.ts';
import { gatewayFromEnv } from '../ai/gateway.ts';
import { AiBudget } from '../ai/budget.ts';
import { AiPracticeTutor } from '../ai/tutor.ts';
import { LiveSearch } from '../library/live.ts';
import { anonymousAuth, hybridAuth, supabaseAuth } from './auth.ts';
import { createApp } from './app.ts';
import { AdminService } from '../app/admin.ts';
import { NoticeService } from '../app/notices.ts';
import { ClassService } from '../app/classes.ts';
import { QuestionBankService } from '../app/question-bank.ts';
import { OfficeService } from '../app/office.ts';
import { TutorialStyleService } from '../app/tutorial-style.ts';
import { DeviceGuard } from '../app/devices.ts';
import { OrderService } from '../app/orders.ts';
import { ReportService } from '../app/reports.ts';
import { RunnerService, judge0Backend, pistonBackend, type FetchLike as RunFetch } from '../app/runner.ts';
import { StudyPlanService } from '../app/study-plan.ts';
import { SearchService } from '../app/search.ts';

const here = dirname(fileURLToPath(import.meta.url));

// Minimal .env loader (no dependency). Real environment variables win.
const envFile = join(here, '../../.env');
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m && !(m[1]! in process.env)) process.env[m[1]!] = m[2]!.replace(/^["']|["']$/g, '');
  }
}
const env = process.env;

// SUPABASE_SECRET_KEY (sb_secret_…) is the current name; SUPABASE_SERVICE_ROLE_KEY (legacy JWT) still works.
const serverKey = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
const store: Store = env.SUPABASE_URL && serverKey ? new SupabaseStore(env.SUPABASE_URL, serverKey) : new MemoryStore();
// Sign-in: with SUPABASE_URL and SUPABASE_ANON_KEY (the public "publishable" key) sign-in is optional
// (hybrid, also when AUTH_MODE is the old default "anonymous"); AUTH_MODE=supabase makes it required;
// AUTH_MODE=off turns sign-in off.
const publicKey = env.SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY;
const auth = !env.SUPABASE_URL || !publicKey || env.AUTH_MODE === 'off' ? anonymousAuth()
  : env.AUTH_MODE === 'supabase' ? supabaseAuth(env.SUPABASE_URL, publicKey) : hybridAuth(env.SUPABASE_URL, publicKey);
const gateway = gatewayFromEnv(env, store);
const live = new LiveSearch({ apiKey: env.TAVILY_API_KEY || null, store });

const learning = new LearningService(store, { tutor: new AiPracticeTutor(gateway) });
// AI allowances (kept per day in the database, so restarts and cleared cookies don't reset them):
// FREE_DAILY_AI_CALLS per learner, AI_GUEST_DAILY per network for guests, AI_DAILY_CAP model calls site-wide.
const aiBudget = new AiBudget(store, { perLearner: Number(env.FREE_DAILY_AI_CALLS ?? 10), perGuestIp: Number(env.AI_GUEST_DAILY ?? 40), globalDaily: Number(env.AI_DAILY_CAP ?? 3000) });
gateway.setBudget(aiBudget);
const reading = new ReadingService(store, gateway, live, { dailyAiLimit: Number(env.FREE_DAILY_AI_CALLS ?? 10), budget: aiBudget });
const instructor = new InstructorService(store, { minGroup: Number(env.MIN_GROUP_SIZE ?? 3) });
const learner = new LearnerService(store, reading, learning);
const labs = new LabService(store);
const extras = new VideoExtrasService(store);
const watch = new WatchService(store, extras);
// Premium videos play on at most MAX_DEVICES devices per account (default 2).
const devices = new DeviceGuard(store, { max: Number(env.MAX_DEVICES ?? 2) || 2 });
watch.setDeviceGuard(devices);
const tutorials = new TutorialService(store, join(here, '../../content-kit'));
// Admins: everyone in ADMIN_EMAILS, plus people an admin gives the role in the admin site.
const admin = new AdminService(store, tutorials, watch, { adminEmails: (env.ADMIN_EMAILS ?? '').split(','), youtubeKey: env.YOUTUBE_API_KEY || null });
const notices = new NoticeService(store);
const classes = new ClassService(store, tutorials, extras, { minGroup: Number(env.MIN_GROUP_SIZE ?? 3), notices });
const orders = new OrderService(store, admin, { notices });
// Code runner (an outside sandbox; student code never runs on this server):
// - JUDGE0_RAPIDAPI_KEY alone → Judge0 CE on RapidAPI
// - RUNNER_URL (+ RUNNER_KEY) → a self-hosted Judge0, or Piston with RUNNER_KIND=piston
const runFetch = fetch as unknown as RunFetch;
const rapidKey = env.JUDGE0_RAPIDAPI_KEY || '';
const runnerUrl = env.RUNNER_URL || (rapidKey ? 'https://judge0-ce.p.rapidapi.com' : '');
const runBackend = !runnerUrl ? null
  : env.RUNNER_KIND === 'piston' ? pistonBackend({ url: runnerUrl, key: env.RUNNER_KEY || undefined, fetchImpl: runFetch })
  : judge0Backend({ url: runnerUrl, key: rapidKey || env.RUNNER_KEY || undefined, host: rapidKey ? new URL(runnerUrl).host : undefined, fetchImpl: runFetch });
const runner = new RunnerService(runBackend, tutorials, { dailyLimit: Number(env.RUNNER_DAILY_LIMIT ?? (rapidKey ? 45 : 2000)), perHour: Number(env.RUNNER_PER_HOUR ?? 30), perDay: Number(env.RUNNER_PER_DAY ?? 80) });
const search = new SearchService(tutorials, admin);
await admin.init().catch((e) => console.warn(`admin: could not load admin content: ${(e as Error).message}`));

const server = createApp({
  learning,
  reading,
  instructor,
  learner,
  notes: new NoteService(store, tutorials),
  labs,
  watch,
  extras,
  adaptiveQuiz: new AdaptiveQuizService(store, tutorials),
  tutorials,
  mastery: new MasteryService(store, tutorials),
  admin,
  classes,
  questionBank: new QuestionBankService(store, tutorials),
  office: new OfficeService(store),
  tutorialStyle: new TutorialStyleService(store, gateway, reading, tutorials),
  devices,
  orders,
  reports: new ReportService(store, Object.entries(env).filter(([key]) => /KEY|SECRET|TOKEN|PASSWORD/.test(key)).map(([, value]) => value ?? '').filter((value) => value.length >= 8)),
  runner,
  search,
  studyPlan: new StudyPlanService(store, tutorials),
  store,
  notices,
  auth,
  labModelFile: join(here, '../../content-kit/tools/lab-model.mjs'),
  publicDir: join(here, '../../web'),
  config: {
    supabaseUrl: env.SUPABASE_URL ?? null,
    supabaseAnonKey: publicKey ?? null,
    aiDescription: gateway.describe(),
    liveSearch: live.enabled,
    storeKind: store.kind,
    instructorKey: env.INSTRUCTOR_KEY || null,
    editLocked: !env.INSTRUCTOR_KEY,
    // Fake demo learners only on a local or test server, and only when asked for.
    allowSeed: env.ALLOW_DEMO_SEED === 'true' && !(env.SITE_URL || env.RENDER || env.NODE_ENV === 'production'),
    freeDailyAi: Number(env.FREE_DAILY_AI_CALLS ?? 10),
    siteUrl: env.SITE_URL || null,
  },
});

const port = Number(env.PORT ?? 8787);
// Hosting platforms set PORT and need the app reachable from outside; locally stay on 127.0.0.1.
const host = env.HOST ?? (env.RENDER || env.PORT ? '0.0.0.0' : '127.0.0.1');
server.listen(port, host, () => {
  console.log(`Loop & Logic running at http://${host}:${port}`);
  console.log(`  data:        ${store.kind}${store.kind === 'memory' ? ' (resets on restart)' : ''}`);
  console.log(`  sign-in:     ${auth.mode}`);
  console.log(`  AI:          ${gateway.describe()}`);
  console.log(`  run code:    ${runBackend ? `${runBackend.name} at ${new URL(runnerUrl).host} (site limit ${Number(env.RUNNER_DAILY_LIMIT ?? (rapidKey ? 45 : 2000))}/day)` : 'off (set JUDGE0_RAPIDAPI_KEY or RUNNER_URL); unchanged examples still show their output'}`);
  console.log(`  tutorials:   ${tutorials.list('en').totals.topics} topics, ${tutorials.list('en').totals.labs} labs`);
  console.log(`  live search: ${live.enabled ? 'on (approved sites only)' : 'off'}`);
  console.log(`  instructor:  ${env.INSTRUCTOR_KEY ? 'key required' : 'open (set INSTRUCTOR_KEY before sharing)'}`);
  console.log(`  admin:       ${(env.ADMIN_EMAILS ?? '').split(',').filter((e) => e.trim()).length} email(s) in ADMIN_EMAILS; YouTube import ${env.YOUTUBE_API_KEY ? 'on' : 'off (set YOUTUBE_API_KEY)'}`);
  // Build the AI Teacher's search index now, so the first question doesn't wait for it.
  setTimeout(() => { const t = Date.now(); tutorials.searchSections(''); console.log(`  AI search:   tutorial index ready in ${Date.now() - t} ms`); }, 0);
});
