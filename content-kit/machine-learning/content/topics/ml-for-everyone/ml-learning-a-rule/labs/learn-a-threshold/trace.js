function trace(input) {
  const points = input.points.map((p, i) => ({ id: 'p' + (i + 1), ...p }));
  const count = t => points.filter(p => (p.x <= t ? 0 : 1) !== p.cls).length;
  const init = {
    plot: { xRange: [0, 10], yRange: [0, 10], xLabel: 'Size (cm)',
      yLabel: 'Sweetness (0–10)', classes: [{ id: 0, label: 'Apple / আপেল' },
        { id: 1, label: 'Mango / আম' }], points },
    chart: { xLabel: 'Dividing size', yLabel: 'Mistakes on known cards',
      series: [{ id: 'errors', label: 'Mistakes / ভুল', type: 'line', points: [] }] }
  };
  const steps = [];
  let bestThreshold = 0, bestMistakes = points.length + 1;
  for (let index = 0; index <= 20; index++) {
    const threshold = index / 2;
    const mistakes = count(threshold);
    if (mistakes < bestMistakes) { bestMistakes = mistakes; bestThreshold = threshold; }
    steps.push({ op: 'shape', id: 'trial', type: 'line', w: [1, 0], b: -threshold,
      label: 'Try ' + threshold, tone: 'current', line: 2,
      note: { en: `At ${threshold}, on or left means Apple; right means Mango. Height is not used by this rule.`,
        bn: `${threshold} বা বাঁয়ে আপেল, ডানে আম। এই নিয়মে উচ্চতা ধরা হয় না।` } });
    steps.push({ op: 'series-add', id: 'errors', x: threshold, y: mistakes, line: 3,
      vars: { trialThreshold: threshold, trialMistakes: mistakes, bestThreshold, bestMistakes },
      note: { en: `${mistakes} label(s) disagree at ${threshold}; the best count so far is ${bestMistakes} at ${bestThreshold}.`,
        bn: `${threshold}-এ ${mistakes}টি ভুল। এখন পর্যন্ত কম ভুল ${bestMistakes}, ভাগ ${bestThreshold}।` } });
  }
  steps.push({ op: 'shape-remove', id: 'trial', note: { en: 'The search is complete; compare its winner with your chosen fence.' } });
  steps.push({ op: 'shape', id: 'best', type: 'line', w: [1, 0], b: -bestThreshold,
    label: 'Best ' + bestThreshold, tone: 'found', dash: true, line: 4,
    note: { en: `Best tried fence: ${bestThreshold}. Equal counts keep the smaller fence because we search left to right.`,
      bn: `চেষ্টা করা সেরা ভাগ ${bestThreshold}। সমান ভুলে ছোট মান রাখার রীতি নিয়েছি।` } });
  steps.push({ op: 'shape', id: 'selected', type: 'line', w: [1, 0], b: -input.threshold,
    label: 'Yours ' + input.threshold, tone: 'current', line: 5,
    note: { en: `Your fence makes ${count(input.threshold)} mistakes; overlapping best and chosen lines may look like one.`,
      bn: `তোমার ভাগে ${count(input.threshold)}টি ভুল। একই অবস্থানের দুটি রেখা মিলে যেতে পারে।` } });
  const wrong = points.filter(p => (p.x <= input.threshold ? 0 : 1) !== p.cls).map(p => p.id);
  if (wrong.length) steps.push({ op: 'point-mark', targets: wrong, tone: 'error',
    note: { en: 'These known labels disagree with your prediction, so each contributes one mistake.',
      bn: 'এই নামগুলো অনুমানের সঙ্গে মেলেনি। প্রতিটিতে একটি ভুল।' } });
  steps.push({ op: 'done', vars: { threshold: input.threshold, mistakes: count(input.threshold), bestThreshold, bestMistakes },
    note: { en: 'These are training counts, not promises about unseen fruit. Add a contradictory card and search again.',
      bn: 'এগুলো চেনা কার্ডের ভুল। নতুন ফলে নিশ্চয়তা নয়। আলাদা ধরনের কার্ড যোগ করে দেখো।' } });
  return { init, steps };
}
