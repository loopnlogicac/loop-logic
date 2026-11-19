function trace(input) {
    const items = [];
    const steps = [];
    const note = (en, bn) => ({en, bn});
    for (const command of input.commands) {
        if (command === 0) {
            if (items.length === 0) {
                steps.push({op: 'note', line: 3, vars: {top: -1},
                    note: note('Underflow: no item exists to remove.', 'স্ট্যাক খালি, তাই pop হবে না।')});
            } else {
                const value = items.pop();
                steps.push({op: 'pop', line: 3, vars: {top: items.length - 1, value},
                    note: note(`Remove ${value}; the previous entry becomes top.`, 'উপরের মান সরালে আগের মান top হয়।')});
            }
        } else if (command === 100) {
            steps.push(items.length ? {op: 'peek', line: 4,
                note: note(`Peek sees ${items[items.length - 1]} without removing it.`, 'Peek-এ top বদলায় না।')}
                : {op: 'note', line: 4, note: note('Empty: peek has no live cell to read.', 'খালি স্ট্যাক থেকে peek করা যায় না।')});
        } else if (items.length === 4) {
            steps.push({op: 'note', line: 5,
                note: note(`Overflow: refuse ${command} and keep top unchanged.`, 'ঘর পূর্ণ, তাই নতুন মান রাখবে না।')});
        } else {
            items.push(command);
            steps.push({op: 'push', value: command, line: 5, vars: {top: items.length - 1},
                note: note(`Push ${command} into the next free cell.`, 'পরের খালি ঘরে নতুন মান রাখো।')});
        }
    }
    steps.push({op: 'done', line: 6, vars: {top: items.length - 1},
        note: note('Only indices through top are live stack entries.', 'Top পর্যন্ত ঘরগুলোই স্ট্যাকের অংশ।')});
    return {init: {items: [], capacity: 4}, steps};
}
