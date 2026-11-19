function trace(input) {
    const items = [0, 0, 0, 0];
    const steps = [];
    let front = 0;
    let rear = 0;
    let count = 0;
    const pointers = () => {
        steps.push({op: 'pointer', name: 'front', target: front, line: 8,
            note: {en: 'Front identifies the next removal cell; count decides whether it is live.'}});
        steps.push({op: 'pointer', name: 'rear', target: rear, line: 8,
            note: {en: 'Rear identifies the next insertion cell; count decides whether insertion is allowed.'}});
        const logical = [];
        for (let k = 0; k < count; k++) logical.push(items[(front + k) % 4]);
        steps.push({op: 'list', name: 'items', items: logical, line: 8,
            vars: {front, rear, count}, note: {en: 'Logical order starts at front and wraps for count entries.', bn: 'Front থেকে count ঘর ঘুরে logical ক্রম দেখো।'}});
    };
    pointers();
    for (const command of input.commands) {
        if (command === 0 && count > 0) {
            const value = items[front];
            items[front] = 0;
            steps.push({op: 'set', i: front, value: 0, line: 3, vars: {value},
                note: {en: `Remove ${value} from front; zero only clears the displayed spare cell.`, bn: 'সামনের মান সরিয়ে ঘরটি খালি দেখাও।'}});
            front = (front + 1) % 4;
            count--;
        } else if (command !== 0 && count < 4) {
            items[rear] = command;
            steps.push({op: 'set', i: rear, value: command, line: 5,
                note: {en: `A spare cell exists, so write ${command} at rear.`, bn: 'জায়গা আছে, rear-এর ঘরে মান রাখো।'}});
            rear = (rear + 1) % 4;
            count++;
        } else {
            steps.push({op: 'note', line: 7,
                note: {en: command === 0 ? 'Empty: count is zero, so no value leaves.'
                    : 'Full: count is four, so no live cell may be overwritten.', bn: 'শর্ত মেলেনি, তাই কোনো মান বা index বদলাবে না।'}});
        }
        pointers();
    }
    steps.push({op: 'done', line: 8, vars: {front, rear, count},
        note: {en: 'Cursors wrap, while count separates empty and full even when both arrows coincide.', bn: 'দুই cursor মিলে গেলেও count দিয়ে খালি আর পূর্ণ চেনা যায়।'}});
    return {init: {array: [0, 0, 0, 0]}, steps};
}
