import { randomUUID } from 'node:crypto';
import type { Store } from '../store/store.ts';
import type { TutorialService } from './tutorials.ts';
import type { Staff } from './classes.ts';
import { AppError } from './service.ts';
type Lang = 'en' | 'bn';
const bad = () => new AppError('bad_question', 400, 'Write a question and explanation in English and Bangla, four distinct options in each language, and a valid answer.');
const text = (v: unknown, max: number) => typeof v === 'string' && v.trim() && v.length <= max ? v.trim() : null;
export class QuestionBankService {
  private readonly store: Store;
  private readonly tutorials: TutorialService;
  constructor(store: Store, tutorials: TutorialService) { this.store = store; this.tutorials = tutorials; }
  private async owned(staff: Staff, id: string) {
    const d = await this.store.getDoc('bank_question', id);
    if (!d || staff.role !== 'admin' && d.data.ownerId !== staff.learnerId) throw new AppError('not_found', 404, 'No such question.');
    return d;
  }
  async list(staff: Staff) { return { questions: (await this.store.listDocs('bank_question')).filter((d) => staff.role === 'admin' || d.data.ownerId === staff.learnerId).map((d) => ({ id: d.id, ...d.data })) }; }
  async save(staff: Staff, body: any, id?: string) {
    const prev = id ? await this.owned(staff, id) : undefined;
    this.tutorials.topic(String(body?.track ?? ''), String(body?.topic ?? ''), 'en');
    for (const lang of ['en', 'bn']) {
      if (!text(body.prompt?.[lang], 2000) || !text(body.explanation?.[lang], 3000) || !Array.isArray(body.options?.[lang]) || body.options[lang].length !== 4 || body.options[lang].some((o: unknown) => !text(o, 500)) || new Set(body.options[lang].map((o: string) => o.trim())).size !== 4) throw bad();
    }
    if (!/[\u0980-\u09ff]/.test(body.prompt.bn) || !/[\u0980-\u09ff]/.test(body.explanation.bn) || !Number.isInteger(body.answer) || body.answer < 0 || body.answer > 3) throw bad();
    const qid = id ?? randomUUID(), at = new Date().toISOString();
    const data = { ownerId: prev?.data.ownerId ?? staff.learnerId, track: body.track, topic: body.topic, prompt: { en: body.prompt.en.trim(), bn: body.prompt.bn.trim() }, options: { en: body.options.en.map((v: string) => v.trim()), bn: body.options.bn.map((v: string) => v.trim()) }, answer: body.answer, explanation: { en: body.explanation.en.trim(), bn: body.explanation.bn.trim() }, status: body.status === 'approved' ? 'approved' : 'draft', createdAt: prev?.data.createdAt ?? at };
    await this.store.putDoc({ kind: 'bank_question', id: qid, data, updatedAt: at });
    return { id: qid, ...data };
  }
  async delete(staff: Staff, id: string) { await this.owned(staff, id); await this.store.deleteDoc('bank_question', id); return { ok: true }; }

  /** Assignment snapshots keep later bank edits from changing an assigned answer key. */
  async prepare(staff: Staff, classId: string, assignmentId: string, item: any) {
    const ids = item.questionIds;
    if (!Array.isArray(ids) || !ids.length || ids.length > 20 || new Set(ids).size !== ids.length) throw bad();
    const questions = [];
    for (const id of ids) {
      const q = await this.owned(staff, String(id));
      if (q.data.status !== 'approved' || q.data.track !== item.track || q.data.topic !== item.topic) throw new AppError('unapproved_question', 400, 'Select approved questions tagged to this topic.');
      questions.push({ id: q.id, ...q.data });
    }
    const quizId = randomUUID();
    await this.store.putDoc({ kind: 'custom_quiz', id: quizId, data: { classId, assignmentId, track: item.track, topic: item.topic, questions }, updatedAt: new Date().toISOString() });
    return { kind: 'custom_quiz', track: item.track, topic: item.topic, quizId };
  }
  private async available(learnerId: string, id: string) {
    const d = await this.store.getDoc('custom_quiz', id);
    if (!d) throw new AppError('not_found', 404, 'No such quiz.');
    const [c, e, a] = await Promise.all([this.store.getDoc('class', d.data.classId), this.store.getDoc('enrol', `${d.data.classId}:${learnerId}`), this.store.getDoc('assignment', d.data.assignmentId)]);
    if (!c || c.data.archived || e?.data.status !== 'active' || e.data.learnerId !== learnerId || a?.data.classId !== c.id || !a.data.items.some((it: any) => it.kind === 'custom_quiz' && it.quizId === id)) throw new AppError('not_found', 404, 'No such quiz.');
    return { d, title: a.data.title };
  }
  async quiz(learnerId: string, id: string, lang: Lang) {
    const { d, title } = await this.available(learnerId, id);
    return { id, title, track: d.data.track, topic: d.data.topic, questions: d.data.questions.map((q: any) => ({ id: q.id, prompt: q.prompt[lang], options: q.options[lang] })) };
  }
  async grade(learnerId: string, id: string, answers: any, lang: Lang) {
    const { d } = await this.available(learnerId, id);
    const results: Record<string, unknown> = {}, correct: Record<string, boolean> = {}; let score = 0;
    for (const q of d.data.questions) {
      const choice = answers?.[q.id];
      if (!Number.isInteger(choice) || choice < 0 || choice > 3) throw new AppError('bad_input', 400, lang === 'bn' ? 'সব প্রশ্নের উত্তর দাও।' : 'Answer every question.');
      correct[q.id] = choice === q.answer; if (correct[q.id]) score++;
      results[q.id] = { correct: correct[q.id], answer: q.answer, explanation: q.explanation[lang] };
    }
    const total = d.data.questions.length;
    await this.store.addReadingEvents([{ id: randomUUID(), learnerId, lessonId: `tutorial:${d.data.track}:${d.data.topic}`, blockId: `custom_quiz:${id}`, type: 'quiz', payload: { customQuiz: id, assignmentId: d.data.assignmentId, score, total, correct }, at: new Date().toISOString() }]);
    return { score, total, results };
  }
}
