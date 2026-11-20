function trace(input) {
  const round = value => Math.round(value * 1000) / 1000;
  const points = input.points.map((p, i) => ({ ...p, id: 'p' + i }));
  const query = [input.qx, input.qy];
  const k = Math.min(input.k, points.length);
  const steps = [];
  const note = (en, bn) => ({ en, bn });
  const init = { plot: {
    xRange: [0, 6], yRange: [0, 6], xLabel: 'Size score', yLabel: 'Sweetness score',
    classes: [{ id: 0, label: 'Apple' }, { id: 1, label: 'Mango' }],
    points: points.map(p => ({ ...p })),
    shapes: { query: { type: 'marker', at: query, symbol: 'star', label: '?' } }
  } };
  steps.push({ op: 'note', line: 1, vars: { k }, note: note(
    `Use ${k} available neighbours; count votes only after measuring distances.`,
    `দূরত্ব মেপে সবচেয়ে কাছের ${k}টি ফলের ভোট নেব।`) });
  const ranked = [];
  for (let i = 0; i < points.length; ++i) {
    const p = points[i];
    const dx = p.x - query[0], dy = p.y - query[1];
    const distance = Math.hypot(dx, dy);
    ranked.push({ p, distance, index: i });
    steps.push({ op: 'point-mark', targets: [p.id], tone: 'current', line: 2,
      note: note(`Inspect ${p.id}: compare both feature differences.`, `${p.id}-এর দুই ফিচারের ফারাক দেখো।`) });
    steps.push({ op: 'shape', id: 'distance-' + p.id, type: 'segment', from: query, to: [p.x, p.y], line: 2,
      note: note(
        `sqrt(${round(dx)}² + ${round(dy)}²) gives distance ${round(distance)}.`,
        `দুই ফারাকের বর্গ যোগ করে মূল নিলে দূরত্ব ${round(distance)}।`) });
    steps.push({ op: 'point-unmark', targets: [p.id], line: 2,
      note: note('Keep the measured distance before moving to the next card.', 'পরের ফলে যাওয়ার আগে মাপা দূরত্ব ধরে রাখো।') });
  }
  ranked.sort((a, b) => a.distance - b.distance || a.index - b.index);
  steps.push({ op: 'list', name: 'distance order', items: ranked.map(x => `${x.p.id}: ${round(x.distance)}`), line: 3,
    note: note('Sort by distance; exact distance ties keep input order.', 'দূরত্বের ক্রমে সাজাও; সমান হলে ইনপুটের ক্রম রাখো।') });
  const selected = ranked.slice(0, k);
  steps.push({ op: 'point-mark', targets: selected.map(x => x.p.id), tone: 'found', line: 4,
    note: note('Only the selected neighbours can vote.', 'শুধু বেছে নেওয়া কাছের ফলগুলো ভোট দেবে।') });
  steps.push({ op: 'shape', id: 'radius', type: 'circle', center: query, r: Math.max(0.001, selected.at(-1).distance), dash: true, line: 4,
    note: note('The circle reaches the kth distance; tied points on its edge still use the stated selection rule.', 'বৃত্ত k-তম দূরত্ব পর্যন্ত যায়; কিনারায় দূরত্ব সমান হলেও বাছাইয়ের নিয়ম মানতে হবে।') });
  const votes = [0, 0];
  for (const { p } of selected) {
    ++votes[p.cls];
    steps.push({ op: 'note', line: 5, vars: { votes0: votes[0], votes1: votes[1] },
      note: note(`${p.id} contributes one vote to class ${p.cls}.`, `${p.id} লেবেল ${p.cls}-কে একটি ভোট দেয়।`) });
  }
  const prediction = Number(votes[1] > votes[0]);
  steps.push({ op: 'shape', id: 'query', type: 'marker', at: query, symbol: 'star', cls: prediction,
    label: prediction ? 'Mango' : 'Apple', line: 6,
    vars: { prediction, votes0: votes[0], votes1: votes[1], k },
    note: note(`Votes are ${votes[0]}–${votes[1]}; predict ${prediction}. A class tie selects label zero.`,
      `ভোট ${votes[0]}–${votes[1]}; ফলের লেবেল ${prediction}। ভোট সমান হলে শূন্য লেবেল নাও।`) });
  steps.push({ op: 'done', line: 7, note: note('Move the query or change k, then compare the new neighbourhood.', 'Query সরাও বা k বদলাও; কাছের ফলের দল কীভাবে বদলায় দেখো।') });
  return { init, steps };
}
