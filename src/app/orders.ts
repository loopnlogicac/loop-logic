// Buying a paid course with bKash or Nagad, checked by an admin.
//
// The student sends money in their own bKash/Nagad app to the number the admin
// set, with a reference code, then tells us the transaction ID (TrxID) and the
// last four digits of the number they paid from. Nothing else about their
// account is collected. An admin matches the TrxID in the bKash/Nagad app and
// approves the order, which unlocks the course. A course whose price a coupon
// brings to zero is unlocked at once.

import { createHash, randomUUID } from 'node:crypto';
import { NoticeService } from './notices.ts';
import { AppError } from './service.ts';
import type { DocRow, Store } from '../store/store.ts';
import type { AdminService } from './admin.ts';

type Json = Record<string, any>;
type Lang = 'en' | 'bn';
const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const bad = (msg: string) => new AppError('bad_input', 400, msg);
const MAX_PENDING = 3;

export class OrderService {
  private readonly store: Store;
  private readonly admin: AdminService;
  private readonly now: () => Date;
  private readonly notices: NoticeService;

  constructor(store: Store, admin: AdminService, opts: { now?: () => Date; notices?: NoticeService } = {}) {
    this.store = store;
    this.notices = opts.notices ?? new NoticeService(store);
    this.admin = admin;
    this.now = opts.now ?? (() => new Date());
  }

  /** A short code the student writes in the payment's reference box, so the admin can match it. */
  static reference(learnerId: string, courseId: string) {
    return `LL${createHash('sha256').update(`${learnerId}:${courseId}`).digest('hex').slice(0, 6).toUpperCase()}`;
  }

  private course(courseId: string) {
    const c = this.admin.courseDoc(courseId);
    if (!c || !c.published || c.access !== 'paid') throw new AppError('not_found', 404, 'This course is not for sale.');
    return c;
  }
  private async orders(filter: (o: Json) => boolean = () => true) {
    return (await this.store.listDocs('order')).map((d) => ({ id: d.id, ...d.data })).filter(filter).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  }

  /** Price after a coupon, with the reason when the coupon does not apply. */
  async quote(learnerId: string, email: string | null, courseId: string, codeIn: unknown) {
    const c = this.course(courseId);
    const price = Number(c.price) || 0;
    const code = str(codeIn, 24).toUpperCase();
    if (!code) return { price, discount: 0, total: price, coupon: null };
    const no = (reason: string) => ({ price, discount: 0, total: price, coupon: { code, ok: false, reason } });
    if (c.couponsAllowed === false) return no('Coupon codes cannot be used for this course.');
    const check = this.admin.checkCoupon(code, `course:${courseId}`, email);
    if (!check.ok) return no(check.reason);
    const coupon = this.admin.couponDoc(code)!;
    const mine = await this.orders((o) => o.learnerId === learnerId && o.status !== 'rejected' && o.status !== 'cancelled');
    if (mine.filter((o) => o.coupon === code).length >= (coupon.perPerson || 1)) return no('You have already used this code.');
    if (coupon.firstOnly && mine.some((o) => o.status === 'approved')) return no('This code is for a first purchase only.');
    if (coupon.waitlistOnly && !(await this.store.listWaitlist(5000)).some((w) => w.email === (email ?? '').toLowerCase())) return no('This code is for people on the Pro waitlist.');
    const discount = check.kind === 'percent' ? Math.round((price * check.value) / 100) : Math.min(price, check.value);
    return { price, discount, total: Math.max(0, price - discount), coupon: { code, ok: true, kind: check.kind, value: check.value } };
  }

  /** What the buy page shows. */
  async page(learnerId: string, email: string | null, signedIn: boolean, courseId: string, lang: Lang) {
    const c = this.course(courseId);
    const owned = await this.admin.hasAccess(learnerId, courseId);
    const pay = this.admin.paymentSettings();
    const methods = (['bkash', 'nagad'] as const).filter((m) => pay[m]?.on && pay[m]?.number).map((m) => ({ id: m, number: pay[m].number, type: pay[m].type }));
    const shown = (c.videos ?? []).filter((v: Json) => !v.hidden);
    return {
      course: {
        id: courseId, title: (lang === 'bn' && c.title.bn) || c.title.en, blurb: (lang === 'bn' && c.blurb?.bn) || c.blurb?.en || '', code: c.code || null,
        price: Number(c.price) || 0, accessMonths: c.accessMonths ?? 0, videos: shown.length, samples: shown.filter((v: Json) => v.sample).length,
        hours: Math.round(shown.reduce((n: number, v: Json) => n + (v.seconds || 0), 0) / 360) / 10, couponsAllowed: c.couponsAllowed !== false, tint: c.tint ?? null,
      },
      owned, signedIn, email, methods, note: (lang === 'bn' && pay.note?.bn) || pay.note?.en || '',
      reference: OrderService.reference(learnerId, courseId),
      orders: signedIn ? (await this.orders((o) => o.learnerId === learnerId && o.courseId === courseId)).map((o) => this.publicOrder(o)) : [],
    };
  }

  private publicOrder(o: Json) {
    return { id: o.id, courseId: o.courseId, courseTitle: o.courseTitle, method: o.method, trxId: o.trxId, total: o.total, coupon: o.coupon, status: o.status, reason: o.reason ?? null, createdAt: o.createdAt, decidedAt: o.decidedAt ?? null };
  }

  async submit(learnerId: string, email: string | null, signedIn: boolean, courseId: string, body: Json) {
    if (!signedIn || !email) throw new AppError('unauthenticated', 401, 'Sign in first, so the course is added to your account.');
    const c = this.course(courseId);
    if (await this.admin.hasAccess(learnerId, courseId)) throw bad('You already have this course.');
    const q = await this.quote(learnerId, email, courseId, body.coupon);
    if (q.coupon && !q.coupon.ok) throw bad(q.coupon.reason ?? 'This coupon cannot be used.');
    const mine = await this.orders((o) => o.learnerId === learnerId && o.status === 'pending');
    if (mine.some((o) => o.courseId === courseId)) throw bad('You already sent a payment for this course. It is waiting for an admin to check it.');
    if (mine.length >= MAX_PENDING) throw bad('You have several payments waiting to be checked. Please wait until they are done.');
    const base = {
      learnerId, email: email.toLowerCase(), courseId, courseTitle: c.title.en, price: q.price, coupon: q.coupon?.ok ? q.coupon.code : null, discount: q.discount, total: q.total,
      reference: OrderService.reference(learnerId, courseId), createdAt: this.now().toISOString(),
    };
    const id = randomUUID();
    if (q.total === 0) {
      // A coupon covered the whole price: nothing to check.
      const order = { ...base, method: 'free', trxId: null, senderLast4: null, status: 'approved', decidedAt: base.createdAt, decidedBy: 'system (fully discounted)' };
      await this.put(id, order);
      if (order.coupon) await this.admin.useCoupon(order.coupon);
      await this.admin.grantLearner('system (fully discounted)', courseId, learnerId, base.email, { order: id, coupon: order.coupon });
      await this.notices.emit(learnerId, 'payment_approved', id, { title: c.title.en, courseId });
      return this.publicOrder({ id, ...order });
    }
    const method = body.method === 'nagad' ? 'nagad' : body.method === 'bkash' ? 'bkash' : null;
    const pay = this.admin.paymentSettings();
    if (!method || !pay[method]?.on) throw bad('Choose bKash or Nagad.');
    const trxId = str(body.trxId, 30).toUpperCase().replace(/\s+/g, '');
    if (!/^[A-Z0-9]{8,12}$/.test(trxId)) throw bad('Enter the transaction ID (TrxID) from your payment message: 8–12 letters and numbers.');
    const senderLast4 = str(body.senderLast4, 4);
    if (!/^\d{4}$/.test(senderLast4)) throw bad('Enter the last 4 digits of the number you paid from.');
    const used = await this.orders((o) => o.trxId === trxId && o.method === method && o.status !== 'rejected' && o.status !== 'cancelled');
    if (used.length) throw bad('This transaction ID has already been used. If you think this is a mistake, contact us.');
    const order = { ...base, method, trxId, senderLast4, status: 'pending' };
    await this.put(id, order);
    await this.admin.logAudit(base.email, 'order.submit', id, { courseId, method, total: q.total, coupon: order.coupon });
    return this.publicOrder({ id, ...order });
  }

  async cancel(learnerId: string, id: string) {
    const d = await this.store.getDoc('order', id);
    if (!d || d.data.learnerId !== learnerId) throw new AppError('not_found', 404, 'No such order.');
    if (d.data.status !== 'pending') throw bad('Only a payment that is still waiting can be cancelled.');
    await this.put(id, { ...d.data, status: 'cancelled', decidedAt: this.now().toISOString(), decidedBy: 'student' });
    return { ok: true };
  }

  async mine(learnerId: string) {
    return { orders: (await this.orders((o) => o.learnerId === learnerId)).map((o) => this.publicOrder(o)) };
  }

  /**
   * The signed-in learner's own course access, for the Paid courses page: courses they can watch
   * (approved order or a manual grant) and courses with a payment under review. Nobody else's.
   */
  async myAccess(learnerId: string, signedIn: boolean, courseIds: string[]) {
    if (!signedIn) return { owned: [] as string[], pending: [] as string[] };
    const owned: string[] = [];
    for (const id of courseIds) if (await this.admin.hasAccess(learnerId, id)) owned.push(id);
    const pending = [...new Set((await this.orders((o) => o.learnerId === learnerId && o.status === 'pending')).map((o) => String(o.courseId)))].filter((id) => !owned.includes(id));
    return { owned, pending };
  }

  // ── admin ──
  async adminList(status?: string) {
    const all = await this.orders();
    const counts = { pending: 0, approved: 0, rejected: 0, cancelled: 0 } as Record<string, number>;
    for (const o of all) counts[o.status] = (counts[o.status] ?? 0) + 1;
    const dupes = new Map<string, number>();
    for (const o of all) if (o.trxId) dupes.set(`${o.method}:${o.trxId}`, (dupes.get(`${o.method}:${o.trxId}`) ?? 0) + 1);
    const revenue = all.filter((o) => o.status === 'approved').reduce((n, o) => n + (o.total || 0), 0);
    return {
      counts, revenue,
      orders: all.filter((o) => !status || status === 'all' || o.status === status).slice(0, 300).map((o) => ({ ...o, duplicate: o.trxId ? (dupes.get(`${o.method}:${o.trxId}`) ?? 0) > 1 : false })),
    };
  }
  async decide(actor: string, id: string, approve: boolean, reasonIn: unknown) {
    const d = await this.store.getDoc('order', id);
    if (!d) throw new AppError('not_found', 404, 'No such order.');
    if (d.data.status !== 'pending') throw bad(`This order is already ${d.data.status}.`);
    const reason = str(reasonIn, 300);
    if (!approve && !reason) throw bad('Tell the student why, e.g. "No payment with this TrxID".');
    const data = { ...d.data, status: approve ? 'approved' : 'rejected', reason: approve ? null : reason, decidedAt: this.now().toISOString(), decidedBy: actor };
    await this.put(id, data);
    if (approve) {
      await this.admin.grantLearner(actor, d.data.courseId, d.data.learnerId, d.data.email, { order: id, trxId: d.data.trxId, total: d.data.total });
      if (d.data.coupon) await this.admin.useCoupon(d.data.coupon);
    } else await this.admin.logAudit(actor, 'order.reject', id, { reason, trxId: d.data.trxId });
    await this.notices.emit(d.data.learnerId, approve ? 'payment_approved' : 'payment_rejected', id, { title: d.data.courseTitle, courseId: d.data.courseId });
    return { ok: true, status: data.status };
  }
  async pendingCount() { return (await this.orders((o) => o.status === 'pending')).length; }

  private async put(id: string, data: Json) { await this.store.putDoc({ kind: 'order', id, data, updatedAt: this.now().toISOString() }); }
}

export type { DocRow };
