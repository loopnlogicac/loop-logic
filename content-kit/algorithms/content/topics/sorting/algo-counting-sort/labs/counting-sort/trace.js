function trace(input) {
    const a = input.values.slice();
    const count = Array(199).fill(0);
    const output = Array(a.length).fill(null);
    const steps = [];
    const keys = Array.from(new Set(a)).sort((x, y) => x - y);
    for (let i = 0; i < a.length; i++) {
        count[a[i] + 99]++;
        steps.push({op: 'list', name: 'count', items: keys.map(key => `${key}:${count[key + 99]}`), line: 2, vars: {i}, note: {en: `Count key ${a[i]} in slot ${a[i] + 99}; the offset handles negative keys.`, bn: 'ঋণাত্মক মানের জন্য key-এর সঙ্গে 99 যোগ করে ঘর নাও।'}});
    }
    for (let key = 1; key < 199; key++) count[key] += count[key - 1];
    steps.push({op: 'list', name: 'prefix', items: keys.map(key => `${key}:${count[key + 99]}`), line: 3, note: {en: 'Each prefix total is the first position after that key group.', bn: 'prefix total ওই মানের দলের শেষের পরের অবস্থান বোঝায়।'}});
    for (let i = a.length - 1; i >= 0; i--) {
        const key = a[i] + 99;
        const position = --count[key];
        output[position] = a[i];
        steps.push({op: 'list', name: 'output', items: output.slice(), line: 4, vars: {i, key, position}, note: {en: `Place ${a[i]} at ${position}; right-to-left traversal preserves ties.`, bn: 'ডান থেকে বসালে সমান মানের আগের ক্রম বজায় থাকে।'}});
    }
    for (let i = 0; i < a.length; i++) {
        steps.push({op: 'set', i, value: output[i], line: 5, note: {en: 'Copy this completed output position back into a.', bn: "পূর্ণ output পজিশনের মান a-তে copy করো।"}});
    }
    steps.push({op: 'done', note: {en: 'Frequency counts and prefix positions have ordered all keys.', bn: 'গণনা আর prefix অবস্থান দিয়ে সব মান সাজানো হয়েছে।'}});
    return {init: {array: a}, steps};
}
