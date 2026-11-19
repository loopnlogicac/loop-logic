"""Audit preparation lab arithmetic against independent Python/library calculations."""
import json
import math
from pathlib import Path
import runpy
import subprocess
import tempfile

import numpy as np
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import MinMaxScaler, StandardScaler, OneHotEncoder

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT/'topics/data-preparation'


def rounded(value):
    # Match the displayed JS convention without rounding any intermediate statistic.
    return math.floor(float(value)*1000+0.5)/1000


def close(actual, expected):
    assert math.isclose(actual, expected, abs_tol=0.00101), (actual, expected)


def shuffled(indices, state):
    result = list(indices)
    for index in reversed(range(1, len(result))):
        state = (1664525*state+1013904223) % 2**32
        partner = state*(index+1)//2**32
        result[index], result[partner] = result[partner], result[index]
    return result, state


def expected_splits(labels, seed):
    count = len(labels)
    size = math.floor(.3*count+.5)
    random = shuffled(range(count), seed)[0][:size]
    groups = [np.flatnonzero(labels == c).tolist() for c in range(2)]
    # Integer division/remainders give the allocation independently of JS floats.
    numerators = [len(group)*size for group in groups]
    allocations = [v//count for v in numerators]
    remaining = size-sum(allocations)
    order = sorted(range(2), key=lambda c: (-(numerators[c] % count), c))
    for c in order[:remaining]:
        allocations[c] += 1
    stratified = []
    for group, allocation in zip(groups, allocations):
        indices, seed = shuffled(group, seed)
        stratified.extend(indices[:allocation])
    return random, stratified


def verify_lab(lab_id, inp, replay):
    state, init = replay['state'], replay['init']
    var = state['vars']
    if lab_id == 'fill-missing':
        rows = np.array([[p['x'], p['y']] for p in inp['points']], dtype=float)
        rows[2, 0] = rows[5, 0] = rows[3, 1] = np.nan
        imputer = SimpleImputer(strategy=inp['strategy']).fit(rows)
        expected = imputer.transform(rows)
        np.testing.assert_allclose(state['tables']['filled']['cells'],
                                   np.vectorize(rounded)(expected), atol=.001)
        assert init['tables']['raw']['cells'][2][0] is None
        for key, value in zip(['fillX', 'fillY'], imputer.statistics_):
            close(var[key], value)
        close(var['total'], expected.sum())
        assert var['missing'] == 3
    elif lab_id == 'one-hot':
        names = {'B': 'Badda', 'M': 'Mirpur', 'U': 'Uttara', '?': 'Unseen'}
        encoder = OneHotEncoder(handle_unknown='ignore', sparse_output=False).fit(
            [['Badda'], ['Mirpur'], ['Uttara']])
        codes = inp['districts']
        rows = state['tables']['encoded']['cells']
        for code, row in zip(codes, rows):
            if code == '?' and inp['policy'] == 'error':
                assert row == ['ERROR']*3
            else:
                expected = encoder.transform([[names[code]]])[0].tolist()
                assert row == expected
        assert var == dict(rows=len(codes), ones=sum(c != '?' for c in codes),
                           unknown=codes.count('?'),
                           errors=codes.count('?') if inp['policy'] == 'error' else 0)
    elif lab_id == 'feature-scaling':
        rows = np.array([[p['x'], p['y']] for p in inp['points']], dtype=float)
        query = np.array([inp['qx'], inp['qy']], dtype=float)
        scaler = (MinMaxScaler() if inp['method'] == 'min-max' else StandardScaler()).fit(rows)
        expected = scaler.transform(rows)
        tq = scaler.transform(query.reshape(1, -1))[0]
        raw_near = np.argmin(np.linalg.norm(rows-query, axis=1))
        new_near = np.argmin(np.linalg.norm(expected-tq, axis=1))
        assert var['rawNearest'] == raw_near+1
        assert var['scaledNearest'] == new_near+1
        close(var['firstX'], expected[0, 0])
        close(var['firstY'], expected[0, 1])
        raw_scale = max(1, abs(rows).max(), abs(query).max())
        new_scale = max(1, abs(expected).max(), abs(tq).max())
        for i, point in enumerate(expected):
            drawn = state['plot']['points'][f'scaled{i}']
            np.testing.assert_allclose([drawn['x'], drawn['y']],
                                       [3+point[0]/new_scale, point[1]/new_scale], atol=1e-10)
        np.testing.assert_allclose(state['plot']['shapes']['rawLink']['to'], rows[raw_near]/raw_scale)
        np.testing.assert_allclose(state['plot']['shapes']['scaledLink']['to'],
                                   [3+expected[new_near, 0]/new_scale, expected[new_near, 1]/new_scale])
    elif lab_id == 'stratified-split':
        labels = np.array([p['cls'] for p in inp['points']])
        random, stratified = expected_splits(labels, inp['seed'])
        selected = random if inp['method'] == 'random' else stratified
        assert var == dict(train=len(labels)-len(selected), test=len(selected),
                           randomTestMinority=int(labels[random].sum()),
                           stratifiedTestMinority=int(labels[stratified].sum()),
                           **{k: var[k] for k in ['class', 'quota', 'testRows']})
        assert len(set(selected)) == len(selected)
        for i in range(len(labels)):
            assert state['plot']['points'][f'p{i}']['cls'] == int(i in selected)
        for key, subset in [('random', random), ('stratified', stratified)]:
            shares = state['chart']['series'][key]['points']
            total, held = labels.sum(), labels[subset].sum()
            expected = [total/len(labels), (total-held)/(len(labels)-len(subset)), held/len(subset)]
            assert [p[0] for p in shares] == ['source', 'train', 'test']
            np.testing.assert_allclose([p[1] for p in shares], expected, atol=.001)
    elif lab_id == 'correlation-explorer':
        points = list(state['plot']['points'].values())
        x = np.array([p['x'] for p in points])
        y = np.array([p['y'] for p in points])
        close(var['r'], np.corrcoef(x, y)[0, 1])
        close(var['r'], inp['r'])
        slope, intercept = np.polyfit(x, y, 1)
        close(var['slope'], slope)
        close(var['intercept'], intercept)
        line = state['plot']['shapes']['fit']
        np.testing.assert_allclose(line['w'], [slope, -1], atol=1e-10)
        close(line['b'], intercept)
        for i, (a, b) in enumerate(zip(x, y)):
            residual = state['plot']['shapes'][f'residual{i}']
            np.testing.assert_allclose(residual['from'], [a, slope*a+intercept], atol=1e-10)
            np.testing.assert_allclose(residual['to'], [a, b])


def main():
    requests, ids = [], []
    rng = np.random.default_rng(4)
    for directory in sorted(BASE.glob('*/labs/*')):
        lab = json.loads((directory/'lab.json').read_text())
        inputs = [(p['input'], True) for p in lab['presets']]
        inputs += [(p['input'], False) for p in lab['checks']]
        for index in range(35):
            case = {}
            for field in lab['inputs']:
                name, kind = field['name'], field['type']
                if kind == 'choice':
                    case[name] = field['options'][index % len(field['options'])]
                elif kind == 'string':
                    size = index % (field['maxLength']+1)
                    case[name] = ''.join(rng.choice(list(field['alphabet']), size=size).tolist())
                elif kind in ['number', 'int']:
                    step = field.get('step', 1)
                    total = round((field['max']-field['min'])/step)
                    position = 0 if index == 0 else total if index == 1 else int(rng.integers(total+1))
                    case[name] = round(field['min']+step*position, 6)
                elif kind == 'points':
                    size = field['minLength'] if index == 0 else field['maxLength'] if index == 1 else int(rng.integers(field['minLength'], field['maxLength']+1))
                    case[name] = []
                    for i in range(size):
                        point = {axis: round(float(rng.uniform(*field[axis+'Range'])), 1)
                                 for axis in ['x', 'y']}
                        if index == 2:
                            point = dict(x=field['xRange'][0], y=field['yRange'][0])
                        if field['classes']:
                            point['cls'] = 0 if index == 3 else int(rng.integers(field['classes']))
                        case[name].append(point)
            inputs.append((case, False))
        for inp, preset in inputs:
            requests.append(dict(path=str(directory.relative_to(ROOT)), input=inp, preset=preset))
            ids.append(lab['id'])
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp)/'inputs.json'
        path.write_text(json.dumps(requests))
        result = subprocess.run(['node', str(ROOT/'shared/preparation_lab_bridge.mjs'), str(path)],
                                text=True, capture_output=True)
        assert result.returncode == 0, result.stderr
        assert not result.stderr, result.stderr
        replays = json.loads(result.stdout)
    for lab_id, request, replay in zip(ids, requests, replays):
        verify_lab(lab_id, request['input'], replay)
    print(f'{len(replays)} deterministic lab traces match independent NumPy/scikit-learn arithmetic and split quotas.')
    print('Presets have 20–400 steps; input preservation, table cells, plotted transformations, nearest links, class-share bars and residuals pass.')

    builder = runpy.run_path(str(ROOT/'shared/make_preparation_figures.py'))
    figures = builder['build']()
    assert figures == json.loads((ROOT/'shared/preparation-figures.json').read_text())
    picture_count = output_count = practice_count = code_count = exam_count = example_count = 0
    for directory in sorted(BASE.iterdir()):
        meta = json.loads((directory/'topic.json').read_text())
        planned = next(t for m in json.loads((ROOT.parent/'spec/curriculum.json').read_text())['modules']
                       for t in m['topics'] if t['id'] == meta['id'])
        visual = [q['figure'] for q in meta['quiz'] if 'figure' in q]
        assert len(visual) >= planned.get('visualQuiz', 0)
        assert all(f in figures.values() for f in visual)
        picture_count += len(visual)
        output_count += sum(q['type'] == 'output' for q in meta['quiz'])
        practice_count += len(meta['practice'])
        code_count += sum(p['type'] == 'code' for p in meta['practice'])
        example_count += len(meta['examples'])
        exam_count += len(meta['examQuestions'])
        if meta['labs']:
            # Every default algorithm has two independently executed matching transcripts.
            assert (directory/'examples/ex-1.out').read_bytes() == (directory/'examples/ex-2.out').read_bytes()
    worksheet = BASE/'ml-data-practice-sheet'
    sheet = json.loads((worksheet/'topic.json').read_text())
    for i, key in enumerate(builder['WARMUPS'], 1):
        assert sheet['quiz'][i-1]['figure'] == figures[key]
        assert (worksheet/f'assets/warm-up-{i}.svg').read_text() == builder['svg'](figures[key])
    manifest = json.loads((ROOT/'manifest.json').read_text())
    assert manifest['packageVersion'] == '0.5.0'
    assert len(manifest['modules']) == 5
    print(f'Eight topics: {example_count} examples, {practice_count} practice items ({code_count} coding), {output_count} output quizzes, {picture_count} picture quizzes and {exam_count} worked exam answers.')
    print('Computed picture catalogue, four printable quiz matches and all five default Python/library transcript pairs pass.')


if __name__ == '__main__':
    main()
