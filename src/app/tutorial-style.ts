// Reading style on tutorial pages (Simpler · Standard · Concise) and the quick
// check before an explanation.
//
// - Standard is the reviewed text. Concise is built in the browser from the same
//   text (key points first, details folded); it needs no AI.
// - Simpler asks the AI to rewrite ONE section in plain words, from that section
//   only. The answer must pass the validator (cites the section, no new numbers,
//   right language) or the learner keeps the reviewed text. A checked rewrite is
//   stored once per section and language and then served to every learner, so
//   each section costs at most one AI call, ever.
// - The suggested style comes from the reading profile (look-ups, quiz streaks,
//   feedback) and always says why.

import type { Store } from '../store/store.ts';
import type { AiGateway } from '../ai/gateway.ts';
import type { ReadingService } from '../reading/service.ts';
import type { TutorialService } from './tutorials.ts';
import type { Lang } from '../content/pricing-pack.ts';
import type { Subject } from '../content/subjects.ts';
import { AppError } from './service.ts';
import { createHash } from 'node:crypto';
import type { AiClient } from '../ai/budget.ts';
import { extractNumbers, SYSTEM_RULES, validateAnswer } from '../ai/validator.ts';

export type ReadingStyle = 'simpler' | 'standard' | 'concise';

export const tutorialSubject = (track: string): Subject => (track === 'machine-learning' ? 'ml' : 'cs');

const SIMPLER_MAX_WORDS = 180;
const DOC_KIND = 'simpler_section';

export class TutorialStyleService {
  private readonly store: Store;
  private readonly gateway: AiGateway;
  private readonly reading: ReadingService;
  private readonly tutorials: TutorialService;

  constructor(store: Store, gateway: AiGateway, reading: ReadingService, tutorials: TutorialService) {
    this.store = store;
    this.gateway = gateway;
    this.reading = reading;
    this.tutorials = tutorials;
  }

  /** The style this learner's reading evidence points to, and why. */
  async suggestion(learnerId: string, track: string, lang: Lang) {
    const p = await this.reading.profile(learnerId);
    const level = p.level[tutorialSubject(track)];
    const suggested: ReadingStyle = level === 1 ? 'simpler' : level === 3 ? 'concise' : 'standard';
    const rule = suggested === 'simpler' ? /^(R1|R5_easier)/ : suggested === 'concise' ? /^(R3|R5_harder)/ : null;
    const why = rule ? [...p.reasons].reverse().find((r) => rule.test(r.rule))?.text[lang] ?? null : null;
    return { suggested, level, why, simplerAvailable: this.gateway.enabled };
  }

  /** A checked plain-words version of one section, or the reason there is none. */
  async simpler(learnerId: string, track: string, topic: string, section: string, lang: Lang, client?: AiClient) {
    const sec = this.tutorials.sectionText(track, topic, section, lang);
    if (!sec) throw new AppError('not_found', 404, lang === 'bn' ? 'এই অংশ পাওয়া যায়নি।' : 'Section not found.');
    const id = `${track}:${topic}:${section}:${lang}`;
    // The stored version is tied to the exact text it was written from: edit the lesson and it is written again.
    const source = createHash('sha256').update(`${sec.title}\n${sec.text}`).digest('hex').slice(0, 16);
    const hit = await this.store.getDoc(DOC_KIND, id);
    if (hit?.data?.text && hit.data.source === source) return { origin: 'ai_checked' as const, text: String(hit.data.text), cached: true };
    if (!this.gateway.enabled) return { origin: 'unavailable' as const, reason: 'ai_off' as const };
    if (!(await this.reading.useAi(learnerId, client))) return { origin: 'unavailable' as const, reason: 'limit' as const };

    const languageName = lang === 'bn' ? 'Bangla (keep English technical terms in brackets after the Bangla word)' : 'English';
    const evidenceId = `tutorial:${topic}#${section}`;
    const user = [
      `Rewrite one section of the tutorial topic "${sec.topicTitle}" for a learner who found it hard to read.`,
      `Write at most ${SIMPLER_MAX_WORDS} words in ${languageName}: very simple everyday words, short sentences, one idea at a time, in the same order as the original.`,
      'Keep every fact, name and number exactly as in the evidence. Do not add new facts, examples or numbers. Do not include code.',
      'Separate paragraphs with a blank line. Cite the evidence id.',
      `<evidence>${JSON.stringify([{ id: evidenceId, title: sec.title, text: sec.text }])}</evidence>`,
    ].join('\n');
    const req = { purpose: 'simpler_section', system: SYSTEM_RULES, user, maxOutputTokens: SIMPLER_MAX_WORDS * 4 };
    const result = await this.gateway.generate(req);
    if (!result) return { origin: 'unavailable' as const, reason: 'check_failed' as const };
    const allowedNumbers = [...extractNumbers(sec.text), ...extractNumbers(sec.textEn), ...extractNumbers(sec.topicTitle)];
    const v = validateAnswer(result.text, { allowedCitations: [evidenceId], allowedNumbers, lang, maxWords: SIMPLER_MAX_WORDS });
    if (!v.ok) {
      await this.gateway.logOutcome(req, result.provider, result.model, `fallback_${v.reason}`);
      return { origin: 'unavailable' as const, reason: 'check_failed' as const };
    }
    await this.store.putDoc({ kind: DOC_KIND, id, data: { text: v.value.explanation, source, model: result.model, at: new Date().toISOString() }, updatedAt: new Date().toISOString() });
    return { origin: 'ai_checked' as const, text: v.value.explanation, cached: false };
  }

  /** One question from the topic's quiz, asked before the first explanation on that topic. */
  quickCheck(learnerId: string, track: string, topic: string, lang: Lang) {
    return { question: this.tutorials.checkQuestion(track, topic, lang, learnerId) };
  }

  /** Grades the quick check on the server; the result sets how the explanation is pitched. */
  async gradeQuickCheck(learnerId: string, track: string, topic: string, body: { id?: unknown; choice?: unknown; skip?: unknown }, lang: Lang) {
    if (body.skip === true) return { correct: null, style: 'standard' as ReadingStyle };
    const r = this.tutorials.gradeAnswer(track, topic, String(body.id ?? ''), body.choice, lang);
    await this.reading.addSignals(learnerId, [{ kind: 'quiz', subject: tutorialSubject(track), correct: r.correct }]);
    return { correct: r.correct, answer: r.answer, explanation: r.explanation, style: (r.correct ? 'concise' : 'simpler') as ReadingStyle };
  }
}
