// Per-video extras written by the course instructor: materials used in the
// video, a short quiz, and a "Try now" button that opens an online compiler.
// Quiz answers never leave the server until the learner submits.

import { randomUUID } from 'node:crypto';
import type { Store, VideoExtrasRow } from '../store/store.ts';
import { AppError } from './service.ts';
import { getVideo } from '../content/videos.ts';
import { SEED_EXTRAS } from '../content/video-extras-seed.ts';

export const LANGUAGES = {
  c: { label: 'C', url: 'https://www.programiz.com/c-programming/online-compiler/', starter: '#include <stdio.h>\n\nint main(void) {\n    printf("Hello, Loop & Logic!\\n");\n    return 0;\n}\n' },
  cpp: { label: 'C++', url: 'https://www.programiz.com/cpp-programming/online-compiler/', starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, Loop & Logic!" << endl;\n    return 0;\n}\n' },
  python: { label: 'Python', url: 'https://www.programiz.com/python-programming/online-compiler/', starter: 'print("Hello, Loop & Logic!")\n' },
  java: { label: 'Java', url: 'https://www.programiz.com/java-programming/online-compiler/', starter: 'class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Loop & Logic!");\n    }\n}\n' },
} as const;
export type Language = keyof typeof LANGUAGES;
const isLanguage = (v: unknown): v is Language => typeof v === 'string' && v in LANGUAGES;

/** Courses where every video gets "Try now" unless the instructor turns it off. */
export const COURSE_TRY_NOW: Record<string, Language> = {
  'c-programming': 'c',
  'problem-solving': 'c',
  'data-structures': 'c',
  'algorithms': 'c',
};

export interface Material { id: string; title: string; url: string | null; code: string | null }
export interface QuizQuestion { id: string; prompt: string; options: string[]; answer: number; explanation: string }
export interface TryNow { mode: 'default' | 'on' | 'off'; language: Language; code: string }
export interface VideoExtras { materials: Material[]; quiz: QuizQuestion[]; tryNow: TryNow }

export const LIMITS = { materials: 20, questions: 20, options: 6, title: 200, prompt: 1000, option: 300, explanation: 1500, code: 10000, url: 2000 };

const empty = (): VideoExtras => ({ materials: [], quiz: [], tryNow: { mode: 'default', language: 'c', code: '' } });

function text(v: unknown, max: number, what: string, required = false): string {
  const s = typeof v === 'string' ? v.replace(/\r\n/g, '\n').trim() : '';
  if (required && !s) throw new AppError('bad_extras', 400, `${what} is empty`);
  if (s.length > max) throw new AppError('bad_extras', 400, `${what} is longer than ${max} characters`);
  return s;
}
const idOf = (v: unknown) => (typeof v === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(v) ? v : randomUUID().slice(0, 8));

/** Checks and cleans what the instructor sent. Throws a readable 400 on anything wrong. */
export function cleanExtras(raw: unknown): VideoExtras {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const mats = Array.isArray(r.materials) ? r.materials : [];
  const quiz = Array.isArray(r.quiz) ? r.quiz : [];
  if (mats.length > LIMITS.materials) throw new AppError('bad_extras', 400, `At most ${LIMITS.materials} materials per video`);
  if (quiz.length > LIMITS.questions) throw new AppError('bad_extras', 400, `At most ${LIMITS.questions} quiz questions per video`);

  const materials = mats.map((m, i): Material => {
    const o = (m ?? {}) as Record<string, unknown>;
    const n = `Material ${i + 1}`;
    const title = text(o.title, LIMITS.title, `${n} title`, true);
    const url = text(o.url, LIMITS.url, `${n} link`);
    const code = text(o.code, LIMITS.code, `${n} code`);
    if (url && !/^https?:\/\/[^\s]+$/i.test(url)) throw new AppError('bad_extras', 400, `${n} link must start with http:// or https://`);
    if (!url && !code) throw new AppError('bad_extras', 400, `${n} needs a link or some code/notes`);
    return { id: idOf(o.id), title, url: url || null, code: code || null };
  });

  const ids = new Set<string>();
  const questions = quiz.map((q, i): QuizQuestion => {
    const o = (q ?? {}) as Record<string, unknown>;
    const n = `Question ${i + 1}`;
    const prompt = text(o.prompt, LIMITS.prompt, n, true);
    const options = (Array.isArray(o.options) ? o.options : []).map((x, j) => text(x, LIMITS.option, `${n} option ${j + 1}`)).filter(Boolean);
    if (options.length < 2) throw new AppError('bad_extras', 400, `${n} needs at least 2 options`);
    if (options.length > LIMITS.options) throw new AppError('bad_extras', 400, `${n} can have at most ${LIMITS.options} options`);
    const answer = Number(o.answer);
    if (!Number.isInteger(answer) || answer < 0 || answer >= options.length) throw new AppError('bad_extras', 400, `${n}: choose which option is correct`);
    let id = idOf(o.id);
    while (ids.has(id)) id = randomUUID().slice(0, 8);
    ids.add(id);
    return { id, prompt, options, answer, explanation: text(o.explanation, LIMITS.explanation, `${n} explanation`) };
  });

  const t = (r.tryNow ?? {}) as Record<string, unknown>;
  const mode = t.mode === 'on' || t.mode === 'off' ? t.mode : 'default';
  const tryNow: TryNow = { mode, language: isLanguage(t.language) ? t.language : 'c', code: text(t.code, LIMITS.code, 'Try now starter code') };
  return { materials, quiz: questions, tryNow };
}

function fromRow(data: Record<string, unknown> | undefined): VideoExtras {
  if (!data) return empty();
  try {
    return cleanExtras(data);
  } catch {
    return empty(); // never let one bad stored row break the player
  }
}

/** What "Try now" does for this video in this course, or null if it is not offered. */
export function resolveTryNow(courseId: string, t: TryNow) {
  const fallback = COURSE_TRY_NOW[courseId];
  if (t.mode === 'off' || (t.mode === 'default' && !fallback)) return null;
  const language: Language = t.mode === 'on' ? t.language : fallback!;
  const info = LANGUAGES[language];
  return { language, label: info.label, url: info.url, code: t.code || info.starter, starter: !t.code };
}

export class VideoExtrasService {
  private readonly store: Store;
  constructor(store: Store) {
    this.store = store;
  }

  /** Saved extras win over the repo seed for that video. */
  async get(videoId: string): Promise<{ extras: VideoExtras; updatedAt: string | null; source: 'saved' | 'seed' | 'none' }> {
    const row = await this.store.getVideoExtras(videoId);
    if (row) return { extras: fromRow(row.data), updatedAt: row.updatedAt, source: 'saved' };
    const seed = SEED_EXTRAS[videoId];
    if (seed) return { extras: fromRow(seed as Record<string, unknown>), updatedAt: null, source: 'seed' };
    return { extras: empty(), updatedAt: null, source: 'none' };
  }

  /** Which videos have materials or a quiz (for the ✎ / ? marks in the video list). */
  async summary(): Promise<Map<string, { materials: number; quiz: number }>> {
    const out = new Map<string, { materials: number; quiz: number }>();
    for (const [id, data] of Object.entries(SEED_EXTRAS)) {
      const e = fromRow(data as Record<string, unknown>);
      out.set(id, { materials: e.materials.length, quiz: e.quiz.length });
    }
    for (const row of await this.store.listVideoExtras()) {
      const e = fromRow(row.data);
      out.set(row.videoId, { materials: e.materials.length, quiz: e.quiz.length });
    }
    return out;
  }

  /** Learner view: no quiz answers, plus this learner's last quiz result. */
  async forLearner(courseId: string, videoId: string, learnerId: string) {
    const { extras } = await this.get(videoId);
    const last = (await this.store.readingEvents(learnerId)).filter((e) => e.type === 'video_quiz' && e.blockId === videoId).at(-1);
    return {
      materials: extras.materials,
      quiz: extras.quiz.map((q) => ({ id: q.id, prompt: q.prompt, options: q.options })),
      lastQuiz: last ? { score: Number(last.payload.score), total: Number(last.payload.total), at: last.at } : null,
      tryNow: resolveTryNow(courseId, extras.tryNow),
    };
  }

  async gradeQuiz(courseId: string, videoId: string, learnerId: string, answers: unknown) {
    const { extras } = await this.get(videoId);
    if (!extras.quiz.length) throw new AppError('no_quiz', 404, 'This video has no quiz yet');
    const given = (answers && typeof answers === 'object' ? answers : {}) as Record<string, unknown>;
    const results = extras.quiz.map((q) => {
      const raw = given[q.id];
      const chosen = Number.isInteger(raw) && (raw as number) >= 0 && (raw as number) < q.options.length ? (raw as number) : null;
      return { id: q.id, chosen, correct: chosen === q.answer, answer: q.answer, explanation: q.explanation };
    });
    const score = results.filter((r) => r.correct).length;
    await this.store.addReadingEvents([{
      id: randomUUID(), learnerId, lessonId: `course:${courseId}`, blockId: videoId, type: 'video_quiz',
      payload: { score, total: results.length, answers: Object.fromEntries(results.map((r) => [r.id, r.chosen])) }, at: new Date().toISOString(),
    }]);
    return { score, total: results.length, results };
  }

  /** Instructor view: everything, including answers. */
  async forEditor(videoId: string) {
    if (!getVideo(videoId)) throw new AppError('not_found', 404, 'Video not found');
    const { extras, updatedAt, source } = await this.get(videoId);
    return { videoId, title: getVideo(videoId)!.title, extras, updatedAt, source, languages: Object.entries(LANGUAGES).map(([id, l]) => ({ id, label: l.label })) };
  }

  async save(videoId: string, raw: unknown) {
    if (!getVideo(videoId)) throw new AppError('not_found', 404, 'Video not found');
    const extras = cleanExtras(raw);
    const row: VideoExtrasRow = { videoId, data: extras as unknown as Record<string, unknown>, updatedAt: new Date().toISOString() };
    await this.store.saveVideoExtras(row);
    return { videoId, extras, updatedAt: row.updatedAt, source: 'saved' as const };
  }

  /** All extras (seed merged with saved), ready to paste into video-extras-seed.ts. */
  async exportAll() {
    const out: Record<string, VideoExtras> = {};
    for (const [id, data] of Object.entries(SEED_EXTRAS)) out[id] = fromRow(data as Record<string, unknown>);
    for (const row of await this.store.listVideoExtras()) out[row.videoId] = fromRow(row.data);
    return { exportedAt: new Date().toISOString(), videos: out };
  }
}
