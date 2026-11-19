function trace(input) {
    const steps = [], nodes = {}, left = {}, right = {}, heights = {};
    let serial = 0;
    const emit = (op, fields, en, bn, line) => steps.push({op, ...fields, note: {en, bn}, line});
    const h = id => id === null ? 0 : heights[id];
    const update = id => { heights[id] = 1 + Math.max(h(left[id]), h(right[id])); };
    const setChild = (parent, side, child, en) => {
        (side === 'left' ? left : right)[parent] = child;
        emit('set-child', {parent, side, child}, en,
            'লিংকটা বদলাও, যাতে সাবট্রির সব নোড ঠিক থাকে।', 4);
    };
    const rightRotate = y => {
        const x = left[y], middle = right[x];
        setChild(y, 'left', middle, 'Move the middle subtree to the old root left link first.');
        setChild(x, 'right', y, 'The left child becomes the local root; old root moves right.');
        update(y); update(x); return x;
    };
    const leftRotate = x => {
        const y = right[x], middle = left[y];
        setChild(x, 'right', middle, 'Move the middle subtree to the old root right link first.');
        setChild(y, 'left', x, 'The right child becomes the local root; old root moves left.');
        update(x); update(y); return y;
    };
    const insert = (root, key) => {
        if (root === null) {
            const id = 'n' + serial++; nodes[id] = key;
            left[id] = right[id] = null; heights[id] = 1;
            emit('create', {id, value: key}, `Create leaf ${key} with node height one.`,
                `${key} দিয়ে লিফ নোড বানাও। এর হাইট এক।`, 1); return id;
        }
        emit('compare', {id: root, value: key}, 'Use the BST comparison before checking balance.',
            'আগে বিএসটির নিয়মে কী তুলনা করো।', 1);
        if (key === nodes[root]) return root;
        const side = key < nodes[root] ? 'left' : 'right';
        const child = insert((side === 'left' ? left : right)[root], key);
        setChild(root, side, child, 'Reconnect the returned subtree root at its original parent.');
        update(root);
        const balance = h(left[root]) - h(right[root]);
        emit('note', {vars: {key: nodes[root], balance, height: h(root)}},
            `Balance ${balance} is left height minus right height.`,
            `বাম হাইট থেকে ডান হাইট বাদ দিলে ব্যালান্স ${balance}।`, 2);
        if (balance > 1) {
            if (key > nodes[left[root]]) {
                const child = leftRotate(left[root]);
                setChild(root, 'left', child, 'LR first rotates the left child left.');
            }
            return rightRotate(root);
        }
        if (balance < -1) {
            if (key < nodes[right[root]]) {
                const child = rightRotate(right[root]);
                setChild(root, 'right', child, 'RL first rotates the right child right.');
            }
            return leftRotate(root);
        }
        return root;
    };
    let root = null;
    const roots = [];
    for (const key of input.values) {
        root = insert(root, key);
        emit('set-root', {id: root}, 'Publish the returned root after any rotations.',
            'রোটেশনের পর যে রুট ফেরত এসেছে, সেটাই রাখো।', 5);
        roots.push(nodes[root]);
        emit('list', {name: 'roots', items: roots.slice()}, 'The root and height describe the current balanced tree.',
            'বর্তমান রুট আর হাইট দেখে ট্রিটা বোঝো।', 5);
    }
    emit('done', {vars: {height: h(root)}}, 'All stored balance factors now lie between minus one and one.',
        'সব নোডের ব্যালান্স এখন মাইনাস এক থেকে একের মধ্যে।', 6);
    return {init: {nodes: [], root: null}, steps};
}
