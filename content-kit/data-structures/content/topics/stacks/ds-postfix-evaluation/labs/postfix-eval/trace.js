function trace(input) {
    const items = [];
    const steps = [];
    const trimmed = input.text.trim();
    const tokens = trimmed ? trimmed.split(/\s+/) : [];
    let valid = tokens.length >= 1 && tokens.length <= 12 ? 1 : 0;
    for (const token of tokens) {
        if (!valid) break;
        if (/^[+-]?\d+$/.test(token)) {
            const value = Number(token) || 0;
            if (value < -99 || value > 99) { valid = 0; break; }
            items.push(value);
            steps.push({op: 'push', value, line: 3, vars: {top: items.length - 1},
                note: {en: `${token} is one complete integer token, so push ${value}.`, bn: 'পুরো token-কে একটি সংখ্যা ধরে রাখো।'}});
        } else {
            if (token.length !== 1 || !'+-*/'.includes(token) || items.length < 2) {
                valid = 0; break;
            }
            const right = items[items.length - 1];
            const left = items[items.length - 2];
            if (token === '/' && right === 0) { valid = 0; break; }
            let result = token === '+' ? left + right : token === '-' ? left - right
                : token === '*' ? left * right : (Math.trunc(left / right) || 0);
            if (result === 0) result = 0;
            if (Math.abs(result) > 10000) { valid = 0; break; }
            steps.push({op: 'pop', line: 7, vars: {right},
                note: {en: `${right} is the right operand because it was pushed last.`, bn: 'প্রথমে ডান operand বের করো।'}});
            items.pop();
            steps.push({op: 'pop', line: 7, vars: {left},
                note: {en: `${left} is the earlier, left operand.`, bn: 'তারপর বাম operand বের করো।'}});
            items.pop();
            items.push(result);
            steps.push({op: 'push', value: result, line: 7, vars: {top: items.length - 1, result},
                note: {en: `${left} ${token} ${right} gives ${result}; this result can be used by the next operator.`, bn: 'হিসাবের ফল পরের কাজের operand হবে।'}});
        }
    }
    if (items.length !== 1) valid = 0;
    steps.push({op: 'done', line: 8, vars: {valid, result: valid ? items[0] : 0, top: items.length - 1},
        note: {en: valid ? `Result: ${items[0]}. Exactly one operand remains.`
            : 'Invalid: token, operand count or arithmetic checks failed.',
            bn: valid ? 'ঠিক একটি ফল পাওয়া গেছে।' : 'Token বা হিসাবের শর্ত মেলেনি।'}});
    return {init: {items: [], capacity: 12}, steps};
}
