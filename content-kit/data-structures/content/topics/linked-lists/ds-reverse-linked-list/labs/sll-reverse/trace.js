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
    let prev = null;
    let cur = head;
    emit('pointer', {name: 'prev', target: prev}, 1, 'The reversed prefix starts empty.',
        'উল্টানো শুরুর অংশ এখন খালি, তাই prev হলো NULL।');
    emit('pointer', {name: 'cur', target: cur}, 1, 'The original head starts the unprocessed suffix.',
        'এখনো কাজ বাকি এমন অংশ পুরোনো head থেকে শুরু।');
    while (cur !== null) {
        const saved = next[cur];
        emit('pointer', {name: 'next', target: saved}, 3,
            'Save the suffix before overwriting its only forward link.',
            'সামনের লিংক বদলানোর আগে বাকি অংশের অ্যাড্রেস রাখো।');
        emit('link', {from: cur, to: prev, field: 'next'}, 4,
            'Turn this one edge toward the already reversed prefix.',
            'এই লিংকটি উল্টানো অংশের দিকে ঘোরাও।');
        prev = cur;
        cur = saved;
        emit('pointer', {name: 'prev', target: prev}, 5, 'The processed prefix gains one node.',
            'কাজ শেষ হওয়া উল্টানো অংশে আরও একটি নোড যোগ হলো।');
        emit('pointer', {name: 'cur', target: cur}, 5, 'Continue at the saved unprocessed successor.',
            'রেখে দেওয়া পরের নোড থেকে বাকি কাজ চালাও।');
    }
    emit('set-head', {id: prev}, 6, 'Every node is processed; prev is the new head.',
        'সব নোডে কাজ শেষ; prev এখন নতুন head।');
    emit('set-tail', {id: head}, 6, 'The old head is now the tail with a NULL next link.',
        'পুরোনো head এখন tail, তার next হলো NULL।');
    emit('pointer', {name: 'next', target: null}, 6, 'No unprocessed suffix remains.',
        'কাজ বাকি এমন কোনো অংশ আর নেই।');
    emit('done', {}, 6, 'Values stay inside their original nodes; only links changed.',
        'নোডের মান একই আছে, শুধু লিংকের দিক বদলেছে।');
    return {init, steps};
}
