function trace(input) {
  const points = input.points.map((p, i) => ({ ...p, y: p.cls, id: 'p' + i }));
  const note = (en, bn) => ({ en, bn });
  const init = { plot: {
    xRange: [0, 1], yRange: [-0.2, 1.2], xLabel: 'Class-one score', yLabel: 'Known class row',
    classes: [{ id: 0, label: 'Known zero' }, { id: 1, label: 'Known one' }], points
  }, tables: { matrix: { rows: 2, cols: 2, rowLabels: ['Actual 0', 'Actual 1'], colLabels: ['Predicted 0', 'Predicted 1'], cells: [[0,0],[0,0]] } } };
  const steps = [{ op: 'shape', id: 'threshold', type: 'line', w: [1,0], b: -input.threshold, label: 'Threshold', line: 1,
    note: note(`Scores at least ${input.threshold} predict one; vertical layout follows the known label only.`,
      `Score অন্তত ${input.threshold} হলে এক predict করো; ওপর-নিচের row শুধু আসল লেবেল বোঝায়।`) }];
  const cells = [[0,0],[0,0]];
  for (const p of points.sort((a,b) => a.x - b.x)) {
    const predicted = Number(p.x >= input.threshold);
    const name = [['TN','FP'],['FN','TP']][p.cls][predicted];
    steps.push({ op: 'point-mark', targets: [p.id], tone: predicted === p.cls ? 'found' : 'discarded', line: 2,
      note: note(`Score ${p.x}, actual ${p.cls}: prediction ${predicted}, so this is ${name}.`,
        `Score ${p.x}, আসল ${p.cls}: মডেলের লেবেল ${predicted}, তাই এটি ${name}।`) });
    steps.push({ op: 'table-mark', table: 'matrix', targets: [[p.cls,predicted]], tone: 'current', line: 3,
      note: note('Choose the actual-label row and predicted-label column, in that order.', 'আগে আসল লেবেলের row, তারপর predicted লেবেলের column নাও।') });
    ++cells[p.cls][predicted];
    steps.push({ op: 'table-set', table: 'matrix', r: p.cls, c: predicted, value: cells[p.cls][predicted], line: 4,
      note: note(`Add one to ${name}; the cell now contains ${cells[p.cls][predicted]} examples.`, `${name}-এ এক যোগ করো; এখন এই ঘরে ${cells[p.cls][predicted]}টি উদাহরণ।`) });
    steps.push({ op: 'point-unmark', targets: [p.id], line: 4,
      note: note('The card has been counted exactly once before inspecting the next score.', 'পরের score দেখার আগে এই কার্ডটি ঠিক একবার গোনা হয়েছে।') });
  }
  steps.push({ op: 'note', line: 5, vars: { tn:cells[0][0], fp:cells[0][1], fn:cells[1][0], tp:cells[1][1] },
    note: note('Read diagonal matches separately from the two different mistakes.', 'Diagonal-এর সঠিক উত্তর ও দুই রকম ভুল আলাদা করে পড়ো।') });
  steps.push({ op: 'done', line: 6, note: note('Move the threshold, keeping scores and known labels fixed, and rebuild the matrix.', 'Score ও আসল লেবেল স্থির রেখে threshold সরাও এবং matrix আবার গোনো।') });
  return { init, steps };
}
