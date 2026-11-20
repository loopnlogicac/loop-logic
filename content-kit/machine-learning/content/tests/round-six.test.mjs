import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdtempSync, rmSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { loadTrace, playTrace } from '../../../tools/labs.mjs';

const pkg = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const planned = JSON.parse(readFileSync(join(pkg, '../spec/curriculum.json'), 'utf8'));
const topics = planned.modules.flatMap(module => (module.id === 'classification' ? module.topics.slice(0, 9) : module.id === 'evaluation' ? module.topics : []).map(topic => ({ ...topic, module: module.id })));
const labs = new Map();
for (const topic of topics) {
  const path = join(pkg, 'topics', topic.module, topic.id);
  const doc = JSON.parse(readFileSync(join(path, 'topic.json'), 'utf8'));
  for (const id of doc.labs ?? []) {
    const labPath = join(path, 'labs', id);
    labs.set(id, { topic: path, doc, lab: JSON.parse(readFileSync(join(labPath, 'lab.json'), 'utf8')), trace: loadTrace(readFileSync(join(labPath, 'trace.js'), 'utf8')) });
  }
}
const play = (id, input) => {
  const entry = labs.get(id);
  return playTrace('ml', entry.trace(input), { lines: entry.lab.pseudocode.length });
};
const first = id => structuredClone(labs.get(id).lab.presets[0].input);
const round = n => Math.round(n * 1000) / 1000;
function python(file) {
  const dir = mkdtempSync(join(tmpdir(), 'ml-round-six-'));
  try {
    const result = spawnSync('python3', ['-I', '-X', 'utf8', file], {
      cwd: dir, encoding: 'utf8', timeout: 30000,
      env: { ...process.env, MPLCONFIGDIR: join(tmpdir(), 'loop-logic-mpl'), OPENBLAS_NUM_THREADS: '1' }
    });
    assert.equal(result.status, 0, result.stderr);
    assert.doesNotMatch(result.stderr, /Warning:/);
    return result.stdout.trim();
  } finally { rmSync(dir, { recursive: true, force: true }); }
}
function printedVars(stdout) {
  return Object.fromEntries(stdout.split('\n').map(line => {
    const cut = line.indexOf(' ');
    assert.ok(cut > 0, line);
    const key = line.slice(0, cut), raw = line.slice(cut + 1);
    return [key, raw !== '' && Number.isFinite(Number(raw)) ? Number(raw) : raw];
  }));
}

test('requested classification and evaluation delivery has sixteen topics and thirteen complete labs', () => {
  assert.equal(topics.length, 16);
  assert.equal(labs.size, 13);
  for (const topic of topics) {
    const doc = JSON.parse(readFileSync(join(pkg, 'topics', topic.module, topic.id, 'topic.json'), 'utf8'));
    assert.equal(doc.review.status, 'draft');
    assert.ok(doc.quiz.filter(q => q.figure).length >= topic.visualQuiz);
  }
});

for (const [id, entry] of labs) test(`${id}: first-preset state matches executed scratch and library programs`, () => {
  const example = entry.doc.examples.find(e => e.id === entry.lab.codeExample);
  assert.equal(example.id, 'ex-1');
  const scratch = python(join(entry.topic, example.file));
  const library = python(join(entry.topic, entry.doc.examples[1].file));
  assert.equal(library, scratch, `${id}: both implementations must print the same result`);
  const expected = printedVars(scratch);
  const actual = JSON.parse(JSON.stringify(play(id, first(id)).vars));
  assert.deepEqual(actual, expected);
  for (const preset of entry.lab.presets) {
    const length = entry.trace(preset.input).steps.length;
    assert.ok(length >= 20 && length <= 400, `${id}/${preset.name}: ${length} teaching steps`);
  }
});

test('naive Bayes preserves literal bilingual training tokens and distinguishes unknown vocabulary', () => {
  const state = play('naive-bayes', first('naive-bayes'));
  assert.deepEqual(JSON.parse(JSON.stringify(state.tables.counts.cells)), [[0, 4], [4, 0]]);
  assert.equal(state.vars.prediction, 1);
  assert.equal(state.vars.logScore0, -4.277);
  const unknown = play('naive-bayes', { alpha: 1, query: 'unknown' });
  assert.equal(unknown.vars.prediction, 0);
  assert.equal(unknown.vars.logScore0, unknown.vars.logScore1);
});

test('threshold equality and score-policy changes preserve the actual-label cohort', () => {
  const input = first('confusion-matrix');
  assert.deepEqual(JSON.parse(JSON.stringify(play('confusion-matrix', input).vars)), { tn: 2, fp: 1, fn: 1, tp: 2 });
  assert.deepEqual(JSON.parse(JSON.stringify(play('confusion-matrix', { ...input, threshold: 0.8 }).vars)), { tn: 3, fp: 0, fn: 1, tp: 2 });
  const equal = { threshold: 0.5, points: [{ x: 0.5, y: 0, cls: 0 }, { x: 0.5, y: 1, cls: 1 }] };
  assert.deepEqual(JSON.parse(JSON.stringify(play('confusion-matrix', equal).vars)), { tn: 0, fp: 1, fn: 0, tp: 1 });
});

test('ROC trapezoids agree with an independent pair-ranking oracle across tied score collections', () => {
  let seed = 31;
  const next = () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0);
  for (let trial = 0; trial < 40; ++trial) {
    const points = Array.from({ length: 2 + next() % 11 }, () => ({ x: (next() % 11) / 10, y: 0, cls: (next() >>> 16) % 2 }));
    const positive = points.filter(p => p.cls === 1), negative = points.filter(p => p.cls === 0);
    const actual = play('roc-curve', { threshold: 0.5, points });
    if (!positive.length || !negative.length) { assert.equal(actual.vars.status, 'undefined'); assert.equal(actual.vars.auc, null); continue; }
    let credit = 0;
    for (const p of positive) for (const n of negative) credit += p.x > n.x ? 1 : p.x === n.x ? 0.5 : 0;
    assert.equal(actual.vars.auc, round(credit / (positive.length * negative.length)));
    const curve = actual.chart.series.roc.points;
    assert.deepEqual(Array.from(curve.at(-1)), [1, 1]);
    for (let i = 1; i < curve.length; ++i) assert.ok(curve[i][0] >= curve[i - 1][0] && curve[i][1] >= curve[i - 1][1]);
  }
});

test('logistic training uses edited labels and labels divergent steps honestly', () => {
  const input = first('logistic-training');
  const flipped = { ...input, points: input.points.map(p => ({ ...p, cls: 1 - p.cls })) };
  const state = play('logistic-training', flipped);
  assert.equal(state.vars.w1, -0.812);
  assert.equal(state.vars.w2, -0.812);
  assert.equal(state.vars.status, 'finished');
  assert.equal(play('logistic-training', { ...input, rate: 20 }).vars.status, 'diverged');
});

test('CART respects path rectangles, conflicting duplicates and its stated positive-gain stop', () => {
  const input = first('decision-tree'), state = play('decision-tree', input);
  assert.deepEqual(Array.from(state.plot.shapes['cut-n1'].from), [0, 4.5]);
  assert.deepEqual(Array.from(state.plot.shapes['cut-n1'].to), [3, 4.5]);
  const xor = [{ x: 1, y: 1, cls: 0 }, { x: 1, y: 5, cls: 1 }, { x: 5, y: 1, cls: 1 }, { x: 5, y: 5, cls: 0 }];
  const stopped = play('decision-tree', { ...input, depth: 4, points: xor });
  assert.equal(stopped.vars.nodes, 1);
  assert.equal(stopped.vars.correct, 2);
  assert.equal(stopped.vars.prediction, 0);
});

test('stratified CV assigns every row once and retains all five non-perfect fold scores', () => {
  const input = first('k-fold'), state = play('k-fold', input);
  assert.equal(state.vars.foldScores, '1.00,0.50,1.00,1.00,0.50');
  assert.equal(state.vars.mean, 0.8);
  const cells = state.tables.data.cells;
  for (const cls of [0, 1]) {
    const counts = Array(5).fill(0);
    cells.forEach(row => { if (row[2] === cls) ++counts[row[3] - 1]; });
    assert.deepEqual(counts, [1, 1, 1, 1, 1]);
  }
});

test('validation labels never enter the fitted neighbour vote', () => {
  const input = first('validation-curve');
  const flipped = { ...input, validation: input.validation.map(p => ({ ...p, cls: 1 - p.cls })) };
  const state = play('validation-curve', flipped);
  assert.equal(state.vars.trainingAccuracy, 1);
  assert.equal(state.vars.validationAccuracy, 0);
  assert.equal(state.vars.bestK, 6);
  assert.equal(state.vars.bestAccuracy, 0.5);
});

test('bootstrap seed reproduces actual fits and another seed changes their measured variation', () => {
  const input = first('bias-variance');
  const a = play('bias-variance', input).vars, b = play('bias-variance', input).vars;
  assert.deepEqual(JSON.parse(JSON.stringify(a)), JSON.parse(JSON.stringify(b)));
  const other = play('bias-variance', { ...input, seed: 1 }).vars;
  assert.ok(a.validationMSE !== other.validationMSE || a.predictionVariance !== other.predictionVariance);
});
