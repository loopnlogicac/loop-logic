function trace(input) {
    const a = input.values.slice();
    const steps = [];
    for (let i = 1; i < a.length; i++) {
        const key = a[i];
        let j = i - 1;
        steps.push({op: 'note', line: 2, vars: {i, key, j}, note: {en: `Save key ${key}; positions before ${i} are already sorted.`, bn: 'key আলাদা রাখো; এর আগের অংশ সাজানো আছে।'}});
        while (j >= 0) {
            steps.push({op: 'note', line: 3, vars: {j}, note: {en: `Compare saved key ${key} with ${a[j]} at index ${j}.`, bn: `Saved key ${key}-কে index ${j}-এর ${a[j]}-এর সঙ্গে তুলনা করো।`}});
            if (a[j] <= key) break;
            a[j + 1] = a[j];
            steps.push({op: 'set', i: j + 1, value: a[j], line: 4, note: {en: 'Shift the larger value right to open a place for the key.', bn: 'বড় মানটি ডানে সরিয়ে key-এর জায়গা করো।'}});
            j--;
        }
        a[j + 1] = key;
        steps.push({op: 'set', i: j + 1, value: key, line: 5, vars: {j}, note: {en: 'Place the key after all values less than or equal to it.', bn: 'key-এর সমান বা ছোট মানগুলোর পরেই key বসাও।'}});
        steps.push({op: 'range', from: 0, to: i, tone: 'sorted', line: 6, note: {en: 'The sorted prefix has grown by one value.', bn: "Sorted prefix একটি মান বেড়েছে।"}});
        steps.push({op: 'clear-ranges', line: 6, note: {en: 'Prepare the view for the next insertion.', bn: "পরের insertion দেখানোর জন্য আগের range সরাও।"}});
    }
    steps.push({op: 'done', note: {en: 'Every key has joined the sorted prefix.', bn: 'সব key সাজানো অংশে ঢুকেছে।'}});
    return {init: {array: input.values.slice()}, steps};
}
