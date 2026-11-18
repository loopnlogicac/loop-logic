// Personalised reading and select-to-understand help.
// Facts never change: only reviewed paragraph versions are chosen, and every
// AI answer must cite library passages and pass the validator, or the learner
// gets the reviewed passage instead.

import { randomUUID } from 'node:crypto';
import { AppError } from '../app/service.ts';
import type { Bi, Lang } from '../content/pricing-pack.ts';
import { getLesson, PREREQ_CHECKS, type Lesson, type LessonBlock, type ReadLevel } from '../content/lessons.ts';
import { GLOSSARY, getPassage, glossarySubject, type Passage } from '../content/library.ts';
import { getLab } from '../content/labs.ts';
import { optionOrder } from '../core/options.ts';
import { extractNumbers, SYSTEM_RULES, validateAnswer } from '../ai/validator.ts';
import type { AiGateway } from '../ai/gateway.ts';
import { searchLocal } from '../library/retrieval.ts';
import type { LiveSearch } from '../library/live.ts';
import type { ReadingEventRow, Store } from '../store/store.ts';
import { applySignal, defaultProfile, normalizeProfile, type ReadingProfile, type ReadingSignal, type Subject } from './profile.ts';

export type HelpAction = 'understand' | 'search' | 'quiz' | 'ask';
export type SelectionType = 'term' | 'formula' | 'example' | 'concept';

export interface HelpInput {
  lessonId: string;
  blockId: string;
  text?: string;
  action: HelpAction;
  lang: Lang;
  prereqAnswer?: number;
  skipPrereq?: boolean;
  depth?: 'enough' | 'full';
  variant?: 'simpler' | 'example' | 'more';
  latest?: boolean;
  question?: string;
}

interface SourceRef {
  id: string;
  title: string;
  location: string;
  reviewed: boolean;
  live: boolean;
  url?: string;
  retrievedAt?: string;
}

const wordsOf = (s: string) => s.split(/\s+/).filter(Boolean).length;
const firstSentence = (s: string) => (s.match(/^.*?[.!?।](\s|$)/)?.[0] ?? s).trim();
const sourceOf = (p: Passage): SourceRef => ({ id: p.id, title: p.sourceTitle, location: p.location, reviewed: p.reviewed, live: false });

/** Display order of a block's quiz options (correct answer is not always first). */
export const quizOrder = (lessonId: string, block: LessonBlock) => optionOrder(`quiz:${lessonId}:${block.id}`, block.quiz?.options.length ?? 0);
/** Display order of a prerequisite check's options; "Not sure" stays last. */
export const prereqOrder = (concept: string) => optionOrder(`prereq:${concept}`, PREREQ_CHECKS[concept]?.options.length ?? 0, 1);

export class ReadingService {
  private readonly store: Store;
  private readonly gateway: AiGateway;
  private readonly live: LiveSearch;
  private readonly dailyAiLimit: number;
  private readonly answerCache = new Map<string, { text: string; sources: SourceRef[] }>();
  private readonly budget = new Map<string, { day: string; count: number }>();

  constructor(store: Store, gateway: AiGateway, live: LiveSearch, options: { dailyAiLimit?: number } = {}) {
    this.store = store;
    this.gateway = gateway;
    this.live = live;
    this.dailyAiLimit = options.dailyAiLimit ?? 10;
  }

  // ── profile ────────────────────────────────────────────────────────────

  async profile(learnerId: string): Promise<ReadingProfile> {
    const raw = (await this.store.getProfile(learnerId)) as ReadingProfile | undefined;
    return normalizeProfile(raw);
  }

  private async signal(learnerId: string, signals: ReadingSignal[]): Promise<ReadingProfile> {
    let p = await this.profile(learnerId);
    for (const s of signals) p = applySignal(p, s);
    await this.store.saveProfile(learnerId, p as unknown as Record<string, unknown>);
    return p;
  }

  private summary(p: ReadingProfile, lang: Lang) {
    return {
      enabled: p.enabled,
      level: p.level,
      detail: p.detail,
      display: p.display,
      termHelp: p.termHelp,
      whyTailored: p.reasons.slice(-5).reverse().map((r) => r.text[lang]),
      suggestions: p.suggestions.map((s) => ({ id: s.id, text: s.text[lang], apply: s.apply })),
      rulesVersion: p.version,
    };
  }

  // ── lessons ────────────────────────────────────────────────────────────

  private lessonOr404(lessonId: string): Lesson {
    const lesson = getLesson(lessonId);
    if (!lesson) throw new AppError('not_found', 404, 'Lesson not found');
    return lesson;
  }

  private blockOr400(lesson: Lesson, blockId: string): LessonBlock {
    const block = lesson.blocks.find((b) => b.id === blockId);
    if (!block) throw new AppError('bad_block', 400, 'Unknown paragraph');
    return block;
  }

  async getLesson(lessonId: string, learnerId: string, opts: { lang: Lang; original?: boolean }) {
    const lesson = this.lessonOr404(lessonId);
    const p = await this.profile(learnerId);
    const personalised = p.enabled && !opts.original;
    const lang = opts.lang;
    const level: ReadLevel = personalised ? p.level[lesson.subject] : 2;
    const lab = getLab(lesson.id);
    return {
      id: lesson.id,
      subject: lesson.subject,
      title: lesson.title[lang],
      summary: lesson.summary[lang],
      personalised,
      level,
      videos: (lesson.videos ?? []).map((v) => ({ ...v, url: `https://www.youtube.com/watch?v=${encodeURIComponent(v.id)}` })),
      lab: lab ? { title: lab.title[lang], minutes: lab.minutes, kind: lab.kind } : null,
      blocks: lesson.blocks.map((b) => {
        const isText = b.type === 'text';
        const text = (isText ? b.text[level] : b.text[2])[lang];
        const terms =
          personalised && p.termHelp[lesson.subject] && isText
            ? GLOSSARY.filter((g) => glossarySubject(g) === lesson.subject && text.toLowerCase().includes(g.term[lang].toLowerCase())).map((g) => ({ match: g.term[lang], definition: g.definition[lang] }))
            : [];
        return {
          id: b.id,
          type: b.type,
          text,
          personalised: isText && personalised && level !== 2,
          extraExample: personalised && b.extraExample && b.concepts.some((c) => p.weakConcepts.includes(c)) ? b.extraExample[lang] : null,
          terms,
          interactive: b.interactive ?? null,
          hasQuiz: Boolean(b.quiz),
        };
      }),
      profile: this.summary(p, lang),
    };
  }

  // ── reading events → profile ───────────────────────────────────────────

  async recordEvents(learnerId: string, raw: unknown) {
    if (!Array.isArray(raw)) throw new AppError('bad_events', 400, 'events must be a list');
    const now = new Date().toISOString();
    const allowed = new Set(['view', 'active_time', 'scroll_back', 'zoom', 'late_read', 'setting']);
    const rows: ReadingEventRow[] = [];
    const signals: ReadingSignal[] = [];
    const past = await this.store.readingEvents(learnerId);
    for (const e of raw.slice(0, 100) as Record<string, unknown>[]) {
      if (!e || typeof e !== 'object' || !allowed.has(String(e.type))) continue;
      const lesson = getLesson(String(e.lessonId ?? ''));
      if (!lesson) continue;
      const block = lesson.blocks.find((b) => b.id === e.blockId) ?? null;
      const payload: Record<string, unknown> = {};
      if (typeof e.seconds === 'number' && e.seconds >= 0 && e.seconds < 3600) payload.seconds = Math.round(e.seconds);
      if (e.display && typeof e.display === 'object') payload.display = e.display;
      if (e.level === 1 || e.level === 2 || e.level === 3) payload.level = e.level;
      if (typeof e.enabled === 'boolean') payload.enabled = e.enabled;
      rows.push({ id: randomUUID(), learnerId, lessonId: lesson.id, blockId: block?.id ?? null, type: e.type as ReadingEventRow['type'], payload, at: now });

      if (e.type === 'active_time' && block && typeof payload.seconds === 'number') {
        const expected = Math.max(8, wordsOf(block.text[2].en) / 3); // ~180 words per minute
        const lookedUp = [...past, ...rows].some((r) => r.blockId === block.id && (r.type === 'help' || r.type === 'scroll_back'));
        if (payload.seconds > 2 * expected && lookedUp) signals.push({ kind: 'struggle', concepts: block.concepts });
      }
      if (e.type === 'zoom') signals.push({ kind: 'zoom' });
      if (e.type === 'late_read') signals.push({ kind: 'late_read' });
      if (e.type === 'setting') {
        const display = payload.display as ReadingProfile['display'] | undefined;
        const preset = display?.preset;
        const safeDisplay = display
          ? { ...(preset && ['light', 'sepia', 'dark', 'contrast'].includes(preset) ? { preset } : {}), ...(typeof display.large === 'boolean' ? { large: display.large } : {}) }
          : undefined;
        signals.push({
          kind: 'setting',
          display: safeDisplay,
          level: payload.level ? { subject: lesson.subject, value: payload.level as ReadLevel } : undefined,
          enabled: payload.enabled as boolean | undefined,
        });
      }
    }
    await this.store.addReadingEvents(rows);
    const p = signals.length ? await this.signal(learnerId, signals) : await this.profile(learnerId);
    return { recorded: rows.length, profile: this.summary(p, 'en'), profileBn: this.summary(p, 'bn') };
  }

  // ── select-to-understand ───────────────────────────────────────────────

  classify(block: LessonBlock, selection: string, lang: Lang): { type: SelectionType; term?: (typeof GLOSSARY)[number] } {
    const sel = selection.trim().toLowerCase();
    if (wordsOf(sel) <= 4) {
      const subject = block.passages.map((id) => getPassage(id)?.subject).find(Boolean);
      const term = GLOSSARY.find((g) => (!subject || glossarySubject(g) === subject) && (g.aliases.includes(sel) || g.term[lang].toLowerCase() === sel || g.term.en.toLowerCase() === sel));
      if (term) return { type: 'term', term };
    }
    if (block.type === 'formula') return { type: 'formula' };
    if (block.type === 'example') return { type: 'example' };
    return { type: 'concept' };
  }

  private async assertNotInSealedCheck(learnerId: string) {
    const sessions = await this.store.listSessions(learnerId);
    if (sessions.some((s) => s.phase === 'assessment')) {
      throw new AppError('assessment_open', 423, 'Help is paused while your sealed check is open.');
    }
  }

  private withinBudget(learnerId: string): boolean {
    const day = new Date().toISOString().slice(0, 10);
    const b = this.budget.get(learnerId);
    if (!b || b.day !== day) {
      this.budget.set(learnerId, { day, count: 0 });
      return true;
    }
    return b.count < this.dailyAiLimit;
  }

  private spend(learnerId: string) {
    const b = this.budget.get(learnerId);
    if (b) b.count += 1;
  }

  async help(learnerId: string, input: HelpInput) {
    const lesson = this.lessonOr404(input.lessonId);
    const block = this.blockOr400(lesson, input.blockId);
    const lang: Lang = input.lang === 'bn' ? 'bn' : 'en';
    if (!['understand', 'search', 'quiz', 'ask'].includes(input.action)) throw new AppError('bad_action', 400, 'Unknown action');
    const selection = (input.text ?? '').trim().slice(0, 1500) || block.text[2][lang];
    await this.assertNotInSealedCheck(learnerId);

    const { type, term } = this.classify(block, selection, lang);
    await this.store.addReadingEvents([
      { id: randomUUID(), learnerId, lessonId: lesson.id, blockId: block.id, type: 'help', payload: { action: input.action, selectionType: type, chars: selection.length }, at: new Date().toISOString() },
    ]);
    let p = await this.profile(learnerId);
    const subject = lesson.subject as Subject;

    if (input.action === 'quiz') {
      const quizBlock = block.quiz ? block : lesson.blocks.find((b) => b.quiz && b.concepts.some((c) => block.concepts.includes(c)));
      if (!quizBlock?.quiz) return { kind: 'message' as const, selectionType: type, text: lang === 'en' ? 'There is no quiz for this part yet.' : 'এই অংশের জন্য এখনো কুইজ নেই।' };
      return {
        kind: 'quiz' as const,
        selectionType: type,
        blockId: quizBlock.id,
        question: quizBlock.quiz.question[lang],
        options: quizOrder(lesson.id, quizBlock).map((i) => quizBlock.quiz!.options[i]![lang]),
      };
    }

    if (input.action === 'search') {
      const local = searchLocal({ query: selection, subject, concepts: block.concepts, preferIds: block.passages, limit: 3 });
      const results: (SourceRef & { text: string })[] = local.hits.map((h) => ({ ...sourceOf(h.passage), text: h.passage.text[lang] }));
      let liveUsed = false;
      if (this.live.enabled && (input.latest || !local.sufficient)) {
        const liveResults = await this.live.search(selection.slice(0, 200), subject);
        liveUsed = liveResults.length > 0;
        for (const r of liveResults) {
          results.push({ id: r.url, title: r.title, location: r.domain, reviewed: false, live: true, url: r.url, retrievedAt: r.retrievedAt, text: r.content });
        }
      }
      return {
        kind: 'search' as const,
        selectionType: type,
        summary: local.hits[0] ? firstSentence(local.hits[0].passage.text[lang]) : lang === 'en' ? 'No reviewed passage matches this yet.' : 'এর সঙ্গে মেলে এমন পর্যালোচিত অংশ এখনো নেই।',
        results,
        liveAvailable: this.live.enabled,
        liveUsed,
      };
    }

    // understand / ask
    const chips = ['simpler', 'example', 'more', 'quiz'];
    if (type === 'term' && term && input.action === 'understand' && !input.variant) {
      p = await this.signal(learnerId, [{ kind: 'term_selected', subject }]);
      const passage = getPassage(term.passage);
      return {
        kind: 'answer' as const,
        selectionType: type,
        origin: 'glossary' as const,
        title: term.term[lang],
        text: term.definition[lang],
        refresher: null,
        sources: passage ? [sourceOf(passage)] : [],
        chips,
        profile: this.summary(p, lang),
      };
    }

    // One-tap prerequisite check, only when there is no evidence yet, once per concept.
    const concept = block.concepts.find((c) => PREREQ_CHECKS[c]);
    const check = concept ? PREREQ_CHECKS[concept] : undefined;
    if (
      concept && check && p.enabled && input.action === 'understand' && !input.variant &&
      !p.knownConcepts.includes(check.prerequisite) && !p.prereqAsked.includes(concept) &&
      input.prereqAnswer === undefined && !input.skipPrereq
    ) {
      return {
        kind: 'prereq' as const,
        selectionType: type,
        concept,
        question: check.question[lang],
        options: prereqOrder(concept).map((i) => check.options[i]![lang]),
        askDepth: p.depthAsked[subject] === null,
        depthOptions: lang === 'en' ? { enough: 'Just enough to continue', full: 'Explain it fully' } : { enough: 'পড়া চালিয়ে যেতে যতটুকু দরকার', full: 'পুরোটা বুঝিয়ে বলো' },
      };
    }

    let refresher: string | null = null;
    const signals: ReadingSignal[] = [];
    if (concept && check && (input.prereqAnswer !== undefined || input.skipPrereq)) {
      const correct = input.prereqAnswer !== undefined && prereqOrder(concept)[input.prereqAnswer] === check.answer;
      signals.push({ kind: 'prereq', concept, prerequisite: check.prerequisite, correct });
      if (input.prereqAnswer !== undefined && !correct) refresher = check.refresher[lang];
    }
    if (signals.length) p = await this.signal(learnerId, signals);
    if (input.depth) {
      p.depthAsked[subject] = input.depth;
      await this.store.saveProfile(learnerId, p as unknown as Record<string, unknown>);
    }

    const depth = input.variant === 'more' ? 'full' : input.depth ?? p.depthAsked[subject] ?? 'enough';
    const maxWords = depth === 'full' ? 120 : p.detail === 'brief' ? 50 : 80;
    const level: ReadLevel = input.variant === 'simpler' ? (Math.max(1, p.level[subject] - 1) as ReadLevel) : p.level[subject];

    // Evidence: the paragraph's own passages first, then the best local matches.
    const local = searchLocal({ query: selection, subject, concepts: block.concepts, preferIds: block.passages, limit: 3 });
    const passages = [...new Map([...block.passages.map((id) => getPassage(id)).filter(Boolean), ...local.hits.map((h) => h.passage)].map((x) => [x!.id, x!])).values()].slice(0, 3);
    const sources = passages.map(sourceOf);

    // Reviewed example first, when asked for one and it exists.
    if (input.variant === 'example' && block.extraExample) {
      return { kind: 'answer' as const, selectionType: type, origin: 'reviewed' as const, title: null, text: block.extraExample[lang], refresher, sources, chips, profile: this.summary(p, lang) };
    }

    const question = input.action === 'ask' ? (input.question ?? '').slice(0, 300) : '';
    const cacheKey = [block.id, type, level, lang, maxWords, input.variant ?? '-', refresher ? 'r' : '-', question ? normalizeQ(question) : '-'].join('|');
    const cached = this.answerCache.get(cacheKey);
    if (cached) {
      await this.gateway.logOutcome({ purpose: 'selection_help', system: '', user: '', maxOutputTokens: 0 }, 'cache', 'cache', 'cache_hit', { cached: true });
      return { kind: 'answer' as const, selectionType: type, origin: 'ai_checked' as const, title: null, text: cached.text, refresher, sources: cached.sources, chips, profile: this.summary(p, lang) };
    }

    if (this.gateway.enabled && passages.length && this.withinBudget(learnerId)) {
      const levelWords = level === 1 ? 'very simple everyday words, short sentences' : level === 3 ? 'precise technical wording' : 'clear standard wording';
      const languageName = lang === 'bn' ? 'Bangla (English terms in brackets are fine)' : 'English';
      const user = [
        `A learner selected part of a lesson and needs ${depth === 'full' ? 'a full explanation' : 'just enough to keep reading'}.`,
        `Selection type: ${type}. Write at most ${maxWords} words in ${languageName}, using ${levelWords}.`,
        input.variant === 'example' ? 'Give one example taken from the evidence.' : '',
        refresher ? `Start from this refresher: ${refresher}` : '',
        `<learner_text>${selection}</learner_text>`,
        question ? `<learner_text>Question: ${question}</learner_text>` : '',
        `Locked facts that must not be contradicted: ${JSON.stringify(block.anchors)}`,
        `<evidence>${JSON.stringify(passages.map((x) => ({ id: x.id, text: x.text[lang] })))}</evidence>`,
      ].filter(Boolean).join('\n');
      const req = { purpose: 'selection_help', system: SYSTEM_RULES, user, maxOutputTokens: Math.round(maxWords * 3) };
      this.spend(learnerId);
      const result = await this.gateway.generate(req);
      if (result) {
        const allowedNumbers = [...passages.flatMap((x) => [...extractNumbers(x.text.en), ...extractNumbers(x.text.bn)]), ...extractNumbers(block.anchors.join(' ')), ...extractNumbers(selection)];
        const v = validateAnswer(result.text, { allowedCitations: passages.map((x) => x.id), allowedNumbers, lang, maxWords });
        if (v.ok) {
          const cited = sources.filter((s) => v.value.citations.includes(s.id));
          this.answerCache.set(cacheKey, { text: v.value.explanation, sources: cited });
          return { kind: 'answer' as const, selectionType: type, origin: 'ai_checked' as const, title: null, text: v.value.explanation, refresher, sources: cited, chips, profile: this.summary(p, lang) };
        }
        await this.gateway.logOutcome(req, result.provider, result.model, `fallback_${v.reason}`);
      }
    }

    // Reviewed fallback: the passages themselves, never invented text.
    const text = passages.length
      ? (depth === 'full' ? passages.slice(0, 2) : passages.slice(0, 1)).map((x) => x.text[lang]).join(' ')
      : lang === 'en' ? 'Reviewed support for this part is not available yet.' : 'এই অংশের জন্য পর্যালোচিত সহায়তা এখনো নেই।';
    return { kind: 'answer' as const, selectionType: type, origin: 'reviewed' as const, title: null, text, refresher, sources, chips, profile: this.summary(p, lang) };
  }

  async checkQuiz(learnerId: string, input: { lessonId: string; blockId: string; choice: number; lang: Lang }) {
    const lesson = this.lessonOr404(input.lessonId);
    const block = this.blockOr400(lesson, input.blockId);
    if (!block.quiz) throw new AppError('no_quiz', 400, 'This paragraph has no quiz');
    await this.assertNotInSealedCheck(learnerId);
    const order = quizOrder(lesson.id, block);
    const correct = order[input.choice] === block.quiz.answer;
    await this.store.addReadingEvents([{ id: randomUUID(), learnerId, lessonId: lesson.id, blockId: block.id, type: 'quiz', payload: { correct }, at: new Date().toISOString() }]);
    const p = await this.signal(learnerId, [{ kind: 'quiz', subject: lesson.subject, correct }]);
    const lang: Lang = input.lang === 'bn' ? 'bn' : 'en';
    return { correct, answer: order.indexOf(block.quiz.answer), explanation: block.quiz.explanation[lang], profile: this.summary(p, lang) };
  }

  async feedback(learnerId: string, input: { lessonId: string; blockId: string; value: string; lang: Lang }) {
    const lesson = this.lessonOr404(input.lessonId);
    this.blockOr400(lesson, input.blockId);
    if (!['too_easy', 'just_right', 'too_hard', 'too_long'].includes(input.value)) throw new AppError('bad_feedback', 400, 'Unknown feedback');
    await this.store.addReadingEvents([{ id: randomUUID(), learnerId, lessonId: lesson.id, blockId: input.blockId, type: 'feedback', payload: { value: input.value }, at: new Date().toISOString() }]);
    const p = await this.signal(learnerId, [{ kind: 'feedback', subject: lesson.subject, value: input.value as 'too_easy' }]);
    return { profile: this.summary(p, input.lang === 'bn' ? 'bn' : 'en') };
  }
}

function normalizeQ(q: string): string {
  return q.toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 120);
}

export type { Bi };
