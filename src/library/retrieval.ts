// Local retrieval over reviewed passages: filters first, then concept boost,
// then term overlap in both languages. No vector store needed for this size.

import { GLOSSARY, PASSAGES, type Passage } from '../content/library.ts';
import type { Subject } from '../content/subjects.ts';

const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
const STOP = new Set(['the', 'a', 'an', 'of', 'to', 'is', 'and', 'or', 'in', 'on', 'for', 'it', 'this', 'that', 'what', 'why', 'how', 'with', 'by', 'as', 'be', 'are', 'ki', 'keno', 'ar', 'o', 'এবং', 'ও', 'কি', 'কেন', 'কী', 'যে', 'এই', 'হয়', 'হলে', 'থেকে']);

export function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)))
    .replace(/[^\p{L}\p{N}\s.%]/gu, ' ')
    .split(/\s+/)
    .map((t) => t.replace(/^\.+|\.+$/g, ''))
    .filter((t) => t.length > 1 && !STOP.has(t));
}

/** Concepts named in a piece of text, via glossary aliases (English, Bangla, romanised). */
export function conceptsIn(text: string): string[] {
  const low = ` ${text.toLowerCase()} `;
  return [...new Set(GLOSSARY.filter((g) => g.aliases.some((a) => low.includes(a))).map((g) => g.concept))];
}

export interface Hit {
  passage: Passage;
  score: number;
}

export function searchLocal(input: { query: string; subject: Subject; concepts?: string[]; preferIds?: string[]; limit?: number }): { hits: Hit[]; sufficient: boolean } {
  const qTokens = new Set(normalize(input.query));
  const wantedConcepts = new Set([...(input.concepts ?? []), ...conceptsIn(input.query)]);
  const hits = PASSAGES.filter((p) => p.subject === input.subject)
    .map((p) => {
      let score = 0;
      for (const c of p.concepts) if (wantedConcepts.has(c)) score += 3;
      if (input.preferIds?.includes(p.id)) score += 2;
      const pTokens = new Set([...normalize(p.text.en), ...normalize(p.text.bn)]);
      for (const t of qTokens) if (pTokens.has(t)) score += 1;
      return { passage: p, score };
    })
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, input.limit ?? 3);
  return { hits, sufficient: (hits[0]?.score ?? 0) >= 3 };
}
