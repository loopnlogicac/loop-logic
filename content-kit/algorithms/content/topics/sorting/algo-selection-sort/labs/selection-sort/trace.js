function trace(input) {
    const a = input.values.slice();
    const steps = [];
    let swaps = 0;
    for (let i = 0; i < a.length - 1; i++) {
        let min = i;
        steps.push({op: 'pointer', name: 'min', target: min, line: 2, note: {en: 'Start with the first unsorted value as the minimum candidate.'}, vars: {i, min}});
        for (let j = i + 1; j < a.length; j++) {
            steps.push({op: 'compare', i: j, j: min, line: 4, note: {en: `Is ${a[j]} smaller than candidate ${a[min]}?`, bn: 'নতুন মানটি বর্তমান ছোট মানের চেয়েও ছোট কি?'}, vars: {j}});
            if (a[j] < a[min]) {
                min = j;
                steps.push({op: 'pointer', name: 'min', target: min, line: 4, vars: {min}, note: {en: 'Keep the smaller candidate until the scan ends.'}});
            }
        }
        if (min !== i) {
            [a[i], a[min]] = [a[min], a[i]];
            swaps++;
            steps.push({op: 'swap', i, j: min, line: 5, vars: {swaps}, note: {en: 'The minimum belongs at the next prefix position.', bn: 'সবচেয়ে ছোট মানটি সাজানো অংশের পরের ঘরে বসবে।'}});
        }
        steps.push({op: 'mark', targets: [i], tone: 'sorted', line: 6, note: {en: 'This position is final because the suffix has no smaller value.'}});
    }
    if (a.length) steps.push({op: 'mark', targets: [a.length - 1], tone: 'sorted', line: 6, note: {en: 'The remaining last value is also in place.'}});
    steps.push({op: 'done', vars: {swaps}, note: {en: 'Each pass selected one minimum; the entire array is ordered.', bn: 'প্রতি পাসে একটি ছোট মান বসেছে; পুরো অ্যারে সাজানো।'}});
    return {init: {array: input.values.slice()}, steps};
}
