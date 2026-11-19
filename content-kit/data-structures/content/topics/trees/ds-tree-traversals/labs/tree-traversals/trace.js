function trace(input) {
    const nodes = input.values.map((value, id) => ({id, value}));
    const left = {}, right = {}, order = [], steps = [];
    for (let i = 0; i < nodes.length; i++) {
        left[i] = 2 * i + 1 < nodes.length ? 2 * i + 1 : null;
        right[i] = 2 * i + 2 < nodes.length ? 2 * i + 2 : null;
    }
    const emit = (id) => {
        order.push(nodes[id].value);
        steps.push({op: 'visit', id, line: 3, note: {
            en: `Visit ${nodes[id].value} now; mode ${input.mode} determines its position.`,
            bn: `এবার ${nodes[id].value} দেখো। বেছে নেওয়া ট্রাভার্সাল অনুযায়ী এর পালা এসেছে।`
        }});
        steps.push({op: 'list', name: 'order', items: order.slice(), line: 3,
            note: {en: 'Append the visited key; the tree links stay unchanged.', bn: 'দেখা কী শেষে যোগ করো; ট্রির লিংক একই থাকে।'}});
    };
    const walk = (id) => {
        if (id === null) return;
        steps.push({op: 'pointer', name: 'cur', target: id, line: 1,
            note: {en: 'Enter this subtree; return immediately at a missing child.', bn: 'এই সাবট্রিতে ঢোকো; চাইল্ড না থাকলে সঙ্গে সঙ্গে ফেরো।'}});
        if (input.mode === 0) emit(id);
        walk(left[id]);
        if (input.mode === 1) emit(id);
        walk(right[id]);
        if (input.mode === 2) emit(id);
    };
    const root = nodes.length ? 0 : null;
    if (input.mode === 3) {
        const queue = root === null ? [] : [root];
        while (queue.length) {
            const cur = queue.shift(); emit(cur);
            if (left[cur] !== null) queue.push(left[cur]);
            if (right[cur] !== null) queue.push(right[cur]);
            steps.push({op: 'list', name: 'queue', items: queue.map(id => nodes[id].value),
                line: 4, note: {en: 'Queue left before right so the next level stays left to right.',
                    bn: 'আগে বাম চাইল্ড, পরে ডান চাইল্ড কিউতে রাখো।'}});
        }
    } else walk(root);
    steps.push({op: 'list', name: 'order', items: order.slice(), line: 5,
        note: {en: 'The result contains each existing node exactly once.', bn: 'ফলে থাকা প্রতিটি নোড ঠিক একবার এসেছে।'}});
    steps.push({op: 'done', line: 5, note: {en: 'Traversal finished without changing the shape.',
        bn: 'ট্রাভার্সাল শেষ। ট্রির লিংকগুলো বদলায়নি।'}});
    return {init: {nodes, left, right, root}, steps};
}
