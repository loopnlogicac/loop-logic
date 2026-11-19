function trace(input) {
    const steps = [];
    const emit = (op, fields, line, en, bn) => {
        steps.push({op, ...fields, line, note: bn ? {en, bn} : {en}});
    };
    const array = input.values.concat(Array(8 - input.values.length).fill(null));
    const init = {array: array.slice()};
    let size = input.values.length;
    let shifts = 0;
    const position = input.position;
    emit('note', {vars: {size, capacity: 8, shifts}}, 1,
        'Check the live range before touching any reserved cell.');
    if (input.mode === 0 && size < 8 && position <= size) {
        for (let i = size; i > position; i--) {
            array[i] = array[i - 1];
            shifts++;
            emit('set', {i, value: array[i], vars: {i, shifts}}, 2,
                `Move ${array[i]} from ${i - 1} to ${i} before its source can be overwritten.`,
                'শেষ দিক থেকে সরালে আগের মান হারাবে না।');
        }
        array[position] = input.value;
        size++;
        emit('set', {i: position, value: input.value, vars: {size}}, 3,
            'The gap is ready, so store the new value and include it in size.',
            'জায়গা হয়েছে, নতুন মান রেখে size বাড়াও।');
    } else if (input.mode === 1 && position < size) {
        for (let i = position; i + 1 < size; i++) {
            array[i] = array[i + 1];
            shifts++;
            emit('set', {i, value: array[i], vars: {i, shifts}}, 4,
                `Move ${array[i]} left to fill the current gap.`);
        }
        size--;
        array[size] = null;
        emit('set', {i: size, value: null, vars: {size}}, 5,
            'The old final cell is spare now; the picture clears it to show the live boundary.',
            'শেষ ঘরটি এখন ব্যবহার হচ্ছে না, তাই ছবিতে ফাঁকা দেখাও।');
    } else {
        emit('note', {}, 1, 'This position is invalid or storage is full; preserve every live value.',
            'Position ভুল বা অ্যারে পূর্ণ, তাই মান বদলাবে না।');
    }
    emit('list', {name: 'live', items: array.slice(0, size)}, 6,
        'Only the first size cells belong to the collection.');
    emit('done', {vars: {size, shifts}}, 6, 'The requested update is complete.');
    return {init, steps};
}
