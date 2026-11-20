// Buying a paid course: payment settings, quotes with coupons, submitting a
// bKash/Nagad payment, duplicate transaction IDs, and admin approval unlocking the course.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { MemoryStore } from '../src/store/store.ts';
import { TutorialService } from '../src/app/tutorials.ts';
import { WatchService } from '../src/app/watch.ts';
import { AdminService, type YtFetch } from '../src/app/admin.ts';
import { OrderService } from '../src/app/orders.ts';

const kit = join(import.meta.dirname, '..', 'content-kit');
const yt: YtFetch = async (url) => {
  const u = new URL(url);
  const ok = (body: unknown) => ({ ok: true, status: 200, json: async () => body });
  if (u.pathname.endsWith('/playlists')) return ok({ items: [{ snippet: { title: 'MAT-101', channelId: 'UC1' } }] });
  if (u.pathname.endsWith('/playlistItems')) return ok({ items: ['a', 'b', 'c', 'd'].map((x) => ({ contentDetails: { videoId: `vid0000000${x}` }, status: { privacyStatus: 'unlisted' } })) });
  return ok({ items: (u.searchParams.get('id') ?? '').split(',').map((id) => ({ id, snippet: { title: id, channelId: 'UC1' }, contentDetails: { duration: 'PT10M' } })) });
};

async function setup() {
  const store = new MemoryStore();
  const tutorials = new TutorialService(store, kit);
  const watch = new WatchService(store);
  const admin = new AdminService(store, tutorials, watch, { adminEmails: ['boss@example.com'], youtubeKey: 'k', fetchImpl: yt, timers: false });
  await admin.init();
  const course = await admin.saveCourse('boss@example.com', { access: 'paid', title: { en: 'MAT-101 Complete' }, price: 500, playlist: 'PLmat101000001', published: true });
  const orders = new OrderService(store, admin);
  return { store, admin, watch, orders, course };
}

test('payment numbers must be real mobile numbers', async () => {
  const { admin } = await setup();
  await assert.rejects(admin.savePaymentSettings('boss@example.com', { bkash: { on: true, number: '12345' } }), /11-digit/);
  const s = await admin.savePaymentSettings('boss@example.com', { bkash: { on: true, number: '017 1234-5678', type: 'personal' }, nagad: { on: false } });
  assert.equal(s.bkash.number, '01712345678');
});

test('a student pays by bKash, the admin approves, the course unlocks', async () => {
  const { admin, watch, orders, course } = await setup();
  await admin.savePaymentSettings('boss@example.com', { bkash: { on: true, number: '01712345678' } });
  const page = await orders.page('s-1', 'rafi@gmail.com', true, course.id, 'en');
  assert.equal(page.course.price, 500);
  assert.deepEqual(page.methods.map((m) => m.id), ['bkash']);
  assert.match(page.reference, /^LL[0-9A-F]{6}$/);
  await assert.rejects(orders.submit('anon', null, false, course.id, {}), /Sign in first/);
  await assert.rejects(orders.submit('s-1', 'rafi@gmail.com', true, course.id, { method: 'nagad', trxId: 'ABC12345XY', senderLast4: '1234' }), /bKash or Nagad/);
  await assert.rejects(orders.submit('s-1', 'rafi@gmail.com', true, course.id, { method: 'bkash', trxId: 'x', senderLast4: '1234' }), /transaction ID/);
  const o = await orders.submit('s-1', 'rafi@gmail.com', true, course.id, { method: 'bkash', trxId: 'bfk3x9q2la', senderLast4: '4321' });
  assert.equal(o.status, 'pending');
  assert.equal(o.trxId, 'BFK3X9Q2LA');
  await assert.rejects(orders.submit('s-1', 'rafi@gmail.com', true, course.id, { method: 'bkash', trxId: 'OTHER12345', senderLast4: '4321' }), /already sent a payment/);
  await assert.rejects(orders.submit('s-2', 'nusrat@gmail.com', true, course.id, { method: 'bkash', trxId: 'BFK3X9Q2LA', senderLast4: '1111' }), /already been used/);
  assert.equal((await watch.view(course.id, 's-1', 'en')).course.owned, false);
  assert.equal((await admin.overview()).attention[0]!.tag, 'Payments');
  await assert.rejects(orders.decide('boss@example.com', o.id, false, ''), /Tell the student why/);
  await orders.decide('boss@example.com', o.id, true, null);
  assert.equal((await watch.view(course.id, 's-1', 'en')).course.owned, true);
  assert.equal((await orders.mine('s-1')).orders[0]!.status, 'approved');
  await assert.rejects(orders.decide('boss@example.com', o.id, true, null), /already approved/);
});

test('a rejected payment frees its transaction ID and tells the student why', async () => {
  const { admin, orders, course } = await setup();
  await admin.savePaymentSettings('boss@example.com', { nagad: { on: true, number: '01812345678' } });
  const o = await orders.submit('s-1', 'a@x.com', true, course.id, { method: 'nagad', trxId: '7QW2ER9T', senderLast4: '0000' });
  await orders.decide('boss@example.com', o.id, false, 'No payment with this TrxID');
  const mine = await orders.mine('s-1');
  assert.equal(mine.orders[0]!.reason, 'No payment with this TrxID');
  const again = await orders.submit('s-1', 'a@x.com', true, course.id, { method: 'nagad', trxId: '7QW2ER9T', senderLast4: '0000' });
  assert.equal(again.status, 'pending');
  await orders.cancel('s-1', again.id);
  assert.equal((await orders.mine('s-1')).orders.find((x) => x.id === again.id)!.status, 'cancelled');
});

test('coupons: discount, per-person limit, and a full discount unlocks at once', async () => {
  const { admin, watch, orders, course } = await setup();
  await admin.savePaymentSettings('boss@example.com', { bkash: { on: true, number: '01712345678' } });
  await admin.saveCoupon('boss@example.com', { code: 'MID20', kind: 'percent', value: 20, appliesTo: `course:${course.id}` });
  await admin.saveCoupon('boss@example.com', { code: 'FREE', kind: 'percent', value: 100 });
  await admin.saveCoupon('boss@example.com', { code: 'EDU', kind: 'fixed', value: 100, eduOnly: true });
  assert.equal((await orders.quote('s-1', 'a@x.com', course.id, 'mid20')).total, 400);
  assert.equal((await orders.quote('s-1', 'a@gmail.com', course.id, 'EDU')).coupon?.ok, false);
  assert.equal((await orders.quote('s-1', 'a@uiu.edu.bd', course.id, 'EDU')).total, 400);
  const o = await orders.submit('s-1', 'a@x.com', true, course.id, { coupon: 'MID20', method: 'bkash', trxId: 'AAAA1111BB', senderLast4: '1234' });
  assert.equal(o.total, 400);
  await orders.decide('boss@example.com', o.id, true, null);
  assert.equal(admin.couponDoc('MID20')!.used, 1);
  assert.equal((await orders.quote('s-1', 'a@x.com', course.id, 'MID20')).coupon?.reason, 'You have already used this code.');
  const free = await orders.submit('s-2', 'b@x.com', true, course.id, { coupon: 'FREE' });
  assert.equal(free.status, 'approved');
  assert.equal((await watch.view(course.id, 's-2', 'en')).course.owned, true);
});

test('the Paid courses page sees only the signed-in student’s own access: owned and under review', async () => {
  const { admin, orders, course } = await setup();
  await admin.savePaymentSettings('boss@example.com', { bkash: { on: true, number: '01712345678' } });
  const ids = [course.id];
  assert.deepEqual(await orders.myAccess('s-1', false, ids), { owned: [], pending: [] }, 'guests get nothing');
  const o = await orders.submit('s-1', 'rafi@gmail.com', true, course.id, { method: 'bkash', trxId: 'PAIDPAGE01', senderLast4: '4321' });
  assert.deepEqual(await orders.myAccess('s-1', true, ids), { owned: [], pending: [course.id] });
  assert.deepEqual(await orders.myAccess('s-2', true, ids), { owned: [], pending: [] }, 'another student sees none of it');
  await orders.decide('boss@example.com', o.id, true, null);
  assert.deepEqual(await orders.myAccess('s-1', true, ids), { owned: [course.id], pending: [] });
});

test('the Virtual Office unlocks for staff and for students who bought a course that includes it', async () => {
  const { createApp } = await import('../src/server/app.ts');
  const { OfficeService } = await import('../src/app/office.ts');
  const { store, admin, orders } = await setup();
  const pack = await admin.saveCourse('boss@example.com', { access: 'paid', title: { en: 'Virtual Office pack' }, price: 299, playlist: 'PLoffice00001', published: true, includesOffice: true });
  assert.deepEqual(admin.officeCourses(), [{ id: pack.id, price: 299 }]);
  await admin.setRole('boss@example.com', 'teacher@uni.edu.bd', 'instructor');
  await admin.savePaymentSettings('boss@example.com', { bkash: { on: true, number: '01712345678' } });
  const users: Record<string, [string, string]> = { stu: ['s-1', 'rafi@gmail.com'], teach: ['t-1', 'teacher@uni.edu.bd'] };
  const auth = { mode: 'hybrid', async identify(req: any) { const u = users[String(req.headers.authorization ?? '').slice(7)]; return u ? { learnerId: u[0], email: u[1], signedIn: true } : { learnerId: 'anon', email: null }; } };
  const app = createApp({ store, admin, orders, office: new OfficeService(store), auth, publicDir: join(import.meta.dirname, '..', 'public'), config: {} } as any);
  await new Promise<void>((r) => app.listen(0, '127.0.0.1', () => r()));
  const base = `http://127.0.0.1:${(app.address() as { port: number }).port}`;
  const get = (path: string, who?: string) => fetch(base + path, { headers: who ? { authorization: `Bearer ${who}` } : {} });
  try {
    assert.equal((await get('/api/office/cgpa-portal')).status, 200, 'the free sample is open to guests');
    assert.equal((await get('/api/office/sales-report', 'stu')).status, 403);
    const lobby = await (await get('/api/office', 'stu')).json();
    assert.equal(lobby.unlock.id, pack.id);
    assert.equal((await get('/api/office/sales-report', 'teach')).status, 200, 'instructors can open every project');
    const o = await orders.submit('s-1', 'rafi@gmail.com', true, pack.id, { method: 'bkash', trxId: 'OFFICE0001', senderLast4: '4321' });
    await orders.decide('boss@example.com', o.id, true, null);
    assert.equal((await get('/api/office/sales-report', 'stu')).status, 200, 'buying the pack unlocks the premium projects');
  } finally { app.close(); }
});
