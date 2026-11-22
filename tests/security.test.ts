// Security hardening: staff-only editing routes, admin-only demo seeding,
// request limits, security headers, AI allowances that survive restarts and
// cleared cookies, and simplified sections that follow lesson edits.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { MemoryStore } from '../src/store/store.ts';
import { TutorialService } from '../src/app/tutorials.ts';
import { WatchService } from '../src/app/watch.ts';
import { AdminService } from '../src/app/admin.ts';
import { VideoExtrasService } from '../src/app/video-extras.ts';
import { createApp, RateLimiter, clientIp } from '../src/server/app.ts';
import { AiBudget } from '../src/ai/budget.ts';
import { AiGateway, type Provider } from '../src/ai/gateway.ts';
import { ReadingService } from '../src/reading/service.ts';
import { LiveSearch } from '../src/library/live.ts';
import { TutorialStyleService } from '../src/app/tutorial-style.ts';

const root = join(import.meta.dirname, '..');
const tutorials = new TutorialService(new MemoryStore(), join(root, 'content-kit'));

async function server(config: Record<string, unknown> = {}) {
  const store = new MemoryStore();
  const watch = new WatchService(store);
  const admin = new AdminService(store, tutorials, watch, { adminEmails: ['boss@example.com'], youtubeKey: null, timers: false });
  await admin.init();
  await admin.setRole('boss@example.com', 'teacher@uni.edu.bd', 'instructor');
  const people: Record<string, string> = { boss: 'boss@example.com', teach: 'teacher@uni.edu.bd', stu: 'rafi@gmail.com' };
  const auth = { mode: 'hybrid', async identify(req: any) {
    const who = String(req.headers.authorization ?? '').slice(7);
    return people[who] ? { learnerId: `id-${who}`, email: people[who], signedIn: true } : { learnerId: 'anon', email: null, signedIn: false };
  } };
  const app = createApp({ store, tutorials, watch, admin, extras: new VideoExtrasService(store), auth, publicDir: join(root, 'web'),
    config: { supabaseUrl: null, supabaseAnonKey: null, aiDescription: 'off', liveSearch: false, storeKind: 'memory', instructorKey: null, editLocked: true, allowSeed: true, siteUrl: 'https://loopnlogic.com', ...config } } as any);
  await new Promise<void>((r) => app.listen(0, '127.0.0.1', () => r()));
  const base = `http://127.0.0.1:${(app.address() as { port: number }).port}`;
  const call = (method: string, path: string, who?: string, body?: unknown, headers: Record<string, string> = {}) =>
    fetch(base + path, { method, headers: { 'content-type': 'application/json', ...(who ? { authorization: `Bearer ${who}` } : {}), ...headers }, body: body ? JSON.stringify(body) : undefined });
  return { app, call };
}

test('editing routes need a signed-in instructor or admin (or the server key); visitors are refused', async () => {
  const { app, call } = await server();
  try {
    const save = { notes: 'hijack', materials: [{ title: 'x', url: 'https://example.com' }] };
    assert.equal((await call('POST', '/api/videos/F8OWdzcf6go/extras', undefined, save)).status, 403, 'anonymous cannot edit video materials');
    assert.equal((await call('POST', '/api/videos/F8OWdzcf6go/extras', 'stu', save)).status, 403, 'a signed-in student cannot either');
    assert.equal((await call('GET', '/api/instructor/video-extras')).status, 403);
    assert.equal((await call('GET', '/api/instructor/overview')).status, 403);
    assert.equal((await call('POST', '/api/videos/F8OWdzcf6go/extras', 'teach', { notes: 'Lecture notes' })).status, 200, 'instructors can edit');
    assert.equal((await call('GET', '/api/instructor/video-extras', 'boss')).status, 200);
    // demo seeding: admins only
    assert.notEqual((await call('POST', '/api/instructor/seed-demo')).status, 200);
    assert.equal((await call('POST', '/api/instructor/seed-demo', 'teach')).status, 403, 'instructors cannot seed');
    const cfg = await (await call('GET', '/api/config')).json();
    assert.equal(cfg.editing, 'locked');
  } finally { app.close(); }

  const keyed = await server({ instructorKey: 'long-random-key-123' });
  try {
    assert.equal((await keyed.call('GET', '/api/instructor/video-extras', undefined, undefined, { 'x-instructor-key': 'wrong' })).status, 403);
    assert.equal((await keyed.call('GET', '/api/instructor/video-extras', undefined, undefined, { 'x-instructor-key': 'long-random-key-123' })).status, 200);
  } finally { keyed.app.close(); }
});

test('request limits: coupon guessing is cut off per IP, and security headers are set', async () => {
  const { app, call } = await server();
  try {
    const statuses: number[] = [];
    for (let i = 0; i < 22; i++) statuses.push((await call('POST', '/api/coupons/check', undefined, { code: `GUESS${i}` }, { 'cf-connecting-ip': '203.0.113.7' })).status);
    assert.equal(statuses.filter((s) => s === 429).length, 2, 'the 21st and 22nd attempts are refused');
    assert.notEqual((await call('POST', '/api/coupons/check', undefined, { code: 'X' }, { 'cf-connecting-ip': '203.0.113.8' })).status, 429, 'another IP is not affected');
    const page = await call('GET', '/privacy.html');
    assert.equal(page.headers.get('x-frame-options'), 'DENY');
    assert.match(page.headers.get('strict-transport-security') ?? '', /max-age=/);
    assert.match(page.headers.get('content-security-policy') ?? '', /script-src 'self'/);
    assert.match(page.headers.get('permissions-policy') ?? '', /camera=\(\)/);
  } finally { app.close(); }
  const rl = new RateLimiter(() => 0);
  assert.equal(rl.take('k', 1, 1000), true);
  assert.equal(rl.take('k', 1, 1000), false);
  assert.equal(clientIp({ headers: { 'x-forwarded-for': '198.51.100.4, 10.0.0.1' }, socket: {} } as any), '198.51.100.4');
});

test('AI allowance survives a restart, and guests clearing cookies still share one allowance per network', async () => {
  const store = new MemoryStore();
  const a = new AiBudget(store, { perLearner: 2, perGuestIp: 3, globalDaily: 100 });
  const guest = (id: string) => [id, { ip: '203.0.113.9', signedIn: false }] as const;
  await a.spend(...guest('g1'));
  await a.spend(...guest('g1'));
  assert.equal(await a.blocked(...guest('g1')), 'learner');
  await a.spend(...guest('g2')); // cleared cookies → a new guest id, same network
  assert.equal(await a.blocked(...guest('g3')), 'guest_network', 'a fresh guest id on the same network is still limited');
  assert.equal(await a.blocked('student-1', { ip: '203.0.113.9', signedIn: true }), null, 'signed-in students have their own allowance');
  await a.flush();
  const b = new AiBudget(store, { perLearner: 2, perGuestIp: 3, globalDaily: 100 }); // after a restart
  assert.equal(await b.blocked(...guest('g1')), 'learner');
  assert.equal(await b.left(...guest('g4')), 0);
});

test('site-wide AI cap: past it, the gateway makes no model calls and learners get reviewed text', async () => {
  const store = new MemoryStore();
  const budget = new AiBudget(store, { perLearner: 10, globalDaily: 1 });
  let calls = 0;
  const provider = { name: 'fake', model: 'f', async call(req: any) { calls++; return { text: JSON.stringify({ explanation: 'ok', citations: [], insufficient_evidence: false }), provider: 'fake', model: 'f', inputTokens: 1, outputTokens: 1 }; } } as unknown as Provider;
  const gateway = new AiGateway([provider], { retryDelayMs: 1 });
  gateway.setBudget(budget);
  assert.ok(await gateway.generate({ purpose: 't', system: '', user: 'u', maxOutputTokens: 10 }));
  assert.equal(await gateway.generate({ purpose: 't', system: '', user: 'u', maxOutputTokens: 10 }), null);
  assert.equal(calls, 1);
  assert.deepEqual((await budget.today()).calls, 1);
});

test('a simplified section is written again when the lesson text changes', async () => {
  const store = new MemoryStore();
  let text = 'A pointer stores the address of another variable in memory.';
  const fakeTutorials = { sectionText: () => ({ title: 'Pointers', text, textEn: text, sourceLang: 'en', topicTitle: 'Pointers' }) } as any;
  let calls = 0;
  const provider = { name: 'fake', model: 'f', async call(req: any) {
    calls++;
    const id = /"id":"([^"]+)"/.exec(req.user)![1];
    return { text: JSON.stringify({ explanation: `Simple version number ${calls === 1 ? 'one' : 'two'} of this part of the lesson.`, citations: [id], insufficient_evidence: false }), provider: 'fake', model: 'f', inputTokens: 1, outputTokens: 1 };
  } } as unknown as Provider;
  const gateway = new AiGateway([provider], { retryDelayMs: 1 });
  const reading = new ReadingService(store, gateway, new LiveSearch({ apiKey: null }));
  const style = new TutorialStyleService(store, gateway, reading, fakeTutorials);
  assert.match((await style.simpler('u1', 'c', 'c-pointers', 'intro', 'en')).text!, /one/);
  assert.equal((await style.simpler('u2', 'c', 'c-pointers', 'intro', 'en')).cached, true);
  text = 'A pointer holds a memory address. Use & to take an address and * to follow it.';
  const after = await style.simpler('u3', 'c', 'c-pointers', 'intro', 'en');
  assert.equal(after.cached, false, 'the old version is not served for the edited lesson');
  assert.match(after.text!, /two/);
  assert.equal(calls, 2);
});
