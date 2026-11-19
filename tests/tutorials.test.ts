import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { TutorialService, cleanHtml } from '../src/app/tutorials.ts';
import { MemoryStore } from '../src/store/store.ts';

const kit = join(dirname(fileURLToPath(import.meta.url)), '..', 'content-kit');
const store = new MemoryStore();
const tut = new TutorialService(store, kit);

test('tutorials load the accepted content-kit packages', () => {
  const l = tut.list('en');
  assert.ok(l.totals.topics >= 100, `topics: ${l.totals.topics}`);
  const ds = l.tracks.find((t) => t.id === 'data-structures')!;
  assert.ok(ds.available && ds.labs >= 7);
  for (const t of l.tracks) assert.equal(t.available, t.delivered > 0, `${t.id}: available only when it has delivered topics`);
});

test('a topic page hides quiz answers and solutions', () => {
  const p = tut.topic('data-structures', 'ds-reverse-linked-list', 'en');
  assert.ok(p.topic.bodyHtml.includes('<h2'));
  assert.ok(p.quiz.length >= 10);
  for (const q of p.quiz) { assert.equal('answer' in q, false); assert.equal('explanation' in q, false); }
  assert.ok(p.examples.every((e) => e.code.length > 0));
  assert.ok(p.labs.length >= 1);
});

test('quiz answers are graded on the server and recorded', async () => {
  const p = tut.topic('data-structures', 'ds-reverse-linked-list', 'en');
  const r = await tut.gradeQuiz('data-structures', 'ds-reverse-linked-list', 'learner-1', { [p.quiz[0]!.id]: 0, [p.quiz[1]!.id]: 3 }, 'en');
  assert.equal(r.answered, 2);
  assert.ok(Object.values(r.results).every((x) => typeof x.explanation === 'string' && Number.isInteger(x.answer)));
});

test('labs run in the sandbox and reject bad input', () => {
  const p = tut.topic('data-structures', 'ds-reverse-linked-list', 'en');
  const lab = tut.lab('data-structures', 'ds-reverse-linked-list', p.labs[0]!, 'en');
  const run = tut.runLab('data-structures', 'ds-reverse-linked-list', p.labs[0]!, lab.presets[0].input, 'en');
  assert.ok(run.steps.length > 1);
  assert.throws(() => tut.runLab('data-structures', 'ds-reverse-linked-list', p.labs[0]!, { values: 'nope' }, 'en'), /must be/);
});

test('unknown topics are 404s, not crashes', () => {
  assert.throws(() => tut.topic('c', 'no-such-topic', 'en'), (e: any) => e.status === 404);
  assert.throws(() => tut.track('nope', 'en'), (e: any) => e.status === 404);
});

test('cleanHtml removes scripts, handlers and unsafe links', () => {
  const out = cleanHtml('<p onclick="x()">a<script>alert(1)</script><a href="javascript:x">b</a><img src="http://evil/x.png"><a href="https://ok.org">c</a></p>');
  assert.ok(!/script|onclick|javascript|evil/.test(out), out);
  assert.ok(out.includes('href="https://ok.org"'));
});

test('Ask AI gets the matching sections of the topic as evidence', () => {
  const c = tut.chatContext('data-structures', 'ds-reverse-linked-list', 'why do we save next before changing cur->next?');
  assert.ok(c && c.evidence.length >= 1 && c.evidence.every((e) => e.text.length > 0));
});
