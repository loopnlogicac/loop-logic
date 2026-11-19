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
    // An entry outside this particular input length is treated as no cycle.
    const entry = input.entry >= 0 && input.entry < nodes.length ? nodes[input.entry].id : null;
    if (tail !== null) next[tail] = entry;
    let slow = head;
    let fast = head;
    let cycle = false;
    emit('pointer', {name: 'slow', target: slow}, 1,
        'Start both pointers at head, but compare only after a move.',
        'দুই পয়েন্টার head-এ শুরু করো, তবে চলার পরেই তুলনা করবে।');
    emit('pointer', {name: 'fast', target: fast}, 1,
        'A cycle is about node identity, not equal stored numbers.',
        'cycle মানে একই নোডে ফেরা, শুধু সমান মান পাওয়া নয়।');
    while (fast !== null && next[fast] !== null) {
        slow = next[slow];
        emit('pointer', {name: 'slow', target: slow}, 3, 'Slow advances one successor.',
            'slow পরের একটি নোডে এগোয়, যাতে দুই গতির ফারাক থাকে।');
        const halfway = next[fast];
        emit('pointer', {name: 'fast', target: halfway}, 4,
            'The first fast step exists because the loop checked its successor.',
            'লুপ পরের নোড আছে দেখেছে, তাই fast-এর প্রথম ধাপটি নেওয়া যায়।');
        fast = next[halfway];
        emit('pointer', {name: 'fast', target: fast}, 4,
            'Fast completes its second step; reaching NULL will end the next round.',
            'fast দ্বিতীয় ধাপ শেষ করে; NULL পেলে পরের ধাপ আর চলবে না।');
        if (slow === fast) {
            cycle = true;
            emit('mark', {targets: [slow], tone: 'found'}, 5,
                'The pointers meet after moving, so this node lies on a cycle.',
                'চলার পরে একই নোডে মিলেছে, তাই cycle আছে।');
            break;
        }
        emit('note', {}, 5, 'Different nodes mean another round is needed.',
            'নোড আলাদা, তাই সিদ্ধান্ত নিতে আরও এক ধাপ দরকার।');
    }
    emit('done', {vars: {cycle: cycle ? 1 : 0}}, cycle ? 5 : 6,
        cycle ? 'A cycle exists; ordinary NULL-based destruction needs the cycle broken first.' :
            'Fast reached an end, so the chain is acyclic.',
        cycle ? 'Cycle আছে; free করার আগে বৃত্ত ভাঙতে হবে।' : 'শেষে পৌঁছেছে, তাই cycle নেই।');
    return {init, steps};
}
