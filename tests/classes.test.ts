// Instructor dashboard: classes, joining with a code, class insights with
// small-group hiding, assignments, announcements, exam packs and the staff guard.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import type { IncomingMessage } from 'node:http';
import { MemoryStore } from '../src/store/store.ts';
import { TutorialService } from '../src/app/tutorials.ts';
import { WatchService } from '../src/app/watch.ts';
import { VideoExtrasService } from '../src/app/video-extras.ts';
import { AdminService } from '../src/app/admin.ts';
import { ClassService, type Staff } from '../src/app/classes.ts';
import type { Authenticator } from '../src/server/auth.ts';

const kit = join(import.meta.dirname, '..', 'content-kit');
const teacher: Staff = { learnerId: 't-1', email: 'teacher@uni.edu.bd', role: 'instructor' };
const other: Staff = { learnerId: 't-2', email: 'other@uni.edu.bd', role: 'instructor' };

function setup(minGroup = 3) {
  const store = new MemoryStore();
  const tutorials = new TutorialService(store, kit);
  const extras = new VideoExtrasService(store);
  const classes = new ClassService(store, tutorials, extras, { minGroup });
  return { store, tutorials, classes, extras };
}

test('students join with the code; approval when the class asks for it', async () => {
  const { classes } = setup();
  const c = await classes.saveClass(teacher, { name: 'CSE 2103 · Data Structures · Sec A', track: 'data-structures', course: 'data-structures' });
  assert.match(c.code, /^[A-Z2-9]{4}-[A-Z2-9]{4}$/);
  await assert.rejects(classes.join('s-1', null, false, c.code), /Sign in first/);
  await assert.rejects(classes.join('s-1', 'a@x.com', true, 'WRONG-CODE'), /No class has this code/);
  const j = await classes.join('s-1', 'a@x.com', true, c.code.toLowerCase().replace('-', ''));
  assert.equal(j.status, 'active');
  await classes.saveClass(teacher, { name: c.name, track: c.track, course: c.course, requireApproval: true }, c.id);
  assert.equal((await classes.join('s-2', 'b@x.com', true, c.code)).status, 'pending');
  let d = await classes.dashboard(teacher, c.id);
  assert.equal(d.kpis.students, 1);
  assert.equal(d.pending.length, 1);
  await classes.approve(teacher, c.id, 's-2', true);
  d = await classes.dashboard(teacher, c.id);
  assert.equal(d.kpis.students, 2);
  await assert.rejects(classes.dashboard(other, c.id), /another instructor/);
  assert.equal((await classes.myClasses(other)).length, 0);
});

test('class insights come from real activity and hide small groups', async () => {
  const { classes, tutorials } = setup(3);
  const c = await classes.saveClass(teacher, { name: 'DS', track: 'data-structures' });
  const topic = tutorials.track('data-structures', 'en').modules[0]!.topics[0]!.id;
  const quiz = tutorials.topic('data-structures', topic, 'en').quiz;
  for (const [i, who] of ['s-1', 's-2'].entries()) {
    await classes.join(who, `${who}@x.com`, true, c.code);
    await tutorials.recordActivity(who, { kind: 'view', track: 'data-structures', topic });
    await tutorials.gradeQuiz('data-structures', topic, who, Object.fromEntries(quiz.map((q, k) => [q.id, k === 0 && i === 0 ? 0 : 99])), 'en');
  }
  let d = await classes.dashboard(teacher, c.id);
  assert.equal(d.enough, false);
  assert.equal(d.kpis.quizAvg, null, 'two students: class average hidden');
  assert.equal(d.hardQuestions.length, 0);
  assert.equal(d.roster.length, 2, 'the instructor still sees each joined student');
  assert.equal(d.roster[0]!.done, 1);
  await classes.join('s-3', 's-3@x.com', true, c.code);
  await tutorials.gradeQuiz('data-structures', topic, 's-3', {}, 'en');
  await tutorials.gradeQuiz('data-structures', topic, 's-3', { [quiz[0]!.id]: 1 }, 'en');
  d = await classes.dashboard(teacher, c.id);
  assert.equal(d.enough, true);
  assert.ok(d.hardQuestions.length > 0, 'question stats show once 3 students answered');
  assert.ok(d.heat && d.heat[0]!.pct !== null);
  // repeat views within an hour are not stored twice
  assert.equal((await tutorials.recordActivity('s-1', { kind: 'view', track: 'data-structures', topic })).repeat, true);
});

test('assignments track each student; students see posts and their progress', async () => {
  const { classes, tutorials } = setup();
  const c = await classes.saveClass(teacher, { name: 'DS', track: 'data-structures' });
  await classes.join('s-1', 's1@x.com', true, c.code);
  const topics = tutorials.track('data-structures', 'en').modules[0]!.topics.filter((t) => t.available).slice(0, 2);
  await assert.rejects(classes.saveAssignment(teacher, c.id, { title: 'Empty', items: [] }), /at least one/);
  const a = await classes.saveAssignment(teacher, c.id, { title: 'Foundations', due: '2026-11-27', items: [{ kind: 'read', topic: topics[0]!.id }, { kind: 'quiz', topic: topics[1]!.id }] });
  await classes.post(teacher, c.id, { title: 'Midterm syllabus', body: 'Arrays and linked lists.', pinned: true });
  await tutorials.recordActivity('s-1', { kind: 'view', track: 'data-structures', topic: topics[0]!.id });
  let mine = await classes.studentClasses('s-1');
  assert.equal(mine.classes[0]!.posts[0]!.title, 'Midterm syllabus');
  assert.deepEqual(mine.classes[0]!.assignments[0]!.items.map((i) => i.done), [true, false]);
  const quiz = tutorials.topic('data-structures', topics[1]!.id, 'en').quiz;
  await tutorials.gradeQuiz('data-structures', topics[1]!.id, 's-1', Object.fromEntries(quiz.map((q) => [q.id, 99])), 'en');
  mine = await classes.studentClasses('s-1');
  assert.equal(mine.classes[0]!.assignments[0]!.items[1]!.done, false, 'a failed quiz does not count');
  const d = await classes.dashboard(teacher, c.id);
  assert.equal(d.assignments.find((x) => x.id === a.id)!.submitted, 0);
  await classes.leave('s-1', c.id);
  assert.equal((await classes.studentClasses('s-1')).classes.length, 0);
});

test('exam packs go to review and only admins approve them', async () => {
  const { classes } = setup();
  const p = await classes.savePack(teacher, { title: 'DS Midterm Pack', lessons: 'Arrays recap\nStacks', files: [{ name: 'Formula sheet', url: 'https://example.com/f.pdf' }, { name: 'bad', url: 'javascript:1' }], submit: true });
  assert.equal(p.status, 'review');
  assert.equal(p.files.length, 1);
  await assert.rejects(classes.reviewPack(teacher, p.id, true, null), /Only admins/);
  await classes.reviewPack({ ...teacher, role: 'admin' }, p.id, false, 'Add solutions');
  assert.equal((await classes.packs(teacher))[0]!.note, 'Add solutions');
  assert.equal((await classes.packs(other)).length, 0);
});

test('instructor endpoints need the instructor or admin role', async () => {
  const { createApp } = await import('../src/server/app.ts');
  const { store, tutorials, classes, extras } = setup();
  const watch = new WatchService(store, extras);
  const admin = new AdminService(store, tutorials, watch, { adminEmails: ['boss@example.com'], youtubeKey: null, timers: false });
  await admin.init();
  await admin.setRole('boss@example.com', 'teacher@uni.edu.bd', 'instructor');
  const users: Record<string, [string, string]> = { teach: ['t-1', 'teacher@uni.edu.bd'], pupil: ['p-1', 'pupil@example.com'] };
  const auth: Authenticator = {
    mode: 'hybrid',
    async identify(req: IncomingMessage) {
      const u = users[String(req.headers.authorization ?? '').slice(7)];
      return u ? { learnerId: u[0], email: u[1], signedIn: true } : { learnerId: 'anon', email: null };
    },
  };
  const app = createApp({ tutorials, watch, extras, admin, classes, store, auth, labModelFile: join(kit, 'tools', 'lab-model.mjs'), publicDir: join(import.meta.dirname, '..', 'web'), config: { supabaseUrl: null, supabaseAnonKey: null, aiDescription: 't', liveSearch: false, storeKind: 'memory', instructorKey: 'secret', editLocked: true, allowSeed: false } } as any);
  await new Promise<void>((r) => app.listen(0, '127.0.0.1', () => r()));
  const port = (app.address() as { port: number }).port;
  const call = (method: string, path: string, who?: string, body?: unknown) => fetch(`http://127.0.0.1:${port}${path}`, { method, headers: { 'content-type': 'application/json', ...(who ? { authorization: `Bearer ${who}` } : {}) }, body: body ? JSON.stringify(body) : undefined });
  try {
    assert.equal((await call('GET', '/api/instructor/classes')).status, 401);
    assert.equal((await call('GET', '/api/instructor/classes', 'pupil')).status, 403);
    const made = await call('POST', '/api/instructor/classes', 'teach', { name: 'DS A', track: 'data-structures' });
    assert.equal(made.status, 200);
    const unnamed = await (await call('POST', '/api/instructor/classes', 'teach', { name: '' })).json();
    assert.match(unnamed.error.message, /Name the class/); assert.match(unnamed.error.bn, /[\u0980-\u09ff]/, 'errors carry a Bangla message for Bangla pages');
    const { code } = await made.json();
    assert.equal((await call('POST', '/api/classes/join', 'pupil', { code })).status, 200);
    assert.equal((await (await call('GET', '/api/my-classes', 'pupil')).json()).classes.length, 1);
    // a signed-in instructor can use the video quiz editor without the instructor key
    assert.equal((await call('GET', '/api/instructor/video-extras', 'teach')).status, 200);
    assert.equal((await call('GET', '/api/instructor/video-extras', 'pupil')).status, 403);
  } finally {
    app.close();
  }
});
