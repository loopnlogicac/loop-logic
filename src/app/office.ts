// Virtual Office: runs the scripted internship projects in src/content/office.ts.
// The browser only ever sees the steps already reached and the current task's
// options; scores, the "right" options and feedback stay on the server until the
// intern answers. Progress lives in the generic docs table (kind 'office_run').

import { AppError } from './service.ts';
import type { Store } from '../store/store.ts';
import { PROJECTS, getProject, ROLES, SKILLS, type Bi, type Msg, type Option, type Project, type Skill, type Step } from '../content/office.ts';

type Lang = 'en' | 'bn';
type Verdict = 'best' | 'partial' | 'poor';
interface Run {
  learnerId: string;
  projectId: string;
  answers: Record<string, string[]>;
  startedAt: string;
  completedAt: string | null;
  attempts: number;
  /** Best finished attempt: overall percent and per-skill percents. */
  best: { overall: number; skills: Partial<Record<Skill, number>>; at: string } | null;
}
export interface OfficeAccess {
  /** Premium projects are open to this learner. */
  unlocked: boolean;
  /** The premium course that includes the Virtual Office, if the admin has set one up. */
  course: { id: string; price: number | null } | null;
}

const t = (b: Bi, lang: Lang) => b[lang] || b.en;
const SKILL_ORDER: Skill[] = ['clarify', 'conflict', 'verify', 'quality', 'communicate'];

/** Points an answer earns per skill, out of 2 per skill the step trains. */
export function gradeStep(step: Step, picked: string[]): { points: Partial<Record<Skill, number>>; verdict: Verdict } {
  const points: Partial<Record<Skill, number>> = {};
  if (step.kind === 'choose') {
    const o = step.options.find((x) => x.id === picked[0]);
    for (const s of step.skills) points[s] = o?.score?.[s] ?? 0;
  } else {
    const correct = step.options.filter((o) => o.correct).map((o) => o.id);
    const hits = picked.filter((id) => correct.includes(id)).length;
    const wrong = picked.filter((id) => !correct.includes(id)).length;
    // A false alarm costs half a finding: careful reviewers are rewarded, guessing everything is not.
    const p = Math.max(0, hits - 0.5 * wrong) / Math.max(1, correct.length) * 2;
    for (const s of step.skills) points[s] = Math.round(p * 100) / 100;
  }
  const got = step.skills.reduce((n, s) => n + (points[s] ?? 0), 0);
  const max = step.skills.length * 2;
  return { points, verdict: got >= max ? 'best' : got > 0 ? 'partial' : 'poor' };
}

/** The best option of a choose step (highest total score). */
const bestOption = (step: Step) => [...step.options].sort((a, b) => total(b) - total(a))[0]!;
const total = (o: Option) => Object.values(o.score ?? {}).reduce((n, v) => n + (v ?? 0), 0);

function scoreRun(project: Project, answers: Record<string, string[]>) {
  const got: Partial<Record<Skill, number>> = {}, max: Partial<Record<Skill, number>> = {};
  for (const step of project.steps) {
    const a = answers[step.id];
    if (!a) continue;
    const { points } = gradeStep(step, a);
    for (const s of step.skills) { got[s] = (got[s] ?? 0) + (points[s] ?? 0); max[s] = (max[s] ?? 0) + 2; }
  }
  const skills: Partial<Record<Skill, number>> = {};
  for (const s of SKILL_ORDER) if (max[s]) skills[s] = Math.round((100 * got[s]!) / max[s]!);
  const sumGot = Object.values(got).reduce((n, v) => n + (v ?? 0), 0), sumMax = Object.values(max).reduce((n, v) => n + (v ?? 0), 0);
  return { overall: sumMax ? Math.round((100 * sumGot) / sumMax) : 0, skills };
}

export class OfficeService {
  private readonly store: Store;
  private readonly now: () => Date;
  constructor(store: Store, opts: { now?: () => Date } = {}) { this.store = store; this.now = opts.now ?? (() => new Date()); }

  private key(learnerId: string, projectId: string) { return `${learnerId}:${projectId}`; }
  private async getRun(learnerId: string, projectId: string): Promise<Run | null> {
    const d = await this.store.getDoc('office_run', this.key(learnerId, projectId));
    return d && d.data.learnerId === learnerId ? (d.data as Run) : null;
  }
  private async saveRun(run: Run) {
    await this.store.putDoc({ kind: 'office_run', id: this.key(run.learnerId, run.projectId), data: run, updatedAt: this.now().toISOString() });
  }
  private project(id: string, lang: Lang) {
    const p = getProject(id);
    if (!p) throw new AppError('not_found', 404, 'No such project.', undefined, 'এমন কোনো প্রজেক্ট নেই।');
    return p;
  }
  private assertOpen(p: Project, access: OfficeAccess) {
    if (!p.free && !access.unlocked) throw new AppError('premium', 403, 'This project is part of the Premium Virtual Office.', undefined, 'এই প্রজেক্টটা প্রিমিয়াম ভার্চুয়াল অফিসের অংশ।');
  }

  roles(lang: Lang) {
    return Object.fromEntries(Object.entries(ROLES).map(([id, r]) => [id, { name: r.name, title: t(r.title, lang), kind: r.kind, initials: r.initials }]));
  }
  skills(lang: Lang) {
    return SKILL_ORDER.map((id) => ({ id, title: t(SKILLS[id].title, lang), blurb: t(SKILLS[id].blurb, lang) }));
  }

  /** The office lobby: projects with progress, and a skills report across finished projects. */
  async lobby(learnerId: string, lang: Lang, access: OfficeAccess) {
    const projects = [];
    const sums: Partial<Record<Skill, { n: number; total: number }>> = {};
    for (const p of PROJECTS) {
      const run = await this.getRun(learnerId, p.id);
      const done = run ? p.steps.filter((s) => run.answers[s.id]).length : 0;
      projects.push({
        id: p.id, free: p.free, locked: !p.free && !access.unlocked, track: t(p.track, lang), title: t(p.title, lang), role: t(p.role, lang), company: p.company,
        minutes: p.minutes, summary: t(p.summary, lang), steps: p.steps.length, done, finished: Boolean(run?.completedAt), best: run?.best?.overall ?? null,
        skills: [...new Set(p.steps.flatMap((s) => s.skills))].map((s) => t(SKILLS[s].title, lang)),
      });
      if (run?.best) for (const [s, v] of Object.entries(run.best.skills) as [Skill, number][]) { const x = sums[s] ?? { n: 0, total: 0 }; x.n++; x.total += v; sums[s] = x; }
    }
    const report = SKILL_ORDER.filter((s) => sums[s]).map((s) => ({ id: s, title: t(SKILLS[s].title, lang), blurb: t(SKILLS[s].blurb, lang), percent: Math.round(sums[s]!.total / sums[s]!.n) }));
    return { projects, report, unlocked: access.unlocked, unlock: access.course, skills: this.skills(lang) };
  }

  /** The project as the intern sees it now. */
  async open(learnerId: string, projectId: string, lang: Lang, access: OfficeAccess) {
    const p = this.project(projectId, lang);
    this.assertOpen(p, access);
    let run = await this.getRun(learnerId, projectId);
    if (!run) {
      run = { learnerId, projectId, answers: {}, startedAt: this.now().toISOString(), completedAt: null, attempts: 1, best: null };
      await this.saveRun(run);
    }
    return this.view(p, run, lang);
  }

  async answer(learnerId: string, projectId: string, body: { step?: unknown; choices?: unknown }, lang: Lang, access: OfficeAccess) {
    const p = this.project(projectId, lang);
    this.assertOpen(p, access);
    const run = await this.getRun(learnerId, projectId);
    if (!run) throw new AppError('not_started', 409, 'Open the project first.', undefined, 'আগে প্রজেক্টটা খোলো।');
    const current = p.steps.find((s) => !run.answers[s.id]);
    if (!current) throw new AppError('finished', 409, 'This project is finished. Start again to retry.', undefined, 'প্রজেক্টটা শেষ। আবার চেষ্টা করতে নতুন করে শুরু করো।');
    if (body.step !== current.id) throw new AppError('stale_step', 409, 'This task has already been answered. Reload the project.', undefined, 'এই কাজের উত্তর আগেই দেওয়া হয়েছে। প্রজেক্টটা আবার লোড করো।');
    const ids = new Set(current.options.map((o) => o.id));
    const picked = [...new Set((Array.isArray(body.choices) ? body.choices : []).map(String))].filter((id) => ids.has(id));
    if (!picked.length || (current.kind === 'choose' && picked.length !== 1)) {
      throw new AppError('bad_choice', 400, current.kind === 'choose' ? 'Choose one option.' : 'Select at least one option.', undefined, current.kind === 'choose' ? 'একটা অপশন বেছে নাও।' : 'অন্তত একটা অপশন বেছে নাও।');
    }
    run.answers[current.id] = picked;
    if (p.steps.every((s) => run.answers[s.id])) {
      run.completedAt = this.now().toISOString();
      const score = scoreRun(p, run.answers);
      if (!run.best || score.overall >= run.best.overall) run.best = { ...score, at: run.completedAt };
    }
    await this.saveRun(run);
    return this.view(p, run, lang);
  }

  async restart(learnerId: string, projectId: string, lang: Lang, access: OfficeAccess) {
    const p = this.project(projectId, lang);
    this.assertOpen(p, access);
    const prev = await this.getRun(learnerId, projectId);
    const run: Run = { learnerId, projectId, answers: {}, startedAt: this.now().toISOString(), completedAt: null, attempts: (prev?.attempts ?? 0) + 1, best: prev?.best ?? null };
    await this.saveRun(run);
    return this.view(p, run, lang);
  }

  private msg(m: Msg, lang: Lang) {
    return { from: m.from, at: m.at, text: t(m.text, lang), code: m.code ?? null, codeLang: m.codeLang ?? null };
  }

  private view(p: Project, run: Run, lang: Lang) {
    const thread: Record<string, unknown>[] = [];
    const ai: Record<string, unknown>[] = [];
    let current: Record<string, unknown> | null = null;
    for (const [i, step] of p.steps.entries()) {
      const picked = run.answers[step.id];
      if (!picked && current) break;
      thread.push({ type: 'step', n: i + 1, title: t(step.title, lang) });
      if (step.aiAsk) {
        thread.push({ type: 'ask', text: t(step.aiAsk, lang) });
        ai.push({ ask: t(step.aiAsk, lang), answers: step.messages.filter((m) => m.from === 'ai').map((m) => this.msg(m, lang)) });
      }
      for (const m of step.messages) thread.push({ type: 'msg', ...this.msg(m, lang) });
      if (!picked) {
        current = { id: step.id, n: i + 1, kind: step.kind, prompt: t(step.prompt, lang), options: step.options.map((o) => ({ id: o.id, text: t(o.text, lang) })) };
        break;
      }
      const g = gradeStep(step, picked);
      const result = step.kind === 'choose'
        ? { kind: 'choose', verdict: g.verdict, picked: picked.map((id) => t(step.options.find((o) => o.id === id)!.text, lang)), feedback: t(step.options.find((o) => o.id === picked[0])!.feedback, lang) }
        : { kind: 'multi', verdict: g.verdict, options: step.options.map((o) => ({ text: t(o.text, lang), correct: Boolean(o.correct), picked: picked.includes(o.id), feedback: t(o.feedback, lang) })) };
      thread.push({ type: 'result', ...result });
      const after = step.kind === 'choose' ? step.options.find((o) => o.id === picked[0])!.replies ?? [] : step.after ?? [];
      for (const m of after) thread.push({ type: 'msg', ...this.msg(m, lang) });
    }
    const finished = p.steps.every((s) => run.answers[s.id]);
    const debrief = finished ? {
      ...scoreRun(p, run.answers),
      skills: Object.entries(scoreRun(p, run.answers).skills).map(([id, percent]) => ({ id, title: t(SKILLS[id as Skill].title, lang), percent })),
      steps: p.steps.map((s, i) => {
        const g = gradeStep(s, run.answers[s.id]!);
        return {
          n: i + 1, title: t(s.title, lang), trapKind: s.trap.kind, trap: t(s.trap.text, lang), lesson: t(s.lesson, lang), verdict: g.verdict,
          yours: run.answers[s.id]!.map((id) => t(s.options.find((o) => o.id === id)!.text, lang)),
          best: s.kind === 'choose' ? [t(bestOption(s).text, lang)] : s.options.filter((o) => o.correct).map((o) => t(o.text, lang)),
        };
      }),
    } : null;
    return {
      project: { id: p.id, free: p.free, title: t(p.title, lang), role: t(p.role, lang), company: p.company, track: t(p.track, lang), summary: t(p.summary, lang), minutes: p.minutes, team: p.team, steps: p.steps.map((s) => t(s.title, lang)) },
      roles: this.roles(lang),
      progress: { done: p.steps.filter((s) => run.answers[s.id]).length, total: p.steps.length, attempts: run.attempts, best: run.best?.overall ?? null },
      thread, ai, current, debrief,
    };
  }
}
