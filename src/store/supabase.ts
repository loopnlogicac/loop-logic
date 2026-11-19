// Supabase (Postgres) store over the REST API, using only fetch.
// Server-side only: uses the service-role key, which must never reach a browser.
// Schema: db/migrations/001_core.sql and 002_video_extras.sql.

import type { EvidenceEvent } from '../core/evidence.ts';
import type { SessionRecord, TraceRecord } from '../app/types.ts';
import { type AuditRow, type DocRow, type LlmCallRow, type ReadingEventRow, type Store, type WaitlistRow, StaleStateError } from './store.ts';

export type HttpFetch = (url: string, init: { method: string; headers: Record<string, string>; body?: string }) => Promise<{
  ok: boolean;
  status: number;
  text(): Promise<string>;
}>;

export class SupabaseError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(`Supabase ${status}: ${message}`);
    this.status = status;
  }
}

export class SupabaseStore implements Store {
  readonly kind = 'supabase' as const;
  private readonly url: string;
  private readonly key: string;
  private readonly fetchImpl: HttpFetch;

  constructor(url: string, serviceRoleKey: string, fetchImpl: HttpFetch = globalThis.fetch as unknown as HttpFetch) {
    this.url = url.replace(/\/$/, '');
    this.key = serviceRoleKey;
    this.fetchImpl = fetchImpl;
  }

  private async rest<T = unknown>(method: string, path: string, body?: unknown, prefer?: string): Promise<T> {
    // New secret keys (sb_secret_…) are not JWTs and go only in the apikey
    // header; legacy service_role keys (JWTs) also go in Authorization.
    const headers: Record<string, string> = { apikey: this.key, 'content-type': 'application/json' };
    if (this.key.startsWith('eyJ')) headers.authorization = `Bearer ${this.key}`;
    if (prefer) headers.prefer = prefer;
    const res = await this.fetchImpl(`${this.url}/rest/v1/${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
    const text = await res.text();
    if (!res.ok) {
      let message = text;
      try {
        message = JSON.parse(text).message ?? text;
      } catch {
        /* keep raw text */
      }
      if (message === 'stale_state') throw new StaleStateError();
      throw new SupabaseError(res.status, message);
    }
    return (text ? JSON.parse(text) : null) as T;
  }

  private q = (v: string) => encodeURIComponent(v);

  async getSession(id: string) {
    const rows = await this.rest<{ data: SessionRecord }[]>('GET', `ll_sessions?id=eq.${this.q(id)}&select=data`);
    return rows[0]?.data;
  }
  async listSessions(learnerId?: string) {
    const filter = learnerId ? `learner_id=eq.${this.q(learnerId)}&` : '';
    const rows = await this.rest<{ data: SessionRecord }[]>('GET', `ll_sessions?${filter}select=data&order=updated_at.desc&limit=1000`);
    return rows.map((r) => r.data);
  }
  async commit(session: SessionRecord, expectedRevision: number | null, events: EvidenceEvent[], trace?: TraceRecord) {
    await this.rest('POST', 'rpc/ll_commit', { p_session: session, p_expected: expectedRevision, p_events: events, p_trace: trace ?? null });
  }
  async events(sessionId: string) {
    const rows = await this.rest<{ data: EvidenceEvent }[]>('GET', `ll_events?session_id=eq.${this.q(sessionId)}&select=data&order=seq.asc`);
    return rows.map((r) => r.data);
  }
  async allEvents() {
    const rows = await this.rest<{ data: EvidenceEvent }[]>('GET', 'll_events?select=data&order=seq.asc&limit=10000');
    return rows.map((r) => r.data);
  }
  async trace(sessionId: string, attemptId: string) {
    const rows = await this.rest<{ data: TraceRecord }[]>('GET', `ll_traces?session_id=eq.${this.q(sessionId)}&attempt_id=eq.${this.q(attemptId)}&select=data`);
    return rows[0]?.data;
  }
  async idempotent<T>(key: string) {
    const rows = await this.rest<{ response: T }[]>('GET', `ll_idempotency?key=eq.${this.q(key)}&select=response`);
    return rows[0]?.response;
  }
  async remember(key: string, value: unknown) {
    const sessionId = key.split(':')[0] ?? null;
    await this.rest('POST', 'll_idempotency', { key, session_id: sessionId, response: value }, 'resolution=ignore-duplicates,return=minimal');
  }
  async deleteSession(id: string) {
    await this.rest('DELETE', `ll_sessions?id=eq.${this.q(id)}`, undefined, 'return=minimal');
  }
  async addReadingEvents(rows: ReadingEventRow[]) {
    if (rows.length === 0) return;
    await this.rest(
      'POST',
      'll_reading_events',
      rows.map((r) => ({ id: r.id, learner_id: r.learnerId, lesson_id: r.lessonId, block_id: r.blockId, type: r.type, payload: r.payload, at: r.at })),
      'return=minimal',
    );
  }
  async readingEvents(learnerId?: string) {
    const filter = learnerId ? `learner_id=eq.${this.q(learnerId)}&` : '';
    const out: ReadingEventRow[] = [];
    for (;;) {
      const offset = out.length ? `&offset=${out.length}` : '';
      const rows = await this.rest<any[]>('GET', `ll_reading_events?${filter}select=*&order=at.asc,id.asc&limit=1000${offset}`);
      out.push(...rows.map((r) => ({ id: r.id, learnerId: r.learner_id, lessonId: r.lesson_id, blockId: r.block_id, type: r.type, payload: r.payload, at: r.at })));
      if (rows.length < 1000) return out;
    }
  }
  async logLlmCall(row: LlmCallRow) {
    await this.rest(
      'POST',
      'll_llm_calls',
      {
        id: row.id,
        purpose: row.purpose,
        provider: row.provider,
        model: row.model,
        input_tokens: row.inputTokens,
        output_tokens: row.outputTokens,
        cached: row.cached,
        latency_ms: row.latencyMs,
        outcome: row.outcome,
        at: row.at,
      },
      'return=minimal',
    );
  }
  async llmCalls() {
    const rows = await this.rest<any[]>('GET', 'll_llm_calls?select=*&order=at.asc&limit=10000');
    return rows.map((r) => ({
      id: r.id,
      purpose: r.purpose,
      provider: r.provider,
      model: r.model,
      inputTokens: r.input_tokens,
      outputTokens: r.output_tokens,
      cached: r.cached,
      latencyMs: r.latency_ms,
      outcome: r.outcome,
      at: r.at,
    }));
  }
  async getProfile(learnerId: string) {
    const rows = await this.rest<{ data: Record<string, unknown> }[]>('GET', `ll_profiles?learner_id=eq.${this.q(learnerId)}&select=data`);
    return rows[0]?.data;
  }
  async saveProfile(learnerId: string, profile: Record<string, unknown>) {
    await this.rest('POST', 'll_profiles', { learner_id: learnerId, data: profile, updated_at: new Date().toISOString() }, 'resolution=merge-duplicates,return=minimal');
  }
  async deleteReading(learnerId: string) {
    await this.rest('DELETE', `ll_reading_events?learner_id=eq.${this.q(learnerId)}`, undefined, 'return=minimal');
    await this.rest('DELETE', `ll_profiles?learner_id=eq.${this.q(learnerId)}`, undefined, 'return=minimal');
  }  async getVideoExtras(videoId: string) {
    const rows = await this.rest<{ video_id: string; data: Record<string, unknown>; updated_at: string }[]>('GET', `ll_video_extras?video_id=eq.${this.q(videoId)}&select=video_id,data,updated_at`);
    const r = rows[0];
    return r ? { videoId: r.video_id, data: r.data, updatedAt: r.updated_at } : undefined;
  }
  async listVideoExtras() {
    const rows = await this.rest<{ video_id: string; data: Record<string, unknown>; updated_at: string }[]>('GET', 'll_video_extras?select=video_id,data,updated_at&order=video_id');
    return rows.map((r) => ({ videoId: r.video_id, data: r.data, updatedAt: r.updated_at }));
  }
  async saveVideoExtras(row: { videoId: string; data: Record<string, unknown>; updatedAt: string }) {
    await this.rest('POST', 'll_video_extras', { video_id: row.videoId, data: row.data, updated_at: row.updatedAt }, 'resolution=merge-duplicates,return=minimal');
  }
  async claimLearner(fromId: string, toId: string) {
    const moved = await this.rest<unknown[]>('PATCH', `ll_reading_events?learner_id=eq.${this.q(fromId)}`, { learner_id: toId }, 'return=representation');
    const target = await this.rest<unknown[]>('GET', `ll_profiles?learner_id=eq.${this.q(toId)}&select=learner_id`);
    if (target.length === 0) await this.rest('PATCH', `ll_profiles?learner_id=eq.${this.q(fromId)}`, { learner_id: toId }, 'return=minimal');
    else await this.rest('DELETE', `ll_profiles?learner_id=eq.${this.q(fromId)}`, undefined, 'return=minimal');
    return Array.isArray(moved) ? moved.length : 0;
  }
  async addWaitlist(row: { email: string; plan: string; lang: string; learnerId: string | null; createdAt: string }) {
    const rows = await this.rest<unknown[]>('POST', 'll_waitlist', { email: row.email, plan: row.plan, lang: row.lang, learner_id: row.learnerId, created_at: row.createdAt }, 'resolution=ignore-duplicates,return=representation');
    return Array.isArray(rows) && rows.length > 0;
  }
  async waitlistCount() {
    const rows = await this.rest<{ email: string }[]>('GET', 'll_waitlist?select=email&limit=100000');
    return rows.length;
  }

  async listWaitlist(limit = 500): Promise<WaitlistRow[]> {
    const rows = await this.rest<{ email: string; plan: string; lang: string; learner_id: string | null; created_at: string }[]>('GET', `ll_waitlist?select=*&order=created_at.desc&limit=${Math.max(1, Math.min(5000, limit))}`);
    return rows.map((r) => ({ email: r.email, plan: r.plan, lang: r.lang, learnerId: r.learner_id, createdAt: r.created_at }));
  }

  // ── admin documents (db/migrations/004_admin.sql) ──
  async listDocs(kind: string): Promise<DocRow[]> {
    const rows = await this.rest<{ kind: string; id: string; data: Record<string, any>; updated_at: string }[]>('GET', `ll_docs?kind=eq.${this.q(kind)}&select=*&order=updated_at.desc&limit=10000`);
    return rows.map((r) => ({ kind: r.kind, id: r.id, data: r.data, updatedAt: r.updated_at }));
  }
  async getDoc(kind: string, id: string): Promise<DocRow | undefined> {
    const rows = await this.rest<{ kind: string; id: string; data: Record<string, any>; updated_at: string }[]>('GET', `ll_docs?kind=eq.${this.q(kind)}&id=eq.${this.q(id)}&select=*`);
    const r = rows[0];
    return r ? { kind: r.kind, id: r.id, data: r.data, updatedAt: r.updated_at } : undefined;
  }
  async putDoc(row: DocRow) {
    await this.rest('POST', 'll_docs?on_conflict=kind,id', { kind: row.kind, id: row.id, data: row.data, updated_at: row.updatedAt }, 'resolution=merge-duplicates,return=minimal');
  }
  async deleteDoc(kind: string, id: string) {
    await this.rest('DELETE', `ll_docs?kind=eq.${this.q(kind)}&id=eq.${this.q(id)}`, undefined, 'return=minimal');
  }
  async addAudit(row: AuditRow) {
    await this.rest('POST', 'll_audit', { at: row.at, actor: row.actor, action: row.action, target: row.target, detail: row.detail }, 'return=minimal');
  }
  async listAudit(limit = 200): Promise<AuditRow[]> {
    const rows = await this.rest<AuditRow[]>('GET', `ll_audit?select=at,actor,action,target,detail&order=at.desc&limit=${Math.max(1, Math.min(2000, limit))}`);
    return rows;
  }
}
