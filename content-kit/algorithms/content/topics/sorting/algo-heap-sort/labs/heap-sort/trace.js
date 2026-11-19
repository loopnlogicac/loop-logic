function trace(input) {
    const a = input.values.slice();
    const steps = [];
    function swap(i, j, line, en) {
        [a[i], a[j]] = [a[j], a[i]];
        steps.push({op: 'swap', i, j, line, note: {en, bn: 'heap-এর শর্ত অনুযায়ী মান দুটি অদলবদল করো।'}});
    }
    function sift(size, root) {
        while (2 * root + 1 < size) {
            let child = 2 * root + 1;
            if (child + 1 < size) {
                steps.push({op: 'compare', i: child, j: child + 1, line: 3, note: {en: 'Choose the larger child so neither child can exceed the repaired parent.', bn: "বড় child নাও, যেন repair-এর পরে কোনো child parent-এর বড় না হয়।"}});
                if (a[child + 1] > a[child]) child++;
            }
            steps.push({op: 'compare', i: root, j: child, line: 4, vars: {size, root, child}, note: {en: 'A parent at least as large as its larger child satisfies the heap rule.', bn: "Parent বড় child-এর অন্তত সমান হলে heap rule মানে।"}});
            if (a[root] >= a[child]) break;
            swap(root, child, 5, 'The larger child rises; continue repairing below it.');
            root = child;
        }
    }
    for (let root = Math.floor(a.length / 2) - 1; root >= 0; root--) sift(a.length, root);
    steps.push({op: 'note', line: 1, note: {en: 'Bottom-up repairs have built a max-heap.', bn: 'নিচ থেকে ঠিক করতে করতে max-heap তৈরি হয়েছে।'}});
    for (let end = a.length - 1; end > 0; end--) {
        swap(0, end, 7, 'The largest remaining value belongs at the end of the active heap.');
        steps.push({op: 'mark', targets: [end], tone: 'sorted', line: 7, vars: {end}, note: {en: 'Exclude this final value from the next sift.', bn: "এই final মান পরের sift থেকে বাদ দাও।"}});
        sift(end, 0);
    }
    steps.push({op: 'done', note: {en: 'Repeated extraction leaves the array in ascending order.', bn: 'বারবার সর্বোচ্চ মান বের করে অ্যারে সাজানো হয়েছে।'}});
    return {init: {array: input.values.slice()}, steps};
}
