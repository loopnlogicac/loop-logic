function trace(input) {
    const steps = [];
    const emit = (op, fields, line, en, bn) => {
        steps.push({op, ...fields, line, note: bn ? {en, bn} : {en}});
    };
    const live = [];
    let capacity = 0;
    let copies = 0;
    emit('note', {vars: {size: 0, capacity, copies}}, 1,
        'No allocation is needed while the vector is empty.');
    for (const value of input.values) {
        const size = live.length;
        if (size === capacity) {
            const old = capacity;
            capacity = capacity === 0 ? 1 : 2 * capacity;
            emit('list', {name: 'old', items: live.slice(), vars: {capacity}}, 3,
                'The vector is full, so reserve twice as many cells.',
                'Vector পূর্ণ, তাই ধারণক্ষমতা দ্বিগুণ করো।');
            // Model a moving realloc; an allocator may instead extend in place.
            for (let i = old - 1; i >= 0; i--) {
                emit('remove', {i}, 4, 'A moving resize will replace this old cell.');
            }
            for (let i = 0; i < capacity; i++) {
                emit('insert', {i, value: null}, 4, 'Reserve a cell in the replacement block.');
            }
            for (let i = 0; i < size; i++) {
                copies++;
                emit('set', {i, value: live[i], vars: {copies}}, 4,
                    `Preserve live value ${live[i]} before discarding the old block.`,
                    'পুরোনো মেমরি ছাড়ার আগে ব্যবহৃত মান কপি করো।');
            }
            emit('list', {name: 'old', items: []}, 4,
                'All live values are preserved; the old block can be released.');
        }
        live.push(value);
        emit('set', {i: size, value, vars: {size: live.length}}, 5,
            'The owner now has room, so append at the first spare slot.');
    }
    emit('list', {name: 'live', items: live.slice()}, 6, 'Spare cells are excluded from the live sequence.');
    emit('done', {vars: {size: live.length, capacity, copies}}, 6,
        'The accumulated copy work is linear across these appends.',
        'সব append মিলিয়ে কপি করার কাজ রৈখিক থাকে।');
    return {init: {array: []}, steps};
}
