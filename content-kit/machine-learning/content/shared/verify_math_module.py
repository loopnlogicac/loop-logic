"""Audit maths traces against independent numeric calculations and saved examples."""
import ast
import hashlib
import json
import os
from pathlib import Path
import re
import runpy
import subprocess
import sys
import tempfile

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
MODULE = ROOT / 'topics/math-intuition'
KIT = ROOT.parents[1]

JS = r'''
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import {join} from 'node:path';
const [kit, folder] = process.argv.slice(1);
const {loadTrace, playTrace} = await import(pathToFileURL(join(kit, 'tools/labs.mjs')));
const lab = JSON.parse(fs.readFileSync(join(folder, 'lab.json'), 'utf8'));
const trace = loadTrace(fs.readFileSync(join(folder, 'trace.js'), 'utf8'));
const inputs = JSON.parse(fs.readFileSync(0, 'utf8'));
const results = inputs.map(input => {
  const original = JSON.stringify(input);
  const result = trace(input);
  if (JSON.stringify(input) !== original) throw Error('Input mutated');
  const snapshot = JSON.stringify(result);
  if (JSON.stringify(trace(input)) !== snapshot) throw Error('Trace not deterministic');
  const state = playTrace('ml', result, {lines:lab.pseudocode.length});
  if (JSON.stringify(result) !== snapshot) throw Error('Playback mutated trace');
  return {state, steps:result.steps, init:result.init};
});
process.stdout.write(JSON.stringify(results));
'''


def numeric_equal(actual, expected, tolerance=0.000501):
    assert abs(actual-expected) <= tolerance, (actual, expected)


def coin(input):
    state, heads, checkpoints = input['seed'], 0, []
    for t in range(1, input['trials']+1):
        state = (1664525*state+1013904223) % 2**32
        heads += state/2**32 < input['probability']
        if t <= 20 or t % 5 == 0 or t == input['trials']:
            checkpoints.append([t, heads/t])
    return heads, checkpoints


def expected_vars(id, input):
    if id == 'vector-play':
        arrows = np.array([[p['x'], p['y']] for p in input['points']])
        total = arrows.sum(axis=0)
        scaled = input['scale']*total
        return dict(sumX=total[0], sumY=total[1], scaledX=scaled[0], scaledY=scaled[1])
    if id == 'distance-explorer':
        points = np.array([[p['x'], p['y']] for p in input['points']])
        delta = points[1]-points[0]
        return dict(dx=delta[0], dy=delta[1], euclidean=np.linalg.norm(delta),
                    manhattan=np.abs(delta).sum())
    if id == 'mean-and-spread':
        values = np.array([*input['values'], input['outlier']])
        return dict(mean=values.mean(), median=np.median(values),
                    variance=values.var(ddof=0), std=values.std(ddof=0))
    if id == 'line-explorer':
        points = np.array([[p['x'], p['y']] for p in input['points']])
        residual = points[:, 1]-(input['slope']*points[:, 0]+input['intercept'])
        return dict(prediction=input['slope']*input['qx']+input['intercept'],
                    mse=np.mean(residual**2))
    if id == 'curve-shapes':
        x = input['x']
        return dict(line=2*x+1, square=x*x, exp=np.exp(x), log=np.log(x),
                    sigmoid=1/(1+np.exp(-x)))
    if id == 'coin-flips':
        heads, _ = coin(input)
        return dict(heads=heads, trials=input['trials'], frequency=heads/input['trials'])
    if id == 'bayes-table':
        tp = input['sick']*input['sensitivity']
        fp = (1000-input['sick'])*input['falsePositive']
        return dict(truePositive=tp, falsePositive=fp, positive=tp+fp,
                    posterior=tp/(tp+fp))
    if id == 'roll-to-the-bottom':
        # Closed-form recurrence is independent of the iterative trace implementation.
        error = (input['start']-1)*(1-2*input['lr'])**input['iterations']
        return dict(x=1+error, cost=error**2)
    if id == 'matrix-vector':
        X = np.array([[p['x'], p['y']] for p in input['points']])
        output = X @ np.array([input['w1'], input['w2']])
        return dict(rows=X.shape[0], cols=2, total=output.sum())
    raise AssertionError(id)


def random_input(fields, rng):
    input = {}
    for f in fields:
        if f['type'] == 'number':
            count = round((f['max']-f['min'])/f['step'])
            input[f['name']] = round(f['min']+int(rng.integers(count+1))*f['step'], 6)
        elif f['type'] == 'int':
            input[f['name']] = int(rng.integers(f['min'], f['max']+1))
        elif f['type'] == 'int-array':
            n = int(rng.integers(f['minLength'], f['maxLength']+1))
            input[f['name']] = rng.integers(f['min'], f['max']+1, size=n).tolist()
        elif f['type'] == 'points':
            n = int(rng.integers(f['minLength'], f['maxLength']+1))
            input[f['name']] = [dict(x=float(x)/10, y=float(y)/10)
                                for x, y in rng.integers(0, 101, size=(n, 2))]
        else:
            raise AssertionError(f)
    return input


def run_program(code, stdin='', files=()):
    with tempfile.TemporaryDirectory() as directory:
        path = Path(directory)/'main.py'
        path.write_text(code)
        for file in files:
            (Path(directory)/file.name).write_bytes(file.read_bytes())
        result = subprocess.run([sys.executable, '-I', '-X', 'utf8', str(path)],
                                cwd=directory, input=stdin, text=True, capture_output=True,
                                check=True, env={**os.environ, 'MPLCONFIGDIR': directory,
                                                'XDG_CACHE_HOME': directory,
                                                'OMP_NUM_THREADS': '1'})
        assert not result.stderr, result.stderr
        return result.stdout


def check_drawn_arithmetic(id, input, result):
    state = result['state']
    if id == 'vector-play':
        expected = expected_vars(id, input)
        assert np.allclose(state['plot']['shapes']['sum']['to'], [expected['sumX'], expected['sumY']])
        assert np.allclose(state['plot']['shapes']['scaled']['to'], [expected['scaledX'], expected['scaledY']])
    elif id == 'mean-and-spread':
        values = np.array([*input['values'], input['outlier']])
        squares = (values-values.mean())**2
        for pair, value in zip(state['chart']['series']['squares']['points'], squares):
            numeric_equal(pair[1], value)
    elif id == 'line-explorer':
        for i, point in enumerate(input['points']):
            gap = state['plot']['shapes'][f'gap{i}']
            assert gap['to'] == [point['x'], point['y']]
            numeric_equal(gap['from'][1], input['slope']*point['x']+input['intercept'])
    elif id == 'curve-shapes':
        functions = dict(line=lambda x: 2*x+1, square=lambda x: x*x,
                         exp=np.exp, log=np.log, sigmoid=lambda x: 1/(1+np.exp(-x)))
        for name, series in state['chart']['series'].items():
            for x, y in series['points']:
                if name == 'log':
                    assert x > 0
                numeric_equal(y, functions[name](x))
    elif id == 'coin-flips':
        _, expected = coin(input)
        for actual, target in zip(state['chart']['series']['frequency']['points'], expected):
            assert actual[0] == target[0]
            numeric_equal(actual[1], target[1])
    elif id == 'bayes-table':
        v = expected_vars(id, input)
        expected = [[v['truePositive'], input['sick']-v['truePositive']],
                    [v['falsePositive'], 1000-input['sick']-v['falsePositive']]]
        for actual, target in zip(state['tables']['counts']['cells'], expected):
            for a, b in zip(actual, target):
                numeric_equal(a, b)
        numeric_equal(sum(sum(row) for row in expected), 1000)
    elif id == 'roll-to-the-bottom':
        updates = [s for s in result['steps'] if s['op'] == 'series-set']
        assert len(updates) == input['iterations']
        x = input['start']
        for t, step in enumerate(updates, 1):
            x -= input['lr']*2*(x-1)
            # Both coordinates, including the cost, move in the SAME operation.
            assert step['id'] == 'ball'
            numeric_equal(step['points'][0][0], x)
            assert np.isclose(step['points'][0][1], (x-1)**2, rtol=1e-12, atol=1e-10)
            assert step['vars']['iteration'] == t
    elif id == 'matrix-vector':
        X = np.array([[p['x'], p['y']] for p in input['points']])
        output = X @ [input['w1'], input['w2']]
        for actual, expected in zip(state['tables']['output']['cells'], output):
            numeric_equal(actual[0], expected)
        assert state['tables']['x']['cells'] == X.tolist()


def main():
    assert json.loads((ROOT/'manifest.json').read_text())['packageVersion'] == '0.4.0'
    rng = np.random.default_rng(2026)
    traces = programs = 0
    for entry in json.loads((ROOT/'shared/math-labs.json').read_text())['labs']:
        folder = MODULE/entry['topic']
        lab_folder = folder/'labs'/entry['id']
        lab = json.loads((lab_folder/'lab.json').read_text())
        inputs = [p['input'] for p in lab['presets']]
        inputs += [c['input'] for c in lab['checks']]
        inputs += [random_input(lab['inputs'], rng) for _ in range(35)]
        result = subprocess.run(['node', '--input-type=module', '-e', JS, str(KIT),
                                 str(lab_folder)], input=json.dumps(inputs), text=True,
                                capture_output=True, check=True)
        assert not result.stderr, result.stderr
        outcomes = json.loads(result.stdout)
        for i, (input, outcome) in enumerate(zip(inputs, outcomes)):
            expected = expected_vars(lab['id'], input)
            for name, value in expected.items():
                # Closed-form powers can differ by a few ulps on large divergent costs.
                actual = outcome['state']['vars'][name]
                assert np.isclose(actual, value, rtol=1e-12, atol=0.000501), (lab['id'], name, actual, value)
            if i < len(lab['presets']):
                assert 20 <= len(outcome['steps']) <= 400, (lab['id'], len(outcome['steps']))
            check_drawn_arithmetic(lab['id'], input, outcome)
            traces += 1
        topic = json.loads((folder/'topic.json').read_text())
        assert lab['codeExample'] == 'ex-1'
        defaults = outcomes[0]['state']['vars']
        paired_outputs = []
        for example in topic['examples'][:2]:
            actual = run_program((folder/example['file']).read_text())
            assert actual == (folder/example['output']).read_text()
            paired_outputs.append(actual)
            for name, value in json.loads(actual).items():
                numeric_equal(defaults[name], value)
        assert json.loads(paired_outputs[0]) == json.loads(paired_outputs[1])
    print(f'{traces} maths traces: independent numeric answers, drawn calculations, purity, determinism and preset lengths passed.')
    print('Nine default lab results agree with both from-scratch and NumPy programs; gradient position and cost move together.')

    builder = runpy.run_path(str(ROOT/'shared/make_math_figures.py'))
    figures = builder['build']()
    assert figures == json.loads((ROOT/'shared/math-figures.json').read_text())
    assert len(figures) == 22
    # Independent numeric checks of key pictured claims.
    assert figures['matrix']['panels']['tables']['counts']['cells'][1] == [2, 3, 1, 7]
    assert figures['mean-outlier']['panels']['tables']['counts']['cells'][1][2] == 3
    assert figures['coin-counts']['panels']['tables']['counts']['cells'][-1] == [100, 52, 0.52]
    assert figures['partial']['panels']['tables']['counts']['cells'] == [[4, 2, 41], [3, 2, 36], [4, 1, 27]]
    picture_count = quiz_programs = 0
    for topic_path in sorted(MODULE.glob('*/topic.json')):
        folder = topic_path.parent
        topic = json.loads(topic_path.read_text())
        body = (folder/'body.en.html').read_text()
        assert 'callout story' in body
        if topic['kind'] == 'lesson':
            for layer in ['intuition', 'how-it-works', 'try-it-yourself', 'examples', 'going-deeper']:
                assert f'id="{layer}"' in body
            assert 'callout unplugged' in body
        for item in [*topic['examples'], *topic['practice'], *topic['quiz']]:
            source = folder/item.get('file', item.get('solution', '__missing__'))
            code = source.read_text() if source.is_file() else item.get('code', '')
            if not code:
                continue
            tree = ast.parse(code)
            imports = {n.names[0].name.split('.')[0] for n in ast.walk(tree)
                       if isinstance(n, ast.Import)}
            imports |= {n.module.split('.')[0] for n in ast.walk(tree)
                        if isinstance(n, ast.ImportFrom) and n.module}
            assert imports & {'numpy', 'pandas', 'sklearn', 'matplotlib'} <= set(item.get('requires', []))
            if 'file' in item:
                output = run_program(code, files=[ROOT/f for f in item.get('workdirFiles', [])])
                assert output == (folder/item['output']).read_text(), source
                programs += 1
            if item.get('type') == 'output':
                assert run_program(code).strip() == item['options'][item['answer']].strip()
                quiz_programs += 1
        for q in topic['quiz']:
            if 'figure' in q:
                assert q['figure'] in figures.values()
                picture_count += 1
    assert picture_count == 28
    sheet = MODULE/'ml-math-practice-sheet'
    questions = json.loads((sheet/'topic.json').read_text())['quiz']
    for i, key in enumerate(builder['WARMUPS'], 1):
        assert questions[i-1]['figure'] == figures[key]
        assert (sheet/f'assets/warm-up-{i}.svg').read_text() == builder['svg'](figures[key])
    print(f'{programs} saved examples and {quiz_programs} output questions reproduced; package declarations and all lesson layers checked.')
    print('28 picture questions match 22 computed figures; six printable SVGs match their quiz panels exactly.')

    datasets = sorted((ROOT/'shared/datasets').glob('*.csv'))
    def hashes():
        return [hashlib.sha256(p.read_bytes()).hexdigest() for p in datasets]
    before = hashes()
    for _ in range(2):
        result = subprocess.run([sys.executable, '-I', '-X', 'utf8',
                                 str(ROOT/'shared/datasets/make_datasets.py')],
                                capture_output=True, check=True)
        assert not result.stderr
        assert hashes() == before
    print('All six course CSV files remained byte-identical after two complete regenerations.')


if __name__ == '__main__':
    main()
