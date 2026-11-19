function trace(input) {
    const a = input.values.slice().sort((x, y) => x - y);
    const steps = [{op: 'note', line: 1, note: {en: 'Display an ascending copy before searching; this setup has a separate sorting cost.', bn: 'সার্চের আগে সাজানো কপি দেখানো হচ্ছে; সাজানোর খরচ আলাদা।'}}];
    let low = 0;
    let high = a.length;
    let result = -1;
    while (low < high) {
        const mid = low + Math.floor((high - low) / 2);
        steps.push({op: 'clear-ranges', line: 3, note: {en: 'Replace the previous candidate interval.'}});
        steps.push({op: 'range', from: low, to: high - 1, tone: 'active', line: 3,
            note: {en: `Only [${low}, ${high}) can still contain the target.`}, vars: {low, high, mid}});
        steps.push({op: 'pointer', name: 'mid', target: mid, line: 4,
            note: {en: `The middle value ${a[mid]} decides which half can survive.`, bn: 'মাঝের মান দেখে ঠিক করো কোন অর্ধেক থাকবে।'}});
        if (a[mid] === input.target) {
            result = mid;
            steps.push({op: 'mark', targets: [mid], tone: 'found', line: 5,
                note: {en: 'Equality gives a valid matching position.', bn: 'মান সমান, তাই এই অবস্থানটি সঠিক উত্তর।'}});
            break;
        }
        if (a[mid] < input.target) {
            low = mid + 1;
            steps.push({op: 'note', line: 6, vars: {low}, note: {en: 'The middle and everything smaller cannot match; move low past mid.'}});
        } else {
            high = mid;
            steps.push({op: 'note', line: 7, vars: {high}, note: {en: 'The middle is too large; high becomes mid, excluding it.'}});
        }
    }
    steps.push({op: 'done', line: result < 0 ? 8 : 5, vars: {result, low, high},
        note: {en: result < 0 ? 'The half-open interval is empty, so return -1.' : `Return index ${result} in the displayed sorted copy.`, bn: 'ফলাফলটি সাজানো অ্যারের অবস্থান বোঝায়; না পেলে -1।'}});
    return {init: {array: a}, steps};
}
