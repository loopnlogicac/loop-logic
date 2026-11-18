// Live search on approved websites only (for current information).
// - The search API is asked to restrict results to the subject's approved domains.
// - Every returned URL is re-checked against our own allowlist before use.
// - Page text is treated as data, trimmed, and cached for a set time.

import { randomUUID } from 'node:crypto';
import { APPROVED_SITES } from '../content/library.ts';
import type { Subject } from '../content/subjects.ts';
import type { Store } from '../store/store.ts';

export interface LiveResult {
  url: string;
  title: string;
  domain: string;
  content: string;
  retrievedAt: string;
}

export type JsonFetch = (url: string, init: { method: string; headers: Record<string, string>; body: string; signal?: AbortSignal }) => Promise<{
  ok: boolean;
  status: number;
  json(): Promise<any>;
}>;

/** True only for https URLs on an approved domain or its subdomain. */
export function isAllowed(rawUrl: string, domains: string[]): string | null {
  let u: URL;
  try {
    u = new URL(rawUrl);
  } catch {
    return null;
  }
  if (u.protocol !== 'https:' || u.username || u.password) return null;
  const host = u.hostname.toLowerCase();
  return domains.find((d) => host === d || host.endsWith(`.${d}`)) ?? null;
}

export class LiveSearch {
  private readonly apiKey: string | null;
  private readonly fetchImpl: JsonFetch;
  private readonly store: Store | null;
  private readonly ttlMs: number;
  private readonly cache = new Map<string, { until: number; results: LiveResult[] }>();

  constructor(options: { apiKey?: string | null; fetchImpl?: JsonFetch; store?: Store | null; ttlMs?: number }) {
    this.apiKey = options.apiKey ?? null;
    this.fetchImpl = options.fetchImpl ?? (globalThis.fetch as unknown as JsonFetch);
    this.store = options.store ?? null;
    this.ttlMs = options.ttlMs ?? 24 * 60 * 60 * 1000;
  }

  get enabled(): boolean {
    return Boolean(this.apiKey);
  }

  async search(query: string, subject: Subject): Promise<LiveResult[]> {
    if (!this.apiKey) return [];
    const domains = APPROVED_SITES[subject].map((s) => s.domain);
    const key = `${subject}:${query.toLowerCase().trim().slice(0, 200)}`;
    const hit = this.cache.get(key);
    if (hit && hit.until > Date.now()) {
      await this.log('cache_hit', 0, true);
      return hit.results;
    }
    const started = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await this.fetchImpl('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${this.apiKey}` },
        body: JSON.stringify({ query: query.slice(0, 300), include_domains: domains, max_results: 3, search_depth: 'basic', include_answer: false }),
        signal: controller.signal,
      });
      if (!res.ok) {
        await this.log(`error_${res.status}`, Date.now() - started);
        return [];
      }
      const data = await res.json();
      const now = new Date().toISOString();
      const results: LiveResult[] = [];
      for (const r of (data?.results ?? []) as { url?: string; title?: string; content?: string }[]) {
        const domain = r.url ? isAllowed(r.url, domains) : null;
        if (!domain) continue; // never trust the provider's filter alone
        results.push({
          url: r.url!,
          title: String(r.title ?? domain).slice(0, 200),
          domain,
          content: String(r.content ?? '').replace(/\s+/g, ' ').slice(0, 800),
          retrievedAt: now,
        });
      }
      this.cache.set(key, { until: Date.now() + this.ttlMs, results });
      await this.log('ok', Date.now() - started);
      return results;
    } catch {
      await this.log(controller.signal.aborted ? 'timeout' : 'error_network', Date.now() - started);
      return [];
    } finally {
      clearTimeout(timer);
    }
  }

  private async log(outcome: string, latencyMs: number, cached = false) {
    await this.store?.logLlmCall({
      id: randomUUID(),
      purpose: 'live_search',
      provider: 'tavily',
      model: 'search',
      inputTokens: 0,
      outputTokens: 0,
      cached,
      latencyMs,
      outcome,
      at: new Date().toISOString(),
    });
  }
}
