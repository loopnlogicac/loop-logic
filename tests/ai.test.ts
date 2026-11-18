import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AiGateway, geminiProvider, groqProvider, type Provider, type FetchLike } from '../src/ai/gateway.ts';
import { validateAnswer, extractNumbers } from '../src/ai/validator.ts';
import { AiPracticeTutor } from '../src/ai/tutor.ts';
import { MemoryStore } from '../src/store/store.ts';
import { LearningService } from '../src/app/service.ts';
import { generateL4 } from '../src/core/scenario.ts';

const ctx = { allowedCitations: ['lib-margin'], allowedNumbers: [800, 900, 100, 11.1], lang: 'en' as const, maxWords: 80 };
const ok = (explanation: string, citations = ['lib-margin']) => JSON.stringify({ explanation, citations, insufficient_evidence: false });

test('validator accepts a grounded, cited answer', () => {
  const v = validateAnswer(ok('Margin divides the ৳100 profit by the ৳900 selling price, about 11.1%.'), ctx);
  assert.equal(v.ok, true);
});

test('validator rejects: not JSON, no citation, foreign citation, invented number, wrong language, claims about the learner', () => {
  assert.deepEqual(validateAnswer('Margin is profit over price', ctx), { ok: false, reason: 'schema_not_json' });
  assert.equal((validateAnswer(ok('Margin divides profit by the selling price.', []), ctx) as { reason: string }).reason, 'no_citation');
  assert.equal((validateAnswer(ok('Margin divides profit by the selling price.', ['web-x']), ctx) as { reason: string }).reason, 'citation_not_in_evidence');
  assert.match((validateAnswer(ok('Margin here is about 14.2% of the price.'), ctx) as { reason: string }).reason, /^number_not_in_evidence/);
  assert.equal((validateAnswer(ok('মার্জিন হলো লাভ ভাগ বিক্রয়মূল্য, প্রায় ১১.১%।'), ctx) as { reason: string }).reason, 'wrong_language');
  assert.equal((validateAnswer(ok('You are a visual learner, so think of margin as a slice.'), ctx) as { reason: string }).reason, 'claim_about_learner');
  assert.equal((validateAnswer(JSON.stringify({ explanation: '', citations: [], insufficient_evidence: true }), ctx) as { reason: string }).reason, 'insufficient_evidence');
});

test('validator reads Bangla digits and accepts a Bangla answer in Bangla mode', () => {
  assert.deepEqual(extractNumbers('মার্জিন ১১.১% আর দাম ৳৯০০, ১,০০০'), [11.1, 900, 1000]);
  const v = validateAnswer(ok('মার্জিন = লাভ ÷ বিক্রয়মূল্য: ১০০ ÷ ৯০০, প্রায় ১১.১%।'), { ...ctx, lang: 'bn' });
  assert.equal(v.ok, true);
});

function fakeProvider(name: string, behaviour: (() => Promise<string>)[]): Provider & { calls: number } {
  let i = 0;
  const p = {
    name,
    model: `${name}-model`,
    calls: 0,
    async call() {
      p.calls++;
      const step = behaviour[Math.min(i++, behaviour.length - 1)]!;
      return { text: await step(), provider: name, model: `${name}-model`, inputTokens: 120, outputTokens: 40 };
    },
  };
  return p;
}
test('gateway retries a transient failure once, then falls back to the next provider, and logs every call', async () => {
  const store = new MemoryStore();
  const first = fakeProvider('gemini', [() => Promise.reject(new Error('network down')), () => Promise.reject(new Error('network down'))]);
  const second = fakeProvider('groq', [async () => ok('fine')]);
  const gw = new AiGateway([first, second], { store, retryDelayMs: 1 });
  const r = await gw.generate({ purpose: 't', system: 's', user: 'u', maxOutputTokens: 50 });
  assert.equal(r?.provider, 'groq');
  assert.equal(first.calls, 2);
  const calls = await store.llmCalls();
  assert.deepEqual(calls.map((c) => c.outcome), ['error_network', 'error_network', 'ok']);
  assert.equal(calls.at(-1)!.inputTokens, 120);
});

test('gateway times out a slow provider', async () => {
  const slow: Provider = { name: 'slow', model: 'm', call: (_r, signal) => new Promise((_res, rej) => signal.addEventListener('abort', () => rej(new Error('aborted')))) };
  const gw = new AiGateway([slow], { timeoutMs: 20, retryDelayMs: 1 });
  assert.equal(await gw.generate({ purpose: 't', system: 's', user: 'u', maxOutputTokens: 5 }), null);
});

test('gateway with no providers is off and returns null', async () => {
  const gw = new AiGateway([]);
  assert.equal(gw.enabled, false);
  assert.equal(await gw.generate({ purpose: 't', system: 's', user: 'u', maxOutputTokens: 5 }), null);
});

test('Gemini and Groq providers send the documented request shapes and read usage', async () => {
  const seen: { url: string; body: any; headers: Record<string, string> }[] = [];
  const fetchImpl: FetchLike = async (url, init) => {
    seen.push({ url, body: JSON.parse(init.body), headers: init.headers });
    const gemini = url.includes('generativelanguage');
    return {
      ok: true,
      status: 200,
      json: async () =>
        gemini
          ? { candidates: [{ content: { parts: [{ text: '{"a":1}' }] } }], usageMetadata: { promptTokenCount: 11, candidatesTokenCount: 7 } }
          : { choices: [{ message: { content: '{"a":2}' } }], usage: { prompt_tokens: 13, completion_tokens: 5 } },
    };
  };
  const signal = new AbortController().signal;
  const g = await geminiProvider('k1', 'gemini-3.5-flash-lite', fetchImpl).call({ purpose: 'p', system: 'sys', user: 'hi', maxOutputTokens: 99 }, signal);
  const q = await groqProvider('k2', 'openai/gpt-oss-120b', fetchImpl).call({ purpose: 'p', system: 'sys', user: 'hi', maxOutputTokens: 99 }, signal);
  assert.equal(g.text, '{"a":1}');
  assert.equal(g.inputTokens, 11);
  assert.equal(seen[0]!.headers['x-goog-api-key'], 'k1');
  assert.equal(seen[0]!.body.generationConfig.responseMimeType, 'application/json');
  assert.deepEqual(seen[0]!.body.generationConfig.thinkingConfig, { thinkingLevel: 'minimal' });
  assert.ok(seen[0]!.body.generationConfig.maxOutputTokens > 99, 'headroom for thinking tokens');
  assert.equal(q.text, '{"a":2}');
  assert.equal(q.outputTokens, 5);
  assert.equal(seen[1]!.headers.authorization, 'Bearer k2');
  assert.deepEqual(seen[1]!.body.response_format, { type: 'json_object' });
  assert.equal(seen[1]!.body.model, 'openai/gpt-oss-120b');
  assert.equal(seen[1]!.body.reasoning_effort, 'low');
  assert.ok(seen[1]!.body.max_completion_tokens > 99, 'headroom for reasoning tokens');
  assert.equal(seen[1]!.body.max_tokens, undefined);
});

test('Gemini retries without a thinking level when the model rejects it; errors carry the provider reason', async () => {
  const bodies: any[] = [];
  const fetchImpl: FetchLike = async (_url, init) => {
    const body = JSON.parse(init.body);
    bodies.push(body);
    if (body.generationConfig.thinkingConfig) return { ok: false, status: 400, json: async () => ({ error: { message: 'thinking level not supported' } }) };
    return { ok: true, status: 200, json: async () => ({ candidates: [{ content: { parts: [{ text: 'hidden', thought: true }, { text: '{"ok":1}' }] } }] }) };
  };
  const r = await geminiProvider('k', 'gemini-3.5-flash', fetchImpl).call({ purpose: 'p', system: 's', user: 'u', maxOutputTokens: 50 }, new AbortController().signal);
  assert.equal(r.text, '{"ok":1}', 'thought parts are not part of the answer');
  assert.equal(bodies.length, 2);
  const old = await geminiProvider('k', 'gemini-2.5-flash', fetchImpl).call({ purpose: 'p', system: 's', user: 'u', maxOutputTokens: 50 }, new AbortController().signal);
  assert.equal(old.text, '{"ok":1}');
  assert.equal(bodies.length, 3, 'older models are never sent a thinking level');

  const failing: FetchLike = async () => ({ ok: false, status: 404, json: async () => ({ error: { message: 'model not found' } }) });
  await assert.rejects(groqProvider('k', 'gone-model', failing).call({ purpose: 'p', system: 's', user: 'u', maxOutputTokens: 5 }, new AbortController().signal), /groq 404: model not found/);
});

test('a timed-out provider is not retried; the next provider answers', async () => {
  let slowCalls = 0;
  const slow: Provider = { name: 'slow', model: 'm', call: (_r, signal) => { slowCalls++; return new Promise((_res, rej) => signal.addEventListener('abort', () => rej(new Error('aborted')))); } };
  const fast: Provider = { name: 'fast', model: 'm', call: async () => ({ text: '{}', provider: 'fast', model: 'm', inputTokens: 1, outputTokens: 1 }) };
  const r = await new AiGateway([slow, fast], { timeoutMs: 20, retryDelayMs: 1 }).generate({ purpose: 't', system: 's', user: 'u', maxOutputTokens: 5 });
  assert.equal(r?.provider, 'fast');
  assert.equal(slowCalls, 1);
});

test('practice help uses AI wording only when it passes; otherwise reviewed text', async () => {
  const task = generateL4(0, 'ignores_discount', { demo: true });
  // Good: explains the method with the givens, cites the passage, reveals no answers.
  const good = fakeProvider('gemini', [async () => ok('Use the price after the discount: 1,000 × (1 − 10%). Then divide the profit by that price and compare with 15%.', ['notes_ai'])]);
  const tutorGood = new AiPracticeTutor(new AiGateway([good]));
  const r1 = await tutorGood.explain({ diagnosis: 'ai_over_reliance', task, lang: 'en', sessionId: 's' });
  assert.ok(r1 && r1.outcome === 'ok');
  // Bad: reveals this task's margin (11.11 is not an allowed number for this tutor) → rejected.
  const leaky = fakeProvider('gemini', [async () => ok('The margin is 11.11%, so reject it.', ['notes_ai'])]);
  const r2 = await new AiPracticeTutor(new AiGateway([leaky])).explain({ diagnosis: 'ai_over_reliance', task, lang: 'en', sessionId: 's' });
  assert.equal(r2, null);

  // In the service, help applies to the CURRENT task (the next one after the attempt).
  const general = fakeProvider('gemini', [async () => ok('Use the price after the discount, divide the profit by that price, then compare the result with the rule.', ['notes_ai'])]);
  const store = new MemoryStore();
  const svc = new LearningService(store, { tutor: new AiPracticeTutor(new AiGateway([general])) });
  const v = await svc.startSession({ learnerId: 'a' });
  await svc.submitAttempt(v.sessionId, 'a', { idempotencyKey: 'k-12345678', answer: { salePrice: 900, profit: 100, marginPct: 11.11, decision: 'accept' } });
  const help = await svc.requestHelp(v.sessionId, 'a');
  assert.equal(help.help.origin, 'ai_checked');
});
