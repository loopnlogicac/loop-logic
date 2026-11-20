import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { MemoryStore } from '../src/store/store.ts';
import { SupabaseStore } from '../src/store/supabase.ts';
import { ReportService } from '../src/app/reports.ts';
import { TutorialService } from '../src/app/tutorials.ts';
import { WatchService } from '../src/app/watch.ts';
import { AdminService } from '../src/app/admin.ts';
import { createApp } from '../src/server/app.ts';
const root = join(import.meta.dirname, '..');
const put = (store: MemoryStore, kind: string, id: string, data: any) => store.putDoc({ kind, id, data, updatedAt: '2026-11-20T00:00:00Z' });

test('backup groups every doc kind, redacts credentials recursively and leaves stored data intact', async () => {
  const store = new MemoryStore();
  const configured = 'sample-configured-value';
  await put(store, 'site', 'settings', { name: 'Site', apiKey: 'do-not-export', nested: { API_KEY: 'private', access_token: 'private', list: [{ password: 'private', text: `value=${configured}` }] }, body: 'AIza' + 'x'.repeat(35) });
  await put(store, 'note', 'learner:t:x', { text: 'Private note', bookmark: true });
  await put(store, 'future_kind', 'x', { visible: 'future content', secretKey: 'private' });
  await put(store, '__proto__', 'safe', { visible: true });
  const r = await new ReportService(store, [configured]).backup();
  assert.deepEqual(Object.keys(r.docs).sort(), ['__proto__', 'future_kind', 'note', 'site']);
  assert.equal(r.docs.note.length, 1);
  const serialized = JSON.stringify(r);
  for (const secret of ['do-not-export', 'private"', configured, 'AIza' + 'x'.repeat(35)]) assert.ok(!serialized.includes(secret));
  assert.ok(serialized.includes('[REDACTED]'));
  assert.equal((await store.getDoc('site', 'settings'))!.data.apiKey, 'do-not-export');
  assert.ok(!serialized.includes('SUPABASE_SECRET_KEY'));
});

test('Supabase docs enumerate all kinds and paginate past small server caps and the old 10,000-row cutoff', async () => {
  const rows = Array.from({ length: 10003 }, (_, i) => ({ kind: i % 2 ? 'note' : 'order', id: String(i), data: { total: i }, updated_at: '2026-11-20T00:00:00Z' }));
  const calls: string[] = [];
  const fakeFetch = async (url: string) => {
    calls.push(url); const u = new URL(url); const kind = u.searchParams.get('kind')?.slice(3);
    const filtered = rows.filter((r) => kind === undefined || r.kind === kind);
    const offset = Number(u.searchParams.get('offset') ?? 0);
    return Response.json(filtered.slice(offset, offset + 333));
  };
  const store = new SupabaseStore('https://test.invalid', 'test', fakeFetch as any);
  const all = await store.listDocs(); assert.equal(all.length, 10003); assert.equal(all[10002]!.updatedAt, rows[0]!.updated_at);
  assert.ok(calls.some((url) => url.includes('offset=9990')));
  const onlyNotes = await store.listDocs('note'); assert.equal(onlyNotes.length, 5001); assert.ok(onlyNotes.every((r) => r.kind === 'note'));
  const backup = await new ReportService(store).backup(); assert.equal(backup.docs.order.length + backup.docs.note.length, 10003);
});

async function revenueFixture() {
  const store = new MemoryStore();
  await put(store, 'course', 'a', { title: { en: 'Course "A", intro', bn: 'কোর্স ক' } });
  const order = (status: string, total: number, courseId: string, method: string, decidedAt = '2026-11-20T00:00:00Z') => ({ status, total, courseId, courseTitle: '=FORMULA()', method, createdAt: '2026-10-01T00:00:00Z', decidedAt, email: 'PRIVATE-STUDENT' });
  await put(store, 'order', '1', order('approved', 0.1, 'a', 'bkash'));
  await put(store, 'order', '2', order('approved', 0.2, 'a', 'nagad'));
  await put(store, 'order', '3', order('approved', 500, 'b', 'bkash', '2026-11-30T19:00:00Z'));
  await put(store, 'order', '4', order('approved', 0, 'a', 'free'));
  for (const status of ['pending', 'cancelled', 'rejected']) await put(store, 'order', status, order(status, 9999, 'b', 'nagad'));
  await put(store, 'order', 'invalid', order('approved', -100, 'a', 'bkash'));
  return { store, reports: new ReportService(store) };
}

test('revenue uses approved totals, approval month in Bangladesh time, all courses and both payment methods', async () => {
  const { reports } = await revenueFixture();
  const r = await reports.revenue();
  assert.equal(r.revenue, 500.3); assert.equal(r.orders, 4); assert.equal(r.timeZone, 'Asia/Dhaka');
  assert.deepEqual(r.byMonth, [{ month: '2026-11', orders: 3, revenue: 0.3 }, { month: '2026-12', orders: 1, revenue: 500 }]);
  assert.equal(r.byMethod.find((m) => m.method === 'bkash')!.revenue, 500.1);
  assert.equal(r.byMethod.find((m) => m.method === 'nagad')!.revenue, 0.2);
  assert.equal(r.byMethod.find((m) => m.method === 'free')!.revenue, 0);
  assert.equal(r.byCourse.find((m) => m.courseId === 'a')!.revenue, 0.3);
  assert.equal((await reports.revenue('bn')).byCourse.find((m) => m.courseId === 'a')!.title, 'কোর্স ক');
});

test('revenue CSV has all three breakdowns, bilingual headers and safe text without student details', async () => {
  const { reports } = await revenueFixture();
  const text = await reports.revenueCsv();
  for (const group of ['Month', 'Course', 'Method']) assert.ok(text.includes(`"${group}"`));
  assert.ok(text.includes('Course ""A"", intro')); assert.ok(text.includes("'=FORMULA()")); assert.ok(!text.includes('PRIVATE-STUDENT'));
  assert.ok((await reports.revenueCsv('bn')).includes('অনুমোদিত অর্ডার'));
  const empty = await new ReportService(new MemoryStore()).revenue(); assert.equal(empty.revenue, 0); assert.deepEqual(empty.byMonth, []);
});

test('admin export/revenue routes reject guests, learners and instructors and return download headers', async () => {
  const { store, reports } = await revenueFixture();
  const tutorials = new TutorialService(store, join(root, 'content-kit')); const watch = new WatchService(store);
  const admin = new AdminService(store, tutorials, watch, { adminEmails: ['admin@example.com'], youtubeKey: null, timers: false }); await admin.init(); await admin.setRole('admin@example.com', 'teacher@example.com', 'instructor');
  const app = createApp({ store, tutorials, watch, admin, reports, publicDir: join(root, 'web'), config: {}, auth: { mode: 'hybrid', identify: async (req: any) => { const who = req.headers.authorization || 'guest'; return { learnerId: who, email: `${who}@example.com`, signedIn: who !== 'guest' }; } } } as any);
  await new Promise<void>((r) => app.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${(app.address() as any).port}`;
  const call = (path: string, who?: string) => fetch(base + path, { headers: who ? { authorization: who } : {} });
  try {
    for (const path of ['/api/admin/export', '/api/admin/revenue', '/api/admin/revenue.csv']) {
      assert.equal((await call(path)).status, 401); assert.equal((await call(path, 'learner')).status, 403); assert.equal((await call(path, 'teacher')).status, 403);
    }
    const backup = await call('/api/admin/export', 'admin'); assert.equal(backup.status, 200); assert.match(backup.headers.get('content-type')!, /application\/json/); assert.match(backup.headers.get('content-disposition')!, /attachment/); assert.equal(backup.headers.get('cache-control'), 'no-store'); assert.equal((await backup.json()).docs.order.length, 8);
    const report = await call('/api/admin/revenue', 'admin'); assert.equal((await report.json()).revenue, 500.3);
    const csv = await call('/api/admin/revenue.csv', 'admin'); assert.match(csv.headers.get('content-type')!, /^text\/csv/); assert.match(csv.headers.get('content-disposition')!, /revenue.csv/); assert.match(await csv.text(), /bKash/);
  } finally { await new Promise<void>((r) => app.close(() => r())); }
});
