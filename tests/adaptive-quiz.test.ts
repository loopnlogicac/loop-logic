import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { MemoryStore, type ReadingEventRow } from '../src/store/store.ts';
import { SupabaseStore } from '../src/store/supabase.ts';
import { TutorialService } from '../src/app/tutorials.ts';
import { AdaptiveQuizService } from '../src/app/adaptive-quiz.ts';
import { createApp } from '../src/server/app.ts';
const root = join(import.meta.dirname, '..'), track = 'data-structures', topic = 'adaptive-fixture';
function setup(store: any = new MemoryStore()) {
  const tutorials = new TutorialService(store, join(root, 'content-kit'));
  tutorials.applyCustom([], [{ id: topic, track, module: tutorials.track(track, 'en').modules[0]!.id, title: { en: 'Adaptive test', bn: 'কুইজ' }, summary: { en: '', bn: '' }, body: { en: 'Lesson', bn: 'পাঠ' }, level: 'beginner', minutes: 5, examples: [], quiz: Array.from({ length: 6 }, (_, i) => ({ prompt: `Question ${i}`, options: ['right', 'wrong', 'other', 'last'], answer: 0, explanation: 'ANSWER EXPLANATION' })) }]);
  const original = tutorials.topic.bind(tutorials);
  tutorials.topic = ((...args: any[]) => { const d = (original as any)(...args); if (args[1] === topic) d.quiz.forEach((q: any, i: number) => { q.difficulty = ['easy', 'medium', 'hard'][i % 3]; }); return d; }) as any;
  return { store, tutorials, adaptive: new AdaptiveQuizService(store, tutorials) };
}
const answer = (adaptive: AdaptiveQuizService, r: any, choice = 0, who = 'a') => adaptive.answer(who, track, topic, { runId: r.runId, questionId: r.question.id, choice }, 'en');

test('adaptive answers move harder/easier using server difficulty and record the real path', async () => {
  const { store, adaptive } = setup(); let r = await adaptive.start('a', track, topic, 'en');
  assert.equal(r.question!.difficulty, 'medium'); assert.ok(!JSON.stringify(r).includes('ANSWER EXPLANATION')); assert.ok(!JSON.stringify(r.question).includes('"answer"'));
  r = await answer(adaptive, r); assert.equal(r.question!.difficulty, 'hard');
  r = await answer(adaptive, r, 1); assert.equal(r.question!.difficulty, 'medium');
  r = await answer(adaptive, r, 1); assert.equal(r.question!.difficulty, 'easy');
  assert.deepEqual(r.difficultyPath, ['medium', 'hard', 'medium']);
  const events = await store.readingEvents('a'); assert.equal(events.length, 3); assert.deepEqual(events[2].payload.difficultyPath, r.difficultyPath); assert.equal(events[2].payload.total, 6, 'partial runs do not earn a full assignment grade');
});

test('question reuse, forged IDs/choices and cross-account attempts are refused; retries are idempotent', async () => {
  const { store, adaptive } = setup(); let r = await adaptive.start('a', track, topic, 'en'); const first = r;
  await assert.rejects(adaptive.answer('b', track, topic, { runId: r.runId, questionId: r.question!.id, choice: 0 }, 'en'), /Start/);
  await assert.rejects(adaptive.answer('a', track, topic, { runId: r.runId, questionId: 'q-6', choice: 0 }, 'en'), /current question/);
  await assert.rejects(answer(adaptive, r, 99), /Choose/);
  const simultaneous = await Promise.all([answer(adaptive, first), answer(adaptive, first)]); assert.deepEqual(simultaneous[0], simultaneous[1]);
  r = simultaneous[0]!; const ids = new Set([first.question!.id]);
  while (!r.done) { assert.ok(!ids.has(r.question!.id)); ids.add(r.question!.id); r = await answer(adaptive, r); }
  assert.equal(ids.size, 6); assert.equal(r.score, 6); assert.equal((await store.readingEvents('a')).length, 6);
  assert.notEqual((await adaptive.start('a', track, topic, 'en')).runId, first.runId);
});

test('adaptive state survives a service restart and recovers a lost event-write response', async () => {
  class Interrupted extends MemoryStore {
    once = true;
    async addReadingEvents(rows: ReadingEventRow[]) { await super.addReadingEvents(rows); if (this.once) { this.once = false; throw new Error('timeout'); } }
  }
  const { store, tutorials, adaptive } = setup(new Interrupted()); const r = await adaptive.start('a', track, topic, 'en');
  await assert.rejects(answer(adaptive, r), /timeout/);
  const restarted = new AdaptiveQuizService(store, tutorials); const resumed = await restarted.start('a', track, topic, 'en'); assert.equal(resumed.answered, 1); assert.equal((await store.readingEvents('a')).length, 1);
  const repeated = await restarted.answer('a', track, topic, { runId: r.runId, questionId: r.question!.id, choice: 1 }, 'en'); assert.equal(repeated.feedback!.correct, true);
});

test('adaptive HTTP endpoints bind the run to the authenticated learner', async () => {
  const { store, tutorials, adaptive } = setup();
  const app = createApp({ store, tutorials, adaptiveQuiz: adaptive, publicDir: join(root, 'web'), config: {}, auth: { mode: 'hybrid', identify: async (req: any) => ({ learnerId: req.headers.authorization || 'guest', email: null }) } } as any);
  await new Promise<void>((r) => app.listen(0, '127.0.0.1', r)); const base = `http://127.0.0.1:${(app.address() as any).port}/api/learn/${track}/${topic}/adaptive`;
  const call = (suffix: string, who: string, body: any) => fetch(base + suffix, { method: 'POST', headers: { authorization: who, 'content-type': 'application/json' }, body: JSON.stringify(body) });
  try { const r = await (await call('', 'alice', {})).json(); assert.equal((await call('/answer', 'bob', { runId: r.runId, questionId: r.question.id, choice: 0 })).status, 404); assert.equal((await call('/answer', 'alice', { runId: r.runId, questionId: r.question.id, choice: 0, correct: false, difficulty: 'easy' })).status, 200); }
  finally { await new Promise<void>((r) => app.close(() => r())); }
});

test('Supabase stores adaptive state as generic docs and difficulty paths as reading events', async () => {
  const docs = new Map<string, any>(), events: any[] = [];
  const fakeFetch = async (url: string, init: any) => {
    const u = new URL(url);
    if (u.pathname.endsWith('ll_docs')) { const id = u.searchParams.get('id')?.slice(3); if (init.method === 'POST') { const d = JSON.parse(init.body); docs.set(d.id, d); return new Response(null, { status: 201 }); } return Response.json(id && docs.has(id) ? [docs.get(id)] : []); }
    if (init.method === 'POST') { events.push(...JSON.parse(init.body)); return new Response(null, { status: 201 }); }
    return Response.json(events.filter((e) => e.learner_id === u.searchParams.get('learner_id')?.slice(3)));
  };
  const { adaptive } = setup(new SupabaseStore('https://test.invalid', 'test', fakeFetch as any)); const r = await adaptive.start('a', track, topic, 'en'); await answer(adaptive, r); assert.equal(docs.size, 1); assert.deepEqual(events[0].payload.difficultyPath, ['medium']);
});
