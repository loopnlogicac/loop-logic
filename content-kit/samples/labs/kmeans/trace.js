// k-means with the simple start used in the lesson: the first k points are the first centres.
function trace(input) {
  const pts = input.points.map((p, i) => ({ id: 'p' + (i + 1), x: p.x, y: p.y, cls: null }));
  const k = Math.min(input.k, pts.length);
  const r2 = (v) => Math.round(v * 100) / 100;
  const classes = [];
  for (let c = 0; c < k; c++) classes.push({ id: c, label: 'Group ' + (c + 1) });
  let centres = pts.slice(0, k).map((p) => [p.x, p.y]);
  const steps = [];
  const shapes = {};
  centres.forEach((c, i) => { shapes['c' + i] = { type: 'marker', at: c, symbol: 'cross', cls: i, label: 'C' + (i + 1) }; });
  const init = { plot: { xRange: [0, 10], yRange: [0, 10], xLabel: 'Visits per month', yLabel: 'Spend (thousand taka)', classes, points: pts.map((p) => ({ id: p.id, x: p.x, y: p.y })), shapes } };
  steps.push({ op: 'note', line: 1, note: { en: `No labels here. We start ${k} centres on the first ${k} points and let the data pull them into place.`, bn: `এখানে কোনো লেবেল নেই। প্রথম ${k}টি বিন্দুতে কেন্দ্র বসিয়ে শুরু করি।` }, vars: { k, round: 0 } });
  const assign = pts.map(() => -1);
  let inertia = 0;
  for (let round = 1; round <= 20; round++) {
    // assignment step
    let changed = 0;
    inertia = 0;
    for (let i = 0; i < pts.length; i++) {
      let best = 0, bestD = Infinity;
      for (let c = 0; c < k; c++) {
        const d = (pts[i].x - centres[c][0]) ** 2 + (pts[i].y - centres[c][1]) ** 2;
        if (d < bestD) { bestD = d; best = c; }
      }
      inertia += bestD;
      if (assign[i] !== best) {
        assign[i] = best; changed++;
        steps.push({ op: 'point-set', id: pts[i].id, cls: best, line: 3, note: { en: `${pts[i].id} is closest to C${best + 1} (distance ${r2(Math.sqrt(bestD))}), so it joins group ${best + 1}.` }, vars: { round } });
      }
    }
    steps.push({ op: 'note', line: 3, note: { en: `Round ${round}: ${changed} point(s) changed group. Total squared distance (inertia) = ${r2(inertia)}.`, bn: `রাউন্ড ${round}: ${changed}টি বিন্দু দল বদলেছে।` }, vars: { round, changed, inertia: r2(inertia) } });
    if (changed === 0) {
      steps.push({ op: 'note', line: 5, note: { en: 'Nobody moved, so the centres will not move either. k-means has converged.', bn: 'কেউ দল বদলায়নি, তাই কেন্দ্রও আর সরবে না। k-means থেমে গেল।' } });
      break;
    }
    // update step
    for (let c = 0; c < k; c++) {
      const mine = pts.filter((_, i) => assign[i] === c);
      if (!mine.length) { steps.push({ op: 'note', line: 4, note: { en: `C${c + 1} has no points, so it stays where it is.` } }); continue; }
      const mx = mine.reduce((s, p) => s + p.x, 0) / mine.length;
      const my = mine.reduce((s, p) => s + p.y, 0) / mine.length;
      if (mx !== centres[c][0] || my !== centres[c][1]) {
        steps.push({ op: 'shape', id: 'path' + c + '-' + round, type: 'arrow', from: centres[c], to: [mx, my], tone: 'path', dash: true, line: 4, note: { en: `C${c + 1} moves to the average of its ${mine.length} point(s): (${r2(mx)}, ${r2(my)}).`, bn: `C${c + 1} তার বিন্দুগুলোর গড় অবস্থানে সরে যায়।` } });
        centres[c] = [mx, my];
        steps.push({ op: 'shape', id: 'c' + c, type: 'marker', at: [mx, my], symbol: 'cross', cls: c, label: 'C' + (c + 1), note: { en: `C${c + 1} is now at the centre of group ${c + 1}.` } });
      }
    }
  }
  const sizes = classes.map((c) => assign.filter((a) => a === c.id).length);
  steps.push({ op: 'list', name: 'group sizes', items: sizes.map((n, c) => `Group ${c + 1}: ${n}`), note: { en: 'Each group is a set of similar customers. Naming the groups is a human job.' } });
  steps.push({ op: 'done', note: { en: `Finished with inertia ${r2(inertia)}. Try another k or reorder the points to start from different centres.` }, vars: { inertia: r2(inertia) } });
  return { init, steps };
}
