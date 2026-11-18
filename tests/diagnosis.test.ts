import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateL2, generateL4, factsFor } from '../src/core/scenario.ts';
import { cleanAnswer, grade } from '../src/core/grading.ts';
import { diagnose } from '../src/core/diagnosis.ts';
import { decideNext, isReady } from '../src/core/adaptation.ts';

const demo = generateL4(0, 'ignores_discount', { demo: true });
const run = (task: typeof demo, answer: Record<string, unknown>) => diagnose(task, grade(task, cleanAnswer(task, answer)));

test('fully correct answer', () => {
  assert.equal(run(demo, { salePrice: 900, profit: 100, marginPct: 11.11, decision: 'reject' }).code, 'correct');
});

test('markup used as margin (with a correct decision) → margin/markup confusion', () => {
  const d = run(demo, { salePrice: 900, profit: 100, marginPct: 12.5, decision: 'reject' });
  assert.equal(d.code, 'margin_markup_confusion');
  assert.equal(d.confidence, 'high');
});

test('followed the wrong coworker advice against own evidence → AI over-reliance', () => {
  const d = run(demo, { salePrice: 900, profit: 100, marginPct: 11.11, decision: 'accept' });
  assert.equal(d.code, 'ai_over_reliance');
  assert.equal(d.confidence, 'high');
});

test('correct numbers but decision against the rule, coworker was right → missed constraint', () => {
  const task = generateL4(7, 'correct_reject');
  const f = factsFor(task);
  const d = run(task, { salePrice: f.salePrice / 100, profit: f.profit / 100, marginPct: f.marginPct, decision: 'accept' });
  assert.equal(d.code, 'missed_constraint');
});

test('rejecting a discount that meets the rule → missed constraint (blanket rejection cannot pass)', () => {
  const task = generateL4(11, 'correct_accept');
  const f = factsFor(task);
  const d = run(task, { salePrice: f.salePrice / 100, profit: f.profit / 100, marginPct: f.marginPct, decision: 'reject' });
  assert.equal(d.code, 'missed_constraint');
});

test('ignored the discount (used list price) → arithmetic slip', () => {
  const d = run(demo, { salePrice: 1000, profit: 200, marginPct: 20, decision: 'reject' });
  assert.equal(d.code, 'arithmetic_slip');
  assert.ok(d.evidence.includes('used_list_price_not_discounted_price'));
});

test('consistent formula with a wrong upstream number → arithmetic slip', () => {
  const d = run(demo, { salePrice: 910, profit: 110, marginPct: 12.09, decision: 'reject' });
  assert.equal(d.code, 'arithmetic_slip');
});

test('unexplained answer stays uncertain, with alternatives', () => {
  const d = run(demo, { salePrice: 905, profit: 40, marginPct: 30, decision: 'reject' });
  assert.equal(d.code, 'uncertain');
  assert.equal(d.confidence, 'low');
  assert.ok(d.alternatives.length > 0);
});

test('L2: margin on cost → confusion; correct → correct', () => {
  const task = generateL2(5);
  const f = factsFor(task);
  assert.equal(run(task, { profit: f.profit / 100, marginPct: f.markupPct }).code, 'margin_markup_confusion');
  assert.equal(run(task, { profit: f.profit / 100, marginPct: f.marginPct }).code, 'correct');
});

test('each diagnosis triggers a different intervention with a reason', () => {
  const codes = ['margin_markup_confusion', 'arithmetic_slip', 'missed_constraint', 'ai_over_reliance'] as const;
  const actions = codes.map((c) => decideNext([{ kind: 'l4_coworker', correct: false, assisted: false, diagnosis: c, coworkerCase: 'ignores_discount' }]));
  assert.equal(new Set(actions.map((a) => a.action)).size, codes.length);
  for (const a of actions) assert.ok(a.reason.en.length > 20 && a.reason.bn.length > 20);
  // over-reliance is followed by a case where the coworker is RIGHT
  assert.equal(actions[3]!.nextCoworkerCase, 'correct_accept');
  // confusion is followed by a margin-only practice task
  assert.equal(actions[0]!.nextKind, 'l2_margin');
});

test('readiness needs two unassisted correct answers including an AI coworker case', () => {
  const c = (kind: 'l2_margin' | 'l4_coworker', assisted = false) => ({ kind, correct: true, assisted, diagnosis: 'correct' as const, coworkerCase: null });
  assert.equal(isReady([c('l2_margin'), c('l2_margin')]), false);
  assert.equal(isReady([c('l4_coworker', true), c('l4_coworker')]), false);
  assert.equal(isReady([c('l2_margin'), c('l4_coworker')]), true);
});

test('seeded generation is replayable', () => {
  assert.deepEqual(generateL4(1234, 'markup_error'), generateL4(1234, 'markup_error'));
  assert.deepEqual(generateL2(99), generateL2(99));
});

test('every coworker case can be generated across many seeds with realistic margins', () => {
  for (const c of ['ignores_discount', 'markup_error', 'correct_reject', 'correct_accept'] as const) {
    for (let seed = 1; seed <= 200; seed++) {
      const f = factsFor(generateL4(seed, c));
      assert.ok(f.profit > 0 && f.marginPct >= 3, `${c} seed ${seed}`);
    }
  }
});
