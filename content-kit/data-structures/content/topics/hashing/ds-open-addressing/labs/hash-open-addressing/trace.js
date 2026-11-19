function trace(input) {
    const size = 11, method = ['linear', 'quadratic', 'double'][input.method];
    const buckets = Array(size).fill(null), steps = [], status = [];
    const bucket = (key, m) => ((key % m) + m) % m;
    const probe = (key, attempt) => (bucket(key, 11) +
        (input.method === 1 ? attempt * attempt : input.method === 2 ? attempt * (1 + bucket(key, 10)) : attempt)) % 11;
    const add = (op, fields, line, en, bn) => steps.push({op, ...fields, line, note: {en, bn}});
    function locate(key, line) {
        for (let attempt = 0; attempt < size; attempt++) {
            const index = probe(key, attempt);
            add('probe', {index, vars: {attempt, index}}, line,
                'Follow the same probe sequence used for insertion.', 'ইনসার্টের প্রোবের ক্রম ধরেই সার্চ করো।');
            if (buckets[index] === null) { return -1; }
            if (buckets[index] === key) { return index; }
        }
        return -1;
    }
    for (const key of input.values) {
        add('hash', {key, index: bucket(key, 11), formula: `${key} mod 11`}, 1,
            'Start at the home bucket; collision handling chooses later probes.', 'হোম বাকেট থেকে শুরু করো, কলিশন হলে পরের প্রোব নাও।');
        let first = -1, duplicate = false;
        for (let attempt = 0; attempt < size; attempt++) {
            const index = probe(key, attempt);
            add('probe', {index, vars: {attempt, index}}, 2,
                `Inspect slot ${index} before deciding where the key belongs.`, 'স্লটে কী আছে দেখে তারপর সিদ্ধান্ত নাও।');
            if (buckets[index] === key) { duplicate = true; break; }
            if (buckets[index] === '†' && first < 0) { first = index; }
            if (buckets[index] === null) { if (first < 0) { first = index; } break; }
        }
        if (duplicate) {
            status.push(0); add('note', {}, 3, 'An equal key is already stored; preserve set semantics.', 'কী আগেই আছে, ডুপ্লিকেট বসিয়ো না।');
        } else if (first >= 0) {
            buckets[first] = key; status.push(1);
            add('insert', {index: first, key}, 4, 'The remembered free slot can hold this distinct key.', 'মনে রাখা ফাঁকা স্লটে এই নতুন কী বসাও।');
        } else {
            status.push(-1); add('note', {}, 5, 'Eleven attempts found no usable slot; this probe sequence is exhausted.', 'এগারো প্রোবেও জায়গা পাওয়া যায়নি, ইনসার্ট থামাও।');
        }
    }
    const index = locate(input.removed, 6);
    if (index >= 0) {
        buckets[index] = '†';
        add('remove', {index, key: input.removed}, 7,
            'Keep a tombstone so searches can continue past this deletion.', 'সার্চের পথ বাঁচাতে ডিলিটের জায়গায় টুম্বস্টোন রাখো।');
    }
    const found = locate(input.query, 8) >= 0;
    add('list', {name: 'insertStatus', items: status}, 9,
        'Insertion statuses are 1 added, 0 duplicate and -1 exhausted.', '১ মানে বসেছে, ০ ডুপ্লিকেট, আর -১ মানে প্রোবে জায়গা মেলেনি।');
    add('done', {vars: {removed: index >= 0 ? 1 : 0, found: found ? 1 : 0}}, 9,
        found ? 'The query survives the deletion because probes cross tombstones.' : 'The query was not found along its bounded probe sequence.',
        found ? 'টুম্বস্টোন পার হয়ে সার্চের কী পাওয়া গেছে।' : 'প্রোবের ক্রম ধরে সার্চের কী মেলেনি।');
    return {init: {size, method}, steps};
}
