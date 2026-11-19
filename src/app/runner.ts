// In-page code runner. Student code never runs on this server: it is sent to an
// outside sandbox (Judge0, hosted on RapidAPI or self-hosted, or a Piston server).
// - An unchanged example is answered from its verified output (no sandbox call).
// - Own code needs a signed-in student, and per-student and daily limits apply,
//   so a free sandbox plan is not used up by one person or by bots.
// - Identical runs are cached for a while.

import { createHash } from 'node:crypto';
import { AppError } from './service.ts';

export type RunLanguage = 'c' | 'cpp' | 'java' | 'python';
export const RUN_LANGUAGES: RunLanguage[] = ['c', 'cpp', 'java', 'python'];
const isRunLanguage = (v: unknown): v is RunLanguage => typeof v === 'string' && (RUN_LANGUAGES as string[]).includes(v);

export type RunStatus = 'ok' | 'compile_error' | 'runtime_error' | 'timeout' | 'error';
export interface RunResult {
  status: RunStatus;
  stdout: string;
  stderr: string;
  compileOutput: string;
  exitCode: number | null;
  timeMs: number | null;
  memoryKb: number | null;
  verified?: boolean;
  cached?: boolean;
}

export type FetchLike = (url: string, init: { method: string; headers: Record<string, string>; body?: string; signal: AbortSignal }) => Promise<{ ok: boolean; status: number; json(): Promise<any> }>;

export interface RunBackend {
  name: string;
  run(language: RunLanguage, code: string, stdin: string, signal: AbortSignal): Promise<RunResult>;
}

export const LIMITS = { code: 20_000, stdin: 4_000, output: 10_000 };
const clip = (s: unknown) => {
  const v = typeof s === 'string' ? s : '';
  return v.length > LIMITS.output ? `${v.slice(0, LIMITS.output)}\n… (output cut at ${LIMITS.output} characters)` : v;
};
const b64 = (s: string) => Buffer.from(s, 'utf8').toString('base64');
const unb64 = (s: unknown) => (typeof s === 'string' && s ? Buffer.from(s, 'base64').toString('utf8') : '');
/** Same program for comparison: line endings and trailing spaces ignored. */
export const sameText = (a: string, b: string) => {
  const n = (s: string) => s.replace(/\r\n?/g, '\n').split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');
  return n(a) === n(b);
};

/** Picks the newest runtime whose name matches, e.g. "C (GCC 14.1.0)" over "C (GCC 9.2.0)". */
function newest<T>(items: T[], name: (t: T) => string, re: RegExp): T | undefined {
  const ver = (s: string) => (/(\d+(?:\.\d+)*)/.exec(s)?.[1] ?? '0').split('.').map(Number);
  const cmp = (a: number[], b: number[]) => { for (let i = 0; i < Math.max(a.length, b.length); i++) { const d = (a[i] ?? 0) - (b[i] ?? 0); if (d) return d; } return 0; };
  return items.filter((t) => re.test(name(t))).sort((a, b) => cmp(ver(name(b)), ver(name(a))))[0];
}

// ── Judge0 (https://judge0.com), RapidAPI or self-hosted ──
const JUDGE0_NAMES: Record<RunLanguage, RegExp> = { c: /^C \(GCC /, cpp: /^C\+\+ \(GCC /, java: /^Java \((OpenJDK|JDK) /, python: /^Python \(3\./ };

export function judge0Backend(opts: { url: string; key?: string; host?: string; fetchImpl: FetchLike; languageIds?: Partial<Record<RunLanguage, number>> }): RunBackend {
  const base = opts.url.replace(/\/+$/, '');
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (opts.key && opts.host) { headers['x-rapidapi-key'] = opts.key; headers['x-rapidapi-host'] = opts.host; }
  else if (opts.key) headers['x-auth-token'] = opts.key;
  let ids: Partial<Record<RunLanguage, number>> | null = opts.languageIds && Object.keys(opts.languageIds).length ? { ...opts.languageIds } : null;

  async function languageId(lang: RunLanguage, signal: AbortSignal) {
    if (!ids || ids[lang] === undefined) {
      const res = await opts.fetchImpl(`${base}/languages`, { method: 'GET', headers, signal });
      if (!res.ok) throw new Error(`languages ${res.status}`);
      const list = (await res.json()) as { id: number; name: string }[];
      ids = { ...(ids ?? {}) };
      for (const l of RUN_LANGUAGES) if (ids[l] === undefined) { const m = newest(list, (x) => x.name, JUDGE0_NAMES[l]); if (m) ids[l] = m.id; }
    }
    const id = ids[lang];
    if (id === undefined) throw new AppError('runner_language', 400, `The sandbox has no ${lang} compiler.`);
    return id;
  }

  return {
    name: 'judge0',
    async run(lang, code, stdin, signal) {
      const language_id = await languageId(lang, signal);
      const res = await opts.fetchImpl(`${base}/submissions?base64_encoded=true&wait=true`, {
        method: 'POST', headers, signal,
        body: JSON.stringify({ source_code: b64(code), language_id, stdin: b64(stdin), cpu_time_limit: 5, wall_time_limit: 10, memory_limit: 256000 }),
      });
      if (res.status === 429) throw new AppError('runner_busy', 429, 'The code sandbox has reached its limit for now. Try again later, or use "Try now".');
      if (!res.ok) throw new Error(`submission ${res.status}`);
      const r = await res.json();
      const sid = Number(r.status?.id ?? 0);
      const status: RunStatus = sid === 3 ? 'ok' : sid === 5 ? 'timeout' : sid === 6 ? 'compile_error' : sid >= 7 && sid <= 12 ? 'runtime_error' : sid === 4 ? 'ok' : 'error';
      return {
        status, stdout: clip(unb64(r.stdout)), stderr: clip(unb64(r.stderr) || (status === 'error' ? unb64(r.message) : '')), compileOutput: clip(unb64(r.compile_output)),
        exitCode: typeof r.exit_code === 'number' ? r.exit_code : null,
        timeMs: r.time ? Math.round(Number(r.time) * 1000) : null, memoryKb: typeof r.memory === 'number' ? r.memory : null,
      };
    },
  };
}

// ── Piston (https://github.com/engineer-man/piston), self-hosted ──
const PISTON_NAMES: Record<RunLanguage, RegExp> = { c: /^c$/, cpp: /^c\+\+$/, java: /^java$/, python: /^python$/ };
const FILE: Record<RunLanguage, string> = { c: 'main.c', cpp: 'main.cpp', java: 'Main.java', python: 'main.py' };

export function pistonBackend(opts: { url: string; key?: string; fetchImpl: FetchLike }): RunBackend {
  const base = opts.url.replace(/\/+$/, '');
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (opts.key) headers.authorization = opts.key;
  let runtimes: { language: string; version: string; aliases?: string[] }[] | null = null;
  return {
    name: 'piston',
    async run(lang, code, stdin, signal) {
      if (!runtimes) {
        const res = await opts.fetchImpl(`${base}/runtimes`, { method: 'GET', headers, signal });
        if (!res.ok) throw new Error(`runtimes ${res.status}`);
        runtimes = await res.json();
      }
      const rt = newest(runtimes!.filter((r) => PISTON_NAMES[lang].test(r.language) || (lang === 'cpp' && (r.aliases ?? []).includes('cpp'))), (r) => r.version, /./);
      if (!rt) throw new AppError('runner_language', 400, `The sandbox has no ${lang} compiler.`);
      const res = await opts.fetchImpl(`${base}/execute`, {
        method: 'POST', headers, signal,
        body: JSON.stringify({ language: rt.language, version: rt.version, files: [{ name: FILE[lang], content: code }], stdin, compile_timeout: 10_000, run_timeout: 5_000, run_memory_limit: 256_000_000 }),
      });
      if (res.status === 429) throw new AppError('runner_busy', 429, 'The code sandbox is busy. Try again in a minute.');
      if (!res.ok) throw new Error(`execute ${res.status}`);
      const r = await res.json();
      const compile = r.compile, run = r.run ?? {};
      if (compile && compile.code !== 0 && compile.code !== null && compile.code !== undefined) {
        return { status: 'compile_error', stdout: '', stderr: '', compileOutput: clip(compile.stderr || compile.output), exitCode: compile.code, timeMs: null, memoryKb: null };
      }
      const killed = run.signal === 'SIGKILL';
      const status: RunStatus = killed ? 'timeout' : run.code === 0 ? 'ok' : 'runtime_error';
      return { status, stdout: clip(run.stdout), stderr: clip(run.stderr), compileOutput: clip(compile?.stderr ?? ''), exitCode: typeof run.code === 'number' ? run.code : null, timeMs: null, memoryKb: null };
    },
  };
}

export interface RunRequest { language: unknown; code: unknown; stdin?: unknown; ref?: unknown }
export interface Runner { learnerId: string; signedIn: boolean }
export interface VerifiedSource { verifiedExample(track: string, topic: string, example: string): { language: string; code: string; stdin: string; output: string } | null }

export class RunnerService {
  private backend: RunBackend | null;
  private source: VerifiedSource;
  private now: () => Date;
  private perHour: number;
  private perDay: number;
  private dailyLimit: number;
  private recent = new Map<string, number[]>(); // learner → run times (ms)
  private day = '';
  private dayCount = 0;
  private cache = new Map<string, RunResult>();

  constructor(backend: RunBackend | null, source: VerifiedSource, opts: { perHour?: number; perDay?: number; dailyLimit?: number; now?: () => Date } = {}) {
    this.backend = backend;
    this.source = source;
    this.now = opts.now ?? (() => new Date());
    this.perHour = opts.perHour ?? 30;
    this.perDay = opts.perDay ?? 80;
    this.dailyLimit = opts.dailyLimit ?? 45;
  }

  /** What the pages need to know: is running own code possible, and in which languages. */
  status() {
    return { enabled: Boolean(this.backend), languages: this.backend ? RUN_LANGUAGES : [], perHour: this.perHour };
  }

  private dhakaDay() { return new Date(this.now().getTime() + 6 * 3_600_000).toISOString().slice(0, 10); }

  async run(req: RunRequest, who: Runner): Promise<RunResult> {
    const language = req.language;
    if (!isRunLanguage(language)) throw new AppError('bad_language', 400, 'This language cannot be run here.');
    const code = typeof req.code === 'string' ? req.code : '';
    const stdin = typeof req.stdin === 'string' ? req.stdin : '';
    if (!code.trim()) throw new AppError('empty_code', 400, 'Write some code first.');
    if (code.length > LIMITS.code) throw new AppError('code_too_long', 400, `Code is limited to ${LIMITS.code.toLocaleString('en')} characters.`);
    if (stdin.length > LIMITS.stdin) throw new AppError('input_too_long', 400, `Input is limited to ${LIMITS.stdin.toLocaleString('en')} characters.`);

    // 1. An unchanged example: answer with the output that was checked when it was written.
    const ref = (req.ref && typeof req.ref === 'object' ? req.ref : {}) as Record<string, unknown>;
    if (typeof ref.track === 'string' && typeof ref.topic === 'string' && typeof ref.example === 'string') {
      const v = this.source.verifiedExample(ref.track, ref.topic, ref.example);
      if (v && v.language === language && sameText(v.code, code) && sameText(v.stdin, stdin)) {
        return { status: 'ok', stdout: v.output, stderr: '', compileOutput: '', exitCode: 0, timeMs: null, memoryKb: null, verified: true };
      }
    }

    // 2. Own code goes to the sandbox.
    if (!this.backend) throw new AppError('runner_off', 503, 'Running your own code is not switched on yet. Use "Try now" to run it in an online compiler.');
    if (!who.signedIn) throw new AppError('sign_in_to_run', 401, 'Sign in to run your own code. Unchanged examples run without signing in.');

    const key = createHash('sha256').update(`${language}\0${code}\0${stdin}`).digest('hex');
    const hit = this.cache.get(key);
    if (hit) { this.cache.delete(key); this.cache.set(key, hit); return { ...hit, cached: true }; }

    const nowMs = this.now().getTime();
    const day = this.dhakaDay();
    if (day !== this.day) { this.day = day; this.dayCount = 0; this.recent.clear(); }
    const mine = (this.recent.get(who.learnerId) ?? []).filter((t) => nowMs - t < 24 * 3_600_000);
    if (mine.filter((t) => nowMs - t < 3_600_000).length >= this.perHour) throw new AppError('run_limit', 429, `You can run code ${this.perHour} times an hour. Try again a little later.`);
    if (mine.length >= this.perDay) throw new AppError('run_limit', 429, `You have used today's ${this.perDay} runs. They reset at midnight (Dhaka time).`);
    if (this.dayCount >= this.dailyLimit) throw new AppError('runner_daily', 429, 'Today\'s free code runs for the whole site are used up. They reset at midnight (Dhaka time); meanwhile "Try now" still works.');

    this.dayCount++;
    mine.push(nowMs);
    this.recent.set(who.learnerId, mine);
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 25_000);
    try {
      const result = await this.backend.run(language, code, stdin, ctl.signal);
      if (result.status !== 'error') {
        this.cache.set(key, result);
        if (this.cache.size > 300) this.cache.delete(this.cache.keys().next().value!);
      }
      return result;
    } catch (e) {
      if (e instanceof AppError) throw e;
      this.dayCount = Math.max(0, this.dayCount - 1); // a failed call did not use the sandbox
      mine.pop();
      throw new AppError('runner_failed', 502, ctl.signal.aborted ? 'The code sandbox took too long to answer. Try again.' : 'The code sandbox could not be reached. Try again in a minute, or use "Try now".');
    } finally {
      clearTimeout(timer);
    }
  }
}
