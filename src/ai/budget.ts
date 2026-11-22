// AI spending limits that survive restarts and cleared cookies.
//
// - Per learner: FREE_DAILY_AI_CALLS answers a day. A signed-in learner keeps
//   the same id on every device, so clearing cookies doesn't reset it.
// - Per network for guests: a guest who clears cookies gets a new id, so guests
//   also share a daily allowance per IP address (generous, because a whole
//   campus lab can share one IP; signing in gives each student their own).
// - Global: AI_DAILY_CAP model calls a day across the whole site, counted at the
//   gateway so every AI feature is covered. Past it, learners get reviewed text.
//
// Counts are kept per UTC day in the docs table (kind "ai_use"), so a restart
// does not hand out a fresh allowance.

import type { Store } from '../store/store.ts';

export interface AiClient { ip?: string | null; signedIn?: boolean }
export type BudgetBlock = 'learner' | 'guest_network' | 'global';

export class AiBudget {
  private readonly store: Store | null;
  readonly perLearner: number;
  readonly perGuestIp: number;
  readonly globalDaily: number;
  private readonly now: () => Date;
  private day = '';
  private loaded: Promise<void> | null = null;
  private counts = new Map<string, number>();
  private total = 0;
  private writing: Promise<unknown> = Promise.resolve();

  constructor(store: Store | null, opts: { perLearner?: number; perGuestIp?: number; globalDaily?: number; now?: () => Date } = {}) {
    this.store = store;
    this.perLearner = Math.max(0, Math.floor(opts.perLearner ?? 10));
    this.perGuestIp = Math.max(0, Math.floor(opts.perGuestIp ?? 40));
    this.globalDaily = Math.max(0, Math.floor(opts.globalDaily ?? 3000));
    this.now = opts.now ?? (() => new Date());
  }

  private keys(learnerId: string, client?: AiClient): string[] {
    const out = [`u:${learnerId}`];
    if (client && !client.signedIn && client.ip) out.push(`ip:${client.ip}`);
    return out;
  }

  private async ready() {
    const d = this.now().toISOString().slice(0, 10);
    if (d !== this.day) {
      this.day = d;
      this.counts = new Map();
      this.total = 0;
      this.loaded = this.load(d);
    }
    await this.loaded;
  }

  private async load(day: string) {
    const doc = await this.store?.getDoc('ai_use', day).catch(() => undefined);
    if (!doc || day !== this.day) return;
    for (const [k, v] of Object.entries((doc.data.keys ?? {}) as Record<string, number>)) this.counts.set(k, Math.max(this.counts.get(k) ?? 0, Number(v) || 0));
    this.total = Math.max(this.total, Number(doc.data.total) || 0);
  }

  private save() {
    if (!this.store) return;
    const day = this.day;
    const data = { total: this.total, keys: Object.fromEntries(this.counts) };
    // Writes are chained so an older count never lands after a newer one.
    this.writing = this.writing.then(() => this.store!.putDoc({ kind: 'ai_use', id: day, data, updatedAt: this.now().toISOString() })).catch(() => undefined);
  }

  /** Why this learner may not get an AI answer now, or null when they may. */
  async blocked(learnerId: string, client?: AiClient): Promise<BudgetBlock | null> {
    await this.ready();
    if (this.total >= this.globalDaily) return 'global';
    if ((this.counts.get(`u:${learnerId}`) ?? 0) >= this.perLearner) return 'learner';
    if (client && !client.signedIn && client.ip && (this.counts.get(`ip:${client.ip}`) ?? 0) >= this.perGuestIp) return 'guest_network';
    return null;
  }

  /** Counts one AI answer against the learner (and, for guests, their network). */
  async spend(learnerId: string, client?: AiClient) {
    await this.ready();
    for (const k of this.keys(learnerId, client)) this.counts.set(k, (this.counts.get(k) ?? 0) + 1);
    this.save();
  }

  /** Answers left today for this learner. */
  async left(learnerId: string, client?: AiClient): Promise<number> {
    await this.ready();
    if (this.total >= this.globalDaily) return 0;
    let n = this.perLearner - (this.counts.get(`u:${learnerId}`) ?? 0);
    if (client && !client.signedIn && client.ip) n = Math.min(n, this.perGuestIp - (this.counts.get(`ip:${client.ip}`) ?? 0));
    return Math.max(0, n);
  }

  /** The gateway asks before every model call. */
  async globalAllows(): Promise<boolean> {
    await this.ready();
    return this.total < this.globalDaily;
  }

  /** The gateway counts every model call it makes. */
  async countCall() {
    await this.ready();
    this.total += 1;
    this.save();
  }

  /** Today's site-wide use, for the admin AI page. */
  async today() {
    await this.ready();
    return { day: this.day, calls: this.total, cap: this.globalDaily, perLearner: this.perLearner, perGuestNetwork: this.perGuestIp };
  }

  /** Waits for pending writes (tests and shutdown). */
  async flush() { await this.writing; }
}
