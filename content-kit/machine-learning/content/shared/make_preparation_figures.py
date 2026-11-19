"""Recompute preparation quiz panels and their matching printable worksheet figures."""
from html import escape
import json
from pathlib import Path

import numpy as np
from sklearn.preprocessing import MinMaxScaler, StandardScaler, OneHotEncoder

ROOT = Path(__file__).resolve().parents[1]
WARMUPS = ['encoding', 'scale-neighbour', 'split-quotas', 'feature-time']


def table(cells, columns):
    return {'tables': {'data': dict(rows=len(cells), cols=len(columns),
                                   cells=cells, colLabels=columns)}}


def cloud(xs, ys):
    return {'plot': dict(xRange=[-3, 3], yRange=[-3, 5], xLabel='x', yLabel='y',
                         points=[dict(id=f'p{i}', x=float(x), y=float(y))
                                 for i, (x, y) in enumerate(zip(xs, ys))])}


def build():
    figures = {}

    def add(key, en, bn, panels):
        figures[key] = dict(caption=dict(en=en, bn=bn), panels=panels)

    available = [('Past marks', -30), ('Study hours', -1), ('Final marks', 1)]
    add('feature-time', 'Predict at day 0; negative days are before prediction.',
        'দিন ০-তে প্রেডিকশন চাই; ঋণাত্মক দিন মানে তার আগে।',
        table([[name, day, 'Yes' if day <= 0 else 'No'] for name, day in available],
              ['Candidate', 'Available day', 'Known at day 0?']))
    add('types', 'Stored values and their meanings are different questions.',
        'কীভাবে রাখা আর কী বোঝায়, সেটা আলাদা করে ভাবো।',
        table([['Rooms', 2, 3, 'Count'], ['District code', 1, 2, 'Name'],
               ['Area (sq ft)', 600.5, 800.0, 'Measurement'],
               ['Service level', 'low', 'high', 'Ordered']],
              ['Field', 'Example A', 'Example B', 'Meaning']))
    observed = np.array([2., 4., 6., 8.])
    add('fill', 'Only the four observed x values fit the replacement statistic.',
        'x-এর মাপা চারটা মান দিয়েই ফাঁকা ঘর পূরণের মান শেখো।',
        table([[i+1, v if v is not None else '?', float(np.median(observed)) if v is None else v]
               for i, v in enumerate([2, 4, None, 6, 8, None])],
              ['Row', 'Observed x', 'Median fill']))
    altered = observed.copy()
    altered[-1] = 40
    add('fill-outlier', 'One observed value changes from 8 to 40.',
        'মাপা একটা মান 8 থেকে 40 হলো; গড় আর মাঝের মান দেখো।',
        table([['Before', float(observed.mean()), float(np.median(observed))],
               ['After', float(altered.mean()), float(np.median(altered))]],
              ['Observed set', 'Mean', 'Median']))
    names = np.array(['Badda', 'Mirpur', 'Uttara', 'Badda', 'Mirpur', 'Uttara'])
    encoder = OneHotEncoder(sparse_output=False).fit(names.reshape(-1, 1))
    encoded = encoder.transform(names.reshape(-1, 1)).astype(int)
    add('encoding', 'Training district names become three fixed indicator columns.',
        'ট্রেনিংয়ের ডিস্ট্রিক্টের নাম থেকে তিনটা নির্দিষ্ট ০/১ কলাম হলো।',
        table([[name, *row.tolist()] for name, row in zip(names, encoded)],
              ['District', *encoder.categories_[0].tolist()]))
    codes = np.arange(3)
    add('encoding-distance', 'Arbitrary district codes produce unequal numeric distances.',
        'ডিস্ট্রিক্টকে ইচ্ছেমতো কোড দিলে সংখ্যার দূরত্বও ইচ্ছেমতো হয়।',
        table([['Badda/Mirpur', int(abs(codes[0]-codes[1]))],
               ['Badda/Uttara', int(abs(codes[0]-codes[2]))],
               ['Mirpur/Uttara', int(abs(codes[1]-codes[2]))]], ['Pair', 'Code distance']))
    rows = np.array([[1, 100], [2, 900], [3, 300], [3, 680], [5, 500], [6, 600]], dtype=float)
    query = np.array([[3., 800.]])
    scaler = MinMaxScaler().fit(rows)
    transformed = scaler.transform(rows)
    tq = scaler.transform(query)[0]
    raw_d = np.linalg.norm(rows-query[0], axis=1)
    scaled_d = np.linalg.norm(transformed-tq, axis=1)
    add('scale-neighbour', 'Distances from query (3,800), with training-fitted min-max scaling.',
        'কোয়েরি (3,800) থেকে দূরত্ব; min-max স্কেল ট্রেনিং পয়েন্ট থেকে শেখা।',
        table([[i+1, round(float(a), 3), round(float(b), 3)]
               for i, (a, b) in enumerate(zip(raw_d, scaled_d))],
              ['Row', 'Raw distance', 'Scaled distance']))
    add('scale-range', 'Transform x using training minimum 1 and maximum 6; do not refit on the query.',
        'ট্রেনিংয়ের সর্বনিম্ন 1 আর সর্বোচ্চ 6 দিয়ে x বদলাও; কোয়েরি দিয়ে আবার শেখাবে না।',
        table([[v, round((v-1)/5, 3)] for v in [1, 2, 3, 4, 6, 8]],
              ['Original x', 'Transformed x']))
    standard = StandardScaler().fit_transform(rows)
    add('scale-standard', 'Population standardisation on all six training points.',
        'ট্রেনিংয়ের ছয়টা পয়েন্টে population standardisation করা হয়েছে।',
        table([[j+1, round(float(standard[:, j].mean()), 3),
                round(float(standard[:, j].std()), 3)] for j in range(2)],
              ['Feature', 'Mean', 'Population SD']))
    counts = np.array([7, 3])
    quota = counts*3/counts.sum()
    allocated = np.floor(quota).astype(int)
    allocated[np.argmax(quota-allocated)] += 3-int(allocated.sum())
    add('split-quotas', 'Three test places are allocated from class counts seven and three.',
        'দুই ক্লাসে সাতটা আর তিনটা সারি; টেস্টের তিনটা জায়গা ভাগ করো।',
        table([[c, int(counts[c]), round(float(quota[c]), 1), int(allocated[c]),
                int(counts[c]-allocated[c])] for c in range(2)],
              ['Class', 'Source', 'Ideal test', 'Test', 'Train']))
    # Six independent time positions; only preceding rows may train a future predictor.
    add('split-time', 'Predict day 6 using the first four days, validate on day 5.',
        'দিন ৬-এর জন্য প্রেডিকশন; প্রথম চার দিন ট্রেনিং, দিন ৫ ভ্যালিডেশন।',
        table([[i, 'Train' if i < 5 else 'Validation' if i == 5 else 'Test']
               for i in range(1, 7)], ['Day', 'Role']))
    xs = np.array([-2., -1., 0., 0., 1., 2.])
    noise = np.array([1., -2., 1., 1., -2., 1.])
    xs /= xs.std()
    noise /= noise.std()
    for key, r, bn in [('corr-positive', .6, 'ধনাত্মক'), ('corr-negative', -1., 'ঋণাত্মক')]:
        ys = r*xs + np.sqrt(1-r*r)*noise
        measured = float(np.corrcoef(xs, ys)[0, 1])
        add(key, f'Six computed points; Pearson r = {measured:.3f}.',
            f'হিসাব করা ছয়টা পয়েন্টে {bn} করিলেশন দেখো।', cloud(xs, ys))
    ux = np.arange(-2, 3, dtype=float)
    uy = ux**2
    add('corr-curve', f'Five points on y=x*x; Pearson r = {np.corrcoef(ux, uy)[0, 1]:.3f}.',
        'y=x*x বাঁকে পাঁচটা পয়েন্ট; সরলরেখার করিলেশন শূন্য হলেও সম্পর্ক আছে।', cloud(ux, uy))
    return figures


def svg(figure):
    """Print the worksheet's table panels with exactly the quiz cell values."""
    grid = figure['panels']['tables']['data']
    width = 840/grid['cols']
    parts = ['<svg xmlns="http://www.w3.org/2000/svg" width="900" height="500" viewBox="0 0 900 500">',
             '<rect width="900" height="500" fill="white"/>']
    for i, row in enumerate([grid['colLabels'], *grid['cells']]):
        for j, value in enumerate(row):
            x, y = 30+j*width, 35+i*48
            parts.append(f'<rect x="{x}" y="{y}" width="{width}" height="48" fill="{"#dbeafe" if i == 0 else "#f8fafc"}" stroke="#64748b"/>')
            parts.append(f'<text x="{x+8}" y="{y+30}" font-family="sans-serif" font-size="16" fill="#172554">{escape(str(value))}</text>')
    caption = figure['caption']['en']
    # Keep the explanatory caption within the page at a readable text size.
    words = caption.split()
    lines = ['']
    for word in words:
        if len(lines[-1])+len(word) > 95:
            lines.append('')
        lines[-1] += (' ' if lines[-1] else '')+word
    for i, line in enumerate(lines):
        parts.append(f'<text x="30" y="{450+i*20}" font-family="sans-serif" font-size="14" fill="#172554">{escape(line)}</text>')
    return '\n'.join([*parts, '</svg>\n'])


def main():
    figures = build()
    (ROOT/'shared/preparation-figures.json').write_text(
        json.dumps(figures, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    assets = ROOT/'topics/data-preparation/ml-data-practice-sheet/assets'
    assets.mkdir(parents=True, exist_ok=True)
    for i, key in enumerate(WARMUPS, 1):
        (assets/f'warm-up-{i}.svg').write_text(svg(figures[key]), encoding='utf-8')
    print(f'Computed {len(figures)} preparation figures and {len(WARMUPS)} printable pictures.')


if __name__ == '__main__':
    main()
