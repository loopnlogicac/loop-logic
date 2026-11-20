// Learning service: the session state machine.
// practice ──(ready)──▶ assessment ──(submit)──▶ complete
// Every state change is one atomic commit with its evidence events.

import { randomUUID } from 'node:crypto';
import { INTERVENTIONS, PACK_VERSION, SOURCES, type Bi, type Lang } from '../content/pricing-pack.ts';
import { decideNext } from '../core/adaptation.ts';
import { diagnose } from '../core/diagnosis.ts';
import { buildReceipt, type EvidenceEvent } from '../core/evidence.ts';
import { type RawAnswer, cleanAnswer, grade, InvalidAnswerError } from '../core/grading.ts';
import { hashSeed } from '../core/rng.ts';
import { type TaskInstance, factsFor, generateL2, generateL4, toPublicTask } from '../core/scenario.ts';
import { VERIFIER_VERSION } from '../core/verifier.ts';
import { gradeTransfer, openTransfer } from '../assessment/vault.ts';
import type { PracticeTutor } from '../ai/tutor.ts';
import type { Store } from '../store/store.ts';
import type { SessionRecord, TraceRecord } from './types.ts';

export class AppError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;
  /** Optional Bangla version of the message; the browser shows it when the page is in Bangla. */
  readonly bn?: string;
  constructor(code: string, status: number, message: string, details?: unknown, bn?: string) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
    this.bn = bn;
  }
}

const TENANT = 'demo';

export type SessionView = ReturnType<LearningService['view']>;

export interface AttemptResponse {
  attemptId: string;
  result: { allCorrect: boolean; fields: Record<string, { correct: boolean } | undefined>; assisted: boolean };
  diagnosis: { code: string; confidence: string; summary: Bi };
  adaptation: { action: string; reason: Bi; readyForTransfer: boolean };
  state: SessionView;
}

export interface TransferResponse {
  result: { correct: boolean; fields: Record<string, boolean> };
  receipt: ReturnType<typeof buildReceipt>;
  state: SessionView;
}

export class LearningService {
  readonly store: Store;
  private readonly now: () => Date;
  private readonly tutor: PracticeTutor | null;

  constructor(store: Store, options: { now?: () => Date; tutor?: PracticeTutor | null } = {}) {
    this.store = store;
    this.now = options.now ?? (() => new Date());
    this.tutor = options.tutor ?? null;
  }

  // ── queries ────────────────────────────────────────────────────────────

  private async load(sessionId: string, learnerId: string): Promise<SessionRecord> {
    const s = await this.store.getSession(sessionId);
    // Same answer for "missing" and "not yours", so ids cannot be probed.
    if (!s || s.learnerId !== learnerId) throw new AppError('not_found', 404, 'Session not found');
    return s;
  }

  view(s: SessionRecord) {
    return {
      sessionId: s.id,
      phase: s.phase,
      revision: s.revision,
      lang: s.lang,
      packVersion: s.packVersion,
      task: s.phase === 'practice' ? toPublicTask(s.current, s.lang) : null,
      transfer: s.phase === 'assessment' ? openTransfer(this.transferSeed(s), s.lang) : null,
      readyForTransfer: s.readyForTransfer,
      helpAvailable: s.phase === 'practice',
      helpUsedOnCurrent: s.helpUsedOnCurrent,
      attempts: s.history.length,
      lastDiagnosis: s.lastDiagnosis,
    };
  }

  async getState(sessionId: string, learnerId: string) {
    return this.view(await this.load(sessionId, learnerId));
  }

  async receipt(sessionId: string, learnerId: string) {
    const s = await this.load(sessionId, learnerId);
    return { sessionId: s.id, phase: s.phase, receipt: buildReceipt(await this.store.events(s.id)) };
  }

  async trace(sessionId: string, learnerId: string, attemptId: string): Promise<TraceRecord> {
    const s = await this.load(sessionId, learnerId);
    const t = await this.store.trace(s.id, attemptId);
    if (!t) throw new AppError('not_found', 404, 'Trace not found');
    return t;
  }

  // ── commands ───────────────────────────────────────────────────────────

  async startSession(input: { learnerId: string; lang?: Lang; demo?: boolean }) {
    const now = this.now().toISOString();
    const id = randomUUID();
    const demo = input.demo !== false;
    const baseSeed = demo ? 0 : hashSeed(`${input.learnerId}:${id}`) % 100_000;
    const first = generateL4(baseSeed * 1000, 'ignores_discount', { demo });
    const s: SessionRecord = {
      id,
      learnerId: input.learnerId,
      tenantId: TENANT,
      lang: input.lang === 'bn' ? 'bn' : 'en',
      baseSeed,
      taskCounter: 0,
      packVersion: PACK_VERSION,
      phase: 'practice',
      revision: 1,
      current: first,
      helpUsedOnCurrent: false,
      history: [],
      lastDiagnosis: null,
      readyForTransfer: false,
      createdAt: now,
      updatedAt: now,
    };
    await this.store.commit(s, null, []);
    return this.view(s);
  }

  async setLanguage(sessionId: string, learnerId: string, lang: Lang) {
    const s = await this.load(sessionId, learnerId);
    // Language is a display preference, kept apart from knowledge evidence.
    const next = { ...s, lang: lang === 'bn' ? 'bn' as const : 'en' as const, revision: s.revision + 1, updatedAt: this.now().toISOString() };
    await this.store.commit(next, s.revision, []);
    return this.view(next);
  }

  async submitAttempt(sessionId: string, learnerId: string, input: { idempotencyKey?: string; expectedRevision?: number; answer?: RawAnswer }): Promise<AttemptResponse> {
    const s = await this.load(sessionId, learnerId);
    const key = this.requireKey(input.idempotencyKey);
    const memo = await this.store.idempotent<AttemptResponse>(`${s.id}:attempt:${key}`);
    if (memo) return memo; // a retry records nothing new

    if (s.phase === 'assessment') throw new AppError('assessment_open', 423, 'Practice is closed while the sealed check is open.');
    if (s.phase === 'complete') throw new AppError('session_complete', 409, 'This session is complete. Start a new one to keep practising.');
    if (input.expectedRevision !== undefined && input.expectedRevision !== s.revision) {
      throw new AppError('stale_state', 409, 'This session changed since you loaded it. Reload and try again.');
    }

    let clean;
    try {
      clean = cleanAnswer(s.current, input.answer ?? {});
    } catch (e) {
      if (e instanceof InvalidAnswerError) throw new AppError('invalid_answer', 400, e.message, { missing: e.missing });
      throw e;
    }

    const task = s.current;
    const facts = factsFor(task);
    const graded = grade(task, clean, facts);
    const diagnosis = diagnose(task, graded);
    const assisted = s.helpUsedOnCurrent;
    const history = [
      ...s.history,
      { kind: task.kind, correct: graded.allCorrect, assisted, diagnosis: diagnosis.code, coworkerCase: task.coworkerCase },
    ];
    const adaptation = decideNext(history);
    const next = this.nextTask(s, adaptation.nextKind, adaptation.nextCoworkerCase, task.contextId);

    const attemptId = randomUUID();
    const at = this.now().toISOString();
    const event: EvidenceEvent = {
      id: attemptId,
      type: 'attempt',
      sessionId: s.id,
      learnerId: s.learnerId,
      tenantId: s.tenantId,
      at,
      packVersion: task.packVersion,
      taskId: task.id,
      level: task.level,
      concepts: task.concepts,
      correct: graded.allCorrect,
      assisted,
      diagnosis: diagnosis.code,
      detail: {
        fields: graded.fields,
        coworkerCase: task.coworkerCase,
        coworkerCorrect: graded.signals.coworkerCorrect,
        reasoning: clean.reasoning || null,
        adaptation: { action: adaptation.action, policy: adaptation.version, nextTask: next.id },
      },
    };
    const trace: TraceRecord = {
      attemptId,
      taskId: task.id,
      level: task.level,
      signals: graded.signals,
      diagnosis,
      adaptation,
      verifierVersion: VERIFIER_VERSION,
      packVersion: task.packVersion,
      facts: {
        salePrice: facts.salePrice / 100,
        profit: facts.profit / 100,
        markupPct: facts.markupPct,
        marginPct: facts.marginPct,
        requiredMarginPct: facts.requiredMarginPct,
        meetsPolicy: facts.meetsPolicy,
      },
    };
    const updated: SessionRecord = {
      ...s,
      revision: s.revision + 1,
      taskCounter: s.taskCounter + 1,
      current: next,
      helpUsedOnCurrent: false,
      history,
      lastDiagnosis: diagnosis.code,
      readyForTransfer: adaptation.readyForTransfer,
      updatedAt: at,
    };
    await this.store.commit(updated, s.revision, [event], trace);

    const response: AttemptResponse = {
      attemptId,
      result: { allCorrect: graded.allCorrect, fields: graded.fields, assisted },
      diagnosis: { code: diagnosis.code, confidence: diagnosis.confidence, summary: diagnosis.summary },
      adaptation: { action: adaptation.action, reason: adaptation.reason, readyForTransfer: adaptation.readyForTransfer },
      state: this.view(updated),
    };
    await this.store.remember(`${s.id}:attempt:${key}`, response);
    return response;
  }

  async requestHelp(sessionId: string, learnerId: string) {
    const s = await this.load(sessionId, learnerId);
    // Server-side gate: no teaching help of any kind while the sealed check is open.
    if (s.phase === 'assessment') throw new AppError('assessment_open', 423, 'Help is paused during the sealed check. You can report a technical problem instead.');
    if (s.phase === 'complete') throw new AppError('session_complete', 409, 'This session is complete.');
    const code = s.lastDiagnosis && s.lastDiagnosis !== 'correct' ? s.lastDiagnosis : 'uncertain';
    const iv = INTERVENTIONS[code];
    // Optional AI wording, used only if it passes validation against the reviewed sources.
    const ai = this.tutor ? await this.tutor.explain({ diagnosis: code, task: s.current, lang: s.lang, sessionId: s.id }) : null;
    const at = this.now().toISOString();
    const updated: SessionRecord = { ...s, helpUsedOnCurrent: true, revision: s.revision + 1, updatedAt: at };
    const event: EvidenceEvent = {
      id: randomUUID(),
      type: 'help',
      sessionId: s.id,
      learnerId: s.learnerId,
      tenantId: s.tenantId,
      at,
      packVersion: s.packVersion,
      taskId: s.current.id,
      level: s.current.level,
      concepts: s.current.concepts,
      correct: null,
      assisted: true,
      diagnosis: code,
      detail: { intervention: code, source: ai ? 'ai_validated' : 'reviewed_fallback', aiOutcome: ai?.outcome ?? null },
    };
    await this.store.commit(updated, s.revision, [event]);
    const aiText = ai?.text ?? null;
    return {
      help: {
        diagnosis: code,
        title: iv.title,
        question: iv.socraticQuestion,
        explanation: aiText ? { ...iv.explanation, [s.lang]: aiText } : iv.explanation,
        sources: iv.sources.map((id) => SOURCES[id]),
        origin: aiText ? 'ai_checked' : 'reviewed_content',
      },
      note: { en: 'Using help marks your next answer as assisted.', bn: 'সাহায্য নিলে পরের উত্তরটি “সাহায্যসহ” হিসেবে ধরা হবে।' },
      state: this.view(updated),
    };
  }

  async startTransfer(sessionId: string, learnerId: string) {
    const s = await this.load(sessionId, learnerId);
    if (s.phase === 'assessment') return { transfer: openTransfer(this.transferSeed(s), s.lang), state: this.view(s) };
    if (s.phase === 'complete') throw new AppError('session_complete', 409, 'This session is complete.');
    if (!s.readyForTransfer) throw new AppError('not_ready', 409, 'Get two correct answers in a row without help first.');
    const transfer = openTransfer(this.transferSeed(s), s.lang);
    const at = this.now().toISOString();
    const updated: SessionRecord = { ...s, phase: 'assessment', revision: s.revision + 1, updatedAt: at };
    const event: EvidenceEvent = {
      id: randomUUID(),
      type: 'transfer_opened',
      sessionId: s.id,
      learnerId: s.learnerId,
      tenantId: s.tenantId,
      at,
      packVersion: s.packVersion,
      taskId: transfer.itemId,
      level: 5,
      concepts: ['total_cost', 'discount_price', 'margin', 'ai_verification', 'minimum_price'],
      correct: null,
      assisted: false,
      diagnosis: null,
      detail: { bank: transfer.bankVersion },
    };
    await this.store.commit(updated, s.revision, [event]);
    return { transfer, state: this.view(updated) };
  }

  async submitTransfer(sessionId: string, learnerId: string, input: { idempotencyKey?: string; answer?: Record<string, unknown> }): Promise<TransferResponse> {
    const s = await this.load(sessionId, learnerId);
    const key = this.requireKey(input.idempotencyKey);
    const memo = await this.store.idempotent<TransferResponse>(`${s.id}:transfer:${key}`);
    if (memo) return memo;
    if (s.phase !== 'assessment') throw new AppError('no_transfer', 409, 'There is no open sealed check.');

    const result = gradeTransfer(this.transferSeed(s), input.answer ?? {});
    const at = this.now().toISOString();
    const event: EvidenceEvent = {
      id: randomUUID(),
      type: 'transfer_attempt',
      sessionId: s.id,
      learnerId: s.learnerId,
      tenantId: s.tenantId,
      at,
      packVersion: s.packVersion,
      taskId: result.itemId,
      level: 5,
      concepts: [...result.conceptsShown, ...result.conceptsMissed],
      correct: result.correct,
      assisted: false,
      diagnosis: null,
      detail: { fields: result.fields, conceptsShown: result.conceptsShown, conceptsMissed: result.conceptsMissed },
    };
    const updated: SessionRecord = { ...s, phase: 'complete', revision: s.revision + 1, updatedAt: at };
    // The revision check makes a second, concurrent submission fail as stale.
    await this.store.commit(updated, s.revision, [event]);
    const response: TransferResponse = {
      result: { correct: result.correct, fields: result.fields },
      receipt: buildReceipt(await this.store.events(s.id)),
      state: this.view(updated),
    };
    await this.store.remember(`${s.id}:transfer:${key}`, response);
    return response;
  }

  async reset(sessionId: string, learnerId: string) {
    const s = await this.load(sessionId, learnerId);
    await this.store.deleteSession(s.id);
    return this.startSession({ learnerId, lang: s.lang, demo: s.baseSeed === 0 });
  }

  // ── helpers ────────────────────────────────────────────────────────────

  private requireKey(key: unknown): string {
    if (typeof key !== 'string' || key.length < 8 || key.length > 100) {
      throw new AppError('missing_idempotency_key', 400, 'Send an idempotencyKey (8–100 characters) with every submission.');
    }
    return key;
  }

  private transferSeed(s: SessionRecord): number {
    return s.baseSeed * 1000 + 999;
  }

  private nextTask(s: SessionRecord, kind: TaskInstance['kind'], coworkerCase: TaskInstance['coworkerCase'], avoidContext: string): TaskInstance {
    const seed = s.baseSeed * 1000 + s.taskCounter + 1;
    return kind === 'l2_margin'
      ? generateL2(seed, { avoidContext })
      : generateL4(seed, coworkerCase ?? 'correct_accept', { avoidContext });
  }
}
