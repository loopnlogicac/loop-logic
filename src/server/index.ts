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
import { LabService } from '../app/labs.ts';
import { ReadingService } from '../reading/service.ts';
import { MemoryStore, type Store } from '../store/store.ts';
import { SupabaseStore } from '../store/supabase.ts';
import { gatewayFromEnv } from '../ai/gateway.ts';
import { AiPracticeTutor } from '../ai/tutor.ts';
import { LiveSearch } from '../library/live.ts';
import { anonymousAuth, supabaseAuth } from './auth.ts';
import { createApp } from './app.ts';

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

const store: Store = env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY ? new SupabaseStore(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY) : new MemoryStore();
const auth = env.AUTH_MODE === 'supabase' && env.SUPABASE_URL && env.SUPABASE_ANON_KEY ? supabaseAuth(env.SUPABASE_URL, env.SUPABASE_ANON_KEY) : anonymousAuth();
const gateway = gatewayFromEnv(env, store);
const live = new LiveSearch({ apiKey: env.TAVILY_API_KEY || null, store });

const learning = new LearningService(store, { tutor: new AiPracticeTutor(gateway) });
const reading = new ReadingService(store, gateway, live, { dailyAiLimit: Number(env.FREE_DAILY_AI_CALLS ?? 10) });
const instructor = new InstructorService(store, { minGroup: Number(env.MIN_GROUP_SIZE ?? 3) });
const learner = new LearnerService(store, reading, learning);
const labs = new LabService(store);
const extras = new VideoExtrasService(store);
const watch = new WatchService(store, extras);

const server = createApp({
  learning,
  reading,
  instructor,
  learner,
  labs,
  watch,
  extras,
  auth,
  publicDir: join(here, '../../public'),
  config: {
    supabaseUrl: env.SUPABASE_URL ?? null,
    supabaseAnonKey: env.SUPABASE_ANON_KEY ?? null,
    aiDescription: gateway.describe(),
    liveSearch: live.enabled,
    storeKind: store.kind,
    instructorKey: env.INSTRUCTOR_KEY || null,
    editLocked: Boolean(env.RENDER) && !env.INSTRUCTOR_KEY,
    allowSeed: env.ALLOW_DEMO_SEED !== 'false',
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
  console.log(`  live search: ${live.enabled ? 'on (approved sites only)' : 'off'}`);
  console.log(`  instructor:  ${env.INSTRUCTOR_KEY ? 'key required' : 'open (set INSTRUCTOR_KEY before sharing)'}`);
});
