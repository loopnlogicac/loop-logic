// Ask AI chat: page context, evidence, checking, budget and fallbacks.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MemoryStore } from '../src/store/store.ts';
import { ReadingService } from '../src/reading/service.ts';
import { AiGateway, type Provider } from '../src/ai/gateway.ts';
import { LiveSearch } from '../src/library/live.ts';
import { VideoExtrasService } from '../src/app/video-extras.ts';
import { chatPage, courseSubject } from '../src/app/ask-context.ts';
import { getCourse } from '../src/content/courses.ts';
import { buildRoutes } from '../src/server/app.ts';

/** A provider that answers by citing whatever evidence ids it was given. */
function citingProvider(reply: (user: string) => object) {
  const p: Provider & { calls: number; lastUser: string } = {
    name: 'fake', model: 'fake-1', calls: 0, lastUser: '',
    async call(req) {
      p.calls++;
      p.lastUser = req.user;
      return { text: JSON.stringify(reply(req.user)), provider: 'fake', model: 'fake-1', inputTokens: 10, outputTokens: 10 };
    },
  } as never;
  return p;
}
const idsIn = (user: string) => [...user.matchAll(/"id":"([^"]+)"/g)].map((m) => m[1]!);

test('page context: video pages carry instructor code as evidence; subjects map to approved-site lists', async () => {
  const store = new MemoryStore();
  const extras = new VideoExtrasService(store);
  await extras.save('F8OWdzcf6go', { materials: [{ title: 'Hello program', code: '#include <stdio.h>\nint main(void) { printf("hi"); return 0; }' }, { title: 'Slides', url: 'https://example.com/s.pdf' }] });
  const page = await chatPage({ kind: 'video', courseId: 'c-programming', videoId: 'F8OWdzcf6go' }, 'en', extras);
  assert.equal(page.kind, 'video');
  assert.equal(page.subject, 'cs');
  assert.equal(page.evidence.length, 1, 'only materials with code or notes become evidence');
  assert.match(page.label, /C Programming Introduction/);
  assert.equal(courseSubject(getCourse('machine-learning')), 'ml');
  assert.equal(courseSubject(getCourse('electric-circuits')), 'ee');
  assert.equal((await chatPage({ kind: 'lesson', lessonId: 'cpu-scheduling' }, 'en', extras)).kind, 'lesson');
  assert.equal((await chatPage({ kind: 'video', courseId: 'nope', videoId: 'x' }, 'en', extras)).kind, 'page', 'unknown pages fall back safely');
});

test('chat: a checked answer cites page evidence; uncited or invented answers fall back; budget is enforced', async () => {
  const store = new MemoryStore();
  const extras = new VideoExtrasService(store);
  await extras.save('F8OWdzcf6go', { materials: [{ title: 'Hello program', code: '#include <stdio.h>\nint main(void) { printf("hi"); return 0; }' }] });
  const good = citingProvider((user) => ({ explanation: 'printf is declared in stdio.h, which the program includes at the top before main.', citations: [idsIn(user)[0]], insufficient_evidence: false }));
  const reading = new ReadingService(store, new AiGateway([good], { retryDelayMs: 1 }), new LiveSearch({ apiKey: null }), { dailyAiLimit: 2 });
  const page = await chatPage({ kind: 'video', courseId: 'c-programming', videoId: 'F8OWdzcf6go' }, 'en', extras);

  const r = await reading.chat('u1', { question: 'Why do we include stdio.h?', lang: 'en', page });
  assert.equal(r.origin, 'ai_checked');
  assert.match(r.text, /stdio\.h/);
  assert.equal(r.sources[0]!.title, 'Instructor material: Hello program');
  assert.equal(r.left, 1);
  assert.match(good.lastUser, /<learner_text>Question: Why do we include stdio\.h\?<\/learner_text>/, 'learner text is fenced as data');

  const again = await reading.chat('u1', { question: 'Why do we include stdio.h?', lang: 'en', page });
  assert.equal(good.calls, 1, 'same question answered from cache');
  assert.equal(again.origin, 'ai_checked');

  await reading.chat('u1', { selection: 'return 0;', question: '', lang: 'en', page });
  const over = await reading.chat('u1', { question: 'What does main return?', lang: 'en', page });
  assert.equal(good.calls, 2, 'no AI call once the daily limit is used');
  assert.match(over.text, /today’s AI answers/);
  assert.equal(over.left, 0);

  const liar = citingProvider(() => ({ explanation: 'This program prints the number 42 on the screen every time it runs.', citations: ['made-up'], insufficient_evidence: false }));
  const r2 = await new ReadingService(new MemoryStore(), new AiGateway([liar], { retryDelayMs: 1 }), new LiveSearch({ apiKey: null })).chat('u2', { question: 'What does it print?', lang: 'en', page });
  assert.notEqual(r2.origin, 'ai_checked', 'citations outside the evidence are rejected');
  assert.ok(!r2.text.includes('42'));

  await assert.rejects(reading.chat('u3', { question: '  ', lang: 'en', page }), /Type a question/);
});

test('ask routes are learner routes', () => {
  const routes = buildRoutes({ config: {} } as never);
  assert.equal(routes.find((r) => r.method === 'POST' && r.pattern.test('/api/ask'))!.auth, 'learner');
  assert.equal(routes.find((r) => r.method === 'GET' && r.pattern.test('/api/ask/limit'))!.auth, 'learner');
});
