import type { ReadingEventRow, Store } from '../store/store.ts';
import type { TutorialService } from './tutorials.ts';

type Lang = 'en' | 'bn';
const keyOf = (track: string, topic: string) => `${track}:${topic}`;
const href = (track: string, topic: string) => `/learn.html?track=${encodeURIComponent(track)}&topic=${encodeURIComponent(topic)}`;
const percentage = (e?: ReadingEventRow) => {
  const s = e?.payload.score, n = e?.payload.total;
  return typeof s === 'number' && typeof n === 'number' && n > 0 && s >= 0 && s <= n ? Math.round(s / n * 100) : null;
};

/** A deterministic plan from this learner's recorded activity. No AI or inferred traits. */
export class StudyPlanService {
  private readonly store: Store;
  private readonly tutorials: TutorialService;
  constructor(store: Store, tutorials: TutorialService) { this.store = store; this.tutorials = tutorials; }
  async plan(learnerId: string, lang: Lang, context?: { track: string; topic: string }) {
    const catalog = this.tutorials.allTopics(lang);
    if (context) this.tutorials.topic(context.track, context.topic, lang);
    const byKey = new Map(catalog.map((t) => [keyOf(t.track, t.topic), t]));
    const events = (await this.store.readingEvents(learnerId)).filter((e) => e.learnerId === learnerId && ['quiz', 'pre_check', 'post_check', 'view'].includes(e.type)).sort((a, b) => a.at.localeCompare(b.at));
    const seen = new Set<string>(), scores = new Map<string, ReadingEventRow>();
    const wrong = new Map<string, { event: ReadingEventRow; track: string; topic: string; id: string }>();
    let last: { track: string; topic: string } | null = null;
    for (const e of events) {
      const m = /^tutorial:([^:]+):(.+)$/.exec(e.lessonId);
      if (!m || !byKey.has(keyOf(m[1]!, m[2]!))) continue;
      const track = m[1]!, topic = m[2]!, key = keyOf(track, topic);
      last = { track, topic };
      if (e.type === 'view') seen.add(key);
      if (percentage(e) !== null) scores.set(key, e);
      if (e.type === 'quiz' && e.payload.correct && typeof e.payload.correct === 'object') {
        for (const [id, correct] of Object.entries(e.payload.correct)) {
          const qkey = `${key}:${id}`;
          if (correct === true) wrong.delete(qkey);
          else if (correct === false) wrong.set(qkey, { event: e, track, topic, id });
        }
      }
    }
    const anchor = context ?? last;
    let next: typeof catalog[number] | undefined;
    if (anchor) {
      const trackTopics = catalog.filter((t) => t.track === anchor.track);
      const at = trackTopics.findIndex((t) => t.topic === anchor.topic);
      next = trackTopics.slice(at + 1).find((t) => !seen.has(keyOf(t.track, t.topic)));
      if (!next && !context) next = trackTopics.find((t) => !seen.has(keyOf(t.track, t.topic)));
    }
    if (!next && !context) next = catalog.find((t) => !seen.has(keyOf(t.track, t.topic)));
    const L = lang === 'bn' ? {
      start: 'এটি তোমার জন্য প্রথম না-পড়া টপিক।',
      next: (title: string) => `${title}-এর পর কারিকুলামে এটি পরের না-পড়া টপিক।`,
      score: (p: number, title: string) => `${title}-এ তোমার নম্বর ছিল ${p}%।`,
      wrong: (title: string) => `${title}-এর এই প্রশ্নে আগেরবার ভুল হয়েছিল।`,
    } : {
      start: 'This is your first unopened topic.',
      next: (title: string) => `Continue after ${title} with the next unopened topic in that track.`,
      score: (p: number, title: string) => `You scored ${p}% on ${title}.`,
      wrong: (title: string) => `You answered this question incorrectly on ${title}.`,
    };
    const anchorInfo = anchor ? byKey.get(keyOf(anchor.track, anchor.topic)) : undefined;
    const review = [...wrong.values()].sort((a, b) => b.event.at.localeCompare(a.event.at)).flatMap((r) => {
      const topic = byKey.get(keyOf(r.track, r.topic))!;
      const question = this.tutorials.topic(r.track, r.topic, lang).quiz.find((q: any) => q.id === r.id);
      if (!question) return [];
      const score = percentage(scores.get(keyOf(r.track, r.topic)));
      return [{ track: r.track, topic: r.topic, title: topic.title, href: href(r.track, r.topic), reason: score === null ? L.wrong(topic.title) : L.score(score, topic.title), question }];
    }).slice(0, 3);
    return {
      next: next ? { track: next.track, topic: next.topic, title: next.title, href: href(next.track, next.topic), reason: anchorInfo && anchorInfo.track === next.track ? L.next(anchorInfo.title) : L.start } : null,
      review,
    };
  }
}
