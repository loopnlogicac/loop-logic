// Inspectable adaptation policy. Chooses the next action from recorded
// evidence and stores a plain-language reason. Explicit rules, versioned.

import type { Bi, CoworkerCase, DiagnosisCode } from '../content/pricing-pack.ts';
import type { TaskKind } from './scenario.ts';

export const POLICY_VERSION = 'adaptation-policy@1.0.0';

export type Action =
  | 'open_transfer'
  | 'fresh_check'
  | 'next_case'
  | 'contrast_example'
  | 'step_by_step'
  | 'policy_card'
  | 'compare_evidence'
  | 'focused_question';

export interface AttemptSummary {
  kind: TaskKind;
  correct: boolean;
  assisted: boolean;
  diagnosis: DiagnosisCode;
  coworkerCase: CoworkerCase | null;
}

export interface Adaptation {
  action: Action;
  nextKind: TaskKind;
  nextCoworkerCase: CoworkerCase | null;
  readyForTransfer: boolean;
  reason: Bi;
  version: string;
}

const CASE_ROTATION: CoworkerCase[] = ['correct_accept', 'markup_error', 'correct_reject', 'ignores_discount'];

/** Next coworker case, never repeating the last one, cycling through mixed reliability. */
export function nextCase(last: CoworkerCase | null, prefer?: CoworkerCase): CoworkerCase {
  if (prefer && prefer !== last) return prefer;
  const i = last ? CASE_ROTATION.indexOf(last) : -1;
  return CASE_ROTATION[(i + 1) % CASE_ROTATION.length]!;
}

/** Ready when the last two attempts were correct without help and one of them judged the coworker. */
export function isReady(history: AttemptSummary[]): boolean {
  const lastTwo = history.slice(-2);
  return lastTwo.length === 2 && lastTwo.every((a) => a.correct && !a.assisted) && lastTwo.some((a) => a.kind === 'l4_coworker');
}

export function decideNext(history: AttemptSummary[]): Adaptation {
  const last = history.at(-1);
  if (!last) throw new Error('decideNext needs at least one attempt');
  const lastL4Case = [...history].reverse().find((a) => a.coworkerCase)?.coworkerCase ?? null;
  const make = (action: Action, nextKind: TaskKind, reason: Bi, prefer?: CoworkerCase): Adaptation => ({
    action,
    nextKind,
    nextCoworkerCase: nextKind === 'l4_coworker' ? nextCase(lastL4Case, prefer) : null,
    readyForTransfer: isReady(history),
    reason,
    version: POLICY_VERSION,
  });

  if (last.correct && isReady(history)) {
    return make('open_transfer', 'l4_coworker', {
      en: 'Two correct answers in a row without help, including an AI coworker case. You are ready for a fresh check with no help.',
      bn: 'সাহায্য ছাড়া পরপর দুটি সঠিক উত্তর, তার মধ্যে একটি এআই সহকর্মীর কেস। এবার সাহায্য ছাড়া একটি নতুন যাচাইয়ের জন্য তুমি প্রস্তুত।',
    });
  }
  if (last.correct && last.assisted) {
    return make('fresh_check', last.kind, {
      en: 'You got it with help. Next is a fresh one with new numbers, to try on your own.',
      bn: 'সাহায্য নিয়ে তুমি পেরেছ। এবার নতুন সংখ্যার একটি প্রশ্ন, নিজে নিজে চেষ্টা করো।',
    });
  }
  if (last.correct) {
    return last.kind === 'l2_margin'
      ? make('next_case', 'l4_coworker', {
          en: 'Margin is solid. Next, use it to judge an AI coworker’s advice.',
          bn: 'মার্জিন ঠিকঠাক হয়েছে। এবার সেটা দিয়ে এআই সহকর্মীর পরামর্শ যাচাই করো।',
        })
      : make('next_case', 'l4_coworker', {
          en: 'Correct. One more case: the coworker may or may not be right this time.',
          bn: 'সঠিক। আরেকটি কেস: এবার সহকর্মী ঠিকও হতে পারে, ভুলও হতে পারে।',
        });
  }

  switch (last.diagnosis) {
    case 'margin_markup_confusion':
      return make('contrast_example', 'l2_margin', {
        en: 'You divided profit by the cost, so the next task practises margin on its own, with the selling price as the base.',
        bn: 'তুমি লাভকে খরচ দিয়ে ভাগ করেছ, তাই পরের প্রশ্নে শুধু মার্জিন অনুশীলন করবে, ভিত্তি হবে বিক্রয়মূল্য।',
      });
    case 'arithmetic_slip':
      return make('step_by_step', last.kind, {
        en: 'The method was right but a step slipped. Next is the same kind of task with new numbers; write each step.',
        bn: 'পদ্ধতি ঠিক ছিল, কিন্তু একটা ধাপে ভুল হয়েছে। পরেরটা একই ধরনের, নতুন সংখ্যায়; প্রতিটি ধাপ লিখে করো।',
      });
    case 'missed_constraint':
      return make('policy_card', 'l4_coworker', {
        en: 'Your numbers were right but the decision missed the rule. Next case: compare your margin with the minimum before deciding.',
        bn: 'হিসাব ঠিক ছিল, কিন্তু সিদ্ধান্তে নিয়মটা বাদ পড়েছে। পরের কেসে সিদ্ধান্তের আগে মার্জিনকে ন্যূনতম সীমার সঙ্গে মেলাও।',
      }, lastL4Case === 'correct_reject' ? 'correct_accept' : 'correct_reject');
    case 'ai_over_reliance':
      return make('compare_evidence', 'l4_coworker', {
        en: 'You followed advice that your own numbers contradicted. In the next case the coworker may be right, so check before you decide.',
        bn: 'তোমার নিজের হিসাবের বিপরীতে গিয়ে তুমি পরামর্শ মেনেছ। পরের কেসে সহকর্মী ঠিকও হতে পারে, তাই সিদ্ধান্তের আগে যাচাই করো।',
      }, 'correct_accept');
    case 'uncertain':
    case 'correct':
    default:
      return make('focused_question', last.kind, {
        en: 'It is not clear yet what went wrong. Next is a similar task; the help button asks one focused question first.',
        bn: 'কোথায় ভুল হলো এখনো পরিষ্কার নয়। পরেরটা একই রকম প্রশ্ন; সাহায্য বাটনে আগে একটি নির্দিষ্ট প্রশ্ন আসবে।',
      });
  }
}
