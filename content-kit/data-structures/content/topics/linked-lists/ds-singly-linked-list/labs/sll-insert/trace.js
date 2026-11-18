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
    emit('create', {id: 'new', value: input.value}, 1,
        'Allocate an independent node before changing the live chain.',
        'লিস্ট বদলানোর আগে আলাদা নতুন নোড বানাও।');
    if (input.mode === 0) {
        emit('link', {from: 'new', to: head, field: 'next'}, 2,
            'Preserve the old head as the new node’s successor.');
        emit('set-head', {id: 'new'}, 2, 'Publish the new first node after its link is ready.',
            'লিংক তৈরি হলে নতুন নোডকে head করো।');
        if (tail === null) {
            emit('set-tail', {id: 'new'}, 3, 'The first node is also the last node.');
        }
    } else {
        for (const node of nodes) {
            emit('pointer', {name: 'cur', target: node.id}, 4,
                'Follow next because this append implementation does not keep a working tail pointer.');
        }
        emit('link', {from: 'new', to: null, field: 'next'}, 5,
            'A final node must terminate the ordinary chain.');
        if (tail === null) {
            emit('set-head', {id: 'new'}, 5, 'There is no predecessor, so update head.');
        } else {
            emit('link', {from: tail, to: 'new', field: 'next'}, 5,
                'The old final next field now owns the appended node.',
                'পুরোনো শেষ নোডের next নতুন নোডকে ধরবে।');
        }
        emit('set-tail', {id: 'new'}, 6, 'The appended node is the new final endpoint.');
    }
    emit('done', {}, 6, 'The sequence has one more reachable node.');
    return {init, steps};
}
