// Labs: serve the lab for a lesson and check the learner's results.
// Check answers stay on the server; options are shown in a shuffled order.

import { randomUUID } from 'node:crypto';
import type { Store } from '../store/store.ts';
import { AppError } from './service.ts';
import { getLesson } from '../content/lessons.ts';
import { getLab, LABS, type Lab } from '../content/labs.ts';
import { courseForLesson } from '../content/courses.ts';
import { optionOrder } from '../core/options.ts';
import type { Lang } from '../content/pricing-pack.ts';

export const labCheckOrder = (lessonId: string, checkId: string, count: number) => optionOrder(`lab:${lessonId}:${checkId}`, count);

export interface LabProgress {
  checksTotal: number;
  checksCorrect: number;
  done: boolean;
  correctIds: string[];
}

export function labProgress(lab: Lab, events: { lessonId: string; type: string; payload: Record<string, unknown> }[]): LabProgress {
  const correctIds = lab.checks
    .map((c) => c.id)
    .filter((id) => events.some((e) => e.lessonId === lab.lessonId && e.type === 'lab_check' && e.payload.checkId === id && e.payload.correct === true));
  return { checksTotal: lab.checks.length, checksCorrect: correctIds.length, done: correctIds.length === lab.checks.length, correctIds };
}

export class LabService {
  private readonly store: Store;
  constructor(store: Store) {
    this.store = store;
  }

  private labOr404(lessonId: string): Lab {
    const lab = getLab(lessonId);
    if (!lab || !getLesson(lessonId)) throw new AppError('not_found', 404, 'Lab not found');
    return lab;
  }

  list(lang: Lang) {
    return LABS.map((l) => ({ lessonId: l.lessonId, title: l.title[lang], minutes: l.minutes, kind: l.kind }));
  }

  async get(lessonId: string, learnerId: string, lang: Lang) {
    const lab = this.labOr404(lessonId);
    const lesson = getLesson(lessonId)!;
    const course = courseForLesson(lessonId);
    const progress = labProgress(lab, await this.store.readingEvents(learnerId));
    return {
      lessonId,
      lessonTitle: lesson.title[lang],
      course: course ? { id: course.id, title: course.title[lang] } : null,
      videos: (lesson.videos ?? []).map((v) => ({ ...v, url: `https://www.youtube.com/watch?v=${encodeURIComponent(v.id)}` })),
      title: lab.title[lang],
      goal: lab.goal[lang],
      minutes: lab.minutes,
      kind: lab.kind,
      tools: lab.tools.map((t) => ({ name: t.name, url: t.url, kind: t.kind, note: t.note[lang] })),
      setup: lab.setup.map((s) => s[lang]),
      starter: lab.starter ? { language: lab.starter.language, filename: lab.starter.filename, code: lab.starter.code, note: lab.starter.note[lang] } : null,
      tasks: lab.tasks.map((t) => t[lang]),
      expected: lab.expected ? { caption: lab.expected.caption[lang], output: lab.expected.output } : null,
      checks: lab.checks.map((c) => ({
        id: c.id,
        question: c.question[lang],
        options: labCheckOrder(lessonId, c.id, c.options.length).map((i) => c.options[i]![lang]),
        done: progress.correctIds.includes(c.id),
      })),
      troubleshooting: lab.troubleshooting.map((t) => ({ problem: t.problem[lang], fix: t.fix[lang] })),
      extension: lab.extension[lang],
      progress: { checksTotal: progress.checksTotal, checksCorrect: progress.checksCorrect, done: progress.done },
    };
  }

  async check(lessonId: string, learnerId: string, input: { checkId: unknown; choice: unknown; lang: Lang }) {
    const lab = this.labOr404(lessonId);
    const check = lab.checks.find((c) => c.id === input.checkId);
    if (!check) throw new AppError('bad_check', 400, 'Unknown check');
    const choice = Number(input.choice);
    if (!Number.isInteger(choice) || choice < 0 || choice >= check.options.length) throw new AppError('bad_choice', 400, 'Unknown option');
    const order = labCheckOrder(lessonId, check.id, check.options.length);
    const correct = order[choice] === 0; // the first authored option is the correct one
    await this.store.addReadingEvents([{ id: randomUUID(), learnerId, lessonId, blockId: null, type: 'lab_check', payload: { checkId: check.id, correct }, at: new Date().toISOString() }]);
    const progress = labProgress(lab, await this.store.readingEvents(learnerId));
    return {
      correct,
      // The explanation is given only for a correct answer, so a wrong try does not reveal it.
      explanation: correct ? check.explanation[input.lang] : null,
      progress: { checksTotal: progress.checksTotal, checksCorrect: progress.checksCorrect, done: progress.done },
    };
  }
}
