function trace(input) {
    const pattern = input.pattern, m = pattern.length;
    const pi = Array(m).fill(0), steps = [];
    steps.push({op:'list',name:'pattern',items:[...pattern],note:{en:'The side list contains pattern characters; array cells below contain their pi lengths.'}});
    if (m > 0) {
        steps.push({op:'note',line:1,note:{
            en:'A single-character prefix has no nonempty proper border, so pi[0] is zero.',
            bn:'এক অক্ষরের prefix-এর কোনো খালি নয় এমন proper border নেই, তাই pi[0] শূন্য।'}});
    }
    for (let i = 1; i < m; i++) {
        let j = pi[i-1];
        steps.push({op:'pointer',name:'i',target:i,line:2,vars:{i,j},note:{en:'Extend the previous prefix border if the new character permits it.'}});
        while (true) {
            const same = pattern[i] === pattern[j];
            steps.push({op:'mark',targets:[i,j],tone:'compare',line:4,
                note:{en:`Compare pattern[${i}]=${pattern[i]} with pattern[${j}]=${pattern[j]}; numeric cells store pi, not letters.`,
                      bn:`প্যাটার্নের ${i} আর ${j} ইনডেক্সের অক্ষর মেলাও; অ্যারের সংখ্যাগুলো pi-এর মান।`}});
            if (same) {
                j++;
                steps.push({op:'note',line:6,vars:{j},note:{en:'Equality extends this border by one character.',bn:'অক্ষর মেলে, তাই border-এর দৈর্ঘ্য এক বাড়ে।'}});
                break;
            }
            if (j === 0) break;
            const old = j;
            j = pi[j-1];
            steps.push({op:'note',line:5,vars:{j},note:{en:`Length ${old} cannot extend; its next possible border has length ${j}.`,bn:`${old} দৈর্ঘ্যটা বাড়ানো যাচ্ছে না; পরের সম্ভাব্য border-এর দৈর্ঘ্য ${j}।`}});
        }
        pi[i] = j;
        steps.push({op:'set',i,value:j,line:7,note:{en:'Store the longest border that survived every comparison.'}});
        steps.push({op:'clear-marks',note:{en:'The next position starts from this completed prefix entry.'}});
    }
    steps.push({op:'done',vars:{length:m},note:{en:'Every pi entry now gives a longest proper border length.',bn:'প্রতিটি pi ঘরে এখন সবচেয়ে বড় proper border-এর দৈর্ঘ্য আছে।'}});
    return {init:{array:Array(m).fill(0)},steps};
}
