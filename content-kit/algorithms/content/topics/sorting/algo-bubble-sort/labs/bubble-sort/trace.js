// Bubble sort trace. Pure and deterministic: input in, steps out.
function trace(input) {
  const a = input.values.slice();
  const n = a.length;
  const steps = [];
  let swaps = 0;
  let comparisons = 0;
  const say = (en, bn) => (bn ? { en, bn } : { en });

  if (n < 2) {
    steps.push({ op: 'mark', targets: n ? [0] : [], tone: 'sorted', line: 7, note: say('One value is already sorted.', 'একটি মান থাকলে সেটা আগেই সাজানো।') });
    if (!n) steps.pop();
    steps.push({ op: 'done', note: say('Nothing to sort.'), vars: { swaps, comparisons } });
    return { init: { array: a }, steps };
  }

  for (let pass = 0; pass < n - 1; pass++) {
    let swapped = false;
    steps.push({ op: 'note', line: 1, note: say(`Pass ${pass + 1}: walk from the left and push the largest value right.`, `পাস ${pass + 1}: বাম থেকে হেঁটে সবচেয়ে বড় মানটা ডানে ঠেলে দাও।`), vars: { pass: pass + 1, swaps, comparisons } });
    for (let j = 0; j < n - 1 - pass; j++) {
      comparisons++;
      steps.push({ op: 'compare', i: j, j: j + 1, line: 4, note: say(`Compare ${a[j]} and ${a[j + 1]}.`, `${a[j]} আর ${a[j + 1]} তুলনা করো।`), vars: { j, comparisons } });
      if (a[j] > a[j + 1]) {
        const big = a[j];
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swaps++;
        swapped = true;
        steps.push({ op: 'swap', i: j, j: j + 1, line: 5, note: say(`${big} is bigger, so swap them.`, `${big} বড়, তাই অদলবদল করো।`), vars: { swaps } });
      }
    }
    steps.push({ op: 'mark', targets: [n - 1 - pass], tone: 'sorted', line: 7, note: say(`${a[n - 1 - pass]} is now in its final place.`, `${a[n - 1 - pass]} এখন তার সঠিক জায়গায়।`) });
    if (!swapped) {
      const rest = [];
      for (let k = 0; k < n - 1 - pass; k++) rest.push(k);
      steps.push({ op: 'mark', targets: rest, tone: 'sorted', line: 8, note: say('No swaps in this pass, so the array is sorted. Stop early.', 'এই পাসে কোনো অদলবদল হয়নি, তাই অ্যারে সাজানো। আগেই থামো।') });
      steps.push({ op: 'done', note: say(`Sorted with ${swaps} swaps and ${comparisons} comparisons.`), vars: { swaps, comparisons } });
      return { init: { array: input.values.slice() }, steps };
    }
  }
  steps.push({ op: 'mark', targets: [0], tone: 'sorted', line: 7, note: say(`${a[0]} is the smallest and is already first.`) });
  steps.push({ op: 'done', note: say(`Sorted with ${swaps} swaps and ${comparisons} comparisons.`), vars: { swaps, comparisons } });
  return { init: { array: input.values.slice() }, steps };
}
