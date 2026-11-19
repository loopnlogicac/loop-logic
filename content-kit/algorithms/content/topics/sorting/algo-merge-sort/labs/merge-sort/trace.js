function trace(input) {
    const a = input.values.slice();
    const steps = [];
    function merge_sort(low, high) {
        if (high - low < 2) return;
        const mid = low + Math.floor((high - low) / 2);
        steps.push({op: 'range', from: low, to: high - 1, tone: 'active', line: 2, vars: {low, high, mid}, note: {en: 'Split this half-open interval into two shorter intervals.', bn: "Half-open interval দুটি ছোট interval-এ ভাগ করো।"}});
        merge_sort(low, mid);
        merge_sort(mid, high);
        let i = low;
        let j = mid;
        const temp = [];
        while (i < mid && j < high) {
            steps.push({op: 'compare', i, j, line: 5, vars: {low, high, mid, i, j}, note: {en: `The smaller front value is next; choose left on equality.`, bn: 'সামনের ছোট মানটি নাও; সমান হলে বামেরটি আগে।'}});
            temp.push(a[i] <= a[j] ? a[i++] : a[j++]);
        }
        while (i < mid) temp.push(a[i++]);
        while (j < high) temp.push(a[j++]);
        steps.push({op: 'list', name: 'temp', items: temp.slice(), line: 6, note: {en: 'The remaining tail follows because its own half is sorted.', bn: "নিজের half সাজানো বলে বাকি tail পরপর আসে।"}});
        for (let k = low; k < high; k++) {
            a[k] = temp[k - low];
            steps.push({op: 'set', i: k, value: a[k], line: 7, vars: {k}, note: {en: 'Copy the merged value back after all source values have been read.', bn: 'সব মূল মান পড়া শেষ, এবার মেশানো মান ফেরত রাখো।'}});
        }
        steps.push({op: 'clear-ranges', line: 7, note: {en: 'This merge is complete; return to its parent interval.', bn: "এই merge শেষ; parent interval-এ ফেরো।"}});
    }
    merge_sort(0, a.length);
    steps.push({op: 'done', note: {en: 'The outer merge covers every input value in ascending order.', bn: 'শেষ merge-এ সব মান ছোট থেকে বড় ক্রমে এসেছে।'}});
    return {init: {array: input.values.slice()}, steps};
}
