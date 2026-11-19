function trace(input) {
  const pts = input.points.map((p, i) => ({ id: 'p' + (i + 1), ...p }));
  const trainSize = pts.length - input.testCount;
  const train = pts.slice(0, trainSize), test = pts.slice(trainSize);
  const sizes = [...new Set(train.map(p => p.x))].sort((a, b) => a - b);
  const candidates = [0, 10];
  for (let i = 1; i < sizes.length; i++) candidates.push((sizes[i - 1] + sizes[i]) / 2);
  let threshold = 0, best = train.length + 1;
  candidates.sort((a, b) => a - b).forEach(t => {
    const count = train.filter(p => Number(p.x > t) !== p.cls).length;
    if (count <= best) { best = count; threshold = t; }
  });
  const majority = train.filter(p => p.cls === 1).length > train.length / 2 ? 1 : 0;
  const predict = (model, x) => {
    if (model === 'flat') return majority;
    if (model === 'simple') return Number(x > threshold);
    let nearest = train[0];
    for (const p of train) if (Math.abs(p.x - x) < Math.abs(nearest.x - x)) nearest = p;
    return nearest.cls;
  };
  const errors = (model, cards) => cards.filter(p => predict(model, p.x) !== p.cls).length;
  const init = {
    plot: { xRange: [0, 10], yRange: [0, 10], xLabel: 'Size (cm)', yLabel: 'Sweetness (unused)',
      classes: [{ id: 0, label: 'Apple / আপেল' }, { id: 1, label: 'Mango / আম' }],
      points: pts.map((p, i) => ({ id: p.id, x: p.x, y: p.y, cls: i < trainSize ? p.cls : null,
        label: i < trainSize ? 'Train ' + p.id : 'Test ? ' + p.id })) },
    chart: { xLabel: 'Rule', yLabel: 'Mistakes (read pile sizes)', series: [
      { id: 'train', label: 'Training / শেখা', type: 'bar', points: [] },
      { id: 'test', label: 'Hidden test / পরীক্ষা', type: 'bar', points: [] }] }
  };
  const shownThreshold = Math.round(threshold * 1000) / 1000;
  const steps = [];
  steps.push({ op: 'note', line: 1, vars: { trainSize, testSize: test.length, model: input.model },
    note: { en: `Train on the first ${trainSize}; hide the last ${test.length} labels. This ordered split is a paper demonstration.`,
      bn: `প্রথম ${trainSize}টি দিয়ে শিখি, শেষ ${test.length}টির নাম ঢাকি। এটি কাগজের ক্রমভিত্তিক খেলা।` } });
  for (const p of train) steps.push({ op: 'point-mark', targets: [p.id], tone: 'current', line: 2,
    note: { en: `${p.id} is available for fitting; its known label can influence all three training-only rules.`,
      bn: `${p.id}-এর জানা নাম শুধু ট্রেনিংয়ের নিয়ম বানাতে ব্যবহার করা যায়।` } });
  steps.push({ op: 'note', line: 2, vars: { threshold: shownThreshold },
    note: { en: `Simple threshold ${shownThreshold} minimises training mistakes; ties use the larger fence. Nearest-size ties use earlier cards.`,
      bn: 'কম ট্রেনিং ভুলের এক রেখা বাছি। সমান ভুলে বড় ভাগ, সমান নিকটতায় আগের কার্ড।' } });
  // Run the fitted prediction rule at every cell centre, independently of test labels.
  const cells = [];
  for (let row = 0; row < 20; row++) {
    const values = [];
    for (let col = 0; col < 20; col++) values.push(predict(input.model, (col + 0.5) / 2));
    cells.push(values);
  }
  steps.push({ op: 'regions', rows: 20, cols: 20, mode: 'class', cells, line: 3,
    note: { en: 'Each shaded cell is a prediction from training alone; all three rules ignore sweetness.',
      bn: 'প্রতিটি ঘরের রং শুধু ট্রেনিং থেকে অনুমান। তিন নিয়মই মিষ্টতা বাদ দেয়।' } });
  if (input.model === 'simple') {
    steps.push({ op: 'shape', id: 'fence', type: 'line', w: [1, 0], b: -threshold,
      label: 'Simple ' + shownThreshold, tone: 'found', line: 3,
      note: { en: 'One dividing line cannot follow every isolated training label; that can help it ignore noise.',
        bn: 'এক রেখা আলাদা প্রতিটি নাম ধরতে পারে না। এতে অপ্রয়োজনীয় খুঁটিনাটি বাদ পড়তে পারে।' } });
  } else if (input.model === 'flexible') {
    const boundary = [];
    let previous = predict('flexible', 0);
    boundary.push([0, previous ? 8.8 : 1.2]);
    for (let i = 1; i <= 200; i++) {
      const x = i / 20, cls = predict('flexible', x);
      if (cls !== previous) boundary.push([x, previous ? 8.8 : 1.2], [x, cls ? 8.8 : 1.2]);
      previous = cls;
    }
    boundary.push([10, previous ? 8.8 : 1.2]);
    steps.push({ op: 'shape', id: 'switches', type: 'curve', points: boundary, tone: 'current', line: 3,
      note: { en: 'The zigzag is a size-to-label step picture (low=Apple, high=Mango); the shaded map shows the actual class regions.',
        bn: 'আঁকাবাঁকা রেখায় নিচে আপেল, ওপরে আম বোঝায়। আসল অঞ্চলগুলো পটভূমির রঙে দেখো।' } });
  }
  for (const p of test) {
    const prediction = predict(input.model, p.x);
    steps.push({ op: 'point-mark', targets: [p.id], tone: 'compare', line: 4,
      vars: { card: p.id, prediction: prediction === 0 ? 'Apple' : 'Mango' },
      note: { en: `Predict ${prediction === 0 ? 'Apple' : 'Mango'} for ${p.id} before uncovering its answer; the fitted rule stays fixed.`,
        bn: `${p.id}-এর নাম খোলার আগেই অনুমান করি। শেখা নিয়ম বদলাচ্ছি না।` } });
    steps.push({ op: 'point-set', id: p.id, cls: p.cls, label: 'Test ' + p.id, line: 4,
      note: { en: `${p.id} is really ${p.cls === 0 ? 'Apple' : 'Mango'}: this prediction is ${prediction === p.cls ? 'correct' : 'a mistake'}.`,
        bn: `${p.id}-এর আসল নাম মেলাই; অনুমান ${prediction === p.cls ? 'ঠিক' : 'ভুল'}।` } });
  }
  for (const model of ['flat', 'simple', 'flexible']) {
    steps.push({ op: 'series-add', id: 'train', x: model, y: errors(model, train), line: 5,
      note: { en: `${model} makes ${errors(model, train)} mistakes on ${train.length} training cards.`,
        bn: `${model}: ${train.length}টি ট্রেনিং কার্ডে ${errors(model, train)}টি ভুল।` } });
    steps.push({ op: 'series-add', id: 'test', x: model, y: errors(model, test), line: 5,
      note: { en: `${model} makes ${errors(model, test)} mistakes on ${test.length} hidden cards; the pile sizes differ.`,
        bn: `${model}: ${test.length}টি টেস্ট কার্ডে ${errors(model, test)}টি ভুল। ডেটাসেটের আকার খেয়াল করো।` } });
  }
  steps.push({ op: 'done', line: 6,
    vars: { trainMistakes: errors(input.model, train), testMistakes: errors(input.model, test) },
    note: { en: 'Test answers only judged the fixed models. If you change a rule after this, bring fresh hidden cards for its final check.',
      bn: 'টেস্ট দিয়ে স্থির নিয়ম বিচার হলো। এবার নিয়ম বদলালে শেষ যাচাইয়ে নতুন কার্ড লাগবে।' } });
  return { init, steps };
}
