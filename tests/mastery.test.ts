import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { MemoryStore, type ReadingEventRow } from '../src/store/store.ts';
import { SupabaseStore } from '../src/store/supabase.ts';
import { TutorialService } from '../src/app/tutorials.ts';
import { MasteryService, masteryPairs } from '../src/app/mastery.ts';
import { ClassService, type Staff } from '../src/app/classes.ts';
import { VideoExtrasService } from '../src/app/video-extras.ts';
import { AdminService } from '../src/app/admin.ts';
import { WatchService } from '../src/app/watch.ts';
import { createApp } from '../src/server/app.ts';

const root = join(import.meta.dirname, '..');
const track = 'data-structures', topic = 'mastery-fixture';
const teacher: Staff = { learnerId: 'teacher', email: 'teacher@example.com', role: 'instructor' };
function setup(store: any = new MemoryStore(), questions = 8) {
  const tutorials = new TutorialService(store, join(root, 'content-kit'));
  addTopic(tutorials, questions);
  return { store, tutorials, mastery: new MasteryService(store, tutorials) };
}
function addTopic(tutorials: TutorialService, questions = 8) {
  tutorials.applyCustom([], [{ id: topic, track, module: tutorials.track(track, 'en').modules[0]!.id, title: { en: 'Mastery fixture', bn: 'শেখা যাচাই' }, summary: { en: '', bn: '' }, level: 'beginner', minutes: 5, body: { en: 'Lesson', bn: 'পাঠ' }, examples: [], quiz: Array.from({ length: questions }, (_, i) => ({ prompt: `Question ${i}`, options: ['right', 'wrong'], answer: 0, explanation: 'SECRET KEY' })) }]);
}
const answers = (qs: any[], correct = true) => Object.fromEntries(qs.map((q) => [q.id, correct ? 0 : 1]));
async function pair(m: MasteryService, who: string) {
  const pre = (await m.start(who, track, topic, 'pre', 'en')).pre!;
  await m.submit(who, track, topic, 'pre', answers(pre.questions, false), 'en');
  const post = (await m.start(who, track, topic, 'post', 'en')).post!;
  return m.submit(who, track, topic, 'post', answers(post.questions), 'en');
}

test('checks select 3 then 5 different questions, grade server-side, persist and resist retries', async () => {
  const { store, tutorials, mastery } = setup();
  const pre = await mastery.start('alice', track, topic, 'pre', 'en');
  assert.equal(pre.pre!.questions.length, 3);
  assert.ok(!JSON.stringify(pre).includes('SECRET KEY'));
  assert.ok(!JSON.stringify(pre).includes('"answer":'));
  await assert.rejects(mastery.submit('alice', track, topic, 'pre', {}, 'en'), /every question/);
  await assert.rejects(mastery.submit('alice', track, topic, 'pre', Object.fromEntries(pre.pre!.questions.map((q: any) => [q.id, 99])), 'en'), /every question/);
  await assert.rejects(mastery.start('alice', track, topic, 'post', 'en'), /Finish/);
  const fresh = new MasteryService(store, tutorials);
  assert.deepEqual((await fresh.get('alice', track, topic, 'en')).pre, pre.pre);
  const given = answers(pre.pre!.questions); given[pre.pre!.questions[0]!.id] = 1;
  await Promise.all([fresh.submit('alice', track, topic, 'pre', given, 'en'), fresh.submit('alice', track, topic, 'pre', given, 'en')]);
  const post = await fresh.start('alice', track, topic, 'post', 'en');
  assert.equal(post.post!.questions.length, 5);
  assert.ok(post.post!.questions.every((q: any) => !pre.pre!.questions.some((p: any) => p.id === q.id)));
  const result = await fresh.submit('alice', track, topic, 'post', answers(post.post!.questions), 'en');
  assert.deepEqual(result.pre!.result, { score: 2, total: 3 });
  assert.deepEqual(result.post!.result, { score: 5, total: 5 });
  await fresh.submit('alice', track, topic, 'post', answers(post.post!.questions, false), 'en');
  const events = await store.readingEvents('alice');
  assert.equal(events.length, 2);
  assert.deepEqual(events[0].payload, { score: 2, total: 3 });
  assert.equal((await fresh.learner('alice', 'en')).tracks[0]!.pre, 67);
  assert.equal((await fresh.overall()).students, 1);
  assert.equal((await fresh.get('bob', track, topic, 'en')).pre, null);
  assert.equal((await fresh.learner('bob', 'en')).tracks.length, 0);
});

test('short quizzes reuse only as necessary; skipping the before check yields no gain', async () => {
  const { mastery } = setup(undefined, 4);
  const pre = (await mastery.start('a', track, topic, 'pre', 'en')).pre!;
  await mastery.submit('a', track, topic, 'pre', answers(pre.questions), 'en');
  const post = (await mastery.start('a', track, topic, 'post', 'en')).post!;
  assert.equal(post.questions.length, 4);
  assert.equal(new Set(post.questions.map((q: any) => q.id)).size, 4);
  const skipped = (await mastery.start('skip', track, topic, 'post', 'en')).post!;
  await mastery.submit('skip', track, topic, 'post', answers(skipped.questions), 'en');
  await assert.rejects(mastery.start('skip', track, topic, 'pre', 'en'), /Finish/);
  assert.equal((await mastery.overall()).students, 0);
});

test('class topic gains require minGroup distinct paired students, exclude outsiders and question text', async () => {
  const { store, tutorials, mastery } = setup();
  const classes = new ClassService(store, tutorials, new VideoExtrasService(store), { minGroup: 3 });
  const cls = await classes.saveClass(teacher, { name: 'DS', track });
  for (const who of ['s1', 's2']) { await classes.join(who, `${who}@example.com`, true, cls.code); await pair(mastery, who); }
  await pair(mastery, 'outsider');
  assert.deepEqual((await classes.dashboard(teacher, cls.id)).masteryGain, []);
  await classes.join('s3', 's3@example.com', true, cls.code);
  await pair(mastery, 's3');
  const d = await classes.dashboard(teacher, cls.id);
  assert.equal(d.masteryGain[0]!.students, 3);
  assert.equal(d.masteryGain[0]!.gain, 100);
  assert.ok(!JSON.stringify(d.masteryGain).includes('learnerId'));
  await assert.rejects(classes.dashboard({ ...teacher, learnerId: 'other' }, cls.id), /another instructor/);
});

test('pairing uses only valid first results; negative gains remain visible', () => {
  const row = (type: string, score: number, total: number, at: string) => ({ id: at, learnerId: 'a', lessonId: 'tutorial:t:x', type, payload: { score, total }, at } as ReadingEventRow);
  const ps = masteryPairs([row('pre_check', 3, 3, '1'), row('pre_check', 0, 3, '2'), row('post_check', 1, 5, '3'), row('post_check', 5, 5, '4'), { ...row('post_check', 100, 0, '5'), learnerId: 'invalid' }]);
  assert.equal(ps.length, 1); assert.equal(ps[0]!.gain, -80);
});

test('mastery HTTP routes isolate learners and restrict judge evidence to admins', async () => {
  const { store, tutorials, mastery } = setup();
  const watch = new WatchService(store);
  const admin = new AdminService(store, tutorials, watch, { adminEmails: ['admin@example.com'], youtubeKey: null, timers: false }); await admin.init(); addTopic(tutorials);
  const app = createApp({ store, tutorials, mastery, admin, watch, publicDir: join(root, 'web'), config: {}, auth: { mode: 'hybrid', identify: async (req: any) => { const who = req.headers.authorization || 'guest'; return { learnerId: who, email: `${who}@example.com`, signedIn: who !== 'guest' }; } } } as any);
  await new Promise<void>((r) => app.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${(app.address() as any).port}`;
  const call = (path: string, who?: string, data?: any) => fetch(base + path, { method: data ? 'POST' : 'GET', headers: { 'content-type': 'application/json', ...(who ? { authorization: who } : {}) }, body: data ? JSON.stringify(data) : undefined });
  try {
    assert.equal((await call('/api/admin/mastery')).status, 401);
    assert.equal((await call('/api/admin/mastery', 'alice')).status, 403);
    await pair(mastery, 'alice');
    assert.equal((await (await call('/api/my-mastery', 'bob')).json()).tracks.length, 0);
    const r = await call('/api/admin/mastery', 'admin'); assert.equal(r.status, 200);
    assert.equal((await r.json()).students, 1);
    const s = await call(`/api/learn/${track}/${topic}/checks/pre`, 'bob', {}); assert.equal(s.status, 200);
    assert.ok(!(await s.text()).includes('SECRET KEY'));
  } finally { await new Promise<void>((r) => app.close(() => r())); }
});

test('Supabase persists check docs and pre/post reading events without migrations', async () => {
  const docs = new Map<string, any>(), events: any[] = [];
  const fakeFetch = async (url: any, init: any) => {
    const u = new URL(String(url));
    if (u.pathname.endsWith('ll_docs')) {
      const id = u.searchParams.get('id')?.slice(3);
      if (init.method === 'POST') { const row = JSON.parse(init.body); docs.set(row.id, row); return new Response(null, { status: 201 }); }
      return Response.json(id ? docs.has(id) ? [docs.get(id)] : [] : [...docs.values()]);
    }
    if (init.method === 'POST') { events.push(...JSON.parse(init.body)); return new Response(null, { status: 201 }); }
    const learner = u.searchParams.get('learner_id')?.slice(3);
    return Response.json(events.filter((e) => !learner || e.learner_id === learner));
  };
  const store = new SupabaseStore('https://test.invalid', 'test', fakeFetch as any);
  const { mastery } = setup(store);
  await pair(mastery, 'a');
  assert.deepEqual(events.map((e) => e.type), ['pre_check', 'post_check']);
  assert.equal((await mastery.overall()).averageGain, 100);
});

test('Supabase mastery evidence includes checks beyond the first page of reading history', async () => {
  const history = Array.from({ length: 1000 }, (_, i) => ({ id: `view-${i}`, learner_id: 'a', lesson_id: 'tutorial:data-structures:mastery-fixture', block_id: null, type: 'view', payload: {}, at: '2026-11-19T00:00:00Z' }));
  history.push({ ...history[0]!, id: 'pre', type: 'pre_check', payload: { score: 1, total: 3 }, at: '2026-11-20T00:00:00Z' }, { ...history[0]!, id: 'post', type: 'post_check', payload: { score: 4, total: 5 }, at: '2026-11-20T00:01:00Z' });
  const fakeFetch = async (url: string) => { const u = new URL(url); const offset = Number(u.searchParams.get('offset') ?? 0); return Response.json(history.slice(offset, offset + 1000)); };
  const { mastery } = setup(new SupabaseStore('https://test.invalid', 'test', fakeFetch as any));
  assert.equal((await mastery.overall()).students, 1);
  assert.equal((await mastery.overall()).averageGain, 46.67);
});

test('failed evidence writes preserve the first score and recover without duplicate events', async () => {
  for (const afterWrite of [false, true]) {
    class InterruptedStore extends MemoryStore {
      interrupted = false;
      async addReadingEvents(rows: ReadingEventRow[]) {
        if (!this.interrupted) {
          this.interrupted = true;
          if (afterWrite) await super.addReadingEvents(rows);
          throw new Error('Simulated storage timeout');
        }
        return super.addReadingEvents(rows);
      }
    }
    const { store, tutorials, mastery } = setup(new InterruptedStore());
    const pre = (await mastery.start('a', track, topic, 'pre', 'en')).pre!;
    await assert.rejects(mastery.submit('a', track, topic, 'pre', answers(pre.questions), 'en'), /timeout/);
    const restarted = new MasteryService(store, tutorials);
    const recovered = await restarted.get('a', track, topic, 'en');
    assert.deepEqual(recovered.pre!.result, { score: 3, total: 3 });
    const retry = await restarted.submit('a', track, topic, 'pre', answers(pre.questions, false), 'en');
    assert.deepEqual(retry.pre!.result, { score: 3, total: 3 });
    assert.equal((await store.readingEvents('a')).length, 1);
    assert.deepEqual((await store.readingEvents('a'))[0].payload, { score: 3, total: 3 });
  }
});
