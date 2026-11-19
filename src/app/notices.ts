import type { Store } from '../store/store.ts';
type Kind = 'payment_approved' | 'payment_rejected' | 'assignment' | 'announcement' | 'join_approved';
type Context = { title: string; classId?: string; courseId?: string };
export class NoticeService {
  private readonly store: Store;
  constructor(store: Store) { this.store = store; }
  async emit(learnerId: string, type: Kind, ref: string, context: Context) {
    const id = `${learnerId}:${type}:${ref}`;
    if (await this.store.getDoc('notice', id)) return;
    const at = new Date().toISOString();
    await this.store.putDoc({ kind: 'notice', id, data: { learnerId, type, context, at, readAt: null }, updatedAt: at });
  }
  async forClass(classId: string, type: 'assignment' | 'announcement', ref: string, title: string) {
    const enrols = await this.store.listDocs('enrol');
    for (const e of enrols) if (e.data.classId === classId && e.data.status === 'active') await this.emit(e.data.learnerId, type, ref, { title, classId });
  }
  private async mine(learnerId: string) { return (await this.store.listDocs('notice')).filter((d) => d.id.startsWith(`${learnerId}:`) && d.data.learnerId === learnerId); }
  async list(learnerId: string, lang: 'en' | 'bn') {
    const T = {
      en: { payment_approved: 'Payment approved', payment_rejected: 'Payment not accepted', assignment: 'New assignment', announcement: 'Class announcement', join_approved: 'Class join approved' },
      bn: { payment_approved: 'পেমেন্ট অনুমোদিত', payment_rejected: 'পেমেন্ট গ্রহণ করা হয়নি', assignment: 'নতুন অ্যাসাইনমেন্ট', announcement: 'ক্লাসের ঘোষণা', join_approved: 'ক্লাসে যোগ দেওয়া অনুমোদিত' },
    };
    const notices = (await this.mine(learnerId)).sort((a, b) => String(b.data.at).localeCompare(String(a.data.at))).map((d) => {
      const c = d.data.context as Context, type = d.data.type as Kind;
      return { id: d.id, text: `${T[lang][type] ?? ''}: ${c.title}`, href: type.startsWith('payment_') ? `/dashboard.html` : '/dashboard.html#mc-h', read: Boolean(d.data.readAt), at: d.data.at };
    });
    return { notices: notices.slice(0, 100), unread: notices.filter((n) => !n.read).length };
  }
  async readAll(learnerId: string) {
    const at = new Date().toISOString();
    for (const d of await this.mine(learnerId)) if (!d.data.readAt) await this.store.putDoc({ ...d, data: { ...d.data, readAt: at }, updatedAt: at });
    return { ok: true };
  }
}
