function trace(input) {
    const items = [];
    const output = [];
    const steps = [];
    const precedence = token => token === '+' || token === '-' ? 1
        : token === '*' || token === '/' ? 2 : token === '^' ? 3 : 0;
    let need_operand = true;
    let valid = 1;
    const emit = token => {
        output.push(token);
        steps.push({op: 'list', name: 'output', items: output.slice(), line: 3,
            note: {en: `Append ${token}; its operands already precede it.`, bn: 'প্রস্তুত token output-এ রাখো।'}});
    };
    const pop = reason => {
        const token = items.pop();
        steps.push({op: 'pop', line: 6,
            note: {en: reason, bn: 'নিয়ম মেনে top-এর operator সরাও।'}});
        return token;
    };
    const push = (token, line) => {
        items.push(token);
        steps.push({op: 'push', value: token, line,
            note: {en: `${token} waits on the operator stack.`, bn: 'Operator পরের সিদ্ধান্তের অপেক্ষায় থাকবে।'}});
    };
    for (const token of input.text) {
        if (token === ' ') continue;
        if (token >= 'A' && token <= 'Z' && need_operand) {
            emit(token);
            need_operand = false;
        } else if (token === '(' && need_operand) {
            push(token, 4);
        } else if (token === ')' && !need_operand) {
            while (items.length && items[items.length - 1] !== '(') {
                emit(pop('Close the group by emitting its pending operator.'));
            }
            if (!items.length) { valid = 0; break; }
            pop('Discard the matching opener; parentheses do not enter postfix.');
        } else if (precedence(token) && !need_operand) {
            while (items.length && items[items.length - 1] !== '('
                && (precedence(items[items.length - 1]) > precedence(token)
                || (precedence(items[items.length - 1]) === precedence(token) && token !== '^'))) {
                emit(pop(`The top operator binds before incoming ${token}.`));
            }
            push(token, 7);
            need_operand = true;
        } else { valid = 0; break; }
    }
    if (need_operand) valid = 0;
    while (valid && items.length) {
        if (items[items.length - 1] === '(') { valid = 0; break; }
        emit(pop('No later token remains, so emit this pending operator.'));
    }
    steps.push({op: 'list', name: 'output', items: output.slice(), line: 9,
        note: {en: valid ? 'The output preserves precedence and associativity.' : 'This partial output is not a valid converted expression.', bn: valid ? 'Output-এ precedence আর associativity বজায় আছে।' : 'এই আংশিক output বৈধ converted expression নয়।'}});
    steps.push({op: 'done', line: 9, vars: {valid, need_operand: need_operand ? 1 : 0},
        note: {en: valid ? `Postfix: ${output.join('')}` : 'Invalid: operand or grouping rules failed.',
            bn: valid ? 'Postfix তৈরি হয়েছে।' : 'Expression-এর নিয়ম মেলেনি।'}});
    return {init: {items: [], capacity: 25}, steps};
}
