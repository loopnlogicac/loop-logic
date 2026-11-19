function trace(input) {
    const items = [];
    const positions = [];
    const steps = [];
    const pairs = {')': '(', ']': '[', '}': '{'};
    let error = 0;
    for (let i = 0; i < input.text.length; i++) {
        const token = input.text[i];
        if ('([{'.includes(token)) {
            items.push(token);
            positions.push(i + 1);
            steps.push({op: 'push', value: token, line: 3, vars: {position: i + 1, top: items.length - 1},
                note: {en: `${token} must wait for its matching closer.`, bn: 'খোলা বন্ধনী তার জোড়ার অপেক্ষায় থাকবে।'}});
        } else if (pairs[token]) {
            if (!items.length || items[items.length - 1] !== pairs[token]) {
                error = i + 1;
                steps.push({op: 'note', line: 4, vars: {error},
                    note: {en: `Closer ${token} at ${error} cannot match the latest opener.`, bn: 'এই বন্ধ বন্ধনীটি top-এর সঙ্গে মেলে না।'}});
                break;
            }
            items.pop();
            positions.pop();
            steps.push({op: 'pop', line: 4, vars: {position: i + 1, top: items.length - 1},
                note: {en: `${token} closes the latest opener, so remove that pending pair.`, bn: 'জোড়া মিলেছে, তাই খোলা বন্ধনী সরাও।'}});
        } else {
            steps.push({op: 'note', line: 2, vars: {position: i + 1},
                note: {en: `${token === ' ' ? 'Space' : token} does not change bracket nesting.`, bn: `${token === ' ' ? 'ফাঁকা জায়গা' : token} বন্ধনীর nesting বদলায় না।`}});
        }
    }
    if (!error && items.length) {
        error = positions[0];
        steps.push({op: 'note', line: 5, vars: {error},
            note: {en: `Input ended; the oldest unmatched opener is at ${error}.`, bn: 'শেষেও খোলা বন্ধনী রয়ে গেছে।'}});
    }
    steps.push({op: 'done', line: 6, vars: {error, top: items.length - 1},
        note: {en: error ? `Error: ${error}. Pending openers stay visible.` : 'Error: 0. Every bracket closed in nesting order.',
            bn: error ? 'ত্রুটির অবস্থান দেখো।' : 'সব বন্ধনীর জোড়া মিলেছে।'}});
    return {init: {items: [], capacity: 25}, steps};
}
