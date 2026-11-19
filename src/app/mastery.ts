import { randomInt, randomUUID } from 'node:crypto';
import { AppError } from './service.ts';
import type { ReadingEventRow, Store } from '../store/store.ts';
import type { TutorialService } from './tutorials.ts';

type Result = { score: number; total: number };
type Attempt = { ids: string[]; result?: Result; event?: { id: string; at: string }; recorded?: boolean };
type State = { pre?: Attempt; post?: Attempt };
type Phase = 'pre' | 'post';

/** First valid before/after pair per learner and topic. Repeats cannot change gains. */
export function masteryPairs(events: ReadingEventRow[]) {
  const states = new Map<string, { learnerId: string; track: string; topic: string; pre?: number; post?: number }>();
  for (const e of [...events].sort((a, b) => a.at.localeCompare(b.at) || (a.type === b.type ? 0 : a.type === 'pre_check' ? -1 : 1))) {
    const m = /^tutorial:([^:]+):(.+)$/.exec(e.lessonId);
    const { score, total } = e.payload;
    if (!m || !['pre_check', 'post_check'].includes(e.type) || !Number.isInteger(score) || !Number.isInteger(total) || Number(total) <= 0 || Number(score) < 0 || Number(score) > Number(total)) continue;
    const key = `${e.learnerId}:${e.lessonId}`;
    const s = states.get(key) ?? { learnerId: e.learnerId, track: m[1]!, topic: m[2]! };
    const pct = 100 * Number(score) / Number(total);
    if (e.type === 'pre_check' && s.pre === undefined && s.post === undefined) s.pre = pct;
    if (e.type === 'post_check' && s.post === undefined) s.post = pct;
    states.set(key, s);
  }
  return [...states.values()].filter((s) => s.pre !== undefined && s.post !== undefined).map((s) => ({ learnerId: s.learnerId, track: s.track, topic: s.topic, pre: s.pre!, post: s.post!, gain: s.post! - s.pre! }));
}

export class MasteryService {
  private readonly store: Store;
  private readonly tutorials: TutorialService;
  private readonly locks = new Map<string, Promise<unknown>>();
  constructor(store: Store, tutorials: TutorialService) { this.store = store; this.tutorials = tutorials; }
  private key(learnerId: string, track: string, topic: string) { return `${learnerId}:tutorial:${track}:${topic}`; }
  private async state(key: string): Promise<State> { return (await this.store.getDoc('mastery_check', key))?.data ?? {}; }
  private async locked<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const prev = this.locks.get(key) ?? Promise.resolve();
    const pending = prev.catch(() => {}).then(fn); this.locks.set(key, pending);
    try { return await pending; } finally { if (this.locks.get(key) === pending) this.locks.delete(key); }
  }
  private phase(value: string): Phase {
    if (value !== 'pre' && value !== 'post') throw new AppError('bad_input', 400, 'Choose pre or post.');
    return value;
  }
  private view(track: string, topic: string, state: State, lang: 'en' | 'bn') {
    const quiz = this.tutorials.topic(track, topic, lang).quiz;
    const show = (a?: Attempt) => a ? { result: a.result ?? null, questions: a.result ? [] : a.ids.map((id) => quiz.find((q: any) => q.id === id)).filter(Boolean) } : null;
    return { available: quiz.length > 0, pre: show(state.pre), post: show(state.post), preClosed: Boolean(state.post) };
  }
  async get(learnerId: string, track: string, topic: string, lang: 'en' | 'bn') {
    const key = this.key(learnerId, track, topic);
    const s = await this.state(key);
    for (const phase of ['pre', 'post'] as const) {
      if (s[phase]?.result && s[phase]?.event && !s[phase]?.recorded) await this.submit(learnerId, track, topic, phase, {}, lang);
    }
    return this.view(track, topic, await this.state(key), lang);
  }
  async start(learnerId: string, track: string, topic: string, phaseIn: string, lang: 'en' | 'bn') {
    const phase = this.phase(phaseIn); const key = this.key(learnerId, track, topic);
    return this.locked(key, async () => {
      const s = await this.state(key);
      if (s[phase]) return this.view(track, topic, s, lang);
      if (phase === 'pre' && s.post || phase === 'post' && s.pre && !s.pre.result) throw new AppError('check_order', 409, lang === 'bn' ? 'আগে চলমান চেক শেষ করো।' : 'Finish the open check first; the before check closes when the after check starts.');
      const quiz = this.tutorials.topic(track, topic, lang).quiz;
      if (!quiz.length) throw new AppError('not_found', 404, lang === 'bn' ? 'এই টপিকে এখনো কুইজ নেই।' : 'No quiz available.');
      const ids = quiz.map((q: any) => String(q.id));
      for (let i = ids.length - 1; i > 0; i--) { const j = randomInt(i + 1); [ids[i], ids[j]] = [ids[j]!, ids[i]!]; }
      const used = new Set(s.pre?.ids ?? []);
      const ordered = phase === 'post' ? [...ids.filter((id) => !used.has(id)), ...ids.filter((id) => used.has(id))] : ids;
      s[phase] = { ids: ordered.slice(0, phase === 'pre' ? 3 : 5) };
      await this.store.putDoc({ kind: 'mastery_check', id: key, data: s, updatedAt: new Date().toISOString() });
      return this.view(track, topic, s, lang);
    });
  }
  async submit(learnerId: string, track: string, topic: string, phaseIn: string, answers: unknown, lang: 'en' | 'bn') {
    const phase = this.phase(phaseIn); const key = this.key(learnerId, track, topic);
    return this.locked(key, async () => {
      const s = await this.state(key); const a = s[phase];
      if (!a) throw new AppError('check_not_started', 409, lang === 'bn' ? 'আগে চেকটা শুরু করো।' : 'Start the check first.');
      if (!a.result) {
        a.result = this.tutorials.gradeCheck(track, topic, a.ids, answers, lang);
        a.event = { id: randomUUID(), at: new Date().toISOString() };
        // Freeze the grade before recording evidence: a retry after an event
        // timeout must never accept a different answer set.
        await this.store.putDoc({ kind: 'mastery_check', id: key, data: s, updatedAt: a.event.at });
      }
      if (!a.recorded && a.event) {
        // A response may have been lost after the event was written. Reuse the
        // persisted event identity and recover without a second evidence row.
        if (!(await this.store.readingEvents(learnerId)).some((e) => e.id === a.event!.id)) {
          await this.store.addReadingEvents([{ ...a.event, learnerId, lessonId: `tutorial:${track}:${topic}`, blockId: null, type: phase === 'pre' ? 'pre_check' : 'post_check', payload: { ...a.result } }]);
        }
        a.recorded = true;
        await this.store.putDoc({ kind: 'mastery_check', id: key, data: s, updatedAt: a.event.at });
      }
      return this.view(track, topic, s, lang);
    });
  }
  async learner(learnerId: string, lang: 'en' | 'bn') {
    const pairs = masteryPairs(await this.store.readingEvents(learnerId));
    const tracks = [...new Set(pairs.map((p) => p.track))].map((track) => {
      const rows = pairs.filter((p) => p.track === track);
      const avg = (key: 'pre' | 'post') => Math.round(rows.reduce((n, p) => n + p[key], 0) / rows.length);
      return { track, title: this.tutorials.pageInfo(track, null, lang)?.trackTitle ?? track, pre: avg('pre'), post: avg('post'), topics: rows.length };
    });
    return { tracks };
  }
  async overall() {
    const pairs = masteryPairs(await this.store.readingEvents());
    const byLearner = new Map<string, number[]>();
    for (const p of pairs) byLearner.set(p.learnerId, [...byLearner.get(p.learnerId) ?? [], p.gain]);
    const gains = [...byLearner.values()].map((gs) => gs.reduce((a, b) => a + b, 0) / gs.length);
    return { averageGain: gains.length ? Math.round(gains.reduce((a, b) => a + b, 0) / gains.length * 100) / 100 : null, students: gains.length, pairs: pairs.length };
  }
}
