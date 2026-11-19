import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { MemoryStore } from '../src/store/store.ts';
import { SupabaseStore } from '../src/store/supabase.ts';
import { NoticeService } from '../src/app/notices.ts';
import { ClassService, type Staff } from '../src/app/classes.ts';
import { OrderService } from '../src/app/orders.ts';
import { TutorialService } from '../src/app/tutorials.ts';
import { VideoExtrasService } from '../src/app/video-extras.ts';
import { createApp } from '../src/server/app.ts';
const root = join(import.meta.dirname, '..');
const teacher: Staff = { learnerId: 'teacher', email: 'teacher@example.com', role: 'instructor' };

test('class notices go only to active members; edits do not send a new-assignment notice', async () => {
  const store = new MemoryStore(), notices = new NoticeService(store), tutorials = new TutorialService(store, join(root, 'content-kit'));
  const classes = new ClassService(store, tutorials, new VideoExtrasService(store), { notices });
  const c = await classes.saveClass(teacher, { name: 'DS', track: 'data-structures', requireApproval: true });
  for (const who of ['active', 'pending']) await classes.join(who, `${who}@example.com`, true, c.code);
  await classes.approve(teacher, c.id, 'active', true);
  assert.equal((await notices.list('active', 'en')).notices[0]!.text, 'Class join approved: DS');
  const topic = tutorials.allTopics('en').find((t) => t.track === 'data-structures')!;
  const a = await classes.saveAssignment(teacher, c.id, { title: 'Read pointers', items: [{ kind: 'read', track: topic.track, topic: topic.topic }] });
  await classes.saveAssignment(teacher, c.id, { title: 'Edited title', items: a.items }, a.id);
  await classes.post(teacher, c.id, { title: 'Exam date', body: 'Next Monday.' });
  assert.equal((await notices.list('active', 'en')).unread, 3);
  assert.equal((await notices.list('pending', 'en')).unread, 0);
  assert.equal((await notices.list('outsider', 'en')).unread, 0);
  assert.ok((await notices.list('active', 'bn')).notices.every((n) => /[\u0980-\u09ff]/.test(n.text)));
});

test('approved and rejected payments notify only the payer and retries do not reset read status', async () => {
  const store = new MemoryStore(), notices = new NoticeService(store);
  const admin = { grantLearner: async () => {}, useCoupon: async () => {}, logAudit: async () => {} };
  const orders = new OrderService(store, admin as any, { notices });
  for (const [i, approve] of [true, false].entries()) {
    await store.putDoc({ kind: 'order', id: String(i), data: { status: 'pending', learnerId: 'payer', courseId: 'c', courseTitle: 'Course', email: 'p@example.com' }, updatedAt: new Date().toISOString() });
    await orders.decide('admin@example.com', String(i), approve, 'No matching payment');
  }
  const r = await notices.list('payer', 'en'); assert.equal(r.unread, 2); assert.ok(r.notices.some((n) => n.text.includes('not accepted'))); assert.ok(r.notices.some((n) => n.text.includes('approved')));
  await notices.emit('other', 'assignment', 'private', { title: 'Other class' });
  await notices.readAll('payer'); await notices.emit('payer', 'payment_approved', '0', { title: 'Course' });
  assert.equal((await notices.list('payer', 'en')).unread, 0); assert.equal((await notices.list('other', 'en')).unread, 1);
});

test('notice endpoints reject guests and ignore caller-supplied learner IDs', async () => {
  const store = new MemoryStore(), notices = new NoticeService(store), tutorials = new TutorialService(store, join(root, 'content-kit'));
  await notices.emit('alice', 'announcement', 'one', { title: 'PRIVATE' });
  const app = createApp({ store, notices, tutorials, publicDir: join(root, 'public'), config: {}, auth: { mode: 'hybrid', identify: async (req: any) => ({ learnerId: req.headers.authorization || 'guest', email: null, signedIn: Boolean(req.headers.authorization) }) } } as any);
  await new Promise<void>((r) => app.listen(0, '127.0.0.1', r)); const base = `http://127.0.0.1:${(app.address() as any).port}`;
  try {
    assert.equal((await fetch(base + '/api/my-notices')).status, 401); assert.equal((await fetch(base + '/api/my-notices/read-all', { method: 'POST' })).status, 401);
    const other = await fetch(base + '/api/my-notices?learnerId=alice', { headers: { authorization: 'bob' } }); assert.equal((await other.json()).notices.length, 0);
    await fetch(base + '/api/my-notices/read-all', { method: 'POST', headers: { authorization: 'bob', 'content-type': 'application/json' }, body: JSON.stringify({ learnerId: 'alice' }) });
    assert.equal((await notices.list('alice', 'en')).unread, 1);
  } finally { await new Promise<void>((r) => app.close(() => r())); }
});

test('notices persist through the Supabase generic docs interface', async () => {
  const docs = new Map<string, any>();
  const fakeFetch = async (url: string, init: any) => { const u = new URL(url), id = u.searchParams.get('id')?.slice(3); if (init.method === 'POST') { const d = JSON.parse(init.body); docs.set(d.id, d); return new Response(null, { status: 201 }); } return Response.json(id ? docs.has(id) ? [docs.get(id)] : [] : [...docs.values()].slice(Number(u.searchParams.get('offset') ?? 0))); };
  const notices = new NoticeService(new SupabaseStore('https://test.invalid', 'test', fakeFetch as any));
  await notices.emit('a', 'assignment', 'one', { title: 'Quiz' }); assert.equal((await notices.list('a', 'en')).unread, 1); await notices.readAll('a'); assert.equal((await notices.list('a', 'en')).unread, 0);
});
