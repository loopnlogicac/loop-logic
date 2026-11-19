import type { Store } from '../store/store.ts';
import { csv } from './csv.ts';

type Lang = 'en' | 'bn';
const secretField = (key: string) => /apikey|secret|password|token|authorization|credential|privatekey/.test(key.toLowerCase().replace(/[^a-z0-9]/g, ''));
const keyPattern = /(?:AIza[\w-]{25,}|(?:sk-|gsk_|sb_secret_)[\w-]{12,}|eyJ[\w-]+\.eyJ[\w-]+\.[\w-]+)/g;

function redact(value: unknown, secrets: string[]): unknown {
  if (typeof value === 'string') {
    let out = value.replace(keyPattern, '[REDACTED]');
    for (const secret of secrets) out = out.split(secret).join('[REDACTED]');
    return out;
  }
  if (Array.isArray(value)) return value.map((v) => redact(v, secrets));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).filter(([k]) => !secretField(k)).map(([k, v]) => [k, redact(v, secrets)]));
  return value;
}

export class ReportService {
  private readonly store: Store;
  private readonly secrets: string[];
  constructor(store: Store, secretValues: string[] = []) { this.store = store; this.secrets = secretValues.filter(Boolean); }

  async backup() {
    const docs: Record<string, unknown[]> = Object.create(null);
    for (const row of await this.store.listDocs()) {
      const safe = redact(row, this.secrets);
      (docs[row.kind] ??= []).push(safe);
    }
    return { version: 1, exportedAt: new Date().toISOString(), docs };
  }

  async revenue(lang: Lang = 'en') {
    const [orders, courses] = await Promise.all([this.store.listDocs('order'), this.store.listDocs('course')]);
    type Bucket = { orders: number; cents: number };
    const months = new Map<string, Bucket>(), courseTotals = new Map<string, Bucket & { title: string }>();
    const methods = new Map<string, Bucket>(['bkash', 'nagad', 'free', 'other'].map((m) => [m, { orders: 0, cents: 0 }]));
    const monthFormat = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka', year: 'numeric', month: '2-digit' });
    let count = 0, total = 0;
    const add = (b: Bucket, cents: number) => { b.orders++; b.cents += cents; };
    for (const { data: o } of orders) {
      if (o.status !== 'approved' || typeof o.total !== 'number' || !Number.isFinite(o.total) || o.total < 0) continue;
      const cents = Math.round(o.total * 100); count++; total += cents;
      const date = new Date(o.decidedAt ?? o.createdAt);
      const parts = Number.isNaN(date.getTime()) ? [] : monthFormat.formatToParts(date);
      const month = parts.length ? `${parts.find((p) => p.type === 'year')!.value}-${parts.find((p) => p.type === 'month')!.value}` : 'unknown';
      const m = months.get(month) ?? { orders: 0, cents: 0 }; add(m, cents); months.set(month, m);
      const courseId = String(o.courseId ?? '');
      const title = courses.find((c) => c.id === courseId)?.data.title;
      const c = courseTotals.get(courseId) ?? { orders: 0, cents: 0, title: String(title?.[lang] || title?.en || o.courseTitle || courseId) };
      add(c, cents); courseTotals.set(courseId, c);
      add(methods.get(methods.has(o.method) ? o.method : 'other')!, cents);
    }
    return {
      currency: 'BDT', timeZone: 'Asia/Dhaka', basis: 'approval', orders: count, revenue: total / 100,
      byMonth: [...months].sort(([a], [b]) => a.localeCompare(b)).map(([month, b]) => ({ month, orders: b.orders, revenue: b.cents / 100 })),
      byCourse: [...courseTotals].sort(([a], [b]) => a.localeCompare(b)).map(([courseId, b]) => ({ courseId, title: b.title, orders: b.orders, revenue: b.cents / 100 })),
      byMethod: [...methods].filter(([m, b]) => m === 'bkash' || m === 'nagad' || b.orders).map(([method, b]) => ({ method, orders: b.orders, revenue: b.cents / 100 })),
    };
  }
  async revenueCsv(lang: Lang = 'en') {
    const r = await this.revenue(lang);
    const L = lang === 'bn' ? { group: 'বিভাগ', item: 'আইটেম', orders: 'অনুমোদিত অর্ডার', revenue: 'আয় (BDT)', month: 'মাস', course: 'কোর্স', method: 'মাধ্যম', unknown: 'তারিখ নেই', free: 'পুরো ছাড়', other: 'অন্যান্য', total: 'মোট' } : { group: 'Group', item: 'Item', orders: 'Approved orders', revenue: 'Revenue (BDT)', month: 'Month', course: 'Course', method: 'Method', unknown: 'Unknown date', free: 'Fully discounted', other: 'Other', total: 'Total' };
    const method = (m: string) => m === 'bkash' ? 'bKash' : m === 'nagad' ? 'Nagad' : m === 'free' ? L.free : L.other;
    return csv([[L.group, L.item, L.orders, L.revenue], [L.total, L.total, r.orders, r.revenue], ...r.byMonth.map((b) => [L.month, b.month === 'unknown' ? L.unknown : b.month, b.orders, b.revenue]), ...r.byCourse.map((b) => [L.course, b.title, b.orders, b.revenue]), ...r.byMethod.map((b) => [L.method, method(b.method), b.orders, b.revenue])]);
  }
}
