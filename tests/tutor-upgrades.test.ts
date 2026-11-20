// Trusted sources page, reading style on tutorials (Simpler / Concise) and the
// quick check before an explanation.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { MemoryStore } from '../src/store/store.ts';
import { TutorialService } from '../src/app/tutorials.ts';
import { ReadingService } from '../src/reading/service.ts';
import { AiGateway, type Provider } from '../src/ai/gateway.ts';
import { LiveSearch } from '../src/library/live.ts';
import { TutorialStyleService } from '../src/app/tutorial-style.ts';
import { trustedSources } from '../src/app/sources.ts';
import { APPROVED_SITES, PASSAGES } from '../src/content/library.ts';
import { chatPage } from '../src/app/ask-context.ts';
import { VideoExtrasService } from '../src/app/video-extras.ts';
import { pageMeta } from '../src/server/seo.ts';

const kit = join(dirname(fileURLToPath(import.meta.url)), '..', 'content-kit');
const tutorials = new TutorialService(new MemoryStore(), kit);
const TRACK = 'c', TOPIC = 'c-pointers-and-strings';

function provider(reply: (user: string) => object) {
  const p: Provider & { calls: number; lastUser: string } = {
    name: 'fake', model: 'fake-1', calls: 0, lastUser: '',
    async call(req) { p.calls++; p.lastUser = req.user; return { text: JSON.stringify(reply(req.user)), provider: 'fake', model: 'fake-1', inputTokens: 10, outputTokens: 10 }; },
  } as never;
  return p;
}
const idsIn = (user: string) => [...user.matchAll(/"id":"([^"]+)"/g)].map((m) => m[1]!);

function setup(p: Provider | null, limit = 10) {
  const store = new MemoryStore();
  const gateway = new AiGateway(p ? [p] : [], { retryDelayMs: 1 });
  const reading = new ReadingService(store, gateway, new LiveSearch({ apiKey: null }), { dailyAiLimit: limit });
  return { store, reading, style: new TutorialStyleService(store, gateway, reading, tutorials) };
}

test('trusted sources: built from the data the AI reads (tutorial sections, notes, approved sites)', () => {
  const s = trustedSources(tutorials, 'en');
  assert.ok(s.tutorials.topics >= 100 && s.tutorials.sections > s.tutorials.topics, `topics ${s.tutorials.topics}, sections ${s.tutorials.sections}`);
  assert.equal(s.tutorials.tracks.reduce((n, t) => n + t.topics, 0), s.tutorials.topics);
  assert.ok(s.tutorials.bangla > 0 && s.tutorials.bangla < s.tutorials.topics);
  assert.equal(s.library.passages, PASSAGES.length);
  assert.equal(s.sites.flatMap((g) => g.sites).length, Object.values(APPROVED_SITES).flat().length, 'every approved site is listed');
  assert.ok(s.sites.flatMap((g) => g.sites).every((x) => x.url === `https://${x.domain}`));
  assert.match(trustedSources(tutorials, 'bn').sites[0]!.name, /[ঀ-৿]/, 'subject names in Bangla');
  const meta = pageMeta('/sources.html', new URLSearchParams(), 'https://loopnlogic.com', { tutorials } as never);
  assert.match(meta.title, /Trusted sources/);
  assert.equal(meta.noindex, false);
});

test('simpler wording: checked against the section, stored once and shared by every learner', async () => {
  const good = provider((user) => ({ explanation: 'A string pointer points at the first letter of some text.\n\nThe text ends where the zero character is.', citations: [idsIn(user)[0]], insufficient_evidence: false }));
  const { store, reading, style } = setup(good, 2);
  const r = await style.simpler('u1', TRACK, TOPIC, 'introduction', 'en');
  assert.equal(r.origin, 'ai_checked');
  assert.match(r.text!, /zero character/);
  assert.match(good.lastUser, /"id":"tutorial:c-pointers-and-strings#introduction"/);
  assert.match(good.lastUser, /Do not add new facts/);
  assert.equal(reading.aiCallsLeft('u1'), 1, 'a fresh rewrite uses one of the learner’s AI answers');
  const again = await style.simpler('u2', TRACK, TOPIC, 'introduction', 'en');
  assert.equal(again.cached, true);
  assert.equal(good.calls, 1, 'second learner gets the stored version');
  assert.equal(reading.aiCallsLeft('u2'), 2, 'stored versions are free');
  assert.ok(await store.getDoc('simpler_section', 'c:c-pointers-and-strings:introduction:en'));
  await assert.rejects(style.simpler('u1', TRACK, TOPIC, 'no-such-section', 'en'), /not found/i);
});

test('simpler wording: invented numbers, AI off and the daily limit all leave the original text', async () => {
  const bad = provider((user) => ({ explanation: 'A string pointer can hold 9999 letters before the zero character ends it.', citations: [idsIn(user)[0]], insufficient_evidence: false }));
  const a = setup(bad);
  const r = await a.style.simpler('u1', TRACK, TOPIC, 'introduction', 'en');
  assert.deepEqual(r, { origin: 'unavailable', reason: 'check_failed' });
  assert.equal(await a.store.getDoc('simpler_section', 'c:c-pointers-and-strings:introduction:en'), undefined, 'a failed rewrite is never stored');

  assert.deepEqual(await setup(null).style.simpler('u1', TRACK, TOPIC, 'introduction', 'en'), { origin: 'unavailable', reason: 'ai_off' });

  const c = setup(provider(() => ({ explanation: 'unused', citations: [], insufficient_evidence: false })), 1);
  assert.equal(c.reading.useAi('u1'), true);
  assert.deepEqual(await c.style.simpler('u1', TRACK, TOPIC, 'introduction', 'en'), { origin: 'unavailable', reason: 'limit' });
});

test('suggested style follows the reading profile and says why', async () => {
  const { reading, style } = setup(null);
  assert.equal((await style.suggestion('u1', TRACK, 'en')).suggested, 'standard');
  for (let i = 0; i < 3; i++) await reading.addSignals('u1', [{ kind: 'term_selected', subject: 'cs' }]);
  const s = await style.suggestion('u1', TRACK, 'en');
  assert.equal(s.suggested, 'simpler');
  assert.match(s.why!, /looked up several terms/);
  assert.equal((await style.suggestion('u1', 'machine-learning', 'en')).suggested, 'standard', 'levels are per subject');
  for (let i = 0; i < 6; i++) await reading.addSignals('u2', [{ kind: 'quiz', subject: 'cs', correct: true }]);
  const up = await style.suggestion('u2', TRACK, 'bn');
  assert.equal(up.suggested, 'concise');
  assert.match(up.why!, /[ঀ-৿]/);
});

test('quick check: no answer key in the question; a right answer pitches the explanation concise, a wrong one simpler', async () => {
  const { reading, style } = setup(null);
  const { question } = style.quickCheck('u1', TRACK, TOPIC, 'en');
  assert.ok(question && question.options.length >= 2);
  assert.equal('answer' in question!, false);
  const right = tutorials.gradeAnswer(TRACK, TOPIC, question!.id, 0, 'en').answer;
  const ok = await style.gradeQuickCheck('u1', TRACK, TOPIC, { id: question!.id, choice: right }, 'en');
  assert.equal(ok.correct, true);
  assert.equal(ok.style, 'concise');
  assert.equal((await reading.profile('u1')).counters.quizStreak.cs, 1, 'the answer counts as reading evidence');
  const no = await style.gradeQuickCheck('u1', TRACK, TOPIC, { id: question!.id, choice: (right + 1) % question!.options.length }, 'en');
  assert.equal(no.style, 'simpler');
  assert.deepEqual(await style.gradeQuickCheck('u1', TRACK, TOPIC, { skip: true }, 'en'), { correct: null, style: 'standard' });
  await assert.rejects(style.gradeQuickCheck('u1', TRACK, TOPIC, { id: question!.id, choice: 99 }, 'en'));
});

test('chat: the answer style shapes the prompt and is part of the cache key; tutorial selections count as look-ups', async () => {
  const p = provider((user) => ({ explanation: 'A pointer to a string literal selects text you must leave unchanged.', citations: [idsIn(user)[0]], insufficient_evidence: false }));
  const { reading } = setup(p);
  const page = await chatPage({ kind: 'tutorial', track: TRACK, topic: TOPIC }, 'en', new VideoExtrasService(new MemoryStore()), tutorials, 'string literal');
  await reading.chat('u1', { question: 'Explain this', selection: 'string literal', lang: 'en', page, style: 'simpler' });
  assert.match(p.lastUser, /very simple everyday words/);
  await reading.chat('u1', { question: 'Explain this', selection: 'string literal', lang: 'en', page, style: 'concise' });
  assert.match(p.lastUser, /brief and precise/);
  assert.equal(p.calls, 2, 'different styles are cached separately');
  await reading.chat('u1', { question: 'Explain this', selection: 'string literal', lang: 'en', page, style: 'concise' });
  assert.equal(p.calls, 2);
  assert.equal((await reading.profile('u1')).counters.termSelections.cs, 3);
});
