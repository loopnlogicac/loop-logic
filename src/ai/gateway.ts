// AI gateway: one place where the app talks to language models.
// - Providers are tried in order (e.g. Gemini free tier, then Groq).
// - Each call has a deadline and one retry for transient failures.
// - Every call is logged with tokens, latency and outcome (no prompt text).
// - Keys stay on the server. If no provider is configured, generate() returns
//   null and callers use reviewed content instead.

import { randomUUID } from 'node:crypto';
import type { Store } from '../store/store.ts';

export interface LlmRequest {
  purpose: string; // selection_help, practice_help, ...
  system: string;
  user: string;
  maxOutputTokens: number;
  temperature?: number;
}

export interface LlmResult {
  text: string;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
}

export type FetchLike = (url: string, init: { method: string; headers: Record<string, string>; body: string; signal: AbortSignal }) => Promise<{
  ok: boolean;
  status: number;
  json(): Promise<any>;
}>;

export interface Provider {
  name: string;
  model: string;
  call(req: LlmRequest, signal: AbortSignal): Promise<Omit<LlmResult, 'latencyMs'>>;
}

class ProviderError extends Error {
  readonly transient: boolean;
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.transient = status === 429 || status >= 500;
  }
}

export function geminiProvider(apiKey: string, model: string, fetchImpl: FetchLike): Provider {
  return {
    name: 'gemini',
    model,
    async call(req, signal) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
      const res = await fetchImpl(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: req.system }] },
          contents: [{ role: 'user', parts: [{ text: req.user }] }],
          generationConfig: { responseMimeType: 'application/json', maxOutputTokens: req.maxOutputTokens, temperature: req.temperature ?? 0.2 },
        }),
        signal,
      });
      if (!res.ok) throw new ProviderError(`gemini ${res.status}`, res.status);
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('') ?? '';
      return {
        text,
        provider: 'gemini',
        model,
        inputTokens: data?.usageMetadata?.promptTokenCount ?? 0,
        outputTokens: data?.usageMetadata?.candidatesTokenCount ?? 0,
      };
    },
  };
}

export function groqProvider(apiKey: string, model: string, fetchImpl: FetchLike): Provider {
  return {
    name: 'groq',
    model,
    async call(req, signal) {
      const res = await fetchImpl('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: req.system },
            { role: 'user', content: req.user },
          ],
          response_format: { type: 'json_object' },
          max_tokens: req.maxOutputTokens,
          temperature: req.temperature ?? 0.2,
        }),
        signal,
      });
      if (!res.ok) throw new ProviderError(`groq ${res.status}`, res.status);
      const data = await res.json();
      return {
        text: data?.choices?.[0]?.message?.content ?? '',
        provider: 'groq',
        model,
        inputTokens: data?.usage?.prompt_tokens ?? 0,
        outputTokens: data?.usage?.completion_tokens ?? 0,
      };
    },
  };
}

export class AiGateway {
  private readonly providers: Provider[];
  private readonly store: Store | null;
  private readonly timeoutMs: number;
  private readonly retryDelayMs: number;

  constructor(providers: Provider[], options: { store?: Store | null; timeoutMs?: number; retryDelayMs?: number } = {}) {
    this.providers = providers;
    this.store = options.store ?? null;
    this.timeoutMs = options.timeoutMs ?? 8000;
    this.retryDelayMs = options.retryDelayMs ?? 400;
  }

  get enabled(): boolean {
    return this.providers.length > 0;
  }

  describe(): string {
    return this.providers.length ? this.providers.map((p) => `${p.name}:${p.model}`).join(' → ') : 'off (reviewed content only)';
  }

  async logOutcome(req: LlmRequest, provider: string, model: string, outcome: string, extra: Partial<LlmResult> & { cached?: boolean } = {}) {
    await this.store?.logLlmCall({
      id: randomUUID(),
      purpose: req.purpose,
      provider,
      model,
      inputTokens: extra.inputTokens ?? 0,
      outputTokens: extra.outputTokens ?? 0,
      cached: extra.cached ?? false,
      latencyMs: extra.latencyMs ?? 0,
      outcome,
      at: new Date().toISOString(),
    });
  }

  /** Returns the first successful result, or null when every provider fails or none is configured. */
  async generate(req: LlmRequest): Promise<LlmResult | null> {
    for (const provider of this.providers) {
      for (let attempt = 0; attempt < 2; attempt++) {
        const started = Date.now();
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeoutMs);
        try {
          const r = await provider.call(req, controller.signal);
          const result: LlmResult = { ...r, latencyMs: Date.now() - started };
          await this.logOutcome(req, provider.name, provider.model, 'ok', result);
          return result;
        } catch (err) {
          const latencyMs = Date.now() - started;
          const timedOut = controller.signal.aborted;
          const transient = timedOut || (err instanceof ProviderError && err.transient) || !(err instanceof ProviderError);
          await this.logOutcome(req, provider.name, provider.model, timedOut ? 'timeout' : `error_${err instanceof ProviderError ? err.status : 'network'}`, { latencyMs });
          if (!transient || attempt === 1) break; // move on to the next provider
          await new Promise((r) => setTimeout(r, this.retryDelayMs));
        } finally {
          clearTimeout(timer);
        }
      }
    }
    return null;
  }
}

/** Builds the gateway from environment variables. Missing keys simply skip that provider. */
export function gatewayFromEnv(env: NodeJS.ProcessEnv, store: Store | null, fetchImpl: FetchLike = globalThis.fetch as unknown as FetchLike): AiGateway {
  const providers: Provider[] = [];
  if (env.GEMINI_API_KEY) providers.push(geminiProvider(env.GEMINI_API_KEY, env.GEMINI_MODEL || 'gemini-flash-latest', fetchImpl));
  if (env.GROQ_API_KEY) providers.push(groqProvider(env.GROQ_API_KEY, env.GROQ_MODEL || 'llama-3.3-70b-versatile', fetchImpl));
  return new AiGateway(providers, { store });
}
