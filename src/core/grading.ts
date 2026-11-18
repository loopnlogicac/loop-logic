// Grades a structured attempt against verifier facts and extracts the signals
// that diagnosis rules need. Pure and deterministic.

import { parseLearnerNumber } from './money.ts';
import { type PricingFacts, moneyMatches, percentMatches } from './verifier.ts';
import { type FieldId, type TaskInstance, coworkerIsCorrect, coworkerRecommendation, factsFor, fieldsFor } from './scenario.ts';

export interface RawAnswer {
  salePrice?: unknown;
  profit?: unknown;
  marginPct?: unknown;
  decision?: unknown;
  reasoning?: unknown;
}

export interface CleanAnswer {
  salePrice: number | null;
  profit: number | null;
  marginPct: number | null;
  decision: 'accept' | 'reject' | null;
  reasoning: string;
}

export interface GradeSignals {
  salePriceCorrect: boolean;
  profitCorrect: boolean;
  marginCorrect: boolean;
  decisionCorrect: boolean | null;
  usedListPrice: boolean; // learner ignored the discount
  marginMatchesMarkup: boolean; // divided profit by cost
  marginConsistentWithOwnNumbers: boolean; // learner's margin = learner's profit / learner's price
  ownMarginBelowRule: boolean | null; // judged from the learner's own margin number
  decision: 'accept' | 'reject' | null;
  coworkerRecommendation: 'accept' | 'reject' | null;
  coworkerCorrect: boolean | null;
  followedCoworker: boolean | null;
}

export interface Graded {
  fields: Partial<Record<FieldId, { correct: boolean }>>;
  allCorrect: boolean;
  signals: GradeSignals;
}

export class InvalidAnswerError extends Error {
  readonly code = 'invalid_answer';
  readonly missing: FieldId[];
  constructor(missing: FieldId[]) {
    super(`Missing or unreadable answers: ${missing.join(', ')}`);
    this.missing = missing;
  }
}

export function cleanAnswer(task: TaskInstance, raw: RawAnswer): CleanAnswer {
  const decision = raw.decision === 'accept' || raw.decision === 'reject' ? raw.decision : null;
  const reasoning = typeof raw.reasoning === 'string' ? raw.reasoning.slice(0, 1000) : '';
  const clean: CleanAnswer = {
    salePrice: parseLearnerNumber(raw.salePrice),
    profit: parseLearnerNumber(raw.profit),
    marginPct: parseLearnerNumber(raw.marginPct),
    decision,
    reasoning,
  };
  const missing = fieldsFor(task.kind).filter((f) => clean[f] === null);
  if (missing.length > 0) throw new InvalidAnswerError(missing);
  return clean;
}

export function grade(task: TaskInstance, answer: CleanAnswer, facts: PricingFacts = factsFor(task)): Graded {
  const requested = fieldsFor(task.kind);
  const salePriceTaka = task.kind === 'l2_margin' ? facts.salePrice / 100 : answer.salePrice;

  const salePriceCorrect = salePriceTaka !== null && moneyMatches(salePriceTaka, facts.salePrice);
  const profitCorrect = answer.profit !== null && moneyMatches(answer.profit, facts.profit);
  const marginCorrect = answer.marginPct !== null && percentMatches(answer.marginPct, facts.margin);
  const decisionCorrect = requested.includes('decision') ? answer.decision === facts.correctDecision : null;

  const usedListPrice =
    task.kind === 'l4_coworker' && salePriceTaka !== null && task.params.discountBps > 0 && moneyMatches(salePriceTaka, task.params.listPrice);

  const marginMatchesMarkup = answer.marginPct !== null && !marginCorrect && percentMatches(answer.marginPct, facts.markup);

  let marginConsistentWithOwnNumbers = false;
  if (answer.marginPct !== null && answer.profit !== null && salePriceTaka !== null && salePriceTaka > 0) {
    const own = (answer.profit / salePriceTaka) * 100;
    marginConsistentWithOwnNumbers = Math.abs(own - answer.marginPct) <= 0.05 + 1e-9;
  }

  const ownMarginBelowRule =
    task.kind === 'l4_coworker' && answer.marginPct !== null ? answer.marginPct < facts.requiredMarginPct : null;

  const rec = coworkerRecommendation(task);
  const signals: GradeSignals = {
    salePriceCorrect,
    profitCorrect,
    marginCorrect,
    decisionCorrect,
    usedListPrice,
    marginMatchesMarkup,
    marginConsistentWithOwnNumbers,
    ownMarginBelowRule,
    decision: answer.decision,
    coworkerRecommendation: rec,
    coworkerCorrect: coworkerIsCorrect(task),
    followedCoworker: rec && answer.decision ? answer.decision === rec : null,
  };

  const fields: Graded['fields'] = {};
  for (const f of requested) {
    fields[f] = {
      correct: f === 'salePrice' ? salePriceCorrect : f === 'profit' ? profitCorrect : f === 'marginPct' ? marginCorrect : decisionCorrect === true,
    };
  }
  const allCorrect = requested.every((f) => fields[f]?.correct === true);
  return { fields, allCorrect, signals };
}
