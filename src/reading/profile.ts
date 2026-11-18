// Reading profile: built only from reading evidence and explicit settings.
// Explicit, versioned rules; every change stores a plain-language reason.
// No personality, motivation or learning-style labels.

import type { Bi } from '../content/pricing-pack.ts';
import type { ReadLevel } from '../content/lessons.ts';
import { perSubject, type Subject } from '../content/subjects.ts';

export const READING_RULES_VERSION = 'reading-rules@1.0.0';

export type { Subject };
export type Preset = 'light' | 'sepia' | 'dark' | 'contrast';

export interface ReadingProfile {
  version: string;
  enabled: boolean;
  level: Record<Subject, ReadLevel>;
  termHelp: Record<Subject, boolean>;
  detail: 'brief' | 'standard';
  weakConcepts: string[];
  knownConcepts: string[];
  prereqAsked: string[];
  depthAsked: Record<Subject, 'enough' | 'full' | null>;
  display: { preset: Preset; large: boolean };
  suggestions: { id: string; text: Bi; apply: Partial<ReadingProfile['display']> }[];
  reasons: { rule: string; text: Bi; at: string }[];
  counters: {
    termSelections: Record<Subject, number>;
    tooLong: number;
    quizStreak: Record<Subject, number>;
    lateReads: number;
    zooms: number;
  };
}

export function defaultProfile(): ReadingProfile {
  return {
    version: READING_RULES_VERSION,
    enabled: true,
    level: perSubject<ReadLevel>(2),
    termHelp: perSubject(false),
    detail: 'standard',
    weakConcepts: [],
    knownConcepts: [],
    prereqAsked: [],
    depthAsked: perSubject<'enough' | 'full' | null>(null),
    display: { preset: 'light', large: false },
    suggestions: [],
    reasons: [],
    counters: { termSelections: perSubject(0), tooLong: 0, quizStreak: perSubject(0), lateReads: 0, zooms: 0 },
  };
}

/** Fill in anything a stored profile lacks (for example subjects added after it was saved). */
export function normalizeProfile(raw: Partial<ReadingProfile> | undefined): ReadingProfile {
  const d = defaultProfile();
  if (!raw) return d;
  return {
    ...d,
    ...raw,
    level: { ...d.level, ...raw.level },
    termHelp: { ...d.termHelp, ...raw.termHelp },
    depthAsked: { ...d.depthAsked, ...raw.depthAsked },
    display: { ...d.display, ...raw.display },
    counters: {
      ...d.counters,
      ...raw.counters,
      termSelections: { ...d.counters.termSelections, ...raw.counters?.termSelections },
      quizStreak: { ...d.counters.quizStreak, ...raw.counters?.quizStreak },
    },
  };
}

export type ReadingSignal =
  | { kind: 'term_selected'; subject: Subject }
  | { kind: 'feedback'; subject: Subject; value: 'too_easy' | 'just_right' | 'too_hard' | 'too_long' }
  | { kind: 'quiz'; subject: Subject; correct: boolean }
  | { kind: 'struggle'; concepts: string[] } // long active time AND a selection/re-read on the same block
  | { kind: 'prereq'; concept: string; prerequisite: string; correct: boolean }
  | { kind: 'late_read' }
  | { kind: 'zoom' }
  | { kind: 'setting'; display?: Partial<ReadingProfile['display']>; level?: { subject: Subject; value: ReadLevel }; enabled?: boolean };

const clampLevel = (n: number): ReadLevel => (n < 1 ? 1 : n > 3 ? 3 : (n as ReadLevel));

export function applySignal(p0: ReadingProfile, s: ReadingSignal, now = new Date()): ReadingProfile {
  const p: ReadingProfile = structuredClone(p0);
  const at = now.toISOString();
  const reason = (rule: string, text: Bi) => {
    p.reasons = [...p.reasons, { rule, text, at }].slice(-12);
  };
  const suggest = (id: string, text: Bi, apply: Partial<ReadingProfile['display']>) => {
    if (!p.suggestions.some((x) => x.id === id)) p.suggestions.push({ id, text, apply });
  };

  switch (s.kind) {
    case 'term_selected': {
      p.counters.termSelections[s.subject] += 1;
      if (p.counters.termSelections[s.subject] >= 3 && !p.termHelp[s.subject]) {
        p.termHelp[s.subject] = true;
        p.level[s.subject] = clampLevel(p.level[s.subject] - 1);
        reason('R1_terms', {
          en: 'You looked up several terms, so key terms now show short definitions and paragraphs use simpler wording.',
          bn: 'তুমি কয়েকটি শব্দের মানে দেখেছ, তাই এখন মূল শব্দগুলোর ছোট সংজ্ঞা দেখানো হচ্ছে এবং অনুচ্ছেদগুলো সহজ ভাষায় লেখা।',
        });
      }
      break;
    }
    case 'feedback': {
      if (s.value === 'too_long') {
        p.counters.tooLong += 1;
        if (p.counters.tooLong >= 2 && p.detail !== 'brief') {
          p.detail = 'brief';
          reason('R2_brief', { en: 'You marked two answers as too long, so answers are now shorter.', bn: 'তুমি দুটি উত্তরকে বেশি লম্বা বলেছ, তাই এখন উত্তর ছোট করা হচ্ছে।' });
        }
      } else if (s.value === 'too_hard' && p.level[s.subject] > 1) {
        p.level[s.subject] = clampLevel(p.level[s.subject] - 1);
        reason('R5_easier', { en: 'You said it was too hard, so the next paragraphs use simpler wording.', bn: 'তুমি কঠিন বলেছ, তাই পরের অনুচ্ছেদগুলো সহজ ভাষায়।' });
      } else if (s.value === 'too_easy' && p.level[s.subject] < 3) {
        p.level[s.subject] = clampLevel(p.level[s.subject] + 1);
        reason('R5_harder', { en: 'You said it was too easy, so paragraphs now use more technical wording.', bn: 'তুমি সহজ বলেছ, তাই অনুচ্ছেদগুলো এখন আরও কারিগরি ভাষায়।' });
      }
      break;
    }
    case 'quiz': {
      p.counters.quizStreak[s.subject] = s.correct ? p.counters.quizStreak[s.subject] + 1 : 0;
      // Stretch rule: success raises the level so learners do not settle at the easiest text.
      if (p.counters.quizStreak[s.subject] >= 3 && p.level[s.subject] < 3) {
        p.level[s.subject] = clampLevel(p.level[s.subject] + 1);
        p.counters.quizStreak[s.subject] = 0;
        reason('R3_stretch', { en: 'Three correct quiz answers in a row, so the wording steps up a level.', bn: 'পরপর তিনটি কুইজ সঠিক, তাই লেখার স্তর এক ধাপ বাড়ানো হলো।' });
      }
      break;
    }
    case 'struggle': {
      const added = s.concepts.filter((c) => !p.weakConcepts.includes(c));
      if (added.length) {
        p.weakConcepts = [...p.weakConcepts, ...added];
        reason('R4_example', { en: 'You spent extra time on a paragraph and looked something up there, so extra examples now appear for that idea.', bn: 'তুমি একটি অনুচ্ছেদে বেশি সময় দিয়েছ এবং সেখানে কিছু খুঁজেছ, তাই ওই ধারণার জন্য বাড়তি উদাহরণ দেখানো হচ্ছে।' });
      }
      break;
    }
    case 'prereq': {
      if (!p.prereqAsked.includes(s.concept)) p.prereqAsked.push(s.concept);
      if (s.correct && !p.knownConcepts.includes(s.prerequisite)) p.knownConcepts.push(s.prerequisite);
      break;
    }
    case 'late_read': {
      p.counters.lateReads += 1;
      if (p.counters.lateReads >= 2 && p.display.preset === 'light') {
        suggest('dark', { en: 'Reading late? Switch to the dark theme.', bn: 'রাতে পড়ছ? ডার্ক থিম চালু করবে?' }, { preset: 'dark' });
      }
      break;
    }
    case 'zoom': {
      p.counters.zooms += 1;
      if (p.counters.zooms >= 2 && !p.display.large) {
        suggest('large', { en: 'Switch to larger text?', bn: 'লেখা বড় করবে?' }, { large: true });
      }
      break;
    }
    case 'setting': {
      if (s.display) {
        p.display = { ...p.display, ...s.display };
        p.suggestions = p.suggestions.filter((x) => !Object.keys(x.apply).some((k) => k in (s.display ?? {})));
      }
      if (s.level) p.level[s.level.subject] = s.level.value;
      if (s.enabled !== undefined) p.enabled = s.enabled;
      break;
    }
  }
  return p;
}
