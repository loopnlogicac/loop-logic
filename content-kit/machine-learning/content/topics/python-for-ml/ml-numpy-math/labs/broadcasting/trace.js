// Fixed 5x2 teaching shape, arbitrary permitted matrix entries and offsets.
function trace(input) {
  const X = Array.from({length: 5}, (_, r) => input.values.slice(2 * r, 2 * r + 2));
  const rowMode = input.mode === 'row';
  const offsets = rowMode ? [input.offsetA, input.offsetB] : input.columnOffsets;
  const result = Array.from({length: 5}, () => [null, null]);
  const init = {tables: {
    x: {rows: 5, cols: 2, colLabels: ['Size', 'Sweetness'], cells: X},
    offsets: {rows: rowMode ? 1 : 5, cols: rowMode ? 2 : 1,
              cells: rowMode ? [offsets] : offsets.map(v => [v])},
    result: {rows: 5, cols: 2, colLabels: ['Size + offset', 'Sweet + offset']}
  }};
  const steps = [{op: 'note', line: 1,
    note: {en: rowMode ? 'Two offsets match two columns; reuse this row for all five fruits.' :
      'Five offsets match five fruits; reuse each row offset across its two features.',
      bn: rowMode ? 'দুটি offset দুটি কলামের সঙ্গে মেলে; পাঁচ ফলের জন্য একই row ব্যবহার করি।' :
      'প্রতি ফলের একটি offset তার দুই feature-এ যোগ করি।'},
    vars: {mode: input.mode, total: 0}}];
  let total = 0;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 2; c++) {
      const orow = rowMode ? 0 : r;
      const ocol = rowMode ? c : 0;
      const offset = rowMode ? offsets[c] : offsets[r];
      steps.push({op: 'table-mark', table: 'x', targets: [[r, c]], tone: 'current', line: 3,
        note: {en: `Read X[${r},${c}] = ${X[r][c]}; row ${r} still represents the same fruit.`,
               bn: `X[${r},${c}]-এর মান ${X[r][c]}; সারি বদলে অন্য ফল নেওয়া হচ্ছে না।`},
        vars: {r, c}});
      steps.push({op: 'table-mark', table: 'offsets', targets: [[orow, ocol]], tone: 'compare', line: 4,
        note: {en: `Reuse offset ${offset} from [${orow},${ocol}]; the singleton dimension stretches here.`,
               bn: `[${orow},${ocol}] থেকে ${offset} আবার নিই; এক ঘরের dimension এখানেই ছড়ায়।`},
        vars: {offset}});
      result[r][c] = X[r][c] + offset;
      steps.push({op: 'table-set', table: 'result', r, c, value: result[r][c], line: 5,
        note: {en: `${X[r][c]} + ${offset} = ${result[r][c]}; write this cell without changing X.`,
               bn: `${X[r][c]} + ${offset} = ${result[r][c]}; X না বদলে ফলের ঘরে লিখি।`}});
      total += result[r][c];
      steps.push({op: 'note', line: 6,
        note: {en: `Add this result once to the running total: ${total}.`,
               bn: `এই ঘরের ফল একবার যোগ করে মোট হলো ${total}।`}, vars: {total}});
      steps.push({op: 'table-clear-marks', table: 'x',
        note: {en: 'Release the input highlight before the next cell.'}});
      steps.push({op: 'table-clear-marks', table: 'offsets',
        note: {en: 'The offset stays available; only its highlight is cleared.'}});
    }
  }
  steps.push({op: 'done', line: 7,
    note: {en: `Ten cell additions are complete. Total ${total}; compare the entire result with Python.`,
           bn: `দশ ঘরের যোগ শেষ। মোট ${total}; পুরো matrix Python-এর সঙ্গে মিলিয়ে দেখো।`},
    vars: {total}});
  return {init, steps};
}
