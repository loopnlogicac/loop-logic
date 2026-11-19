import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { MemoryStore } from '../src/store/store.ts';
import { TutorialService } from '../src/app/tutorials.ts';
import { ClassService, type Staff } from '../src/app/classes.ts';
import { VideoExtrasService } from '../src/app/video-extras.ts';
import { WatchService } from '../src/app/watch.ts';
import { AdminService } from '../src/app/admin.ts';
import { createApp } from '../src/server/app.ts';
import { csv } from '../src/app/csv.ts';

const root = join(import.meta.dirname, '..');
const teacher: Staff = { learnerId: 'teacher', email: 'teacher@example.com', role: 'instructor' };
function setup() {
  const store = new MemoryStore(); const tutorials = new TutorialService(store, join(root, 'content-kit'));
  const extras = new VideoExtrasService(store); const classes = new ClassService(store, tutorials, extras);
  return { store, tutorials, extras, classes };
}

test('gradebook uses assignment completion, assigned quiz scores and item-weighted overall completion', async () => {
  const { store, tutorials, classes } = setup();
  const c = await classes.saveClass(teacher, { name: 'DS', track: 'data-structures' });
  await classes.join('a', 'a@example.com', true, c.code); await classes.join('b', 'b@example.com', true, c.code);
  const [one, two] = tutorials.allTopics('en').filter((t) => t.track === 'data-structures');
  const a = await classes.saveAssignment(teacher, c.id, { title: 'Read and quiz', passMark: 60, items: [{ kind: 'read', topic: one!.topic }, { kind: 'quiz', topic: one!.topic }] });
  const b = await classes.saveAssignment(teacher, c.id, { title: 'Read next', items: [{ kind: 'read', topic: two!.topic }] });
  const at = '2026-11-20T01:00:00Z';
  await store.addReadingEvents([{ id: randomUUID(), learnerId: 'a', lessonId: `tutorial:data-structures:${one!.topic}`, blockId: null, type: 'quiz', payload: { score: 4, total: 5 }, at }]);
  const d = await classes.dashboard(teacher, c.id);
  assert.equal(d.enough, false, 'no new class aggregate is exposed for small groups');
  const student = d.roster.find((s) => s.learnerId === 'a')!;
  assert.deepEqual(student.assignments.find((r) => r.id === a.id), { id: a.id, done: 2, of: 2, quizPercent: 80 });
  assert.equal(student.assignments.find((r) => r.id === b.id)!.quizPercent, null);
  assert.equal(student.overallPercent, 67);
  assert.equal(d.roster.find((s) => s.learnerId === 'b')!.overallPercent, 0);
  const text = await classes.gradebookCsv(teacher, c.id);
  assert.match(text, /text|Student/); assert.ok(text.includes('"✓","80"')); assert.ok(text.includes('"0/1","—"'));
  assert.match(await classes.gradebookCsv(teacher, c.id, 'bn'), /শিক্ষার্থী/);
  await assert.rejects(classes.gradebookCsv({ ...teacher, learnerId: 'other' }, c.id), /another instructor/);
  await classes.leave('a', c.id);
  assert.ok(!(await classes.gradebookCsv(teacher, c.id)).includes('a@example.com'));
});

test('empty gradebooks have headers and no invented overall grade; CSV handles quotes, newlines and formulas', async () => {
  const { classes } = setup();
  const c = await classes.saveClass(teacher, { name: 'Empty' });
  assert.equal((await classes.gradebookCsv(teacher, c.id)).split('\r\n').length, 2);
  await classes.join('s', '=FORMULA@example.com', true, c.code);
  const d = await classes.dashboard(teacher, c.id); assert.equal(d.roster[0]!.overallPercent, null);
  const text = await classes.gradebookCsv(teacher, c.id); assert.ok(text.includes("\"'=formula@example.com\""));
  assert.equal(csv([['a,"b"\nc', '=1+1', ' @SUM(1)', '\tfoo']]), '\uFEFF"a,""b""\nc","\'=1+1","\' @SUM(1)","\'\tfoo"\r\n');
});

test('CSV endpoint sends an authenticated attachment and refuses learners, other instructors and guests', async () => {
  const { store, tutorials, extras, classes } = setup(); const watch = new WatchService(store);
  const admin = new AdminService(store, tutorials, watch, { adminEmails: ['admin@example.com'], youtubeKey: null, timers: false }); await admin.init();
  await admin.setRole('admin@example.com', teacher.email, 'instructor'); await admin.setRole('admin@example.com', 'other@example.com', 'instructor');
  const c = await classes.saveClass(teacher, { name: 'DS' }); await classes.join('s', 'student@example.com', true, c.code);
  const app = createApp({ store, tutorials, extras, watch, classes, admin, publicDir: join(root, 'public'), config: {}, auth: { mode: 'hybrid', identify: async (req: any) => { const who = req.headers.authorization || 'guest'; return { learnerId: who, email: `${who}@example.com`, signedIn: who !== 'guest' }; } } } as any);
  await new Promise<void>((r) => app.listen(0, '127.0.0.1', r));
  const url = `http://127.0.0.1:${(app.address() as any).port}/api/instructor/classes/${c.id}/gradebook.csv`;
  const call = (who?: string) => fetch(url, { headers: who ? { authorization: who } : {} });
  try {
    assert.equal((await call()).status, 401); assert.equal((await call('student')).status, 403); assert.equal((await call('other')).status, 403);
    const r = await call('teacher'); assert.equal(r.status, 200); assert.match(r.headers.get('content-type')!, /^text\/csv/); assert.match(r.headers.get('content-disposition')!, /attachment; filename="gradebook.csv"/); assert.equal(r.headers.get('cache-control'), 'no-store'); assert.match(await r.text(), /student@example.com/);
    assert.equal((await call('admin')).status, 200);
  } finally { await new Promise<void>((r) => app.close(() => r())); }
});
