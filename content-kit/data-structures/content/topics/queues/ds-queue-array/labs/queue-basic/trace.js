function trace(input) {
    const items = [];
    const steps = [];
    let front = 0;
    let rear = 0;
    for (const command of input.commands) {
        if (command === 0) {
            if (front === rear) {
                steps.push({op: 'note', line: 4,
                    note: {en: 'Equal cursors mean no waiting value can be removed.', bn: 'দুই cursor সমান, তাই কিউ খালি।'}});
            } else {
                const value = items.shift();
                front++;
                steps.push({op: 'dequeue', line: 3, vars: {front, rear, value},
                    note: {en: `${value} arrived earliest, so remove it and advance front.`, bn: 'আগে আসা মান সরিয়ে front বাড়াও।'}});
            }
        } else if (rear < 4) {
            items.push(command);
            rear++;
            steps.push({op: 'enqueue', value: command, line: 5, vars: {front, rear},
                note: {en: `${command} joins after the waiting values; rear advances.`, bn: 'নতুন মান শেষে যোগ হবে।'}});
        } else {
            steps.push({op: 'note', line: 6, vars: {front, rear},
                note: {en: `No rear space: rear is four, even though ${front} prefix cells are unused.`, bn: 'Rear শেষ সীমায়; সামনের খালি ঘর ব্যবহার হচ্ছে না।'}});
        }
    }
    steps.push({op: 'done', line: 7, vars: {front, rear},
        note: {en: 'The visible queue is the live FIFO interval; removed prefix cells are outside it.', bn: 'শুধু অপেক্ষায় থাকা মানগুলোই কিউতে আছে।'}});
    return {init: {items: [], capacity: 4}, steps};
}
