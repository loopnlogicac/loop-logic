function trace(input) {
  const round = x => Math.round(x * 1000) / 1000;
  const rank = (x, y) => input.points.map((p, i) => ({ p, i, d: Math.hypot(p.x - x, p.y - y) }))
    .sort((a, b) => a.d - b.d || a.i - b.i);
  function predict(x, y, k) {
    const chosen = rank(x, y).slice(0, Math.min(k, input.points.length));
    const zero = input.weights === 'distance' && chosen.some(p => p.d === 0);
    const votes = [0, 0];
    for (const item of chosen) {
      if (zero) { if (item.d === 0) votes[item.p.cls] += 1; }
      else votes[item.p.cls] += input.weights === 'distance' ? 1 / item.d : 1;
    }
    return Number(votes[1] > votes[0]);
  }
  function map(k) {
    return Array.from({ length: 24 }, (_, r) => Array.from({ length: 24 }, (_, c) =>
      predict((c + 0.5) * 6 / 24, 6 - (r + 0.5) * 6 / 24, k)));
  }
  const note = (en, bn) => ({ en, bn });
  const init = { plot: {
    xRange: [0, 6], yRange: [0, 6], xLabel: 'Size score', yLabel: 'Sweetness score',
    classes: [{ id: 0, label: 'Apple' }, { id: 1, label: 'Mango' }],
    points: [...input.points.map((p, i) => ({ ...p, id: 't' + i })),
      ...input.validation.map((p, i) => ({ ...p, id: 'v' + i, label: 'V' }))]
  }, chart: { xLabel: 'Requested k', yLabel: 'Validation accuracy',
    xRange: [0, 15], yRange: [0, 1], series: [{ id: 'validation', label: 'Validation', type: 'line', points: [] }] } };
  const steps = [];
  const results = [];
  for (const k of [1, 3, 7, 15]) {
    steps.push({ op: 'note', line: 1, note: note(
      `Try requested k=${k}, using ${Math.min(k, input.points.length)} available neighbours. V cards never vote.`,
      `k=${k} হলে পাওয়া ${Math.min(k, input.points.length)}টি নেবার নাও। V কার্ড শুধু যাচাইয়ে, ভোটে নয়।`) });
    steps.push({ op: 'regions', rows: 24, cols: 24, mode: 'class', cells: map(k), line: 2,
      note: note('Every region cell is predicted by the same neighbour rule on its centre.', 'প্রতিটি ঘরের মাঝখানে একই নেবারের নিয়ম চালিয়ে রং দাও।') });
    let correct = 0;
    for (let i = 0; i < input.validation.length; ++i) {
      const p = input.validation[i], prediction = predict(p.x, p.y, k);
      const matched = prediction === p.cls;
      correct += Number(matched);
      steps.push({ op: 'point-mark', targets: ['v' + i], tone: matched ? 'found' : 'discarded', line: 3,
        note: note(`V${i}: predicted ${prediction}, known label ${p.cls}; ${matched ? 'correct' : 'incorrect'}.`,
          `V${i}-এ মডেলের লেবেল ${prediction}, আসল ${p.cls}; ${matched ? 'মিলেছে' : 'মেলেনি'}।`) });
      steps.push({ op: 'point-unmark', targets: ['v' + i], line: 3,
        note: note('Keep this validation result outside the training vote.', 'এই যাচাইয়ের ফল ট্রেনিং ভোটে ঢোকাবে না।') });
    }
    const accuracy = correct / input.validation.length;
    results.push({ k, accuracy });
    steps.push({ op: 'series-add', id: 'validation', x: k, y: accuracy, line: 4,
      note: note(`${correct}/${input.validation.length} validation cards agree: accuracy ${round(accuracy)}.`,
        `${input.validation.length}টির মধ্যে ${correct}টি ঠিক; accuracy ${round(accuracy)}।`) });
  }
  const best = results.reduce((a, b) => b.accuracy > a.accuracy ? b : a);
  const correct = input.validation.reduce((n, p) => n + Number(predict(p.x, p.y, input.k) === p.cls), 0);
  steps.push({ op: 'vline', x: best.k, label: 'Best candidate', line: 5,
    note: note('Select the largest validation accuracy; equal scores keep the smaller requested k.', 'যাচাইয়ে বেশি score নাও; সমান হলে ছোট requested k রাখো।') });
  steps.push({ op: 'regions', rows: 24, cols: 24, mode: 'class', cells: map(input.k), line: 6,
    vars: { selectedK: input.k, accuracy: round(correct / input.validation.length), bestK: best.k, bestAccuracy: round(best.accuracy) },
    note: note(`The final map shows your slider k=${input.k}, which can differ from the best tested candidate.`,
      `শেষ মানচিত্রে slider-এর k=${input.k}; এটি সেরা candidate থেকে আলাদা হতে পারে।`) });
  steps.push({ op: 'done', line: 7, note: note('Compare boundaries and held-out errors, then keep a separate final test set.', 'Boundary ও আলাদা যাচাইয়ের ভুল মেলাও; final test আলাদা রাখো।') });
  return { init, steps };
}
