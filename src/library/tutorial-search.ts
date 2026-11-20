// Search over every reviewed tutorial section, in English and Bangla, for the
// AI Teacher (retrieval for RAG). Zero dependencies: BM25 ranking over a small
// in-memory index built from the tutorial files when it is first needed.
//
// Each search document is one section of one topic (split at <h2>), plus a
// "key points" document and an "examples" document per topic. A document holds
// the English and the Bangla text of that section together, so an English or a
// Bangla question finds it; the evidence is returned in the page language.

import { normalize } from './retrieval.ts';

export type Lang = 'en' | 'bn';
export interface Bi { en: string; bn: string | null }

export interface SectionInput {
  track: string;
  topic: string;
  section: string;
  topicTitle: Bi;
  sectionTitle: Bi;
  text: Bi;
  /** Topic keywords: weighted like titles. */
  keywords?: string[];
}

export interface SearchHit {
  id: string;
  track: string;
  topic: string;
  section: string;
  topicTitle: Bi;
  sectionTitle: Bi;
  text: Bi;
  score: number;
}

interface Doc extends SearchHit { tf: Map<string, number>; len: number; titleTokens: Set<string> }

// Common Bangla endings (ordered longest first). Stripped so "লুপের", "লুপে" and "লুপটা" all match "লুপ".
const BN_SUFFIXES = ['গুলোর', 'গুলোকে', 'গুলো', 'গুলি', 'দেরকে', 'দের', 'টার', 'টির', 'টাকে', 'টিকে', 'টা', 'টি', 'য়ের', 'য়ে', 'তে', 'কে', 'ের', 'রা', 'র', 'ে', 'য়'];
const BANGLA = /[ঀ-৿]/;

/** One word to its search form: lower case, simple English and Bangla endings removed. */
export function stem(word: string): string {
  if (BANGLA.test(word)) {
    for (const s of BN_SUFFIXES) if (word.endsWith(s) && [...word].length - [...s].length >= 2) return word.slice(0, -s.length);
    return word;
  }
  if (word.length > 5 && word.endsWith('ing')) return word.slice(0, -3);
  if (word.length > 4 && word.endsWith('ies')) return word.slice(0, -3) + 'y';
  if (word.length > 4 && word.endsWith('ed')) return word.slice(0, -2);
  if (word.length > 4 && /(ches|shes|xes|sses)$/.test(word)) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
}

export function searchTokens(text: string): string[] {
  return normalize(text).filter((t) => !/^[\d.%]+$/.test(t)).map(stem);
}

const K1 = 1.2, B = 0.75, TITLE_WEIGHT = 3;
// Question words that say nothing about the subject (after stemming).
const QUERY_STOP = new Set(['relat', 'differ', 'difference', 'between', 'explain', 'mean', 'work', 'use', 'us', 'does', 'do', 'can', 'when', 'which', 'example', 'please', 'tell', 'me', 'my', 'about', 'there', 'get', 'need', 'want', 'way', 'kivabe', 'kemne', 'kore', 'bujhi', 'na', 'কীভাবে', 'কিভাবে', 'বুঝি', 'বুঝিয়ে', 'বলো', 'করি', 'করে', 'না', 'আর', 'মানে', 'পার্থক্য']);

export class TutorialIndex {
  private readonly docs: Doc[] = [];
  private readonly df = new Map<string, number>();
  private readonly avgLen: number;

  constructor(sections: SectionInput[]) {
    for (const s of sections) {
      const tf = new Map<string, number>();
      const add = (text: string | null | undefined, weight: number) => { for (const t of searchTokens(text ?? '')) tf.set(t, (tf.get(t) ?? 0) + weight); };
      add(s.text.en, 1); add(s.text.bn, 1);
      for (const title of [s.topicTitle.en, s.topicTitle.bn, s.sectionTitle.en, s.sectionTitle.bn, ...(s.keywords ?? [])]) add(title, TITLE_WEIGHT);
      if (!tf.size) continue;
      const len = [...tf.values()].reduce((n, v) => n + v, 0);
      const titleTokens = new Set(searchTokens([s.topicTitle.en, s.topicTitle.bn ?? '', ...(s.keywords ?? [])].join(' ')));
      this.docs.push({ id: `tutorial:${s.topic}#${s.section}`, track: s.track, topic: s.topic, section: s.section, topicTitle: s.topicTitle, sectionTitle: s.sectionTitle, text: s.text, score: 0, tf, len, titleTokens });
      for (const t of tf.keys()) this.df.set(t, (this.df.get(t) ?? 0) + 1);
    }
    this.avgLen = this.docs.length ? this.docs.reduce((n, d) => n + d.len, 0) / this.docs.length : 1;
  }

  get size() { return this.docs.length; }

  /**
   * Best sections for a question. `topic` (the page the learner is on) and
   * `related` topics get a boost; `onlyTopic` restricts the search to one topic.
   */
  search(query: string, opts: { topic?: string; related?: Iterable<string>; track?: string; onlyTopic?: string; limit?: number } = {}): SearchHit[] {
    const all = [...new Set(searchTokens(query))];
    const q = all.filter((t) => !QUERY_STOP.has(t)).length ? all.filter((t) => !QUERY_STOP.has(t)) : all;
    if (!q.length) return [];
    const related = new Set(opts.related ?? []);
    const n = this.docs.length;
    const out: SearchHit[] = [];
    for (const d of this.docs) {
      if (opts.onlyTopic && d.topic !== opts.onlyTopic) continue;
      let score = 0;
      for (const t of q) {
        const f = d.tf.get(t);
        if (!f) continue;
        const df = this.df.get(t) ?? 0;
        const idf = Math.log(1 + (n - df + 0.5) / (df + 0.5));
        score += idf * (f * (K1 + 1)) / (f + K1 * (1 - B + B * (d.len / this.avgLen)));
      }
      if (score <= 0) continue;
      // A question that names the topic ("pointers and arrays") should land on that topic.
      const inTitle = q.filter((t) => d.titleTokens.has(t)).length;
      score *= 1 + 1.2 * (inTitle / q.length) ** 2;
      if (opts.topic && d.topic === opts.topic) score *= 1.6;
      else if (related.has(d.topic)) score *= 1.25;
      else if (opts.track && d.track === opts.track) score *= 1.1;
      const { tf: _tf, len: _len, titleTokens: _tt, ...hit } = d;
      out.push({ ...hit, score });
    }
    return out.sort((a, b) => b.score - a.score).slice(0, opts.limit ?? 5);
  }
}
