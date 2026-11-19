// Storage interface (async so a database can implement it).
// MemoryStore: zero-setup demo. SupabaseStore (supabase.ts): persistent.

import type { EvidenceEvent } from '../core/evidence.ts';
import type { SessionRecord, TraceRecord } from '../app/types.ts';

export interface ReadingEventRow {
  id: string;
  learnerId: string;
  lessonId: string;
  blockId: string | null;
  type: 'view' | 'active_time' | 'select' | 'help' | 'quiz' | 'feedback' | 'scroll_back' | 'setting' | 'lab_check' | 'video' | 'video_quiz' | 'ask';
  payload: Record<string, unknown>;
  at: string;
}

export interface LlmCallRow {
  id: string;
  purpose: string;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cached: boolean;
  latencyMs: number;
  outcome: string;
  at: string;
}

/** Instructor-written extras for one YouTube video (materials, quiz, Try now). */
export interface VideoExtrasRow {
  videoId: string;
  data: Record<string, unknown>;
  updatedAt: string;
}

export interface Store {
  readonly kind: 'memory' | 'supabase';
  getSession(id: string): Promise<SessionRecord | undefined>;
  listSessions(learnerId?: string): Promise<SessionRecord[]>;
  /** Saves a session and its new events atomically, only if the stored revision matches. */
  commit(session: SessionRecord, expectedRevision: number | null, events: EvidenceEvent[], trace?: TraceRecord): Promise<void>;
  events(sessionId: string): Promise<EvidenceEvent[]>;
  allEvents(): Promise<EvidenceEvent[]>;
  trace(sessionId: string, attemptId: string): Promise<TraceRecord | undefined>;
  idempotent<T>(key: string): Promise<T | undefined>;
  remember(key: string, value: unknown): Promise<void>;
  deleteSession(id: string): Promise<void>;
  // reading + operations
  addReadingEvents(rows: ReadingEventRow[]): Promise<void>;
  readingEvents(learnerId?: string): Promise<ReadingEventRow[]>;
  logLlmCall(row: LlmCallRow): Promise<void>;
  llmCalls(): Promise<LlmCallRow[]>;
  getProfile(learnerId: string): Promise<Record<string, unknown> | undefined>;
  saveProfile(learnerId: string, profile: Record<string, unknown>): Promise<void>;
  /** Removes a learner's reading events and reading profile (learner-requested reset). */
  deleteReading(learnerId: string): Promise<void>;
  getVideoExtras(videoId: string): Promise<VideoExtrasRow | undefined>;
  listVideoExtras(): Promise<VideoExtrasRow[]>;
  saveVideoExtras(row: VideoExtrasRow): Promise<void>;
  /** Move an anonymous learner's reading history and profile to a signed-in account. Returns rows moved. */
  claimLearner(fromId: string, toId: string): Promise<number>;
  /** Pro waitlist. Returns false when the email was already on the list. */
  addWaitlist(row: WaitlistRow): Promise<boolean>;
  waitlistCount(): Promise<number>;
}

export interface WaitlistRow { email: string; plan: string; lang: string; learnerId: string | null; createdAt: string }

export class StaleStateError extends Error {
  readonly code = 'stale_state';
  constructor() {
    super('This session changed since you loaded it. Reload and try again.');
  }
}

export class MemoryStore implements Store {
  readonly kind = 'memory' as const;
  private sessions = new Map<string, SessionRecord>();
  private eventLog = new Map<string, EvidenceEvent[]>();
  private traces = new Map<string, TraceRecord>();
  private keys = new Map<string, unknown>();
  private reading: ReadingEventRow[] = [];
  private calls: LlmCallRow[] = [];
  private profiles = new Map<string, Record<string, unknown>>();
  private extras = new Map<string, VideoExtrasRow>();

  async getSession(id: string) {
    const s = this.sessions.get(id);
    return s ? structuredClone(s) : undefined;
  }
  async listSessions(learnerId?: string) {
    return [...this.sessions.values()].filter((s) => !learnerId || s.learnerId === learnerId).map((s) => structuredClone(s));
  }
  async commit(session: SessionRecord, expectedRevision: number | null, events: EvidenceEvent[], trace?: TraceRecord) {
    const current = this.sessions.get(session.id);
    if (expectedRevision !== null && current && current.revision !== expectedRevision) throw new StaleStateError();
    const log = [...(this.eventLog.get(session.id) ?? []), ...events.map((e) => structuredClone(e))];
    this.sessions.set(session.id, structuredClone(session));
    this.eventLog.set(session.id, log);
    if (trace) this.traces.set(`${session.id}:${trace.attemptId}`, structuredClone(trace));
  }
  async events(sessionId: string) {
    return structuredClone(this.eventLog.get(sessionId) ?? []);
  }
  async allEvents() {
    return structuredClone([...this.eventLog.values()].flat());
  }
  async trace(sessionId: string, attemptId: string) {
    const t = this.traces.get(`${sessionId}:${attemptId}`);
    return t ? structuredClone(t) : undefined;
  }
  async idempotent<T>(key: string): Promise<T | undefined> {
    const v = this.keys.get(key);
    return v === undefined ? undefined : (structuredClone(v) as T);
  }
  async remember(key: string, value: unknown) {
    this.keys.set(key, structuredClone(value));
  }
  async deleteSession(id: string) {
    this.sessions.delete(id);
    this.eventLog.delete(id);
    for (const k of [...this.traces.keys()]) if (k.startsWith(`${id}:`)) this.traces.delete(k);
    for (const k of [...this.keys.keys()]) if (k.startsWith(`${id}:`)) this.keys.delete(k);
  }
  async addReadingEvents(rows: ReadingEventRow[]) {
    this.reading.push(...rows.map((r) => structuredClone(r)));
  }
  async readingEvents(learnerId?: string) {
    return structuredClone(this.reading.filter((r) => !learnerId || r.learnerId === learnerId));
  }
  async logLlmCall(row: LlmCallRow) {
    this.calls.push(structuredClone(row));
  }
  async llmCalls() {
    return structuredClone(this.calls);
  }
  async getProfile(learnerId: string) {
    const p = this.profiles.get(learnerId);
    return p ? structuredClone(p) : undefined;
  }
  async saveProfile(learnerId: string, profile: Record<string, unknown>) {
    this.profiles.set(learnerId, structuredClone(profile));
  }
  async deleteReading(learnerId: string) {
    this.reading = this.reading.filter((r) => r.learnerId !== learnerId);
    this.profiles.delete(learnerId);
  }
  async getVideoExtras(videoId: string) {
    const r = this.extras.get(videoId);
    return r ? structuredClone(r) : undefined;
  }
  async listVideoExtras() {
    return [...this.extras.values()].map((r) => structuredClone(r));
  }
  async saveVideoExtras(row: VideoExtrasRow) {
    this.extras.set(row.videoId, structuredClone(row));
  }  async claimLearner(fromId: string, toId: string) {
    let n = 0;
    for (const e of this.reading) if (e.learnerId === fromId) { e.learnerId = toId; n++; }
    const p = this.profiles.get(fromId);
    if (p && !this.profiles.has(toId)) this.profiles.set(toId, p);
    this.profiles.delete(fromId);
    return n;
  }
  private waitlist = new Map<string, WaitlistRow>();
  async addWaitlist(row: WaitlistRow) {
    if (this.waitlist.has(row.email)) return false;
    this.waitlist.set(row.email, { ...row });
    return true;
  }
  async waitlistCount() {
    return this.waitlist.size;
  }

}
