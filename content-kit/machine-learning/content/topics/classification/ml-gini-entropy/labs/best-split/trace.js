function trace(input) {
  const points = input.points.map((p, i) => ({ ...p, id: 'p' + i }));
  const round = v => Math.round(v * 1000) / 1000;
  const note = (en, bn) => ({ en, bn });
  function impurity(rows) {
    if (!rows.length) return 0;
    const p = rows.filter(r => r.cls === 1).length / rows.length;
    if (input.criterion === 'entropy') return [p, 1-p].reduce((s, v) => s - (v ? v * Math.log2(v) : 0), 0);
    return 1 - p*p - (1-p)*(1-p);
  }
  const parent = impurity(points), candidates = [];
  for (const feature of ['x', 'y']) {
    const values = [...new Set(points.map(p => p[feature]))].sort((a, b) => a - b);
    for (let i = 1; i < values.length; ++i) {
      const threshold = (values[i-1] + values[i]) / 2;
      const left = points.filter(p => p[feature] <= threshold), right = points.filter(p => p[feature] > threshold);
      const li = impurity(left), ri = impurity(right);
      const weighted = (left.length * li + right.length * ri) / points.length;
      candidates.push({ feature, threshold, left, right, li, ri, weighted, gain: parent - weighted });
    }
  }
  const init = { plot: {
    xRange: [0, 6], yRange: [0, 6], xLabel: 'Size score', yLabel: 'Sweetness score',
    classes: [{ id: 0, label: 'Apple' }, { id: 1, label: 'Mango' }], points
  }, tables: { candidates: { rows: Math.max(1, candidates.length), cols: 6,
    rowLabels: Array.from({ length: Math.max(1, candidates.length) }, (_, i) => String(i + 1)),
    colLabels: ['Feature', 'Threshold', 'Left mix', 'Right mix', 'Weighted', 'Gain'] } },
  chart: { xLabel: 'Candidate row', yLabel: 'Impurity gain', series: [{ id: 'gain', label: 'Gain', type: 'bar', points: [] }] } };
  const steps = [{ op: 'note', line: 1, note: note(`Parent ${input.criterion} impurity is ${round(parent)}. We compare all distinct-value midpoints.`,
    `Parent-এর ${input.criterion} impurity ${round(parent)}। আলাদা মানের মাঝের সব midpoint তুলনা করব।`) }];
  let best = null, bestIndex = -1;
  for (let row = 0; row < candidates.length; ++row) {
    const c = candidates[row];
    steps.push({ op: 'shape', id: 'candidate', type: 'line', w: c.feature === 'x' ? [1,0] : [0,1], b: -c.threshold, dash: true, line: 2,
      note: note(`Try ${c.feature}<=${round(c.threshold)}: left ${c.left.length}, right ${c.right.length}.`, `${c.feature}<=${round(c.threshold)} পরীক্ষা করো: বামে ${c.left.length}, ডানে ${c.right.length}।`) });
    steps.push({ op: 'point-mark', targets: c.left.map(p => p.id), tone: 'found', line: 3,
      note: note('These cards answer yes to the candidate question.', 'এই কার্ডগুলো candidate প্রশ্নে হ্যাঁ বলে।') });
    steps.push({ op: 'point-mark', targets: c.right.map(p => p.id), tone: 'discarded', line: 3,
      note: note('These cards answer no; they still count in the weighted result.', 'এই কার্ডগুলো না বলে; weighted হিসাবে এদেরও ধরতে হবে।') });
    const values = [c.feature, round(c.threshold), round(c.li), round(c.ri), round(c.weighted), round(c.gain)];
    const descriptions = ['feature', 'threshold', 'left impurity', 'right impurity', 'size-weighted child impurity', 'parent minus weighted child impurity'];
    for (let col = 0; col < values.length; ++col) steps.push({ op: 'table-set', table: 'candidates', r: row, c: col, value: values[col], line: col < 4 ? 4 : 5,
      note: note(`Row ${row+1} ${descriptions[col]}: ${values[col]}.`, `Row ${row+1}-এর ${descriptions[col]}: ${values[col]}।`) });
    steps.push({ op: 'series-add', id: 'gain', x: row+1, y: c.gain, line: 5,
      note: note(`Weight children by their sizes: (${c.left.length}×${round(c.li)} + ${c.right.length}×${round(c.ri)})/${points.length}.`,
        `দলের আকার দিয়ে weight দাও: (${c.left.length}×${round(c.li)}+${c.right.length}×${round(c.ri)})/${points.length}।`) });
    if (c.gain > 1e-12 && (!best || c.gain > best.gain + 1e-12)) { best = c; bestIndex = row; }
    steps.push({ op: 'point-clear-marks', line: 6, note: note('Keep the largest positive gain; exact gain ties retain feature then threshold order.', 'সবচেয়ে বড় positive gain রাখো; সমান হলে ফিচার ও threshold-এর আগের ক্রম রাখো।') });
  }
  if (candidates.length) steps.push({ op: 'shape-remove', id: 'candidate', line: 7,
    note: note('Remove the last trial line before showing the chosen result.', 'শেষ পরীক্ষার রেখা সরিয়ে বেছে নেওয়া ফল দেখাও।') });
  if (best) {
    steps.push({ op: 'shape', id: 'best', type: 'line', w: best.feature === 'x' ? [1,0] : [0,1], b: -best.threshold, label: 'Best gain', line: 7,
      note: note(`Best row ${bestIndex+1} reduces impurity by ${round(best.gain)}.`, `সেরা row ${bestIndex+1}-এ impurity কমে ${round(best.gain)}।`) });
    steps.push({ op: 'table-mark', table: 'candidates', targets: [[bestIndex,5]], tone: 'found', line: 7,
      note: note('This question wins by weighted reduction, not by the prettiest-looking side.', 'দেখতে সুন্দর দল নয়, weighted impurity কমার হিসাবে এই প্রশ্ন জেতে।') });
  }
  steps.push({ op: 'note', line: 8, vars: { bestFeature: best ? best.feature : 'none', threshold: best ? round(best.threshold) : 0, gain: best ? round(best.gain) : 0 },
    note: note(best ? 'Return the chosen positive-gain question.' : 'No positive-gain question exists; keep a leaf instead.', best ? 'Positive gain-এর বেছে নেওয়া প্রশ্ন ফেরাও।' : 'Positive gain-এর প্রশ্ন নেই; leaf রেখো।') });
  steps.push({ op: 'done', line: 8, note: note('Change criterion or a card and inspect every candidate row again.', 'Criterion বা কার্ড বদলে প্রতিটি candidate row আবার দেখো।') });
  return { init, steps };
}
