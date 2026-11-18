// Append-only learner evidence and the receipt derived from it.
// Concept state is a projection of events; events are never rewritten.

import type { Bi, ConceptId, DiagnosisCode } from '../content/pricing-pack.ts';
import { CONCEPTS } from '../content/pricing-pack.ts';

export type EventType = 'attempt' | 'help' | 'transfer_opened' | 'transfer_attempt' | 'correction';

export interface EvidenceEvent {
  id: string;
  type: EventType;
  sessionId: string;
  learnerId: string;
  tenantId: string;
  at: string;
  packVersion: string;
  taskId: string;
  level: number | null;
  concepts: string[];
  correct: boolean | null;
  assisted: boolean;
  diagnosis: DiagnosisCode | null;
  detail: Record<string, unknown>;
}

export type ConceptState =
  | 'not_assessed'
  | 'practicing'
  | 'shown_with_help'
  | 'shown_independently'
  | 'needs_review'
  | 'uncertain';

export interface ReceiptLine {
  text: Bi;
  evidence: string[]; // event ids
}

export interface Receipt {
  demonstratedIndependently: ReceiptLine[];
  completedWithHelp: ReceiptLine[];
  stillUncertain: ReceiptLine[];
  nextCheck: ReceiptLine[];
  conceptStates: Record<string, ConceptState>;
  basedOnEvents: number;
}

export function projectConceptStates(events: EvidenceEvent[]): Record<string, ConceptState> {
  const states: Record<string, ConceptState> = {};
  for (const id of Object.keys(CONCEPTS)) states[id] = 'not_assessed';
  for (const e of events) {
    if (e.type !== 'attempt' && e.type !== 'transfer_attempt') continue;
    const shown = (e.detail['conceptsShown'] as string[] | undefined) ?? (e.correct ? e.concepts : []);
    const missed = (e.detail['conceptsMissed'] as string[] | undefined) ?? (e.correct ? [] : e.concepts);
    for (const c of shown) {
      if (e.type === 'transfer_attempt') states[c] = 'shown_independently';
      else if (states[c] !== 'shown_independently') states[c] = e.assisted ? 'shown_with_help' : 'practicing';
    }
    for (const c of missed) {
      if (e.type === 'transfer_attempt') states[c] = 'needs_review';
      else if (states[c] === 'not_assessed') states[c] = e.diagnosis === 'uncertain' ? 'uncertain' : 'practicing';
    }
  }
  return states;
}

const name = (c: string): Bi => CONCEPTS[c as ConceptId]?.name ?? { en: c, bn: c };

export function buildReceipt(events: EvidenceEvent[]): Receipt {
  const states = projectConceptStates(events);
  const receipt: Receipt = {
    demonstratedIndependently: [],
    completedWithHelp: [],
    stillUncertain: [],
    nextCheck: [],
    conceptStates: states,
    basedOnEvents: events.length,
  };

  const transfer = events.filter((e) => e.type === 'transfer_attempt').at(-1);
  if (transfer) {
    const shown = (transfer.detail['conceptsShown'] as string[]) ?? [];
    const missed = (transfer.detail['conceptsMissed'] as string[]) ?? [];
    for (const c of shown) {
      receipt.demonstratedIndependently.push({
        text: { en: `${name(c).en}: correct on a fresh task with no help.`, bn: `${name(c).bn}: সাহায্য ছাড়া নতুন প্রশ্নে সঠিক।` },
        evidence: [transfer.id],
      });
    }
    for (const c of missed) {
      receipt.stillUncertain.push({
        text: { en: `${name(c).en}: not yet shown on a fresh task.`, bn: `${name(c).bn}: নতুন প্রশ্নে এখনো দেখানো যায়নি।` },
        evidence: [transfer.id],
      });
    }
  }

  const assistedCorrect = events.filter((e) => e.type === 'attempt' && e.correct && e.assisted);
  if (assistedCorrect.length > 0) {
    receipt.completedWithHelp.push({
      text: {
        en: `${assistedCorrect.length} practice task(s) solved after using help.`,
        bn: `সাহায্য নিয়ে ${assistedCorrect.length}টি অনুশীলনী প্রশ্নের সমাধান।`,
      },
      evidence: assistedCorrect.map((e) => e.id),
    });
  }

  const overReliance = events.filter((e) => e.type === 'attempt' && e.diagnosis === 'ai_over_reliance');
  const caughtAdvice = events.filter((e) => e.type === 'attempt' && e.correct && e.detail['coworkerCorrect'] === false && !e.assisted);
  if (caughtAdvice.length > 0) {
    receipt.demonstratedIndependently.push({
      text: { en: 'Caught incorrect AI coworker advice in practice, without help.', bn: 'অনুশীলনে সাহায্য ছাড়াই এআই সহকর্মীর ভুল পরামর্শ ধরেছ।' },
      evidence: caughtAdvice.map((e) => e.id),
    });
  }
  if (overReliance.length > 0 && caughtAdvice.length === 0) {
    receipt.stillUncertain.push({
      text: { en: 'Checking AI advice against your own numbers.', bn: 'নিজের হিসাবের সঙ্গে এআই-এর পরামর্শ মিলিয়ে দেখা।' },
      evidence: overReliance.map((e) => e.id),
    });
  }

  if (!transfer) {
    receipt.nextCheck.push({
      text: { en: 'A fresh pricing decision with no help, once you are ready.', bn: 'প্রস্তুত হলে সাহায্য ছাড়া নতুন একটি দামের সিদ্ধান্ত।' },
      evidence: [],
    });
  } else {
    receipt.nextCheck.push({
      text: {
        en: 'A delayed check on a different pricing decision in a later session (planned: 1, 3 and 7 days).',
        bn: 'পরের কোনো সেশনে ভিন্ন একটি দামের সিদ্ধান্তে বিলম্বিত যাচাই (পরিকল্পনা: ১, ৩ ও ৭ দিন পরে)।',
      },
      evidence: [transfer.id],
    });
  }
  return receipt;
}
