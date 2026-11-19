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
    for (const value of input.values) insert(value, false);
    const init = {nodes: Object.keys(nodes).map(id => ({id, value: nodes[id]})),
        left: {...left}, right: {...right}, root};
    const remove = (cur, key, parent, side) => {
        if (cur === null) {
            step('note', {}, 'This empty link proves there is no key to remove.',
                'খালি লিংক মানে মোছার মতো কী নেই।', 1); return null;
        }
        step('compare', {id: cur, value: key}, `Compare ${key} with ${nodes[cur]} to locate the deletion node.`,
            `${key} মুছতে ${nodes[cur]}-এর সঙ্গে তুলনা করো।`, 1);
        if (key < nodes[cur]) { left[cur] = remove(left[cur], key, cur, 'left'); return cur; }
        if (key > nodes[cur]) { right[cur] = remove(right[cur], key, cur, 'right'); return cur; }
        if (left[cur] !== null && right[cur] !== null) {
            let next = right[cur];
            while (left[next] !== null) {
                step('visit', {id: next}, 'The successor is farther left inside the right subtree.',
                    'পরের বড় কী, অর্থাৎ successor, পেতে ডান সাবট্রির আরও বামে যাও।', 2);
                next = left[next];
            }
            nodes[cur] = nodes[next];
            step('set-value', {id: cur, value: nodes[next]},
                'Copy the successor key; its original node must still be removed.',
                'successor-এর কী কপি করো। পুরোনো নোডটাও মুছতে হবে।', 3);
            right[cur] = remove(right[cur], nodes[next], cur, 'right'); return cur;
        }
        const child = left[cur] !== null ? left[cur] : right[cur];
        if (parent === null) {
            root = child;
            step('set-root', {id: child}, 'Move root to the saved child before freeing the old root.',
                'পুরোনো রুট মোছার আগে চাইল্ডকে নতুন রুট করো।', 4);
        } else {
            (side === 'left' ? left : right)[parent] = child;
            step('set-child', {parent, side, child}, 'Bypass this node through its parent link.',
                'প্যারেন্টের লিংক দিয়ে এই নোডটাকে বাদ দাও।', 4);
        }
        step('delete', {id: cur}, 'No incoming tree link remains; release exactly this node.',
            'এখন কোনো ট্রি লিংক এই নোডে আসে না। নোডটা মুছে দাও।', 5);
        delete nodes[cur]; delete left[cur]; delete right[cur]; return child;
    };
    root = remove(root, input.key, null, null);
    step('done', {}, 'Deletion is complete; every surviving subtree retains its ordering.',
        'মোছা শেষ। বাকি নোডগুলোর সার্চের নিয়ম ঠিক আছে।', 6);
    return {init, steps};
}
