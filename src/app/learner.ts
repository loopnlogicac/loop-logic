// Learner-facing summaries: catalog, dashboard, "what the system learned",
// data export and learner-requested resets. Read-only over the stores,
// except the explicit reset actions.

import type { Store } from '../store/store.ts';
import type { ReadingService } from '../reading/service.ts';
import type { LearningService } from './service.ts';
import { AppError } from './service.ts';
import { LESSONS, getLesson } from '../content/lessons.ts';
import { CONCEPTS, type Lang, type Bi } from '../content/pricing-pack.ts';
import { GLOSSARY } from '../content/library.ts';
import { CONCEPT_NAMES } from '../content/library-more.ts';
import { SUBJECT_LABELS } from '../content/subjects.ts';
import { getLab } from '../content/labs.ts';
import { labProgress } from './labs.ts';
import { CHANNEL, COURSES, SUBJECTS, getCourse, courseForLesson, playlistUrl, type Course } from '../content/courses.ts';

const DIAGNOSIS_NAMES: Record<string, Bi> = {
  ai_over_reliance: { en: 'Followed the AI without checking', bn: 'যাচাই না করে এআই-এর কথা মেনেছ' },
  margin_markup_confusion: { en: 'Mixed up markup and margin', bn: 'মার্কআপ আর মার্জিন গুলিয়েছ' },
  missed_constraint: { en: 'Missed the shop’s rule', bn: 'দোকানের নিয়ম খেয়াল করোনি' },
  arithmetic_slip: { en: 'Small arithmetic slip', bn: 'হিসাবের ছোট ভুল' },
  correct: { en: 'Correct', bn: 'সঠিক' },
  uncertain: { en: 'Unclear', bn: 'অস্পষ্ট' },
};

export function conceptName(id: string): Bi {
  const c = (CONCEPTS as Record<string, { name: Bi }>)[id];
  if (c) return c.name;
  if (CONCEPT_NAMES[id]) return CONCEPT_NAMES[id]!;
  const g = GLOSSARY.find((x) => x.concept === id);
  return g ? g.term : { en: id.replace(/_/g, ' '), bn: id.replace(/_/g, ' ') };
}

const LEVEL_NAMES: Record<number, Bi> = {
  1: { en: 'Simpler', bn: 'সহজ' },
  2: { en: 'Standard', bn: 'সাধারণ' },
  3: { en: 'Deeper', bn: 'গভীর' },
};
const SUBJECT_NAMES: Record<string, Bi> = SUBJECT_LABELS;
const PRESET_NAMES: Record<string, Bi> = { light: { en: 'Light', bn: 'আলো' }, sepia: { en: 'Sepia', bn: 'সেপিয়া' }, dark: { en: 'Dark', bn: 'অন্ধকার' }, contrast: { en: 'High contrast', bn: 'উচ্চ কনট্রাস্ট' } };

export class LearnerService {
  private readonly store: Store;
  private readonly reading: ReadingService;
  private readonly learning: LearningService;
  constructor(store: Store, reading: ReadingService, learning: LearningService) {
    this.store = store;
    this.reading = reading;
    this.learning = learning;
  }

  // ── catalog ───────────────────────────────────────────────────────────

  private courseCard(c: Course, lang: Lang) {
    return {
      id: c.id,
      code: c.code,
      subject: c.subject,
      subjectName: SUBJECTS[c.subject][lang],
      title: c.title[lang],
      blurb: c.blurb[lang],
      videos: c.playlists.reduce((n, p) => n + p.videos, 0),
      lessons: c.lessons.length,
      labs: c.lessons.filter((id) => getLab(id)).length,
      practice: c.practice,
      lessonIds: c.lessons,
      adaptive: c.lessons.length > 0,
    };
  }

  catalog(lang: Lang) {
    const courses = COURSES.map((c) => this.courseCard(c, lang));
    return {
      channel: CHANNEL,
      subjects: Object.entries(SUBJECTS).map(([id, name]) => ({ id, name: name[lang], count: courses.filter((c) => c.subject === id).length })).filter((s) => s.count > 0),
      courses,
    };
  }

  async course(id: string, learnerId: string, lang: Lang) {
    const c = getCourse(id);
    if (!c) throw new AppError('not_found', 404, 'Course not found');
    const progress = await this.lessonProgress(learnerId);
    return {
      ...this.courseCard(c, lang),
      playlists: c.playlists.map((p) => ({ ...p, url: playlistUrl(p.id) })),
      lessonList: c.lessons.map((lid) => {
        const l = getLesson(lid)!;
        const lab = getLab(l.id);
        return {
          id: l.id, title: l.title[lang], summary: l.summary[lang],
          videos: (l.videos ?? []).length,
          lab: lab ? { title: lab.title[lang], minutes: lab.minutes, kind: lab.kind } : null,
          ...progress.get(l.id) ?? emptyProgress(l.id),
        };
      }),
    };
  }

  // ── progress ──────────────────────────────────────────────────────────

  private async lessonProgress(learnerId: string) {
    const events = await this.store.readingEvents(learnerId);
    const out = new Map<string, ReturnType<typeof emptyProgress>>();
    for (const l of LESSONS) {
      const mine = events.filter((e) => e.lessonId === l.id);
      const countable = l.blocks.filter((b) => b.type !== 'heading').map((b) => b.id);
      const seen = new Set(mine.filter((e) => e.blockId && ['active_time', 'help', 'quiz', 'scroll_back', 'feedback'].includes(e.type)).map((e) => e.blockId!));
      const quizzes = mine.filter((e) => e.type === 'quiz');
      const quizBlocks = new Set(l.blocks.filter((b) => b.quiz).map((b) => b.id));
      const correctBlocks = new Set(quizzes.filter((e) => e.payload.correct === true).map((e) => e.blockId));
      const lab = getLab(l.id);
      const lp = lab ? labProgress(lab, mine) : null;
      out.set(l.id, {
        ...emptyProgress(l.id),
        started: mine.length > 0,
        percent: countable.length ? Math.round((countable.filter((id) => seen.has(id)).length / countable.length) * 100) : 0,
        quizzesTotal: quizBlocks.size,
        quizzesCorrect: [...quizBlocks].filter((b) => correctBlocks.has(b)).length,
        helpRequests: mine.filter((e) => e.type === 'help').length,
        hasLab: Boolean(lab),
        labChecksTotal: lp?.checksTotal ?? 0,
        labChecksCorrect: lp?.checksCorrect ?? 0,
        labDone: lp?.done ?? false,
        lastAt: mine.at(-1)?.at ?? null,
      });
    }
    return out;
  }

  private async practiceSummary(learnerId: string, lang: Lang) {
    const sessions = (await this.store.listSessions(learnerId)).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    const latest = sessions[0];
    const completed = sessions.filter((s) => s.phase === 'complete');
    const receipts = [];
    for (const s of completed.slice(0, 5)) {
      const r = await this.learning.receipt(s.id, learnerId);
      receipts.push({
        sessionId: s.id,
        at: s.updatedAt,
        shown: r.receipt.demonstratedIndependently.map((x) => x.text[lang]),
        notYet: r.receipt.stillUncertain.map((x) => x.text[lang]),
        withHelp: r.receipt.completedWithHelp.map((x) => x.text[lang]),
      });
    }
    const all = sessions.flatMap((s) => s.history);
    const mistakes = new Map<string, number>();
    for (const h of all) if (!h.correct) mistakes.set(h.diagnosis, (mistakes.get(h.diagnosis) ?? 0) + 1);
    return {
      latest: latest
        ? {
            sessionId: latest.id,
            phase: latest.phase,
            attempts: latest.history.length,
            correct: latest.history.filter((h) => h.correct).length,
            independent: latest.history.filter((h) => h.correct && !h.assisted).length,
            readyForTransfer: latest.readyForTransfer,
            updatedAt: latest.updatedAt,
          }
        : null,
      totals: { sessions: sessions.length, attempts: all.length, correct: all.filter((h) => h.correct).length, completed: completed.length },
      commonMistakes: [...mistakes.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([code, n]) => ({ code, name: (DIAGNOSIS_NAMES[code] ?? { en: code, bn: code })[lang], count: n })),
      receipts,
    };
  }

  async dashboard(learnerId: string, lang: Lang) {
    const [progress, practice, profile] = await Promise.all([this.lessonProgress(learnerId), this.practiceSummary(learnerId, lang), this.reading.profile(learnerId)]);
    const lessons = LESSONS.map((l) => {
      const c = courseForLesson(l.id);
      return { id: l.id, title: l.title[lang], summary: l.summary[lang], subject: l.subject, courseId: c?.id ?? null, courseTitle: c?.title[lang] ?? null, ...progress.get(l.id)! };
    });
    const started = lessons.filter((l) => l.started).sort((a, b) => (b.lastAt ?? '').localeCompare(a.lastAt ?? ''));
    const cont = started.find((l) => l.percent < 100) ?? started[0] ?? null;
    const focus = profile.weakConcepts.map((id) => ({
      concept: id,
      name: conceptName(id)[lang],
      lessonId: LESSONS.find((l) => l.blocks.some((b) => b.concepts.includes(id)))?.id ?? null,
    }));
    return {
      isNew: started.length === 0 && practice.totals.sessions === 0,
      continueReading: cont,
      lessons,
      practice,
      focus,
      stats: {
        lessonsStarted: started.length,
        helpRequests: lessons.reduce((n, l) => n + l.helpRequests, 0),
        quizzesCorrect: lessons.reduce((n, l) => n + l.quizzesCorrect, 0),
        quizzesTotal: lessons.reduce((n, l) => n + l.quizzesTotal, 0),
        labsDone: lessons.filter((l) => l.labDone).length,
        labsTotal: lessons.filter((l) => l.hasLab).length,
      },
    };
  }

  // ── profile: what the system learned ─────────────────────────────────

  async profileView(learnerId: string, lang: Lang) {
    const [p, events, sessions] = await Promise.all([this.reading.profile(learnerId), this.store.readingEvents(learnerId), this.store.listSessions(learnerId)]);
    return {
      enabled: p.enabled,
      rulesVersion: p.version,
      levels: (Object.keys(p.level) as (keyof typeof p.level)[]).map((s) => ({ subject: s, name: SUBJECT_NAMES[s]![lang], level: p.level[s], levelName: LEVEL_NAMES[p.level[s]]![lang], termHelp: p.termHelp[s] })),
      detail: p.detail,
      display: { ...p.display, presetName: PRESET_NAMES[p.display.preset]![lang] },
      weakConcepts: p.weakConcepts.map((c) => conceptName(c)[lang]),
      knownConcepts: p.knownConcepts.map((c) => conceptName(c)[lang]),
      reasons: p.reasons.slice().reverse().map((r) => ({ rule: r.rule, text: r.text[lang], at: r.at })),
      data: { readingEvents: events.length, practiceSessions: sessions.length, practiceAttempts: sessions.reduce((n, s) => n + s.history.length, 0) },
    };
  }

  async exportData(learnerId: string) {
    const [profile, readingEvents, sessions] = await Promise.all([this.store.getProfile(learnerId), this.store.readingEvents(learnerId), this.store.listSessions(learnerId)]);
    const practice = [];
    for (const s of sessions) {
      practice.push({ sessionId: s.id, phase: s.phase, createdAt: s.createdAt, attempts: s.history.map((h) => ({ kind: h.kind, correct: h.correct, assisted: h.assisted, diagnosis: h.diagnosis })), events: (await this.store.events(s.id)).map((e) => ({ type: e.type, at: e.at })) });
    }
    return { exportedAt: new Date().toISOString(), learnerId, readingProfile: profile ?? null, readingEvents, practice };
  }

  async reset(learnerId: string, scope: unknown) {
    if (scope !== 'reading' && scope !== 'practice' && scope !== 'all') throw new AppError('bad_scope', 400, 'scope must be reading, practice or all');
    const sessions = await this.store.listSessions(learnerId);
    if (sessions.some((s) => s.phase === 'assessment') && scope !== 'reading') throw new AppError('assessment_open', 423, 'Finish or abandon the sealed check before deleting practice history.');
    if (scope === 'reading' || scope === 'all') await this.store.deleteReading(learnerId);
    if (scope === 'practice' || scope === 'all') for (const s of sessions) await this.store.deleteSession(s.id);
    return { ok: true, scope };
  }
}

function emptyProgress(lessonId: string) {
  return { lessonId, started: false, percent: 0, quizzesTotal: 0, quizzesCorrect: 0, helpRequests: 0, hasLab: false, labChecksTotal: 0, labChecksCorrect: 0, labDone: false, lastAt: null as string | null };
}
