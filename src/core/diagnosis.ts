// Rule-based diagnosis. Proposes the most likely cause of difficulty with its
// evidence, alternatives and a qualitative confidence. One attempt is never
// treated as conclusive; the adaptation policy decides what to do with it.

import type { Bi, DiagnosisCode } from '../content/pricing-pack.ts';
import type { Graded } from './grading.ts';
import type { TaskInstance } from './scenario.ts';

export const DIAGNOSIS_VERSION = 'diagnosis-rules@1.0.0';

export interface Diagnosis {
  code: DiagnosisCode;
  confidence: 'high' | 'medium' | 'low';
  evidence: string[];
  alternatives: DiagnosisCode[];
  summary: Bi;
  version: string;
}

const SUMMARY: Record<DiagnosisCode, Bi> = {
  correct: { en: 'All correct.', bn: 'সব ঠিক।' },
  margin_markup_confusion: {
    en: 'Your profit is right, but the margin was worked out from the cost (that is markup).',
    bn: 'লাভ ঠিক আছে, কিন্তু মার্জিন খরচের ভিত্তিতে হিসাব করা হয়েছে (সেটা মার্কআপ)।',
  },
  arithmetic_slip: {
    en: 'The method looks right, but a number along the way is off.',
    bn: 'পদ্ধতি ঠিক মনে হচ্ছে, কিন্তু মাঝের কোনো একটা সংখ্যা ভুল।',
  },
  missed_constraint: {
    en: 'Your numbers are right, but the decision does not match the store’s margin rule.',
    bn: 'হিসাব ঠিক, কিন্তু সিদ্ধান্তটা দোকানের মার্জিনের নিয়মের সঙ্গে মেলেনি।',
  },
  ai_over_reliance: {
    en: 'Your own margin was below the rule, but you followed the coworker’s advice to accept.',
    bn: 'তোমার নিজের হিসাবে মার্জিন নিয়মের নিচে ছিল, তবু তুমি সহকর্মীর পরামর্শ মেনে ছাড় দিয়েছ।',
  },
  uncertain: {
    en: 'The answers do not point to one clear cause yet.',
    bn: 'উত্তরগুলো এখনো একটা নির্দিষ্ট কারণ দেখাচ্ছে না।',
  },
};

function make(code: DiagnosisCode, confidence: Diagnosis['confidence'], evidence: string[], alternatives: DiagnosisCode[] = []): Diagnosis {
  return { code, confidence, evidence, alternatives, summary: SUMMARY[code], version: DIAGNOSIS_VERSION };
}

export function diagnose(task: TaskInstance, graded: Graded): Diagnosis {
  const s = graded.signals;
  if (graded.allCorrect) return make('correct', 'high', ['all_fields_correct']);

  if (task.kind === 'l4_coworker') {
    // Followed advice that contradicts the learner's own evidence.
    if (s.ownMarginBelowRule === true && s.decision === 'accept' && s.followedCoworker === true && s.coworkerCorrect === false) {
      const others: Diagnosis['alternatives'] = s.marginCorrect ? ['missed_constraint'] : ['missed_constraint', 'arithmetic_slip'];
      return make('ai_over_reliance', s.marginCorrect ? 'high' : 'medium', ['own_margin_below_rule', 'accepted', 'followed_incorrect_advice'], others);
    }
    if (s.marginMatchesMarkup && s.profitCorrect) {
      return make('margin_markup_confusion', s.salePriceCorrect ? 'high' : 'medium', ['profit_correct', 'margin_equals_markup'], ['arithmetic_slip']);
    }
    if (s.usedListPrice) {
      return make('arithmetic_slip', 'medium', ['used_list_price_not_discounted_price'], ['missed_constraint']);
    }
    if (s.salePriceCorrect && s.profitCorrect && s.marginCorrect && s.decisionCorrect === false) {
      return make('missed_constraint', 'high', ['numbers_correct', 'decision_against_rule']);
    }
    if (!s.marginCorrect && s.marginConsistentWithOwnNumbers) {
      return make('arithmetic_slip', 'medium', ['margin_formula_consistent', 'upstream_number_wrong'], ['uncertain']);
    }
    if (s.marginCorrect && (!s.salePriceCorrect || !s.profitCorrect)) {
      return make('arithmetic_slip', 'low', ['margin_correct_but_intermediate_wrong'], ['uncertain']);
    }
    return make('uncertain', 'low', ['no_rule_matched'], ['arithmetic_slip', 'margin_markup_confusion']);
  }

  // L2: profit and margin only.
  if (s.marginMatchesMarkup && s.profitCorrect) {
    return make('margin_markup_confusion', 'high', ['profit_correct', 'margin_equals_markup'], ['arithmetic_slip']);
  }
  if (!s.profitCorrect && s.marginConsistentWithOwnNumbers) {
    return make('arithmetic_slip', 'medium', ['margin_formula_consistent', 'profit_wrong'], ['uncertain']);
  }
  if (s.profitCorrect && !s.marginCorrect) {
    return make('arithmetic_slip', 'low', ['profit_correct', 'margin_wrong'], ['margin_markup_confusion', 'uncertain']);
  }
  return make('uncertain', 'low', ['no_rule_matched'], ['arithmetic_slip', 'margin_markup_confusion']);
}
