function trace(input) {
    const heap = input.values.slice(), steps = [];
    const say = (en, bn) => ({en, bn});
    const swap = (i, j) => {
        steps.push({op: 'swap', i, j, line: 2, note: say('Swap to restore parent dominance on this path.',
            'এই পথে প্যারেন্টকে বড় রাখতে মান দুটো অদলবদল করো।')});
        [heap[i], heap[j]] = [heap[j], heap[i]];
    };
    const down = i => {
        while (2 * i + 1 < heap.length) {
            let child = 2 * i + 1;
            if (child + 1 < heap.length) {
                steps.push({op: 'compare', i: child, j: child + 1, line: 1,
                    note: say('Choose the greater child; keep the left child on ties.', 'বড় চাইল্ড বেছে নাও। সমান হলে বামেরটা রাখো।')});
                if (heap[child + 1] > heap[child]) child++;
            }
            steps.push({op: 'compare', i, j: child, line: 1,
                note: say('Stop when the parent is at least the greater child.', 'প্যারেন্ট বড় চাইল্ডের চেয়ে ছোট না হলে থামো।')});
            if (heap[i] >= heap[child]) break;
            swap(i, child); i = child;
        }
    };
    for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) down(i);
    let i = heap.length;
    steps.push({op: 'insert', i, value: input.key, line: 3,
        note: say('Append the new key at the next complete-tree position.', 'নতুন কীকে শেষের পরের ঘরে রাখো।')});
    heap.push(input.key);
    while (i > 0) {
        const parent = Math.floor((i - 1) / 2);
        steps.push({op: 'compare', i: parent, j: i, line: 3,
            note: say('Compare the inserted key against its parent before moving up.', 'উপরে ওঠার আগে প্যারেন্টের সঙ্গে তুলনা করো।')});
        if (heap[parent] >= heap[i]) break;
        swap(parent, i); i = parent;
    }
    if (input.removeMax) {
        const removed = heap[0], last = heap[heap.length - 1];
        steps.push({op: 'set', i: 0, value: last, line: 4,
            note: say('Save the maximum and replace the root by the last value.', 'ম্যাক্সিমাম রেখে রুটে শেষ মানটা বসাও।')});
        heap[0] = last;
        steps.push({op: 'remove', i: heap.length - 1, line: 4,
            note: say('Remove the last slot so the tree remains complete.', 'শেষ ঘর সরাও, যাতে ট্রি কমপ্লিট থাকে।')});
        heap.pop(); down(0);
        steps.push({op: 'note', vars: {removed}, line: 4,
            note: say(`Removed maximum ${removed}.`, `ম্যাক্সিমাম ${removed} সরানো হয়েছে।`)});
    }
    steps.push({op: 'done', line: 5, note: say('The active array again satisfies the max-heap property.',
        'অ্যারে আবার ম্যাক্স হিপের নিয়ম মানছে।')});
    return {init: {array: input.values.slice()}, steps};
}
