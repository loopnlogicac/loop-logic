import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { MemoryStore } from '../src/store/store.ts';
import { SupabaseStore } from '../src/store/supabase.ts';
import { TutorialService } from '../src/app/tutorials.ts';
import { ClassService, type Staff } from '../src/app/classes.ts';
import { QuestionBankService } from '../src/app/question-bank.ts';
import { VideoExtrasService } from '../src/app/video-extras.ts';
import { WatchService } from '../src/app/watch.ts';
import { AdminService } from '../src/app/admin.ts';
import { createApp } from '../src/server/app.ts';
const root = join(import.meta.dirname, '..');
const teacher: Staff = { learnerId: 'teacher', email: 'teacher@example.com', role: 'instructor' };
const other: Staff = { learnerId: 'other', email: 'other@example.com', role: 'instructor' };
const question = (topic: string, status = 'draft') => ({ track: 'data-structures', topic, prompt: { en: 'Which end is removed first?', bn: 'আগে কোন প্রান্ত থেকে সরাবে?' }, options: { en: ['top', 'bottom', 'middle', 'all'], bn: ['উপরের', 'নিচের', 'মাঝের', 'সবগুলো'] }, answer: 0, explanation: { en: 'The top is removed first. SECRET EXPLANATION', bn: 'উপরেরটি আগে সরে।' }, status });
function setup(store: any = new MemoryStore()) { const tutorials = new TutorialService(store, join(root, 'content-kit')); const bank = new QuestionBankService(store, tutorials); const classes = new ClassService(store, tutorials, new VideoExtrasService(store)); const topic = tutorials.allTopics('en').find((t) => t.track === 'data-structures')!.topic; return { store, tutorials, bank, classes, topic }; }
async function assigned() {
  const s = setup(); const c = await s.classes.saveClass(teacher, { name: 'DS', track: 'data-structures' });
  for (const who of ['a', 'b']) await s.classes.join(who, `${who}@example.com`, true, c.code);
  const q = await s.bank.save(teacher, question(s.topic, 'approved'));
  const a = await s.classes.saveAssignment(teacher, c.id, { title: 'Custom stack quiz', passMark: 60, items: [{ kind: 'custom_quiz', track: 'data-structures', topic: s.topic, questionIds: [q.id] }] });
  return { ...s, c, q, assignment: a, quizId: a.items[0]!.quizId };
}

test('question bank validates bilingual four-option content, approval and instructor ownership', async () => {
  const { bank, topic, classes } = setup(); const body = question(topic); const q = await bank.save(teacher, body);
  assert.equal(q.status, 'draft'); assert.equal((await bank.list(other)).questions.length, 0);
  await assert.rejects(bank.save(other, body, q.id), /No such question/); await assert.rejects(bank.delete(other, q.id), /No such question/);
  for (const invalid of [{ ...body, options: { ...body.options, en: ['one'] } }, { ...body, answer: 4 }, { ...body, prompt: { ...body.prompt, bn: '' } }, { ...body, options: { ...body.options, en: ['same', 'same', 'b', 'c'] } }]) await assert.rejects(bank.save(teacher, invalid));
  const c = await classes.saveClass(teacher, { name: 'DS', track: 'data-structures' });
  await assert.rejects(classes.saveAssignment(teacher, c.id, { title: 'Draft assignment', items: [{ kind: 'custom_quiz', track: 'data-structures', topic, questionIds: [q.id] }] }), /approved questions/);
});

test('approved snapshots hide keys and survive source edits or deletion; only active enrolled students can open them', async () => {
  const { bank, classes, q, topic, quizId } = await assigned();
  const publicQuiz = await bank.quiz('a', quizId, 'en'); assert.equal(publicQuiz.questions[0].options.length, 4); assert.ok(!JSON.stringify(publicQuiz).includes('SECRET')); assert.ok(!JSON.stringify(publicQuiz).includes('"answer":'));
  assert.ok(!JSON.stringify(await classes.studentClasses('a')).includes('SECRET')); assert.ok(!JSON.stringify(await classes.studentClasses('a')).includes('"answer":'));
  await bank.save(teacher, { ...question(topic, 'draft'), answer: 1 }, q.id); await bank.delete(teacher, q.id);
  assert.equal((await bank.grade('a', quizId, { [q.id]: 0 }, 'en')).score, 1);
  await assert.rejects(bank.quiz('outsider', quizId, 'en'), /No such quiz/);
  const cl = (await classes.studentClasses('a')).classes[0]!; await classes.leave('a', cl.id); await assert.rejects(bank.quiz('a', quizId, 'en'), /No such quiz/);
});

test('custom quizzes grade server-side, track own completion and flow into the gradebook without mixing normal quiz scores', async () => {
  const { store, bank, classes, q, c, quizId, assignment } = await assigned();
  await assert.rejects(bank.grade('a', quizId, {}, 'en'), /every question/); assert.equal((await store.readingEvents('a')).length, 0);
  await assert.rejects(bank.grade('a', quizId, { [q.id]: 99 }, 'en'));
  const r = await bank.grade('a', quizId, { [q.id]: 0, score: 0, answer: 3 }, 'bn'); assert.equal(r.score, 1); assert.equal(r.results[q.id].explanation, 'উপরেরটি আগে সরে।');
  await classes.join('c', 'c@example.com', true, c.code);
  const d = await classes.dashboard(teacher, c.id); assert.equal(d.kpis.quizAvg, null, 'one contributor must not become a class figure even with three enrollments'); const student = d.roster.find((s) => s.learnerId === 'a')!;
  assert.equal(student.assignments[0]!.quizPercent, 100); assert.equal(student.assignments[0]!.done, 1); assert.equal(student.overallPercent, 100);
  assert.equal(d.roster.find((s) => s.learnerId === 'b')!.assignments[0]!.quizPercent, null);
  assert.ok((await classes.gradebookCsv(teacher, c.id)).includes('"✓","100"'));
  await classes.deleteAssignment(teacher, c.id, assignment.id); await assert.rejects(bank.quiz('b', quizId, 'en'), /No such quiz/);
});

test('question-bank HTTP endpoints enforce staff roles and quiz endpoints enforce enrollment', async () => {
  const { store, tutorials, bank, classes, topic } = setup(); const watch = new WatchService(store);
  const admin = new AdminService(store, tutorials, watch, { adminEmails: ['admin@example.com'], youtubeKey: null, timers: false }); await admin.init(); await admin.setRole('admin@example.com', teacher.email, 'instructor');
  const app = createApp({ store, tutorials, questionBank: bank, classes, admin, watch, publicDir: join(root, 'web'), config: {}, auth: { mode: 'hybrid', identify: async (req: any) => { const who = req.headers.authorization || 'guest'; return { learnerId: who, email: `${who}@example.com`, signedIn: who !== 'guest' }; } } } as any);
  await new Promise<void>((r) => app.listen(0, '127.0.0.1', r)); const base = `http://127.0.0.1:${(app.address() as any).port}`;
  try {
    assert.equal((await fetch(base + '/api/instructor/question-bank')).status, 401);
    assert.equal((await fetch(base + '/api/instructor/question-bank', { headers: { authorization: 'student' } })).status, 403);
    const r = await fetch(base + '/api/instructor/question-bank', { method: 'POST', headers: { authorization: 'teacher', 'content-type': 'application/json' }, body: JSON.stringify(question(topic, 'approved')) }); assert.equal(r.status, 200);
    assert.equal((await fetch(base + '/api/custom-quizzes/missing?learnerId=teacher', { headers: { authorization: 'student' } })).status, 404);
  } finally { await new Promise<void>((r) => app.close(() => r())); }
});

test('Supabase generic docs support bank snapshots and event grading without migrations', async () => {
  const fixture = await assigned(); const docs: any[] = [];
  for (const kind of ['class', 'enrol', 'assignment', 'bank_question', 'custom_quiz']) for (const d of await fixture.store.listDocs(kind)) docs.push({ kind, id: d.id, data: d.data, updated_at: d.updatedAt });
  const events: any[] = [];
  const fakeFetch = async (url: string, init: any) => { const u = new URL(url);
    if (u.pathname.endsWith('ll_docs')) { const kind = u.searchParams.get('kind')?.slice(3), id = u.searchParams.get('id')?.slice(3); return Response.json(docs.filter((d) => d.kind === kind && (!id || d.id === id)).slice(Number(u.searchParams.get('offset') ?? 0))); }
    if (init.method === 'POST') { events.push(...JSON.parse(init.body)); return new Response(null, { status: 201 }); }
    return Response.json([]);
  };
  const { bank } = setup(new SupabaseStore('https://test.invalid', 'test', fakeFetch as any));
  assert.equal((await bank.quiz('a', fixture.quizId, 'bn')).questions.length, 1); await bank.grade('a', fixture.quizId, { [fixture.q.id]: 0 }, 'en'); assert.equal(events[0].payload.customQuiz, fixture.quizId); assert.equal(events[0].learner_id, 'a');
});
