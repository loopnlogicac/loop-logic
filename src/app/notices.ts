import type { Store } from '../store/store.ts';
import { getCourse } from '../content/courses.ts';
type Kind = 'payment_approved' | 'payment_rejected' | 'assignment' | 'announcement' | 'join_approved';
type Context = { title: string; classId?: string; courseId?: string };
type Item = { id: string; type: Kind; context: Context; at: string; readAt: string | null };
/** At most this many notices are kept per learner (newest first). */
const KEEP = 100;

/** Private notices. Each learner has one inbox doc (kind 'inbox', id = learnerId), so a poll reads one row. */
export class NoticeService {
  private readonly store: Store;
  private readonly locks = new Map<string, Promise<unknown>>();
  constructor(store: Store) { this.store = store; }
  private async locked<T>(learnerId: string, fn: () => Promise<T>): Promise<T> {
    const prev = this.locks.get(learnerId) ?? Promise.resolve();
    const pending = prev.catch(() => {}).then(fn); this.locks.set(learnerId, pending);
    try { return await pending; } finally { if (this.locks.get(learnerId) === pending) this.locks.delete(learnerId); }
  }
  private async items(learnerId: string): Promise<Item[]> {
    const row = await this.store.getDoc('inbox', learnerId);
    return row && row.data.learnerId === learnerId && Array.isArray(row.data.items) ? row.data.items as Item[] : [];
  }
  private async save(learnerId: string, items: Item[]) {
    const at = new Date().toISOString();
    await this.store.putDoc({ kind: 'inbox', id: learnerId, data: { learnerId, items: items.slice(0, KEEP) }, updatedAt: at });
  }
  async emit(learnerId: string, type: Kind, ref: string, context: Context) {
    const id = `${type}:${ref}`;
    await this.locked(learnerId, async () => {
      const items = await this.items(learnerId);
      if (items.some((n) => n.id === id)) return;
      await this.save(learnerId, [{ id, type, context, at: new Date().toISOString(), readAt: null }, ...items]);
    });
  }
  async forClass(classId: string, type: 'assignment' | 'announcement', ref: string, title: string) {
    const enrols = await this.store.listDocs('enrol');
    for (const e of enrols) if (e.data.classId === classId && e.data.status === 'active') await this.emit(e.data.learnerId, type, ref, { title, classId });
  }
  async list(learnerId: string, lang: 'en' | 'bn') {
    const T = {
      en: { payment_approved: 'Payment approved', payment_rejected: 'Payment not accepted', assignment: 'New assignment', announcement: 'Class announcement', join_approved: 'Class join approved' },
      bn: { payment_approved: 'পেমেন্ট অনুমোদিত', payment_rejected: 'পেমেন্ট গ্রহণ করা হয়নি', assignment: 'নতুন অ্যাসাইনমেন্ট', announcement: 'ক্লাসের ঘোষণা', join_approved: 'ক্লাসে যোগ দেওয়া অনুমোদিত' },
    };
    const notices = (await this.items(learnerId)).sort((a, b) => String(b.at).localeCompare(String(a.at))).map((n) => {
      const c = n.context;
      const title = (c.courseId && getCourse(c.courseId)?.title[lang]) || c.title;
      return { id: n.id, text: `${T[lang][n.type] ?? ''}: ${title}`, href: n.type.startsWith('payment_') ? '/dashboard.html' : '/dashboard.html#mc-h', read: Boolean(n.readAt), at: n.at };
    });
    return { notices, unread: notices.filter((n) => !n.read).length };
  }
  async readAll(learnerId: string) {
    await this.locked(learnerId, async () => {
      const items = await this.items(learnerId);
      if (!items.some((n) => !n.readAt)) return;
      const at = new Date().toISOString();
      await this.save(learnerId, items.map((n) => (n.readAt ? n : { ...n, readAt: at })));
    });
    return { ok: true };
  }
}
