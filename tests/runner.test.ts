import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { TutorialService } from '../src/app/tutorials.ts';
import { MemoryStore } from '../src/store/store.ts';
import { RunnerService, judge0Backend, pistonBackend, sameText, type FetchLike } from '../src/app/runner.ts';

const kit = join(dirname(fileURLToPath(import.meta.url)), '..', 'content-kit');
const tut = new TutorialService(new MemoryStore(), kit);
const b64 = (s: string) => Buffer.from(s).toString('base64');
const guest = { learnerId: 'g1', signedIn: false };
const student = { learnerId: 's1', signedIn: true };

/** A fake Judge0: echoes "ran <lang id>" plus stdin; "while(1)" times out; "syntax" fails to compile. */
function fakeJudge0(calls: { url: string; body?: any; headers: Record<string, string> }[]): FetchLike {
  return async (url, init) => {
    const body = init.body ? JSON.parse(init.body) : undefined;
    calls.push({ url, body, headers: init.headers });
    if (url.endsWith('/languages')) return { ok: true, status: 200, json: async () => [{ id: 50, name: 'C (GCC 9.2.0)' }, { id: 103, name: 'C (GCC 14.1.0)' }, { id: 62, name: 'Java (OpenJDK 13.0.1)' }, { id: 91, name: 'Java (JDK 17.0.6)' }, { id: 71, name: 'Python (3.8.1)' }, { id: 92, name: 'Python (3.11.2)' }, { id: 54, name: 'C++ (GCC 9.2.0)' }] };
    const code = Buffer.from(body.source_code, 'base64').toString();
    if (code.includes('syntax')) return { ok: true, status: 201, json: async () => ({ status: { id: 6 }, compile_output: b64('main.c:1: error: expected ;'), stdout: null }) };
    if (code.includes('while(1)')) return { ok: true, status: 201, json: async () => ({ status: { id: 5 }, stdout: null }) };
    return { ok: true, status: 201, json: async () => ({ status: { id: 3 }, stdout: b64(`ran ${body.language_id}\n${Buffer.from(body.stdin, 'base64').toString()}`), time: '0.012', memory: 1024, exit_code: 0 }) };
  };
}

test('sameText ignores line endings and trailing spaces only', () => {
  assert.ok(sameText('a  \r\nb\n\n', 'a\nb'));
  assert.ok(!sameText('a b', 'a  b'));
});

test('an unchanged example answers from its verified output, without a sandbox or sign-in', async () => {
  const p = tut.topic('c', 'c-pointers-intro', 'en');
  const ex = p.examples.find((e) => e.output !== null && e.runnable)!;
  assert.ok(ex, 'a runnable C example with output');
  const runner = new RunnerService(null, tut);
  const r = await runner.run({ language: 'c', code: `${ex.code}\n\n`, stdin: ex.stdin, ref: { track: 'c', topic: 'c-pointers-intro', example: ex.id } }, guest);
  assert.equal(r.verified, true);
  assert.equal(r.stdout, ex.output);
  // an edited example needs the sandbox
  await assert.rejects(runner.run({ language: 'c', code: `${ex.code}// changed`, ref: { track: 'c', topic: 'c-pointers-intro', example: ex.id } }, student), (e: any) => e.code === 'runner_off' && e.status === 503);
});

test('examples that read input carry their stdin, and SQL or package examples are not runnable', () => {
  const p = tut.topic('c', 'c-string-input-output', 'en');
  assert.ok(p.examples.some((e) => e.stdin.length > 0 && e.runnable));
  const sql = tut.allTopics('en').find((t) => t.track === 'dbms')!;
  assert.ok(tut.topic('dbms', sql.topic, 'en').examples.every((e) => !e.runnable));
  const prac = p.practice.find((x: any) => x.type === 'code')!;
  assert.ok(prac.sample && typeof prac.sample.output === 'string' && prac.language === 'c');
});

test('own code: guests must sign in; signed-in students run in the sandbox with the newest compiler', async () => {
  const calls: any[] = [];
  const runner = new RunnerService(judge0Backend({ url: 'https://judge0-ce.p.rapidapi.com', key: 'k', host: 'judge0-ce.p.rapidapi.com', fetchImpl: fakeJudge0(calls) }), tut);
  await assert.rejects(runner.run({ language: 'c', code: 'int main(){}' }, guest), (e: any) => e.code === 'sign_in_to_run' && e.status === 401);
  const r = await runner.run({ language: 'c', code: 'int main(){}', stdin: '5' }, student);
  assert.equal(r.status, 'ok');
  assert.equal(r.stdout, 'ran 103\n5');
  assert.equal(r.timeMs, 12);
  assert.equal(calls.find((c) => c.url.includes('/submissions')).headers['x-rapidapi-key'], 'k');
  const py = await runner.run({ language: 'python', code: 'print(1)' }, student);
  assert.equal(py.stdout.split('\n')[0], 'ran 92');
  // same program again: cached, no new sandbox call
  const before = calls.length;
  const again = await runner.run({ language: 'c', code: 'int main(){}', stdin: '5' }, student);
  assert.equal(again.cached, true);
  assert.equal(calls.length, before);
  assert.equal((await runner.run({ language: 'c', code: 'syntax' }, student)).status, 'compile_error');
  assert.equal((await runner.run({ language: 'c', code: 'while(1);' }, student)).status, 'timeout');
});

test('limits: per student per hour and for the whole site per day', async () => {
  const runner = new RunnerService(judge0Backend({ url: 'http://j0', fetchImpl: fakeJudge0([]) }), tut, { perHour: 2, dailyLimit: 3 });
  await runner.run({ language: 'c', code: 'a' }, student);
  await runner.run({ language: 'c', code: 'b' }, student);
  await assert.rejects(runner.run({ language: 'c', code: 'c' }, student), (e: any) => e.code === 'run_limit' && e.status === 429);
  await runner.run({ language: 'c', code: 'd' }, { learnerId: 's2', signedIn: true });
  await assert.rejects(runner.run({ language: 'c', code: 'e' }, { learnerId: 's3', signedIn: true }), (e: any) => e.code === 'runner_daily');
  await assert.rejects(runner.run({ language: 'sql', code: 'select 1' }, student), (e: any) => e.code === 'bad_language');
  await assert.rejects(runner.run({ language: 'c', code: 'x'.repeat(20_001) }, student), (e: any) => e.code === 'code_too_long');
});

test('a sandbox failure does not use up the limits', async () => {
  let n = 0;
  const flaky: FetchLike = async (url) => { if (url.endsWith('/languages')) return { ok: true, status: 200, json: async () => [{ id: 50, name: 'C (GCC 9.2.0)' }] }; n++; throw new Error('down'); };
  const runner = new RunnerService(judge0Backend({ url: 'http://j0', fetchImpl: flaky }), tut, { dailyLimit: 1 });
  await assert.rejects(runner.run({ language: 'c', code: 'a' }, student), (e: any) => e.code === 'runner_failed');
  await assert.rejects(runner.run({ language: 'c', code: 'a' }, student), (e: any) => e.code === 'runner_failed'); // not runner_daily
  assert.equal(n, 2);
});

test('Piston backend: compile errors and normal runs', async () => {
  const fetchImpl: FetchLike = async (url, init) => {
    if (url.endsWith('/runtimes')) return { ok: true, status: 200, json: async () => [{ language: 'c', version: '10.2.0' }, { language: 'java', version: '15.0.2' }, { language: 'python', version: '3.12.0' }] };
    const b = JSON.parse(init.body!);
    if (b.files[0].content.includes('bad')) return { ok: true, status: 200, json: async () => ({ compile: { code: 1, stderr: 'error: bad' }, run: {} }) };
    return { ok: true, status: 200, json: async () => ({ compile: { code: 0, stderr: '' }, run: { code: 0, stdout: `${b.files[0].name}:${b.stdin}`, stderr: '', signal: null } }) };
  };
  const runner = new RunnerService(pistonBackend({ url: 'http://piston/api/v2', fetchImpl }), tut);
  assert.equal((await runner.run({ language: 'java', code: 'class Main{}', stdin: '7' }, student)).stdout, 'Main.java:7');
  const bad = await runner.run({ language: 'c', code: 'bad' }, student);
  assert.equal(bad.status, 'compile_error');
  assert.match(bad.compileOutput, /bad/);
});
