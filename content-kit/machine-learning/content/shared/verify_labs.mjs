// Additional content checks: exact Python agreement, data flow and edge behaviour.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { loadTrace, playTrace, fuzzInputs } from '../../../tools/labs.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const module = join(root, 'topics/ml-for-everyone');
const specs = [
  ['ml-data-features-labels', 'cards-to-points'],
  ['ml-learning-a-rule', 'learn-a-threshold'],
  ['ml-train-and-test', 'exam-split'],
];
let replayed = 0;
for (const [topic, id] of specs) {
  const folder = join(module, topic, 'labs', id);
  const lab = JSON.parse(readFileSync(join(folder, 'lab.json'), 'utf8'));
  const trace = loadTrace(readFileSync(join(folder, 'trace.js'), 'utf8'));
  const replay = input => {
    const result = trace(input);
    const state = playTrace('ml', result, { lines: lab.pseudocode.length });
    replayed++;
    return { result, state };
  };
  const first = replay(lab.presets[0].input);
  const reference = spawnSync('python3', ['-I', '-X', 'utf8', join(folder, 'reference.py')], { encoding: 'utf8' });
  assert.equal(reference.status, 0, reference.stderr);
  assert.equal(reference.stderr, '');
  assert.equal(reference.stdout, readFileSync(join(folder, 'reference.out'), 'utf8'));
  if (id === 'cards-to-points') {
    const vars = first.state.vars;
    assert.equal(reference.stdout.split('\n')[0], `cards=${vars.cards} apples=${vars.apples} mangoes=${vars.mangoes}`);
    const p6 = first.state.plot.points.p6;
    assert.equal(reference.stdout.split('\n')[1], `p6: size=${p6.x} sweetness=${p6.y} label=mango`);
  } else if (id === 'learn-a-threshold') {
    const vars = first.state.vars;
    assert.equal(reference.stdout.split('\n')[0], `threshold=${vars.threshold} mistakes=${vars.mistakes}`);
    assert.equal(reference.stdout.split('\n')[1], `bestThreshold=${vars.bestThreshold} bestMistakes=${vars.bestMistakes}`);
  } else {
    const vars = first.state.vars;
    assert.equal(reference.stdout.split('\n')[0], `trainSize=${vars.trainSize} testSize=${vars.testSize} threshold=${vars.threshold}`);
    for (const model of ['flat', 'simple', 'flexible']) {
      const train = first.state.chart.series.train.points.find(([name]) => name === model)[1];
      const test = first.state.chart.series.test.points.find(([name]) => name === model)[1];
      assert(reference.stdout.includes(`${model}: trainMistakes=${train} testMistakes=${test}\n`));
    }
  }
  for (const preset of lab.presets) {
    const { result } = replay(preset.input);
    assert(result.steps.length >= 20 && result.steps.length <= 400, `${id}: ${preset.name} length ${result.steps.length}`);
  }
  for (const input of fuzzInputs(lab.inputs, 35)) {
    const { state, result } = replay(input);
    if (id === 'cards-to-points') {
      assert.equal(Object.keys(state.plot.points).length, input.points.length);
      assert.equal(state.vars.apples, input.points.filter(p => p.cls === 0).length);
      input.points.forEach((p, i) => {
        for (const key of ['x', 'y', 'cls']) assert.equal(state.plot.points['p' + (i + 1)][key], p[key]);
      });
    } else if (id === 'learn-a-threshold') {
      const count = t => input.points.reduce((total, p) => total + Number(Number(p.x > t) !== p.cls), 0);
      const trials = Array.from({ length: 21 }, (_, i) => i / 2);
      const minimum = Math.min(...trials.map(count));
      const smallest = trials.find(t => count(t) === minimum);
      assert.equal(state.vars.mistakes, count(input.threshold));
      assert.equal(state.vars.bestThreshold, smallest);
      assert.equal(state.vars.bestMistakes, minimum);
      assert.deepEqual(state.chart.series.errors.points, trials.map(t => [t, count(t)]));
    } else {
      const changed = JSON.parse(JSON.stringify(input));
      changed.points.slice(-input.testCount).forEach(p => { p.cls = 1 - p.cls; });
      const alternate = replay(changed);
      // Flip only test answers: every fitted region and pre-reveal guess must stay fixed.
      assert.deepEqual(state.plot.regions, alternate.state.plot.regions);
      assert.equal(state.vars.threshold, alternate.state.vars.threshold);
      const guesses = steps => steps.filter(s => s.op === 'point-mark' && s.line === 4).map(s => s.vars);
      assert.deepEqual(guesses(result.steps), guesses(alternate.result.steps));
      const trainSize = input.points.length - input.testCount;
      const hidden = result.init.plot.points.slice(trainSize);
      assert(hidden.every(p => p.cls === null && p.label.includes('?')));
      const train = input.points.slice(0, trainSize);
      const simplePred = x => Number(x > state.vars.threshold);
      const nearestPred = x => train.map((p, i) => ({ p, i, d: Math.abs(p.x - x) }))
        .sort((a, b) => a.d - b.d || a.i - b.i)[0].p.cls;
      const majority = Number(train.filter(p => p.cls === 1).length > train.length / 2);
      const predictors = { simple: simplePred, flexible: nearestPred, flat: () => majority };
      for (const [model, predict] of Object.entries(predictors)) {
        for (const [part, cards] of [['train', train], ['test', input.points.slice(trainSize)]]) {
          const expected = cards.filter(p => predict(p.x) !== p.cls).length;
          const actual = state.chart.series[part].points.find(([name]) => name === model)[1];
          assert.equal(actual, expected, `${id} ${model} ${part}`);
        }
      }
      state.plot.regions.cells.forEach(row => row.forEach((cls, col) => {
        assert.equal(cls, predictors[input.model]((col + 0.5) / 2));
      }));
    }
  }
  console.log(`${id}: Python agreement, preset length and independent input checks passed.`);
}
console.log(`Replayed ${replayed} traces; hidden-label changes left training and pre-reveal predictions unchanged.`);
