// Tutorials: the content-kit packages written by Codex and accepted by the checker
// (content-kit/<track>/content, C in content-kit/c-tutorial/c-tutorial), served as
// readable topic pages with runnable examples, server-graded quizzes, practice and labs.

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { randomUUID } from 'node:crypto';
// @ts-ignore: plain JavaScript module shared with the content checker
import { loadTrace, playTrace, validInput, LabError } from '../../content-kit/tools/labs.mjs';
import { AppError } from './service.ts';
import type { Store } from '../store/store.ts';
import { LANGUAGES } from './video-extras.ts';
import { getVideo } from '../content/videos.ts';
import { markdownToHtml } from './markdown.ts';

type Lang = 'en' | 'bn';
type Bi = { en: string; bn: string };
type Json = Record<string, any>;

export const TRACK_INFO: Record<string, { title: Bi; blurb: Bi; course?: string; order: number }> = {
  c: { order: 1, course: 'c-programming', title: { en: 'C Programming', bn: 'সি প্রোগ্রামিং' }, blurb: { en: 'From your first program to pointers, memory and files, with every example compiled and tested.', bn: 'প্রথম প্রোগ্রাম থেকে পয়েন্টার, মেমরি আর ফাইল পর্যন্ত; প্রতিটি উদাহরণ কম্পাইল করে পরীক্ষিত।' } },
  'data-structures': { order: 2, course: 'data-structures', title: { en: 'Data Structures', bn: 'ডেটা স্ট্রাকচার' }, blurb: { en: 'Arrays, linked lists, stacks, queues, trees, heaps, hashing and graphs in C, with step-by-step visual labs.', bn: 'সি-তে অ্যারে, লিংকড লিস্ট, স্ট্যাক, কিউ, ট্রি, হিপ, হ্যাশিং আর গ্রাফ; ধাপে ধাপে ভিজ্যুয়াল ল্যাবসহ।' } },
  algorithms: { order: 3, course: 'algorithms', title: { en: 'Algorithms', bn: 'অ্যালগরিদম' }, blurb: { en: 'Searching, sorting, greedy, divide and conquer, dynamic programming and graph algorithms, each with a simulator.', bn: 'সার্চিং, সর্টিং, গ্রিডি, ডিভাইড অ্যান্ড কনকার, ডায়নামিক প্রোগ্রামিং আর গ্রাফ অ্যালগরিদম; প্রতিটির সিমুলেটরসহ।' } },
  'oop-java': { order: 4, title: { en: 'Object-Oriented Programming in Java', bn: 'জাভায় অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিং' }, blurb: { en: 'Classes, objects, inheritance, polymorphism, interfaces and collections in modern Java.', bn: 'আধুনিক জাভায় ক্লাস, অবজেক্ট, ইনহেরিট্যান্স, পলিমরফিজম, ইন্টারফেস আর কালেকশন।' } },
  python: { order: 5, title: { en: 'Python Programming', bn: 'পাইথন প্রোগ্রামিং' }, blurb: { en: 'Idiomatic Python from zero, with "if you know C" notes along the way.', bn: 'শূন্য থেকে পাইথন, পথে পথে “সি জানলে” নোটসহ।' } },
  dbms: { order: 6, title: { en: 'Database Management Systems', bn: 'ডেটাবেস ম্যানেজমেন্ট সিস্টেম' }, blurb: { en: 'ER modelling, the relational model, SQL on MySQL, normalisation and transactions.', bn: 'ইআর মডেলিং, রিলেশনাল মডেল, MySQL-এ SQL, নরমালাইজেশন আর ট্রানজ্যাকশন।' } },
  'compiler-design': { order: 7, title: { en: 'Compiler Design', bn: 'কম্পাইলার ডিজাইন' }, blurb: { en: 'Lexing, parsing, semantic analysis and code generation, with working implementations.', bn: 'লেক্সিং, পার্সিং, সেমান্টিক অ্যানালাইসিস আর কোড জেনারেশন; চলমান ইমপ্লিমেন্টেশনসহ।' } },
  'machine-learning': { order: 8, course: 'machine-learning', title: { en: 'Machine Learning from Zero', bn: 'শূন্য থেকে মেশিন লার্নিং' }, blurb: { en: 'Starts with stories a child can follow and ends with neural networks, with interactive labs for every method.', bn: 'শিশুও বুঝবে এমন গল্প দিয়ে শুরু, নিউরাল নেটওয়ার্কে শেষ; প্রতিটি পদ্ধতির ইন্টারঅ্যাকটিভ ল্যাবসহ।' } },
};

interface Topic {
  id: string; track: string; module: string; dir: string; custom?: boolean;
  json: Json; bodyEn: string; bodyBn: string | null;
  examples: { id: string; title: string; language: string; code: string; output: string | null; stdin: string; runnable: boolean; explanationHtml: string; tryNow: boolean; outputNote?: string; demonstrates?: string }[];
  text: string;
}
interface Track { id: string; root: string; curriculum: Json; manifest: Json; language: string; topics: Map<string, Topic>; order: string[]; custom?: boolean }

/** A track started from the admin site. */
export interface CustomTrackDef { id: string; title: Bi; blurb: Bi; language: string; course?: string | null; modules: { id: string; title: Bi }[] }
/** A topic written in the admin site (Markdown text, examples with their output, multiple-choice quiz). */
export interface CustomTopicDef {
  id: string; track: string; module: string; title: Bi; summary: Bi; level: string; minutes: number;
  body: Bi; examples: { title: string; language: string; code: string; output: string }[];
  quiz: { prompt: string; options: string[]; answer: number; explanation: string }[];
}

// ── HTML safety: content already passed the checker's tag whitelist; this is a second fence ──
const TAGS = new Set(['h2', 'h3', 'h4', 'p', 'br', 'hr', 'ul', 'ol', 'li', 'strong', 'em', 'code', 'pre', 'kbd', 'dfn', 'abbr', 'sup', 'sub', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'caption', 'blockquote', 'a', 'figure', 'figcaption', 'img', 'div', 'span']);
const ATTRS = new Set(['id', 'class', 'start', 'title', 'scope', 'colspan', 'rowspan', 'href', 'src', 'alt', 'width', 'height', 'data-example', 'data-lab']);
export function cleanHtml(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|iframe|object|embed|svg|math|form|input|button|textarea|select)\b[\s\S]*?<\/\1\s*>/gi, '')
    .replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, (m, tag: string, attrs: string) => {
      const t = tag.toLowerCase();
      if (!TAGS.has(t)) return '';
      if (m.startsWith('</')) return `</${t}>`;
      const kept: string[] = [];
      for (const a of attrs.matchAll(/([a-zA-Z-]+)\s*=\s*("([^"]*)"|'([^']*)')/g)) {
        const name = a[1]!.toLowerCase();
        const value = a[3] ?? a[4] ?? '';
        if (!ATTRS.has(name)) continue;
        if (name === 'href' && !/^(https:\/\/|topic:|#)/.test(value)) continue;
        if (name === 'src' && !/^assets\/[a-z0-9-]+\.(svg|png|webp)$/.test(value)) continue;
        kept.push(`${name}="${value.replace(/"/g, '&quot;')}"`);
      }
      return `<${t}${kept.length ? ' ' + kept.join(' ') : ''}${m.endsWith('/>') ? ' /' : ''}>`;
    });
}
const textOf = (html: string) => html.replace(/<pre[\s\S]*?<\/pre>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&[a-zA-Z#0-9]+;/g, ' ').replace(/\s+/g, ' ').trim();

const readText = (f: string) => (existsSync(f) ? readFileSync(f, 'utf8') : null);
const readJsonFile = (f: string): Json | null => { try { return JSON.parse(readFileSync(f, 'utf8')); } catch { return null; } };
const pick = <T extends Json>(o: T | undefined, lang: Lang): string => (o ? (o[lang] || o.en || '') : '');
const TRY_NOW: Record<string, string> = { c: LANGUAGES.c.url, python: LANGUAGES.python.url, java: LANGUAGES.java.url };
/** Languages the in-page runner accepts. SQL needs a MySQL setup and package-using Python needs numpy etc., so those keep "Try now". */
export const RUN_LANGS = new Set(['c', 'cpp', 'java', 'python']);
const canRun = (language: string, e: Json) => RUN_LANGS.has(language) && !(Array.isArray(e.requires) && e.requires.length) && e.runMode !== 'compile-only' && !e.setup;

export class TutorialService {
  private tracks = new Map<string, Track>();
  private topicTrack = new Map<string, string>(); // planned topic id → track (also for topics not delivered yet)
  private traces = new Map<string, (input: unknown) => unknown>();

  private store: Store;
  private kitDir: string;
  private hidden = new Set<string>();
  private labCache = new Map<string, Json | null>();

  constructor(store: Store, kitDir: string) {
    this.store = store;
    this.kitDir = kitDir;
    this.load();
  }

  private load() {
    if (!existsSync(this.kitDir)) return;
    for (const d of readdirSync(this.kitDir)) {
      const specFile = join(this.kitDir, d, 'spec', 'curriculum.json');
      if (!existsSync(specFile)) continue;
      const curriculum = readJsonFile(specFile);
      if (!curriculum) continue;
      const id = d === 'c-tutorial' ? 'c' : String(curriculum.track ?? d);
      for (const m of curriculum.modules ?? []) for (const t of m.topics ?? []) this.topicTrack.set(t.id, id);
      const root = join(this.kitDir, d, d === 'c-tutorial' ? 'c-tutorial' : 'content');
      const manifest = readJsonFile(join(root, 'manifest.json'));
      if (!manifest || !Array.isArray(manifest.modules)) continue;
      const track: Track = { id, root, curriculum, manifest, language: curriculum.language ?? 'c', topics: new Map(), order: [] };
      for (const mm of manifest.modules) {
        for (const tid of mm.topics ?? []) {
          try {
            const topic = this.loadTopic(track, mm.id, tid);
            if (topic) { track.topics.set(tid, topic); track.order.push(tid); }
          } catch (e) { console.warn(`tutorials: skipped ${id}/${tid}: ${(e as Error).message}`); }
        }
      }
      if (track.topics.size) this.tracks.set(id, track);
    }
  }

  private loadTopic(track: Track, moduleId: string, tid: string): Topic | null {
    const dir = join(track.root, 'topics', moduleId, tid);
    const json = readJsonFile(join(dir, 'topic.json'));
    const bodyEn = readText(join(dir, 'body.en.html'));
    if (!json || !bodyEn) return null;
    const bodyBn = readText(join(dir, 'body.bn.html'));
    const examples = (json.examples ?? []).map((e: Json) => ({
      id: String(e.id), title: String(e.title ?? ''), language: String(e.language ?? track.language),
      code: readText(join(dir, String(e.file ?? ''))) ?? '',
      output: e.output ? readText(join(dir, String(e.output))) : null,
      stdin: e.stdin ? readText(join(dir, String(e.stdin))) ?? '' : '',
      runnable: canRun(String(e.language ?? track.language), e),
      explanationHtml: cleanHtml(String(e.explanationHtml ?? '')),
      tryNow: Boolean(e.tryNow) && Boolean(TRY_NOW[String(e.language ?? track.language)]),
      outputNote: e.outputNote, demonstrates: e.demonstrates,
    }));
    return { id: tid, track: track.id, module: moduleId, dir, json, bodyEn: cleanHtml(bodyEn), bodyBn: bodyBn ? cleanHtml(bodyBn) : null, examples, text: textOf(bodyEn) };
  }

  // ── admin: hidden tracks, admin-written topics and tracks ──
  setHiddenTracks(ids: string[]) { this.hidden = new Set(ids); }
  isHidden(id: string) { return this.hidden.has(id); }

  /** Replaces every admin-added track and topic with the given ones. */
  applyCustom(tracks: CustomTrackDef[], topics: CustomTopicDef[]) {
    for (const [id, t] of [...this.tracks]) if (t.custom) { this.tracks.delete(id); delete TRACK_INFO[id]; }
    for (const t of this.tracks.values()) {
      for (const m of t.curriculum.modules ?? []) m.topics = (m.topics ?? []).filter((pt: Json) => !pt.custom);
      for (const [id, x] of [...t.topics]) if (x.custom) { t.topics.delete(id); this.topicTrack.delete(id); }
      t.order = t.order.filter((id) => t.topics.has(id));
    }
    tracks.forEach((d, i) => {
      if (this.tracks.has(d.id) || TRACK_INFO[d.id]) return; // never replace a Codex track
      TRACK_INFO[d.id] = { order: 100 + i, course: d.course ?? undefined, title: d.title, blurb: d.blurb };
      this.tracks.set(d.id, { id: d.id, root: '', custom: true, manifest: { packageVersion: null }, language: d.language || 'c', topics: new Map(), order: [],
        curriculum: { title: d.title.en, modules: d.modules.map((m) => ({ id: m.id, title: m.title, summary: { en: '', bn: '' }, topics: [] })) } });
    });
    for (const d of topics) {
      const t = this.tracks.get(d.track);
      const m = t?.curriculum.modules.find((mm: Json) => mm.id === d.module);
      if (!t || !m || t.topics.has(d.id) || this.topicTrack.has(d.id)) continue;
      // Examples are shown where the text has a slot for them; admin topics put them after the text.
      const slots = d.examples.map((_e, i) => `<div data-example="ex-${i + 1}"></div>`).join('');
      const bodyEn = cleanHtml(markdownToHtml(d.body.en) + slots);
      const bodyBn = d.body.bn?.trim() ? cleanHtml(markdownToHtml(d.body.bn) + slots) : null;
      const json: Json = {
        id: d.id, title: d.title, summary: d.summary, level: d.level, kind: 'lesson', estMinutes: d.minutes, labs: [], practice: [], keyPoints: [], examQuestions: [], videos: [], references: [],
        quiz: d.quiz.map((q, i) => ({ id: `q-${i + 1}`, type: 'mcq', difficulty: 'medium', prompt: q.prompt, options: q.options, answer: q.answer, explanation: q.explanation })),
      };
      t.topics.set(d.id, {
        id: d.id, track: t.id, module: d.module, dir: '', custom: true, json, bodyEn, bodyBn, text: textOf(bodyEn),
        examples: d.examples.map((e, i) => ({ id: `ex-${i + 1}`, title: e.title, language: e.language || t.language, code: e.code, output: e.output || null, stdin: '', runnable: RUN_LANGS.has(e.language || t.language), explanationHtml: '', tryNow: Boolean(TRY_NOW[e.language || t.language]) })),
      });
      m.topics.push({ id: d.id, title: d.title.en, level: d.level, kind: 'lesson', custom: true });
      this.topicTrack.set(d.id, t.id);
    }
    for (const t of this.tracks.values()) {
      const inCurriculum = (t.curriculum.modules ?? []).flatMap((m: Json) => (m.topics ?? []).map((pt: Json) => pt.id)).filter((id: string) => t.topics.has(id));
      const rest = t.order.filter((id) => !inCurriculum.includes(id));
      t.order = [...inCurriculum, ...rest];
    }
  }

  /** Every track with its modules, hidden ones included (admin site). */
  adminTracks() {
    return Object.keys(TRACK_INFO).map((id) => {
      const t = this.tracks.get(id);
      const info = TRACK_INFO[id]!;
      const topics = t ? [...t.topics.values()] : [];
      return {
        id, title: info.title.en, order: info.order, custom: Boolean(t?.custom), hidden: this.hidden.has(id), language: t?.language ?? null,
        delivered: topics.length, planned: t ? t.curriculum.modules.reduce((n: number, m: Json) => n + (m.topics ?? []).length, 0) : this.plannedCount(id),
        labs: topics.reduce((n, x) => n + (x.json.labs?.length ?? 0), 0), bangla: topics.filter((x) => x.bodyBn).length, customTopics: topics.filter((x) => x.custom).length,
        modules: (t?.curriculum.modules ?? []).map((m: Json) => ({ id: m.id, title: pick(m.title, 'en'), topics: (m.topics ?? []).length })),
      };
    }).sort((a, b) => a.order - b.order);
  }

  /** Every lab of a track, grouped by topic in course order (homepage Labs tab). */
  labIndex(trackId: string, lang: Lang) {
    const t = this.tracks.get(trackId);
    if (!t || this.hidden.has(trackId)) throw new AppError('not_found', 404, 'No such track.');
    const topics: { id: string; title: string; module: string; labs: { id: string; title: string; summary: string; kind: string }[] }[] = [];
    for (const id of t.order) {
      const x = t.topics.get(id)!;
      const ids: string[] = x.json.labs ?? [];
      if (!ids.length) continue;
      const module = t.curriculum.modules.find((m: Json) => m.id === x.module);
      topics.push({
        id, title: pick(x.json.title, lang), module: pick(module?.title, lang),
        labs: ids.map((lid) => {
          const key = join(x.dir, 'labs', lid);
          if (!this.labCache.has(key)) this.labCache.set(key, readJsonFile(join(key, 'lab.json')));
          const lab = this.labCache.get(key);
          return lab ? { id: lid, title: pick(lab.title, lang), summary: pick(lab.summary, lang), kind: String(lab.kind) } : null;
        }).filter(Boolean) as { id: string; title: string; summary: string; kind: string }[],
      });
    }
    return { track: { id: t.id, title: TRACK_INFO[t.id]?.title[lang] ?? t.id }, labs: topics.reduce((n, x) => n + x.labs.length, 0), topics };
  }

  // ── catalogue ──
  list(lang: Lang) {
    const all = Object.keys(TRACK_INFO).filter((id) => !this.hidden.has(id)).map((id) => {
      const info = TRACK_INFO[id]!;
      const t = this.tracks.get(id);
      const planned = t ? t.curriculum.modules.reduce((n: number, m: Json) => n + m.topics.length, 0) : this.plannedCount(id);
      const labs = t ? [...t.topics.values()].reduce((n, x) => n + (x.json.labs?.length ?? 0), 0) : 0;
      return { id, title: info.title[lang], blurb: info.blurb[lang], course: info.course ?? null, language: t?.language ?? null, delivered: t?.topics.size ?? 0, planned, labs, order: info.order, available: Boolean(t?.topics.size) };
    });
    return { tracks: all.sort((a, b) => a.order - b.order), totals: { topics: all.reduce((n, x) => n + x.delivered, 0), labs: all.reduce((n, x) => n + x.labs, 0) } };
  }

  private plannedCount(id: string) { let n = 0; for (const tr of this.topicTrack.values()) if (tr === id) n++; return n; }

  track(id: string, lang: Lang) {
    const t = this.hidden.has(id) ? undefined : this.tracks.get(id);
    const info = TRACK_INFO[id];
    if (!t || !info || !t.topics.size) throw new AppError('not_found', 404, lang === 'bn' ? 'এই টিউটোরিয়াল এখনো আসেনি।' : 'This tutorial is not available yet.');
    return {
      id, title: info.title[lang], blurb: info.blurb[lang], course: info.course ?? null, language: t.language,
      delivered: t.topics.size, version: t.manifest.packageVersion ?? null,
      modules: t.curriculum.modules.map((m: Json) => ({
        id: m.id, title: pick(m.title, lang), summary: pick(m.summary, lang),
        topics: m.topics.map((pt: Json) => {
          const x = t.topics.get(pt.id);
          return { id: pt.id, title: x ? pick(x.json.title, lang) : pt.title, level: pt.level, kind: pt.kind ?? 'lesson', available: Boolean(x), labs: x?.json.labs?.length ?? pt.labs?.length ?? 0, minutes: x?.json.estMinutes ?? null };
        }),
      })),
    };
  }

  private topicOr404(trackId: string, topicId: string, lang: Lang): { t: Track; x: Topic } {
    const t = this.hidden.has(trackId) ? undefined : this.tracks.get(trackId);
    const x = t?.topics.get(topicId);
    if (!t || !x) throw new AppError('not_found', 404, lang === 'bn' ? 'এই টপিক এখনো আসেনি।' : 'This topic is not available yet.');
    return { t, x };
  }

  topic(trackId: string, topicId: string, lang: Lang) {
    const { t, x } = this.topicOr404(trackId, topicId, lang);
    const j = x.json;
    const useBn = lang === 'bn' && Boolean(x.bodyBn);
    const i = t.order.indexOf(topicId);
    const nav = (id: string | undefined) => (id ? { id, title: pick(t.topics.get(id)!.json.title, lang) } : null);
    const module = t.curriculum.modules.find((m: Json) => m.id === x.module);
    const linkIds = new Set<string>([...(x.bodyEn + (x.bodyBn ?? '')).matchAll(/href="topic:([a-z0-9-]+)/g)].map((m) => m[1]!));
    for (const id of [...(j.prerequisites ?? []), ...(j.related ?? [])]) linkIds.add(id);
    const links = Object.fromEntries([...linkIds].map((id) => {
      const tr = this.topicTrack.get(id);
      const tt = tr ? this.tracks.get(tr)?.topics.get(id) : undefined;
      return [id, { track: tr ?? null, available: Boolean(tt), title: tt ? pick(tt.json.title, lang) : id }];
    }));
    return {
      track: { id: t.id, title: TRACK_INFO[t.id]?.title[lang] ?? t.curriculum.title, language: t.language },
      module: { id: x.module, title: pick(module?.title, lang) },
      topic: {
        id: x.id, title: pick(j.title, lang), summary: pick(j.summary, lang), level: j.level, kind: j.kind ?? 'lesson', minutes: j.estMinutes,
        standards: j.standards ?? null, sections: j.sections ?? [], bodyLang: useBn ? 'bn' : 'en', hasBangla: Boolean(x.bodyBn),
        bodyHtml: useBn ? x.bodyBn : x.bodyEn,
      },
      examples: x.examples.map((e) => ({ ...e, tryNowUrl: e.tryNow ? TRY_NOW[e.language] : null })),
      labs: (j.labs ?? []) as string[],
      quiz: (j.quiz ?? []).map((q: Json) => ({ id: q.id, type: q.type, difficulty: q.difficulty, prompt: q.prompt, options: q.options, code: q.code ?? null, language: q.language ?? t.language, figure: q.figure ?? null })),
      practice: (j.practice ?? []).map((p: Json) => ({ ...this.practiceSample(x, p, t.language), id: p.id, title: p.title, difficulty: p.difficulty, type: p.type ?? 'code', statementHtml: cleanHtml(String(p.statementHtml ?? '')), hints: (p.hints ?? []).map((h: unknown) => (typeof h === 'string' ? h : pick(h as Json, lang))), figure: p.figure ?? null })),
      keyPoints: (j.keyPoints ?? []).map((k: Json) => pick(k, lang)),
      examQuestions: (j.examQuestions ?? []).map((q: Json) => ({ question: q.question, type: q.type, marks: q.marks ?? null, answerHtml: cleanHtml(String(q.answerHtml ?? '')), figure: q.figure ?? null })),
      videos: (j.videos ?? []).map((v: Json) => { const vid = getVideo(String(v.videoId)); return vid ? { videoId: vid.id, title: vid.title, note: v.note ?? null } : null; }).filter(Boolean),
      references: (j.references ?? []).filter((r: Json) => typeof r.url === 'string' && r.url.startsWith('https://')).map((r: Json) => ({ title: r.title ?? r.url, url: r.url })),
      links,
      prev: nav(t.order[i - 1]), next: nav(t.order[i + 1]),
    };
  }

  /** Grade one server-selected adaptive question; never trust a client answer key. */
  gradeAnswer(trackId: string, topicId: string, id: string, choice: unknown, lang: Lang) {
    const { x } = this.topicOr404(trackId, topicId, lang);
    const q = (x.json.quiz ?? []).find((q: Json) => q.id === id);
    if (!q || !Number.isInteger(choice) || Number(choice) < 0 || Number(choice) >= q.options.length) throw new AppError('bad_input', 400, lang === 'bn' ? 'একটি উত্তর বেছে নাও।' : 'Choose an answer.');
    return { correct: choice === q.answer, answer: q.answer, explanation: String(q.explanation ?? '') };
  }

  async gradeQuiz(trackId: string, topicId: string, learnerId: string, answers: unknown, lang: Lang) {
    const { x } = this.topicOr404(trackId, topicId, lang);
    const given = (answers && typeof answers === 'object' ? answers : {}) as Record<string, unknown>;
    const results: Record<string, { chosen: number | null; correct: boolean; answer: number; explanation: string }> = {};
    let score = 0, answered = 0;
    const correctById: Record<string, boolean> = {};
    for (const q of x.json.quiz ?? []) {
      const c = given[q.id];
      const chosen = Number.isInteger(c) ? Number(c) : null;
      if (chosen === null) continue;
      answered++;
      const correct = chosen === q.answer;
      if (correct) score++;
      correctById[q.id] = correct;
      results[q.id] = { chosen, correct, answer: q.answer, explanation: String(q.explanation ?? '') };
    }
    if (answered) await this.store.addReadingEvents([{ id: randomUUID(), learnerId, lessonId: `tutorial:${trackId}:${topicId}`, blockId: null, type: 'quiz', payload: { score, answered, total: (x.json.quiz ?? []).length, correct: correctById }, at: new Date().toISOString() }]);
    return { score, answered, total: (x.json.quiz ?? []).length, results };
  }

  /** A learner opened a topic, or ran one of its labs (for their instructor's class view). */
  async recordActivity(learnerId: string, body: Json) {
    const kind = body?.kind === 'lab' ? 'lab' : 'view';
    const { x } = this.topicOr404(String(body?.track ?? ''), String(body?.topic ?? ''), 'en');
    const lab = kind === 'lab' ? String(body?.lab ?? '') : null;
    if (lab && !(x.json.labs ?? []).includes(lab)) throw new AppError('not_found', 404, 'No such lab.');
    const lessonId = `tutorial:${x.track}:${x.id}`;
    const recent = (await this.store.readingEvents(learnerId)).slice(-50);
    const type = kind === 'lab' ? 'lab_check' : 'view';
    if (recent.some((e) => e.type === type && e.lessonId === lessonId && (!lab || e.payload.lab === lab) && Date.now() - Date.parse(e.at) < 3_600_000)) return { ok: true, repeat: true };
    await this.store.addReadingEvents([{ id: randomUUID(), learnerId, lessonId, blockId: lab, type, payload: lab ? { lab } : {}, at: new Date().toISOString() }]);
    return { ok: true };
  }

  solution(trackId: string, topicId: string, practiceId: string, lang: Lang) {
    const { t, x } = this.topicOr404(trackId, topicId, lang);
    const p = (x.json.practice ?? []).find((q: Json) => q.id === practiceId);
    if (!p) throw new AppError('not_found', 404, 'No such practice problem.');
    if ((p.type ?? 'code') === 'written') return { type: 'written', answerHtml: cleanHtml(String(p.answerHtml ?? '')) };
    const language = String(p.language ?? t.language);
    const tests = (p.tests ?? []).slice(0, 3).map((tc: Json) => ({ stdin: tc.stdin ? readText(join(x.dir, String(tc.stdin))) : '', output: readText(join(x.dir, String(tc.output ?? ''))) ?? '' }));
    return { type: 'code', language, code: readText(join(x.dir, String(p.solution ?? ''))) ?? '', tests, tryNowUrl: TRY_NOW[language] ?? null };
  }

  /** First test of a code practice problem, so students can check their own program against it. */
  private practiceSample(x: Topic, p: Json, trackLanguage: string) {
    if ((p.type ?? 'code') === 'written') return { language: null, runnable: false, sample: null };
    const language = String(p.language ?? trackLanguage);
    const tc = (p.tests ?? [])[0];
    const sample = tc ? { stdin: tc.stdin ? readText(join(x.dir, String(tc.stdin))) ?? '' : '', output: readText(join(x.dir, String(tc.output ?? ''))) ?? '' } : null;
    return { language, runnable: canRun(language, p), sample };
  }

  /** The stored program, input and output for an example, used to answer an unchanged run without the sandbox. */
  verifiedExample(trackId: string, topicId: string, exampleId: string) {
    const x = this.tracks.get(trackId)?.topics.get(topicId);
    const e = x?.examples.find((ex) => ex.id === exampleId);
    return e && e.output !== null ? { language: e.language, code: e.code, stdin: e.stdin, output: e.output } : null;
  }

  /** Every delivered topic, for the sitemap and site search. */
  allTopics(lang: Lang) {
    const out: { track: string; trackTitle: string; topic: string; title: string; summary: string; keywords: string[]; level: string }[] = [];
    for (const t of this.tracks.values()) {
      if (this.hidden.has(t.id)) continue;
      for (const id of t.order) {
        const x = t.topics.get(id)!;
        out.push({ track: t.id, trackTitle: TRACK_INFO[t.id]?.title[lang] ?? t.id, topic: id, title: pick(x.json.title, lang), summary: pick(x.json.summary, lang), keywords: x.json.keywords ?? [], level: x.json.level });
      }
    }
    return out;
  }

  /** Visible track ids (sitemap). */
  trackIds() { return [...this.tracks.keys()].filter((id) => !this.hidden.has(id)); }

  /** Title and description for a track or topic page (SEO). */
  pageInfo(trackId: string, topicId: string | null, lang: Lang) {
    const t = this.tracks.get(trackId);
    if (!t || this.hidden.has(trackId)) return null;
    const trackTitle = TRACK_INFO[trackId]?.title[lang] ?? trackId;
    if (!topicId) return { title: `${trackTitle} tutorial`, description: TRACK_INFO[trackId]?.blurb[lang] ?? '', trackTitle, topicTitle: null, keywords: [] as string[] };
    const x = t.topics.get(topicId);
    if (!x) return null;
    return { title: pick(x.json.title, lang), description: pick(x.json.summary, lang), trackTitle, topicTitle: pick(x.json.title, lang), keywords: (x.json.keywords ?? []) as string[] };
  }

  /** Every lab across tracks (site search). */
  allLabs(lang: Lang) {
    const out: { track: string; topic: string; topicTitle: string; id: string; title: string; summary: string }[] = [];
    for (const id of this.trackIds()) {
      for (const tp of this.labIndex(id, lang).topics) for (const lab of tp.labs) out.push({ track: id, topic: tp.id, topicTitle: tp.title, id: lab.id, title: lab.title, summary: lab.summary });
    }
    return out;
  }

  /** Title, keyword and summary search over every delivered topic. */
  search(q: string, lang: Lang) {
    const words = q.toLowerCase().normalize('NFKC').split(/[^a-z0-9+#\u0980-\u09ff]+/).filter((w) => w.length >= 2).slice(0, 8);
    if (!words.length) return { q, results: [] };
    const results: { track: string; trackTitle: string; topic: string; title: string; summary: string; level: string; score: number }[] = [];
    for (const t of this.tracks.values()) for (const x of t.topics.values()) {
      if (this.hidden.has(t.id)) continue;
      const title = `${x.json.title?.en ?? ''} ${x.json.title?.bn ?? ''}`.toLowerCase();
      const keys = (x.json.keywords ?? []).join(' ').toLowerCase();
      const summary = `${x.json.summary?.en ?? ''} ${x.json.summary?.bn ?? ''}`.toLowerCase();
      let score = 0;
      for (const w of words) score += (title.includes(w) ? 6 : 0) + (keys.includes(w) ? 3 : 0) + (summary.includes(w) ? 1 : 0);
      if (score >= words.length * 2) results.push({ track: t.id, trackTitle: TRACK_INFO[t.id]?.title[lang] ?? t.id, topic: x.id, title: pick(x.json.title, lang), summary: pick(x.json.summary, lang), level: x.json.level, score });
    }
    results.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
    return { q, results: results.slice(0, 30).map(({ score: _s, ...r }) => r) };
  }

  // ── labs ──
  private labDir(trackId: string, topicId: string, labId: string, lang: Lang) {
    const { x } = this.topicOr404(trackId, topicId, lang);
    if (!(x.json.labs ?? []).includes(labId)) throw new AppError('not_found', 404, 'No such lab.');
    return join(x.dir, 'labs', labId);
  }

  lab(trackId: string, topicId: string, labId: string, lang: Lang) {
    const lab = readJsonFile(join(this.labDir(trackId, topicId, labId, lang), 'lab.json'));
    if (!lab) throw new AppError('not_found', 404, 'No such lab.');
    return { id: lab.id, kind: lab.kind, title: pick(lab.title, lang), summary: pick(lab.summary, lang), pseudocode: lab.pseudocode ?? [], inputs: lab.inputs ?? [], presets: lab.presets ?? [], complexity: lab.complexity ?? null, codeExample: lab.codeExample ?? null };
  }

  runLab(trackId: string, topicId: string, labId: string, input: unknown, lang: Lang) {
    const dir = this.labDir(trackId, topicId, labId, lang);
    const lab = readJsonFile(join(dir, 'lab.json'));
    if (!lab) throw new AppError('not_found', 404, 'No such lab.');
    const bad = validInput(lab.inputs ?? [], input);
    if (bad) throw new AppError('bad_input', 400, bad);
    let trace = this.traces.get(dir);
    if (!trace) { trace = loadTrace(readFileSync(join(dir, 'trace.js'), 'utf8')) as (input: unknown) => unknown; this.traces.set(dir, trace); }
    try {
      const result = trace(input) as { init: unknown; steps: unknown[] };
      playTrace(lab.kind, result, { lines: (lab.pseudocode ?? []).length }); // validates every step
      return { kind: lab.kind, init: result.init, steps: result.steps };
    } catch (e) {
      if (e instanceof LabError) throw new AppError('lab_error', 422, `This input made the lab fail: ${(e as Error).message}`);
      throw new AppError('lab_error', 422, lang === 'bn' ? 'এই ইনপুটে ল্যাবটি চলেনি। অন্য ইনপুট দাও।' : 'The lab could not run this input. Try a different one.');
    }
  }

  /** File path of an image inside a topic's assets/ folder, or null. */
  assetPath(trackId: string, topicId: string, file: string): string | null {
    const x = this.tracks.get(trackId)?.topics.get(topicId);
    if (!x || !/^[a-z0-9-]+\.(svg|png|webp)$/.test(file)) return null;
    const p = resolve(x.dir, 'assets', file);
    if (!p.startsWith(resolve(x.dir, 'assets') + sep)) return null;
    try { return statSync(p).isFile() ? p : null; } catch { return null; }
  }

  /** Context for the Ask AI chat on a topic page: the sections that best match the question. */
  chatContext(trackId: string, topicId: string, question: string) {
    const x = this.tracks.get(trackId)?.topics.get(topicId);
    if (!x) return null;
    const sections = x.bodyEn.split(/(?=<h2\b)/).map((h) => ({ id: /<h2[^>]*id="([^"]+)"/.exec(h)?.[1] ?? 'intro', title: textOf(/<h2[^>]*>([\s\S]*?)<\/h2>/.exec(h)?.[1] ?? ''), text: textOf(h) })).filter((s) => s.text.length > 40);
    const words = new Set(question.toLowerCase().split(/[^a-z0-9ঀ-৿]+/).filter((w) => w.length > 2));
    const scored = sections.map((s, i) => ({ s, i, score: [...words].filter((w) => s.text.toLowerCase().includes(w)).length + (i === 0 ? 0.5 : 0) }));
    const best = scored.sort((a, b) => b.score - a.score || a.i - b.i).slice(0, 3).sort((a, b) => a.i - b.i);
    const title = pick(x.json.title, 'en');
    return {
      title, track: x.track,
      evidence: best.map(({ s }) => ({ id: `tutorial:${x.id}#${s.id}`, title: `${title}: ${s.title}`, location: `${TRACK_INFO[x.track]?.title.en ?? x.track} tutorial`, text: s.text.slice(0, 1500) })),
    };
  }
}
