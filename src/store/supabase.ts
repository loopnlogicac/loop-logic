// Supabase (Postgres) store over the REST API, using only fetch.
// Server-side only: uses the service-role key, which must never reach a browser.
// Schema: db/migrations/001_core.sql.

import type { EvidenceEvent } from '../core/evidence.ts';
import type { SessionRecord, TraceRecord } from '../app/types.ts';
import { type LlmCallRow, type ReadingEventRow, type Store, StaleStateError } from './store.ts';

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
    const headers: Record<string, string> = {
      apikey: this.key,
      authorization: `Bearer ${this.key}`,
      'content-type': 'application/json',
    };
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
    const rows = await this.rest<any[]>('GET', `ll_reading_events?${filter}select=*&order=at.asc&limit=10000`);
    return rows.map((r) => ({ id: r.id, learnerId: r.learner_id, lessonId: r.lesson_id, blockId: r.block_id, type: r.type, payload: r.payload, at: r.at }));
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
  }
}
