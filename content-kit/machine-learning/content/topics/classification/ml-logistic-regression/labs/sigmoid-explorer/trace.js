function trace(input) {
  const sigmoid = z => z >= 0 ? 1 / (1 + Math.exp(-z)) : Math.exp(z) / (1 + Math.exp(z));
  const round = v => Math.round(v * 1000) / 1000;
  const note = (en, bn) => ({ en, bn });
  const points = input.points.map((p, i) => ({ ...p, id: 'p' + i }));
  const scores = points.map(p => input.w1 * p.x + input.w2 * p.y + input.bias);
  const scoreRange = [Math.min(-6, ...scores), Math.max(6, ...scores)];
  const curve = Array.from({ length: 101 }, (_, i) => {
    const score = scoreRange[0] + i * (scoreRange[1] - scoreRange[0]) / 100;
    return [score, sigmoid(score)];
  });
  const init = { plot: {
    xRange: [-3, 3], yRange: [-3, 3], xLabel: 'Centred size', yLabel: 'Centred sweetness',
    classes: [{ id: 0, label: 'Apple' }, { id: 1, label: 'Mango' }], points
  }, chart: { xLabel: 'Score', yLabel: 'Probability of class one', xRange: scoreRange, yRange: [0, 1],
    series: [{ id: 'sigmoid', label: 'Sigmoid', type: 'line', points: curve },
      { id: 'cards', label: 'Card scores', type: 'scatter', points: [] }] } };
  const steps = [];
  const cutoff = Math.log(input.threshold / (1 - input.threshold));
  steps.push({ op: 'vline', x: cutoff, label: 'Threshold score', line: 1,
    note: note(`Probability threshold ${input.threshold} corresponds to score ${round(cutoff)}.`,
      `Probability-এর সীমা ${input.threshold} হলে score-এর সীমা ${round(cutoff)}।`) });
  if (Math.hypot(input.w1, input.w2) > 1e-12) {
    steps.push({ op: 'shape', id: 'boundary', type: 'line', w: [input.w1, input.w2], b: input.bias - cutoff, line: 2,
      note: note('The threshold boundary is a straight line in the two input features.', 'দুই ফিচারের ওপর threshold-এর boundary একটি সোজা রেখা।') });
  } else {
    steps.push({ op: 'note', line: 2, note: note('Both feature weights are zero, so every point receives the same score.', 'দুই ফিচারের weight শূন্য হলে সব পয়েন্টে একই score হয়।') });
  }
  const predictions = [];
  let positiveCount = 0;
  for (const p of points) {
    const score = input.w1 * p.x + input.w2 * p.y + input.bias;
    const probability = sigmoid(score);
    const predicted = Number(probability >= input.threshold);
    predictions.push(predicted);
    positiveCount += predicted;
    steps.push({ op: 'point-mark', targets: [p.id], tone: 'current', line: 3,
      note: note(`${p.id}: score = ${input.w1}×${p.x} + ${input.w2}×${p.y} + ${input.bias} = ${round(score)}.`,
        `${p.id}-এর দুই ফিচারকে weight দিয়ে গুণ ও bias যোগ করলে score ${round(score)}।`) });
    steps.push({ op: 'series-add', id: 'cards', x: score, y: probability, line: 4,
      note: note(`The sigmoid maps that score to probability ${round(probability)}.`,
        `Sigmoid এই score থেকে probability ${round(probability)} দেয়।`) });
    steps.push({ op: 'point-set', id: p.id, cls: predicted, line: 5,
      note: note(`Compare with ${input.threshold}: predicted ${predicted}; original label was ${p.cls}.`,
        `${input.threshold}-এর সঙ্গে তুলনায় মডেলের লেবেল ${predicted}; আসল লেবেল ছিল ${p.cls}।`) });
    steps.push({ op: 'point-unmark', targets: [p.id], line: 5,
      note: note('Keep probability distinct from the hard decision before inspecting another card.', 'পরের কার্ডে যাওয়ার আগে probability ও hard লেবেল-এর পার্থক্য মনে রাখো।') });
  }
  steps.push({ op: 'note', line: 6, vars: { predictions: predictions.join(','), positiveCount },
    note: note(`${positiveCount} points receive class one; the threshold changes decisions, not the fixed score formula.`,
      `${positiveCount}টি পয়েন্টে এক লেবেল হলো; threshold বদলালে সিদ্ধান্ত বদলায়, স্থির score-এর সূত্র নয়।`) });
  steps.push({ op: 'done', line: 7, note: note('Change a weight, bias or threshold and compare the curve with the boundary.', 'Weight, bias বা threshold বদলে curve ও boundary মেলাও।') });
  return { init, steps };
}
