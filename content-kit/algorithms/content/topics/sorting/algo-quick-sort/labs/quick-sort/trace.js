function trace(input) {
    const a = input.values.slice();
    const steps = [];
    function swap(i, j, line, en) {
        [a[i], a[j]] = [a[j], a[i]];
        steps.push({op: 'swap', i, j, line, note: {en, bn: 'partition-এর নিয়ম রাখতে মান দুটি অদলবদল করো।'}});
    }
    function quick_sort(low, high) {
        if (low >= high) return;
        const pivot = a[high];
        let i = low;
        steps.push({op: 'mark', targets: [high], tone: 'pivot', line: 2, vars: {low, high, pivot, i}, note: {en: `Use final value ${pivot} as pivot for this interval.`, bn: `Interval-এর শেষ মান ${pivot}-কে pivot নাও।`}});
        for (let j = low; j < high; j++) {
            steps.push({op: 'compare', i: j, j: high, line: 4, vars: {i, j}, note: {en: `A value at most ${pivot} belongs before the boundary i.`, bn: 'pivot-এর সমান বা ছোট মান i-এর আগের অংশে যাবে।'}});
            if (a[j] <= pivot) {
                swap(i, j, 4, 'Move this eligible value to the left partition.');
                i++;
            }
        }
        swap(i, high, 5, 'Put the pivot between the small and large partitions.');
        steps.push({op: 'clear-marks', line: 5, note: {en: 'The old endpoint no longer holds the pivot.', bn: "পুরোনো endpoint-এ এখন আর pivot নেই।"}});
        steps.push({op: 'mark', targets: [i], tone: 'sorted', line: 5, vars: {p: i}, note: {en: 'The pivot position is final and excluded from both recursive calls.', bn: "Pivot final; দুই recursive call থেকেই তার পজিশন বাদ।"}});
        quick_sort(low, i - 1);
        quick_sort(i + 1, high);
    }
    quick_sort(0, a.length - 1);
    steps.push({op: 'done', note: {en: 'Both sides of every pivot are sorted.', bn: 'প্রতি pivot-এর দুই পাশই সাজানো হয়েছে।'}});
    return {init: {array: input.values.slice()}, steps};
}
