// k-nearest neighbours on 2-D points, Euclidean distance.
// Tie rule (same as the lesson's code): the class of the single nearest neighbour wins.
function trace(input) {
  const NAMES = ['Apple', 'Mango'];
  const r2 = (v) => Math.round(v * 100) / 100;
  const pts = input.points.map((p, i) => ({ id: 'p' + (i + 1), x: p.x, y: p.y, cls: p.cls }));
  const q = [input.qx, input.qy];
  const steps = [];
  const init = {
    plot: {
      xRange: [0, 10], yRange: [0, 10], xLabel: 'Size', yLabel: 'Sweetness',
      classes: [{ id: 0, label: 'Apple' }, { id: 1, label: 'Mango' }],
      points: pts,
      shapes: { query: { type: 'marker', at: q, symbol: 'star', cls: null, label: '?' } }
    }
  };
  let k = input.k;
  if (k > pts.length) {
    k = pts.length;
    steps.push({ op: 'note', note: { en: `Only ${pts.length} example(s) exist, so k becomes ${k}: we cannot ask more neighbours than we have.` }, vars: { k } });
  } else {
    steps.push({ op: 'note', note: { en: `The star is a new fruit. We will ask its ${k} closest example(s) what it is.`, bn: `তারকাটি নতুন ফল। এর সবচেয়ে কাছের ${k}টি উদাহরণকে জিজ্ঞেস করব।` }, vars: { k } });
  }

  // 1. measure every distance
  for (const p of pts) {
    const d = Math.sqrt((p.x - q[0]) ** 2 + (p.y - q[1]) ** 2);
    p.d = d;
    steps.push({ op: 'shape', id: 'd-' + p.id, type: 'segment', from: q, to: [p.x, p.y], tone: 'considered', dash: true, line: 2,
      note: { en: `${p.id} (${NAMES[p.cls]}) is ${r2(d)} away: the square root of ${r2(p.x - q[0])}² + ${r2(p.y - q[1])}².` }, vars: { point: p.id, d: r2(d) } });
  }

  // 2. sort by distance (stable: equal distances keep their input order)
  const sorted = pts.map((p, i) => ({ p, i })).sort((a, b) => a.p.d - b.p.d || a.i - b.i).map((x) => x.p);
  steps.push({ op: 'list', name: 'nearest first', items: sorted.map((p) => `${p.id}: ${r2(p.d)}`), line: 3,
    note: { en: 'Line the examples up from nearest to farthest. Only the front of this line matters.', bn: 'উদাহরণগুলোকে কাছ থেকে দূরে সাজাই। শুধু সামনের কয়েকটিই গুরুত্বপূর্ণ।' } });

  // 3. keep the first k
  const nb = sorted.slice(0, k);
  const rest = sorted.slice(k);
  steps.push({ op: 'point-mark', targets: nb.map((p) => p.id), tone: 'found', line: 4,
    note: { en: `The ${k} nearest example(s) become the neighbours. They are the only ones allowed to vote.`, bn: `সবচেয়ে কাছের ${k}টি উদাহরণই প্রতিবেশী; শুধু তারাই ভোট দেবে।` } });
  if (rest.length) {
    steps.push({ op: 'point-mark', targets: rest.map((p) => p.id), tone: 'discarded', line: 4, note: { en: 'Everything farther away is ignored for this prediction.' } });
    for (const p of rest) steps.push({ op: 'shape-remove', id: 'd-' + p.id, note: { en: `${p.id} is too far to vote, so its distance line goes away.` } });
  }
  const radius = nb[nb.length - 1].d;
  steps.push({ op: 'shape', id: 'reach', type: 'circle', center: q, r: Math.max(radius, 0.05), tone: 'window', dash: true,
    note: { en: `This circle (radius ${r2(radius)}) holds exactly the neighbours.` } });

  // 4. count votes
  const votes = [0, 0];
  for (const p of nb) {
    votes[p.cls] += 1;
    steps.push({ op: 'note', line: 5, note: { en: `${p.id} votes ${NAMES[p.cls]}.`, bn: `${p.id} ভোট দিল ${NAMES[p.cls] === 'Apple' ? 'আপেল' : 'আম'}।` }, vars: { votesApple: votes[0], votesMango: votes[1] } });
  }

  // 5. decide
  let winner;
  if (votes[0] === votes[1]) {
    winner = nb[0].cls;
    steps.push({ op: 'point-mark', targets: [nb[0].id], tone: 'current', line: 6,
      note: { en: `It is a tie, ${votes[0]}–${votes[1]}. The nearest neighbour, ${nb[0].id}, settles it: ${NAMES[winner]}.`, bn: `ভোট সমান। সবচেয়ে কাছের প্রতিবেশী ${nb[0].id} সিদ্ধান্ত দিল।` } });
  } else {
    winner = votes[1] > votes[0] ? 1 : 0;
  }
  steps.push({ op: 'shape', id: 'query', type: 'marker', at: q, symbol: 'star', cls: winner, label: NAMES[winner], line: 7,
    note: { en: `${NAMES[winner]} wins with ${votes[winner]} of ${k} vote(s), so the new fruit is predicted to be ${NAMES[winner] === 'Apple' ? 'an apple' : 'a mango'}.`, bn: `${votes[winner]}টি ভোট পেয়ে ${NAMES[winner] === 'Apple' ? 'আপেল' : 'আম'} জিতল।` },
    vars: { prediction: NAMES[winner] } });
  steps.push({ op: 'done', note: { en: 'Try moving the star or changing k. Small k follows single examples; large k follows the crowd.', bn: 'তারকাটি সরাও বা k বদলাও—ফলাফল কীভাবে বদলায় দেখো।' } });
  return { init, steps };
}
