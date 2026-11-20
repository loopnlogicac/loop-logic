function trace(input) {
  const criterion = input.criterion || 'gini';
  const minSplit = input.minSplit || 2;
  const maxDepth = input.depth;
  const points = input.points.map((p, i) => ({ ...p, id: 'p' + i }));
  const query = [input.qx, input.qy];
  const round = n => Math.round(n * 1000) / 1000;
  const note = (en, bn) => ({ en, bn });
  function impurity(rows) {
    if (!rows.length) return 0;
    const p = rows.filter(r => r.cls === 1).length / rows.length;
    if (criterion === 'entropy') return [p, 1 - p].reduce((s, v) => s - (v ? v * Math.log2(v) : 0), 0);
    return 1 - p * p - (1 - p) * (1 - p);
  }
  function split(rows) {
    let best = null;
    const parent = impurity(rows);
    for (const feature of ['x', 'y']) {
      const values = [...new Set(rows.map(p => p[feature]))].sort((a, b) => a - b);
      for (let i = 1; i < values.length; ++i) {
        const threshold = (values[i - 1] + values[i]) / 2;
        const left = rows.filter(p => p[feature] <= threshold);
        const right = rows.filter(p => p[feature] > threshold);
        const gain = parent - (left.length * impurity(left) + right.length * impurity(right)) / rows.length;
        if (gain > 1e-12 && (!best || gain > best.gain + 1e-12)) best = { feature, threshold, gain, left, right };
      }
    }
    return best;
  }
  const init = { plot: {
    xRange: [0, 6], yRange: [0, 6], xLabel: 'Size score', yLabel: 'Sweetness score',
    classes: [{ id: 0, label: 'Apple' }, { id: 1, label: 'Mango' }], points,
    shapes: { query: { type: 'marker', at: query, symbol: 'star', label: '?' } }
  }, tree: { nodes: [], root: null } };
  const steps = [{ op: 'note', line: 1, note: note(
    `Grow a two-feature binary CART tree with ${criterion}, depth ${maxDepth}, minimum split count ${minSplit}.`,
    `${criterion}, depth ${maxDepth} ও অন্তত ${minSplit}টি কার্ড দিয়ে দুই ফিচারের binary CART ট্রি বানাও।`) }];
  let count = 0;
  function grow(rows, depth, bounds, parent, side) {
    const id = 'n' + count++;
    const ones = rows.filter(p => p.cls === 1).length;
    const prediction = Number(ones > rows.length - ones);
    const node = { id, prediction };
    steps.push({ op: 'tree-create', id, value: `Class ${prediction} (${rows.length})`, line: 2,
      note: note(`Create ${id} for ${rows.length} cards; its current majority predicts ${prediction}.`, `${rows.length}টি কার্ডের ${id} বানাও; এখন majority-এর লেবেল ${prediction}।`) });
    if (parent === null) steps.push({ op: 'tree-set-root', id, line: 2, note: note('This node starts every query path.', 'প্রতিটি query এই root থেকে শুরু করবে।') });
    else steps.push({ op: 'tree-set-child', parent, side, child: id, line: 2,
      note: note(`Link ${id} as the ${side} answer branch of ${parent}.`, `${parent}-এর ${side} উত্তরের branch-এ ${id} বসাও।`) });
    const best = depth < maxDepth && rows.length >= minSplit && impurity(rows) > 1e-12 ? split(rows) : null;
    if (!best) {
      steps.push({ op: 'shape', id: 'region-' + id, type: 'rect', from: [bounds[0], bounds[2]], to: [bounds[1], bounds[3]], cls: prediction, line: 3,
        note: note('Stop for purity, depth, sample count or no positive gain; this leaf owns the shaded rectangle.', 'Pure দল, depth, sample count বা positive gain না থাকায় থামো; leaf-এর অংশটুকু রং করো।') });
      for (const p of rows) {
        steps.push({ op: 'point-mark', targets: [p.id], tone: p.cls === prediction ? 'found' : 'discarded', line: 3,
          note: note(`${p.id} reaches leaf ${id}: known ${p.cls}, predicted ${prediction}.`, `${p.id} leaf ${id}-এ পৌঁছায়: আসল ${p.cls}, মডেলের লেবেল ${prediction}।`) });
        steps.push({ op: 'point-unmark', targets: [p.id], line: 3, note: note('Keep this card in its leaf while checking the next one.', 'কার্ডটি এই leaf-এই রাখো, পরেরটি যাচাই করো।') });
      }
      return node;
    }
    node.feature = best.feature; node.threshold = best.threshold;
    steps.push({ op: 'tree-set-value', id, value: `${best.feature}<=${round(best.threshold)}?`, line: 4,
      note: note(`The best positive impurity reduction is ${round(best.gain)} at ${best.feature}<=${round(best.threshold)}.`,
        `সেরা positive impurity কমা ${round(best.gain)}; প্রশ্ন ${best.feature}<=${round(best.threshold)}।`) });
    const vertical = best.feature === 'x';
    steps.push({ op: 'shape', id: 'cut-' + id, type: 'segment',
      from: vertical ? [best.threshold, bounds[2]] : [bounds[0], best.threshold],
      to: vertical ? [best.threshold, bounds[3]] : [bounds[1], best.threshold], line: 4,
      note: note('Draw this question only inside the rectangle belonging to its parent path.', 'প্রশ্নের কাট শুধু তার parent path-এর rectangle-এর ভেতরে আঁকো।') });
    const leftBounds = [...bounds], rightBounds = [...bounds];
    if (vertical) { leftBounds[1] = best.threshold; rightBounds[0] = best.threshold; }
    else { leftBounds[3] = best.threshold; rightBounds[2] = best.threshold; }
    node.left = grow(best.left, depth + 1, leftBounds, id, 'left');
    node.right = grow(best.right, depth + 1, rightBounds, id, 'right');
    return node;
  }
  const root = grow(points, 0, [0, 6, 0, 6], null, null);
  function predict(point) {
    let node = root;
    while (node.left) node = point[node.feature] <= node.threshold ? node.left : node.right;
    return node.prediction;
  }
  let cursor = root;
  while (cursor.left) {
    const answer = input['q' + cursor.feature] <= cursor.threshold;
    steps.push({ op: 'tree-visit', id: cursor.id, line: 5,
      note: note(`Query ${cursor.feature}<=${round(cursor.threshold)} is ${answer}; take the ${answer ? 'left' : 'right'} branch.`,
        `Query-তে ${cursor.feature}<=${round(cursor.threshold)} উত্তর ${answer ? 'হ্যাঁ' : 'না'}; ${answer ? 'বাম' : 'ডান'} branch নাও।`) });
    cursor = answer ? cursor.left : cursor.right;
  }
  steps.push({ op: 'tree-visit', id: cursor.id, line: 6,
    note: note(`Leaf ${cursor.id} predicts ${cursor.prediction}; no more questions remain.`, `Leaf ${cursor.id}-এর লেবেল ${cursor.prediction}; আর প্রশ্ন নেই।`) });
  const correct = points.filter(p => predict(p) === p.cls).length;
  steps.push({ op: 'shape', id: 'query', type: 'marker', at: query, symbol: 'star', cls: cursor.prediction,
    label: 'Class ' + cursor.prediction, line: 7, vars: { prediction: cursor.prediction, correct, nodes: count },
    note: note(`${correct}/${points.length} training labels agree; ${count} nodes were built. This is training evidence.`,
      `ট্রেনিংয়ের ${points.length}টির মধ্যে ${correct}টি মেলে; নোড ${count}টি। এটি ট্রেনিংয়ের ফল।`) });
  steps.push({ op: 'done', line: 8, note: note('Change depth or a card and compare both the questions and shaded regions.', 'Depth বা কার্ড বদলে প্রশ্ন ও রঙিন অঞ্চল দুটোই মেলাও।') });
  return { init, steps };
}
