// Reading subjects. The reading level adapts separately for each one.
import type { Bi } from './pricing-pack.ts';

export const LESSON_SUBJECTS = ['business', 'ml', 'cs', 'ee'] as const;
export type Subject = (typeof LESSON_SUBJECTS)[number];

export const SUBJECT_LABELS: Record<Subject, Bi> = {
  business: { en: 'Business lessons', bn: 'ব্যবসার পাঠ' },
  ml: { en: 'Machine-learning lessons', bn: 'মেশিন লার্নিং পাঠ' },
  cs: { en: 'Computer-science lessons', bn: 'কম্পিউটার সায়েন্স পাঠ' },
  ee: { en: 'Electrical lessons', bn: 'ইলেকট্রিক্যাল পাঠ' },
};

/** One value per subject. */
export function perSubject<T>(value: T): Record<Subject, T> {
  return Object.fromEntries(LESSON_SUBJECTS.map((s) => [s, value])) as Record<Subject, T>;
}
