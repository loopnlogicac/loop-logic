import { randomUUID } from 'node:crypto';
import type { Store, ReadingEventRow } from '../store/store.ts';
import type { TutorialService } from './tutorials.ts';
import { AppError } from './service.ts';

type Lang = 'en' | 'bn';
const LEVELS = ['easy', 'medium', 'hard'];
type Answer = { id: string; choice: number; difficulty: string; correct: boolean; answer: number; explanation: string };
type Run = { id: string; current: string | null; answers: Answer[]; path: string[]; pending?: ReadingEventRow };
export class AdaptiveQuizService {
  private readonly store: Store;
  private readonly tutorials: TutorialService;
  private readonly locks = new Map<string, Promise<unknown>>();
  constructor(store: Store, tutorials: TutorialService) { this.store = store; this.tutorials = tutorials; }
  private key(learner: string, track: string, topic: string) { return `${learner}:tutorial:${track}:${topic}`; }
  private async locked<T>(key: string, fn: () => Promise<T>) {
    const pending = (this.locks.get(key) ?? Promise.resolve()).catch(() => {}).then(fn); this.locks.set(key, pending);
    try { return await pending; } finally { if (this.locks.get(key) === pending) this.locks.delete(key); }
  }
  private quiz(track: string, topic: string, lang: Lang) { return this.tutorials.topic(track, topic, lang).quiz; }
  private level(q: any) { return LEVELS.includes(q.difficulty) ? q.difficulty : 'medium'; }
  private pick(quiz: any[], answered: Answer[], target: number) {
    const used = new Set(answered.map((a) => a.id));
    return quiz.filter((q) => !used.has(q.id)).sort((a, b) => Math.abs(LEVELS.indexOf(this.level(a)) - target) - Math.abs(LEVELS.indexOf(this.level(b)) - target))[0] ?? null;
  }
  private view(run: Run, quiz: any[], feedback?: Answer) {
    const current = quiz.find((q) => q.id === run.current);
    return { runId: run.id, question: current ? { ...current, difficulty: this.level(current) } : null, done: !run.current, score: run.answers.filter((a) => a.correct).length, answered: run.answers.length, total: quiz.length, difficultyPath: run.path, feedback: feedback ? { ...feedback } : null };
  }
  private async save(key: string, run: Run) { await this.store.putDoc({ kind: 'adaptive_quiz', id: key, data: run, updatedAt: new Date().toISOString() }); }
  private async flush(key: string, run: Run) {
    if (!run.pending) return;
    if (!(await this.store.readingEvents(run.pending.learnerId)).some((e) => e.id === run.pending!.id)) await this.store.addReadingEvents([run.pending]);
    delete run.pending; await this.save(key, run);
  }
  async start(learner: string, track: string, topic: string, lang: Lang) {
    const key = this.key(learner, track, topic);
    return this.locked(key, async () => {
      const quiz = this.quiz(track, topic, lang);
      if (!quiz.length) throw new AppError('not_found', 404, lang === 'bn' ? 'এই টপিকে এখনো কুইজ নেই।' : 'No quiz available.');
      let run = (await this.store.getDoc('adaptive_quiz', key))?.data as Run | undefined;
      if (run) await this.flush(key, run);
      if (!run || !run.current) { const first = this.pick(quiz, [], 1)!; run = { id: randomUUID(), current: first.id, answers: [], path: [] }; await this.save(key, run); }
      return this.view(run, quiz);
    });
  }
  async answer(learner: string, track: string, topic: string, body: any, lang: Lang) {
    const key = this.key(learner, track, topic);
    return this.locked(key, async () => {
      const quiz = this.quiz(track, topic, lang);
      const run = (await this.store.getDoc('adaptive_quiz', key))?.data as Run | undefined;
      if (!run || run.id !== body?.runId) throw new AppError('not_found', 404, lang === 'bn' ? 'মানিয়ে নেওয়া কুইজটা আবার শুরু করো।' : 'Start adaptive mode again.');
      await this.flush(key, run);
      const prior = run.answers.find((a) => a.id === body.questionId);
      if (prior) return this.view(run, quiz, prior);
      if (body.questionId !== run.current || !run.current) throw new AppError('stale_question', 409, lang === 'bn' ? 'বর্তমান প্রশ্নের উত্তর দাও।' : 'Answer the current question.');
      const q = quiz.find((q: any) => q.id === run.current);
      if (!q) throw new AppError('not_found', 404, lang === 'bn' ? 'এই প্রশ্নটা আর নেই।' : 'This question is no longer available.');
      const graded = this.tutorials.gradeAnswer(track, topic, q.id, body.choice, lang);
      const a = { id: q.id, choice: body.choice, difficulty: this.level(q), ...graded };
      run.answers.push(a); run.path.push(a.difficulty);
      const target = Math.max(0, Math.min(2, LEVELS.indexOf(a.difficulty) + (a.correct ? 1 : -1)));
      run.current = this.pick(quiz, run.answers, target)?.id ?? null;
      run.pending = { id: randomUUID(), learnerId: learner, lessonId: `tutorial:${track}:${topic}`, blockId: null, type: 'quiz', payload: { adaptive: true, runId: run.id, score: run.answers.filter((a) => a.correct).length, total: quiz.length, answered: run.answers.length, correct: Object.fromEntries(run.answers.map((a) => [a.id, a.correct])), difficultyPath: [...run.path], complete: !run.current }, at: new Date().toISOString() };
      await this.save(key, run); await this.flush(key, run);
      return this.view(run, quiz, a);
    });
  }
}
