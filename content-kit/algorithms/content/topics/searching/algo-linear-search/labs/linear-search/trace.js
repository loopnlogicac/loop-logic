function trace(input) {
    const a = input.values.slice();
    const steps = [];
    let result = -1;
    for (let i = 0; i < a.length; i++) {
        steps.push({op: 'pointer', name: 'i', target: i, line: 1,
            note: {en: `Positions before ${i} did not match; test this value.`, bn: 'আগের মানগুলো মেলেনি, এবার এই মানটি দেখো।'},
            vars: {i, target: input.target}});
        if (a[i] === input.target) {
            result = i;
            steps.push({op: 'mark', targets: [i], tone: 'found', line: 2,
                note: {en: `${a[i]} equals the target, so the first match is here.`, bn: 'মানটি target-এর সমান, তাই প্রথম মিল এখানেই।'}});
            break;
        }
        steps.push({op: 'mark', targets: [i], tone: 'discarded', line: 2,
            note: {en: `${a[i]} is different from ${input.target}; continue.`}});
    }
    steps.push({op: 'done', line: result < 0 ? 3 : 2, vars: {result},
        note: {en: result < 0 ? 'Every value was tested; the target is absent.' : `Return the first matching index ${result}.`,
            bn: result < 0 ? 'সব মান দেখা হয়েছে; target নেই।' : 'প্রথম মিলে যাওয়া অবস্থানটি ফেরত দাও।'}});
    return {init: {array: a}, steps};
}
