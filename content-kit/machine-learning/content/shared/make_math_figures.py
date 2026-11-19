"""Compute the maths module's panel figures and six matching printable pictures."""
from html import escape
import json
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
WORKSHEET = ROOT / 'topics/math-intuition/ml-math-practice-sheet'
WARMUPS = ['distance', 'line', 'mean-outlier', 'coin-counts', 'bayes', 'matrix']


def table(cells, columns, rows=None):
    grid = dict(rows=len(cells), cols=len(columns), cells=cells, colLabels=columns)
    if rows:
        grid['rowLabels'] = rows
    return {'tables': {'counts': grid}}


def chart(series, x='x', y='y'):
    return {'chart': dict(xLabel=x, yLabel=y, series=[
        dict(id=f's{i}', label=label, type='line', tone='active', points=points)
        for i, (label, points) in enumerate(series)])}


def plot(points=(), shapes=None):
    return {'plot': dict(xRange=[-1, 10], yRange=[-1, 10], xLabel='x', yLabel='y',
                         points=[dict(id=f'p{i}', x=float(x), y=float(y))
                                 for i, (x, y) in enumerate(points)], shapes=shapes or {})}


def build():
    figures = {}

    def put(key, en, bn, panels):
        figures[key] = dict(caption=dict(en=en, bn=bn), panels=panels)

    a, b = np.array([2, 1]), np.array([1, 3])
    total = a + b
    put('vector-add', 'Follow a then b from the head of a.', 'a-এর মাথা থেকে b ধরে এগোও।',
        plot(shapes=dict(a=dict(type='arrow', **{'from': [0, 0]}, to=a.tolist(), label='a'),
                         b=dict(type='arrow', **{'from': a.tolist()}, to=total.tolist(), label='b'),
                         sum=dict(type='arrow', **{'from': [0, 0]}, to=total.tolist(), label='a + b'))))
    put('vector-scale', 'Arrow a and three times a share an origin.', 'a আর তার তিন গুণ একই জায়গা থেকে শুরু।',
        plot(shapes=dict(a=dict(type='arrow', **{'from': [0, 0]}, to=a.tolist(), label='a'),
                         scaled=dict(type='arrow', **{'from': [0, 0]}, to=(3*a).tolist(), label='3a'))))
    p, q = np.array([1, 1]), np.array([4, 5])
    put('distance', 'Endpoints (1,1) and (4,5): horizontal, vertical and straight routes.',
        'দুই মাথা (1,1) আর (4,5); আড়াআড়ি, খাড়া আর সোজা পথ দেখো।',
        plot([p, q], dict(h=dict(type='segment', **{'from': p.tolist()}, to=[4, 1], label='3 across'),
                         v=dict(type='segment', **{'from': [4, 1]}, to=q.tolist(), label='4 up'),
                         d=dict(type='segment', **{'from': p.tolist()}, to=q.tolist(), label='Straight'))))
    put('distance-scale', 'Differences for two candidates, before and after converting metres to centimetres.',
        'দুই প্রার্থীর পার্থক্য; মিটার থেকে সেন্টিমিটারে বদলে কী হয় দেখো।',
        table([['A', 1, 4, 100, 4], ['B', 3, 0, 300, 0]],
              ['Candidate', 'Height m', 'Other gap', 'Height cm', 'Other gap']))
    put('distance-zero', 'Two records have equal feature coordinates.', 'দুই রেকর্ডের ফিচারের মান একই।',
        table([['A', 3, 4], ['B', 3, 4]], ['Record', 'x', 'y']))
    values = np.array([2, 2, 3, 3, 4, 6], dtype=float)
    put('mean', 'Six observations with their population mean and median.', 'ছয়টি মানের গড় আর মাঝের মান পড়ো।',
        plot([(v, (i % 3)/5) for i, v in enumerate(values)],
             dict(mean=dict(type='line', w=[1, 0], b=-float(values.mean()), label='Mean 3.333'),
                  median=dict(type='line', w=[1, 0], b=-float(np.median(values)), label='Median 3', dash=True))))
    altered = values.copy(); altered[-1] = 24
    put('mean-outlier', 'Only the last observation changes from 6 to 24.', 'শুধু শেষ মানটা 6 থেকে 24 হয়েছে।',
        table([['Before', float(values.mean()), float(np.median(values))],
               ['After', float(altered.mean()), float(np.median(altered))]], ['Set', 'Mean', 'Median']))
    put('mean-spread', 'Two five-score sets with the same mean.', 'দুই দলের পাঁচটি করে স্কোর; গড় একই।',
        table([['A', 3, 3, 3, 3, 3], ['B', 1, 2, 3, 4, 5]], ['Set', 'p1', 'p2', 'p3', 'p4', 'p5']))
    xs = np.arange(5)
    put('line', 'A line goes through the computed points of y = 2x + 1.', 'y = 2x + 1 রেখার হিসাব করা বিন্দুগুলো দেখো।',
        plot(list(zip(xs, 2*xs+1)), dict(rule=dict(type='line', w=[2, -1], b=1, label='y = 2x + 1'))))
    put('line-residual', 'The observed point (2,6) sits above the line prediction (2,5).',
        '(2,6) আসল মান; রেখার প্রেডিকশন (2,5)-এর ওপরে আছে।',
        plot([(2, 6)], dict(rule=dict(type='line', w=[2, -1], b=1, label='y = 2x + 1'),
                           gap=dict(type='segment', **{'from': [2, 5]}, to=[2, 6], label='Residual'))))
    put('line-negative', 'Predictions fall by two for every unit of x.', 'x এক ঘর বাড়লে প্রেডিকশন দুই কমে।',
        table([[int(x), int(8-2*x)] for x in range(5)], ['x', 'Predicted y']))
    xs = np.arange(-3, 4, dtype=float)
    put('curves', 'Line 2x+1 and square x*x, sampled at seven inputs.', 'সাতটা ইনপুটে 2x+1 রেখা আর x*x বাঁক তুলনা করো।',
        chart([('2x+1', list(map(list, zip(xs.tolist(), (2*xs+1).tolist())))),
               ('x*x', list(map(list, zip(xs.tolist(), (xs*xs).tolist()))))], 'Input', 'Output'))
    sx = np.arange(-4, 5, dtype=float)
    put('sigmoid', 'Sigmoid values approach zero and one without reaching them at finite inputs.',
        'সসীম ইনপুটে sigmoid শূন্য আর একের কাছে যায়, কিন্তু ছোঁয় না।',
        chart([('Sigmoid', [[float(x), round(float(1/(1+np.exp(-x))), 3)] for x in sx])], 'Input', 'Sigmoid'))
    state, heads, history = 7, 0, []
    for t in range(1, 101):
        state = (1664525*state + 1013904223) % 2**32
        heads += state/2**32 < 0.5
        if t in [10, 20, 50, 100]:
            history.append([t, heads, round(heads/t, 3)])
    put('coin-counts', 'Four checkpoints of one seeded fair-coin simulation.', 'সিড ঠিক রাখা কয়েন পরীক্ষার চারটা সময়ের হিসাব।',
        table(history, ['Flips', 'Heads', 'Heads share']))
    put('coin-path', 'Running frequency at checkpoints and the chosen probability 0.5.',
        'কয়েক ধাপের হেডের হার আর ঠিক করা সম্ভাবনা 0.5 দেখো।',
        chart([('Frequency', [[t, f] for t, _, f in history]), ('Probability', [[t, 0.5] for t, _, _ in history])], 'Flips', 'Heads share'))
    counts = np.array([[9, 1], [99, 891]])
    put('bayes', 'Expected counts among 1000 people: row groups and test-result columns.',
        'হাজার জনের জন্য আশা করা সংখ্যা; অসুস্থতা সারিতে আর টেস্টের ফল কলামে।',
        table([['Ill', *counts[0].tolist()], ['Healthy', *counts[1].tolist()]], ['Group', 'Positive', 'Negative']))
    put('independence', 'Among 100 people, half of each group carries a bag.', 'একশ জনের দুই দলের অর্ধেক করে ব্যাগ এনেছে।',
        table([['Group A', 20, 20], ['Group B', 30, 30]], ['Group', 'Bag', 'No bag']))
    gx = np.arange(-1, 5, dtype=float)
    put('bowl', 'Cost (x-1)^2 has its bottom at x=1.', 'cost (x-1)^2-এর নিচের জায়গা x=1।',
        chart([('Cost', [[float(x), float((x-1)**2)] for x in gx])], 'x', 'Cost'))
    walks = []
    for rate in [0.25, 1.25]:
        x = 4.0; history = [[0, (x-1)**2]]
        for t in range(1, 7):
            x -= rate*2*(x-1); history.append([t, round((x-1)**2, 3)])
        walks.append((f'lr={rate}', history))
    put('steps', 'Two learning rates on the same bowl and starting position.', 'একই বাটি আর শুরুতে দুই learning rate-এর cost দেখো।',
        chart(walks, 'Iteration', 'Cost'))
    put('partial', 'Vary one knob while keeping the other fixed: cost (x-1)^2 + 2(y+2)^2.',
        'একটা মান স্থির রেখে অন্যটা বদলাও; cost (x-1)^2 + 2(y+2)^2।',
        table([[4, 2, 41], [3, 2, 36], [4, 1, 27]], ['x', 'y', 'Cost']))
    X = np.array([[1, 2], [3, 1], [2, 4], [0, 2], [4, 0]])
    w = np.array([2, 1])
    put('matrix', 'Five rows, weights (2,1), and the actual row dot products.', 'পাঁচটা সারি, ওজন (2,1) আর প্রতি সারির ডট প্রোডাক্ট।',
        table([[i+1, *row.tolist(), int(v)] for i, (row, v) in enumerate(zip(X, X@w))],
              ['Row', 'Feature 1', 'Feature 2', 'Output']))
    put('transpose', 'A 3 by 2 matrix beside its 2 by 3 transpose.', '3 বাই 2 ম্যাট্রিক্স আর তার 2 বাই 3 transpose দেখো।',
        {'tables': {'original': dict(rows=3, cols=2, cells=X[:3].tolist()),
                    'transposed': dict(rows=2, cols=3, cells=X[:3].T.tolist())}})
    return figures


def svg(figure):
    """Render the worksheet's single table or geometric plot without external assets."""
    parts = ['<svg xmlns="http://www.w3.org/2000/svg" width="900" height="520" viewBox="0 0 900 520">',
             '<rect width="900" height="520" fill="white"/>']

    def text(x, y, value, size=17):
        parts.append(f'<text x="{x}" y="{y}" font-family="sans-serif" font-size="{size}" fill="#172554">{escape(str(value))}</text>')

    panels = figure['panels']
    if 'tables' in panels:
        grid = next(iter(panels['tables'].values()))
        columns = grid['colLabels']
        width = 830/len(columns)
        for i, row in enumerate([columns] + grid['cells']):
            for j, value in enumerate(row):
                x, y = 30+j*width, 45+i*48
                parts.append(f'<rect x="{x}" y="{y}" width="{width}" height="48" fill="{ "#dbeafe" if i == 0 else "#f8fafc"}" stroke="#64748b"/>')
                text(x+10, y+30, f'{value:.3f}' if isinstance(value, float) else value)
    else:
        panel = panels['plot']
        def xy(v):
            return 80 + (v[0]+1)*34, 420 - (v[1]+1)*34
        for tick in range(11):
            x, y = xy([tick, tick])
            text(x-3, 451, tick, 12); text(31, y+4, tick, 12)
        parts.append('<path d="M46 40 V454 H455" fill="none" stroke="#334155"/>')
        text(225, 485, 'x'); text(25, 25, 'y')
        for i, shape in enumerate(panel.get('shapes', {}).values()):
            if shape['type'] == 'line':
                a, b = shape['w']; c = shape['b']
                if b:
                    start, end = [0, -c/b], [4, -(4*a+c)/b]
                else:
                    start, end = [-c/a, 0], [-c/a, 10]
            else:
                start, end = shape['from'], shape['to']
            x1,y1 = xy(start); x2,y2 = xy(end)
            colour = ['#2563eb','#ea580c','#0f766e'][i%3]
            parts.append(f'<path d="M{x1} {y1} L{x2} {y2}" stroke="{colour}" stroke-width="3"/>')
            text(490, 100+i*45, shape.get('label', ''), 19)
        for point in panel['points']:
            x,y = xy([point['x'],point['y']])
            parts.append(f'<circle cx="{x}" cy="{y}" r="6" fill="#172554"/>')
            text(x+9,y-7,f"({point['x']:g},{point['y']:g})",13)
    text(30, 510, figure['caption']['en'], 13)
    return '\n'.join(parts+['</svg>\n'])


def main():
    figures = build()
    (ROOT/'shared/math-figures.json').write_text(json.dumps(figures, ensure_ascii=False, indent=2)+'\n')
    assets = WORKSHEET/'assets'; assets.mkdir(parents=True, exist_ok=True)
    for index, key in enumerate(WARMUPS, 1):
        (assets/f'warm-up-{index}.svg').write_text(svg(figures[key]))
    print(f'Computed {len(figures)} maths figures and {len(WARMUPS)} printable pictures.')


if __name__ == '__main__':
    main()
