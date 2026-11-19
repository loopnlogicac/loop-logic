import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { MemoryStore, type ReadingEventRow } from '../src/store/store.ts';
import { SupabaseStore } from '../src/store/supabase.ts';
import { TutorialService } from '../src/app/tutorials.ts';
import { StudyPlanService } from '../src/app/study-plan.ts';
import { createApp } from '../src/server/app.ts';
const root = join(import.meta.dirname, '..');
function setup(store: any = new MemoryStore()) { const tutorials = new TutorialService(store, join(root, 'content-kit')); return { store, tutorials, plan: new StudyPlanService(store, tutorials) }; }
const row = (learnerId: string, topic: string, type: ReadingEventRow['type'], payload = {}, at = '2026-11-20T01:00:00Z'): ReadingEventRow => ({ id: randomUUID(), learnerId, lessonId: `tutorial:data-structures:${topic}`, blockId: null, type, payload, at });

test('study plans use recorded wrong answers, cap review at three, give reasons and never expose answer keys', async () => {
  const { store, tutorials, plan } = setup();
  const topics = tutorials.allTopics('en').filter((t) => t.track === 'data-structures'); const first = topics[0]!;
  const qs = tutorials.topic(first.track, first.topic, 'en').quiz;
  await store.addReadingEvents([row('alice', first.topic, 'view'), row('alice', first.topic, 'quiz', { score: 4, total: 10, correct: Object.fromEntries(qs.slice(0, 5).map((q) => [q.id, false])) }), row('bob', first.topic, 'ask', { question: 'PRIVATE QUESTION' })]);
  const p = await plan.plan('alice', 'en'); assert.equal(p.next!.topic, topics[1]!.topic); assert.equal(p.review.length, 3); assert.match(p.review[0]!.reason, /40%/);
  assert.ok(!JSON.stringify(p).includes('"answer":')); assert.ok(!JSON.stringify(p).includes('PRIVATE QUESTION'));
  assert.deepEqual(p, await plan.plan('alice', 'en'));
  assert.equal((await plan.plan('bob', 'en')).review.length, 0);
  assert.ok(!(await plan.plan('alice', 'bn')).review[0]!.reason.includes('You scored'));
});

test('later correct answers remove review questions; checks influence score reasons and viewed topics are skipped', async () => {
  const { store, tutorials, plan } = setup(); const topics = tutorials.allTopics('en').filter((t) => t.track === 'data-structures'); const first = topics[0]!, next = topics[1]!;
  const qs = tutorials.topic(first.track, first.topic, 'en').quiz;
  await store.addReadingEvents([row('a', first.topic, 'quiz', { score: 0, total: 2, correct: { [qs[0]!.id]: false, [qs[1]!.id]: false } }), row('a', next.topic, 'view'), row('a', first.topic, 'post_check', { score: 4, total: 5 }, '2026-11-20T01:01:00Z'), row('a', first.topic, 'quiz', { correct: { [qs[0]!.id]: true } }, '2026-11-20T01:02:00Z')]);
  const p = await plan.plan('a', 'en', { track: first.track, topic: first.topic }); assert.equal(p.next!.topic, topics[2]!.topic); assert.equal(p.review.length, 1); assert.equal(p.review[0]!.question.id, qs[1]!.id); assert.match(p.review[0]!.reason, /80%/);
  await assert.rejects(plan.plan('a', 'en', { track: first.track, topic: 'missing' }), /not available/);
  assert.equal((await plan.plan('new', 'en')).review.length, 0);
});

test('study-plan HTTP route ignores supplied learner IDs and validates topic context', async () => {
  const { store, tutorials, plan } = setup(); const first = tutorials.allTopics('en').find((t) => t.track === 'data-structures')!; const q = tutorials.topic(first.track, first.topic, 'en').quiz[0]!;
  await store.addReadingEvents([row('alice', first.topic, 'quiz', { score: 0, total: 1, correct: { [q.id]: false } })]);
  const app = createApp({ tutorials, studyPlan: plan, store, publicDir: join(root, 'public'), config: {}, auth: { mode: 'hybrid', identify: async (req: any) => ({ learnerId: req.headers.authorization || 'guest', email: null, signedIn: Boolean(req.headers.authorization) }) } } as any);
  await new Promise<void>((r) => app.listen(0, '127.0.0.1', r)); const base = `http://127.0.0.1:${(app.address() as any).port}`;
  try {
    const bob = await fetch(`${base}/api/study-plan?learnerId=alice`, { headers: { authorization: 'bob' } }); assert.equal(bob.status, 200); assert.equal((await bob.json()).review.length, 0);
    const alice = await fetch(`${base}/api/study-plan`, { headers: { authorization: 'alice' } }); assert.equal((await alice.json()).review.length, 1);
    assert.equal((await fetch(`${base}/api/study-plan?track=data-structures`)).status, 400);
  } finally { await new Promise<void>((r) => app.close(() => r())); }
});

test('Supabase study plans use learner-filtered events', async () => {
  const requests: string[] = []; const fakeFetch = async (url: string) => { requests.push(url); return Response.json([]); };
  const { plan } = setup(new SupabaseStore('https://test.invalid', 'test', fakeFetch as any));
  assert.ok((await plan.plan('student-a', 'en')).next);
  assert.ok(requests.every((r) => new URL(r).searchParams.get('learner_id') === 'eq.student-a'));
});
