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
    const prev = {};
    for (let i = 0; i < nodes.length; i++) prev[nodes[i].id] = i ? nodes[i - 1].id : null;
    init.prev = prev;
    const successor = head === null ? null : next[head];
    emit('create', {id: 'new', value: 64}, 1, 'Allocate before editing either neighbor.');
    emit('link', {from: 'new', to: head, field: 'prev'}, 2,
        'The known cur node becomes the predecessor.');
    emit('link', {from: 'new', to: successor, field: 'next'}, 2,
        'Save the old successor in the new node.');
    if (successor !== null) {
        emit('link', {from: successor, to: 'new', field: 'prev'}, 3,
            'The successor must also point back to the inserted node.',
            'পরের নোডের prev-ও নতুন নোডে দাও।');
    } else {
        emit('set-tail', {id: 'new'}, 3, 'Without a successor, the new node becomes tail.');
    }
    if (head !== null) {
        emit('link', {from: head, to: 'new', field: 'next'}, 4, 'Publish the new forward edge from cur.');
    } else {
        emit('set-head', {id: 'new'}, 4, 'The empty chain now has its first node.');
    }
    emit('note', {}, 5, 'Now delete that same known node; finding it needs no search.');
    if (head !== null) {
        emit('link', {from: head, to: successor, field: 'next'}, 5, 'The predecessor bypasses the victim.');
    } else {
        emit('set-head', {id: successor}, 5, 'Deleting the only head restores the empty endpoint.');
    }
    if (successor !== null) {
        emit('link', {from: successor, to: head, field: 'prev'}, 5,
            'Repair the backward edge to mirror the forward edge.',
            'সামনের লিংকের সঙ্গে পেছনের লিংকও মিলিয়ে দাও।');
    } else {
        emit('set-tail', {id: head}, 5, 'The predecessor becomes tail, or both endpoints become NULL.');
    }
    emit('link', {from: 'new', to: null, field: 'next'}, 6, 'Detach the outgoing next link in the picture.');
    emit('link', {from: 'new', to: null, field: 'prev'}, 6, 'Detach the outgoing prev link too.');
    emit('delete', {id: 'new'}, 6, 'Both neighbors bypass the victim, so its allocation can end.');
    emit('done', {}, 6, 'The original sequence is restored in both directions.');
    return {init, steps};
}
