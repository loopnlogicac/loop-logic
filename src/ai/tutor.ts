// Practice tutor: rewords the reviewed intervention for the current task, in the
// learner's language, grounded in the reviewed passage and the verifier's facts.
// Returns null (caller shows reviewed text) when AI is off or validation fails.

import { INTERVENTIONS, type DiagnosisCode, type Lang } from '../content/pricing-pack.ts';
import { type TaskInstance, factsFor } from '../core/scenario.ts';
import { extractNumbers, SYSTEM_RULES, validateAnswer } from './validator.ts';
import type { AiGateway } from './gateway.ts';

export interface PracticeTutor {
  explain(input: { diagnosis: Exclude<DiagnosisCode, 'correct'>; task: TaskInstance; lang: Lang; sessionId: string }): Promise<{ text: string; outcome: string } | null>;
}

export class AiPracticeTutor implements PracticeTutor {
  private readonly gateway: AiGateway;
  private readonly cache = new Map<string, string>();

  constructor(gateway: AiGateway) {
    this.gateway = gateway;
  }

  async explain(input: { diagnosis: Exclude<DiagnosisCode, 'correct'>; task: TaskInstance; lang: Lang; sessionId: string }) {
    if (!this.gateway.enabled) return null;
    const key = `${input.diagnosis}:${input.task.id}:${input.task.packVersion}:${input.lang}`;
    const cached = this.cache.get(key);
    const req = { purpose: 'practice_help', system: SYSTEM_RULES, user: '', maxOutputTokens: 300 };
    if (cached) {
      await this.gateway.logOutcome(req, 'cache', 'cache', 'cache_hit', { cached: true });
      return { text: cached, outcome: 'cache_hit' };
    }

    const iv = INTERVENTIONS[input.diagnosis];
    const f = factsFor(input.task);
    const facts = {
      cost: input.task.params.cost / 100,
      list_price: input.task.params.listPrice / 100,
      discount_pct: input.task.params.discountBps / 100,
      required_margin_pct: f.requiredMarginPct,
    };
    // The tutor explains the method on THIS task's givens; it does not reveal this task's answers.
    const passages = iv.sources.map((id) => ({ id, text: iv.explanation[input.lang] }));
    const language = input.lang === 'bn' ? 'Bangla (English terms in brackets are fine)' : 'English';
    req.user = [
      `Task: help a learner who made this kind of mistake: ${input.diagnosis.replace(/_/g, ' ')}.`,
      `Write at most 80 words in ${language}. Explain the method using the task's given numbers, but do NOT state the final price, profit, margin or decision for this task.`,
      `Verified givens: ${JSON.stringify(facts)}`,
      `<evidence>${JSON.stringify(passages)}</evidence>`,
    ].join('\n');

    const result = await this.gateway.generate(req);
    if (!result) return null;
    const allowed = [...Object.values(facts), ...passages.flatMap((p) => extractNumbers(p.text))];
    const v = validateAnswer(result.text, { allowedCitations: passages.map((p) => p.id), allowedNumbers: allowed, lang: input.lang, maxWords: 80 });
    if (!v.ok) {
      await this.gateway.logOutcome(req, result.provider, result.model, `fallback_${v.reason}`);
      return null;
    }
    this.cache.set(key, v.value.explanation);
    return { text: v.value.explanation, outcome: 'ok' };
  }
}
