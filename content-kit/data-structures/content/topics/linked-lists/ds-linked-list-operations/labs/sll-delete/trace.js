function trace(input) {
    const steps = [];
    const emit = (op, fields, line, en, bn) => {
        steps.push({op, ...fields, line, note: bn ? {en, bn} : {en}});
    };
    const nodes = input.values.map((value, i) => ({id: 'n' + i, value}));
    const next = {};
    for (let i = 0; i < nodes.length; i++) {
        next[nodes[i].id] = i + 1 < nodes.length ? nodes[i + 1].id : null;
    }
    const head = nodes.length ? nodes[0].id : null;
    const tail = nodes.length ? nodes[nodes.length - 1].id : null;
    const init = {nodes, next, head, tail};
    let position = 0;
    for (; position < nodes.length; position++) {
        const cur = nodes[position];
        emit('pointer', {name: 'cur', target: cur.id}, 2,
            `Compare ${cur.value} with ${input.target}; only the first equal node is removed.`,
            `${cur.value} আর ${input.target} তুলনা করো; শুধু প্রথম মেলা নোড বাদ যাবে।`);
        emit('visit', {id: cur.id}, 2, 'The owner is head or the preceding node’s next field.',
            'মালিক হলো head অথবা আগের নোডের next ফিল্ড।');
        if (cur.value === input.target) break;
    }
    if (position === nodes.length) {
        emit('done', {}, 3, 'No match exists, so all links remain unchanged.',
            'মানটি নেই, তাই কোনো লিংক বদলাবে না।');
        return {init, steps};
    }
    const victim = nodes[position].id;
    const successor = next[victim];
    if (position === 0) {
        emit('set-head', {id: successor}, 4, 'Head owns the victim, so head now identifies its successor.',
            'বাদ যাওয়া নোডের মালিক head, তাই head এবার তার পরের নোড দেখাবে।');
    } else {
        emit('link', {from: nodes[position - 1].id, to: successor, field: 'next'}, 4,
            'Bypass the victim before releasing its storage.',
            'মেমরি ছাড়ার আগে victim-কে বাদ দিয়ে লিংক দাও।');
    }
    if (victim === tail) {
        emit('set-tail', {id: position ? nodes[position - 1].id : null}, 5,
            'The final endpoint must not keep a released node.',
            'ছেড়ে দেওয়া নোডে tail রাখা যাবে না, তাই শেষ প্রান্ত ঠিক করো।');
    }
    emit('pointer', {name: 'cur', target: null}, 6, 'Stop using the working pointer before free.',
        'free করার আগে কাজের পয়েন্টার দিয়ে নোডটা ব্যবহার বন্ধ করো।');
    emit('link', {from: victim, to: null, field: 'next'}, 6,
        'Detach the outgoing link in the picture; live nodes already bypass the victim.',
        'ব্যবহৃত নোডগুলো ইতিমধ্যে পাশ কাটিয়েছে; ছবিতেও বাদ যাওয়া নোডের next আলাদা করো।');
    emit('delete', {id: victim}, 6, 'No live owner refers to the victim, so release it.',
        'ব্যবহৃত চেইনের কোনো লিংক victim-কে ধরে নেই, এখন free করো।');
    emit('done', {}, 6, 'Exactly the first matching node has been removed.',
        'শুধু প্রথম মেলা নোড বাদ গেছে; পরের একই মান থাকলে তা রয়ে গেছে।');
    return {init, steps};
}
