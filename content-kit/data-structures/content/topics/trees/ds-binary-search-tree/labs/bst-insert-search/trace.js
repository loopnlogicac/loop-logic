function trace(input) {
    const steps = [], nodes = {}, left = {}, right = {};
    let root = null, serial = 0;
    const note = (en, bn) => bn ? {en, bn} : {en};
    const step = (op, fields, en, bn, line = 1) =>
        steps.push({op, ...fields, line, note: note(en, bn)});
    const insert = (key, show) => {
        let cur = root, parent = null, side = null;
        while (cur !== null) {
            if (show) step('compare', {id: cur, value: key},
                `${key} is compared with ${nodes[cur]}; equality keeps one copy.`,
                `${key} আর ${nodes[cur]} তুলনা করো। সমান হলে নতুন নোড লাগবে না।`, 1);
            if (nodes[cur] === key) return;
            parent = cur; side = key < nodes[cur] ? 'left' : 'right';
            cur = (side === 'left' ? left : right)[cur];
        }
        const id = 'n' + serial++; nodes[id] = key; left[id] = right[id] = null;
        if (show) step('create', {id, value: key}, 'Create the missing leaf only after reaching an empty link.',
            'খালি লিংকে পৌঁছে নতুন লিফ নোড বানাও।', 2);
        if (parent === null) {
            root = id;
            if (show) step('set-root', {id}, 'The empty tree receives its first root.', 'খালি ট্রি প্রথম রুট পেল।', 3);
        } else {
            (side === 'left' ? left : right)[parent] = id;
            if (show) step('set-child', {parent, side, child: id},
                `Attach ${key} on the ${side}; the ancestor bounds still hold.`,
                `${key}-কে ${side} লিংকে রাখো। সার্চের নিয়ম ঠিক আছে।`, 3);
        }
    };
    for (const value of input.values) insert(value, true);
    let cur = root, comparisons = 0;
    while (cur !== null) {
        comparisons++;
        step('compare', {id: cur, value: input.key},
            `Search ${input.key}: compare with ${nodes[cur]} before choosing a child.`,
            `${input.key} খুঁজতে ${nodes[cur]}-এর সঙ্গে তুলনা করো।`, 4);
        if (nodes[cur] === input.key) break;
        cur = input.key < nodes[cur] ? left[cur] : right[cur];
    }
    step('done', {vars: {found: cur !== null ? 1 : 0, comparisons}},
        cur === null ? 'A missing child proves the key is absent.' : 'Equality proves the key is present.',
        cur === null ? 'খালি লিংক পাওয়া গেছে, তাই এই কী নেই।' : 'কী মিলে গেছে, সার্চ শেষ।', 5);
    return {init: {nodes: [], root: null}, steps};
}
