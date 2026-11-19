function trace(input) {
    const size = 7, buckets = Array.from({length: size}, () => []), steps = [];
    const bucket = key => ((key % size) + size) % size;
    const add = (op, fields, line, en, bn) => steps.push({op, ...fields, line, note: {en, bn}});
    for (const key of input.values) {
        const index = bucket(key);
        add('hash', {key, index, formula: `${key} mod 7 = ${index}`}, 1,
            'Normalize the remainder to select a bucket.', 'ভাগশেষ নেগেটিভ হলে ঠিক করে বাকেট বেছে নাও।');
        let found = false;
        for (const stored of buckets[index]) {
            add('probe', {index}, 2, `Compare ${stored} with ${key}; equal keys share one record.`,
                'কী মিলে গেলে আরেকটা নোড লাগবে না।');
            if (stored === key) { found = true; break; }
        }
        if (!found) {
            buckets[index].push(key);
            add('insert', {index, key}, 3, 'Append after the last node so earlier links keep their order.',
                'শেষ নোডের পরে বসাও, আগের কীগুলোর ক্রম ঠিক থাকে।');
        } else { add('note', {}, 2, 'The key already exists, so do not allocate a duplicate.', 'এই কী আগেই আছে, নতুন নোড লাগবে না।'); }
    }
    const index = bucket(input.removed), at = buckets[index].indexOf(input.removed);
    add('hash', {key: input.removed, index}, 4, 'Deletion first chooses the same bucket used by insertion.',
        'ডিলিটেও ইনসার্টের মতো একই বাকেট নাও।');
    for (const stored of buckets[index]) {
        add('probe', {index}, 4, `Follow the chain while checking ${stored}.`, 'লিংক ধরে কী মিলিয়ে এগোও।');
        if (stored === input.removed) { break; }
    }
    if (at >= 0) {
        buckets[index].splice(at, 1);
        add('remove', {index, key: input.removed}, 5, 'Repair the incoming link, then release the matched record.',
            'আগের লিংক ঠিক করে মিলে যাওয়া নোড ফ্রি করো।');
    } else { add('note', {}, 4, 'No matching record exists; keep all links unchanged.', 'কী পাওয়া যায়নি, লিংক বদলাতে হবে না।'); }
    const q = bucket(input.query);
    add('hash', {key: input.query, index: q}, 6, 'Search hashes the full query before comparing keys.', 'সার্চের কী দিয়ে আগে বাকেট বের করো।');
    let found = false;
    for (const stored of buckets[q]) {
        add('probe', {index: q}, 6, `Inspect ${stored} for the requested key.`, 'এই নোডের কী মিলিয়ে দেখো।');
        if (stored === input.query) { found = true; break; }
    }
    add('done', {vars: {removed: at >= 0 ? 1 : 0, found: found ? 1 : 0}}, 7,
        found ? 'The query is still reachable through its bucket list.' : 'The bucket has no matching key.',
        found ? 'বাকেটের লিস্ট ধরে সার্চের কী পাওয়া গেছে।' : 'এই বাকেটে সার্চের কী নেই।');
    return {init: {size, method: 'chaining'}, steps};
}
