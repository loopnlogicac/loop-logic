function trace(input) {
    const text = input.text, pattern = input.pattern;
    const n = text.length, m = pattern.length, offset = n + 1;
    const steps = [], matches = [];
    let comparisons = 0;
    steps.push({op:'list',name:'matches',items:[],note:{en:'Keep every accepted start; advancing one position preserves overlaps.'}});
    if (m === 0) {
        for (let i = 0; i <= n; i++) matches.push(i);
        steps.push({op:'list',name:'matches',items:matches,note:{en:'For an empty pattern, this lab explicitly matches every text boundary.',bn:'খালি প্যাটার্ন হলে এই ল্যাবে টেক্সটের প্রতিটি সীমানায় ম্যাচ ধরা হয়।'}});
    } else {
        for (let start = 0; start + m <= n; start++) {
            let j = 0;
            steps.push({op:'range',from:start,to:start+m-1,tone:'active',line:2,
                vars:{start,j},note:{en:'Only a complete pattern-sized text segment may be tested.'}});
            while (j < m) {
                comparisons++;
                const same = text[start+j] === pattern[j];
                steps.push({op:'compare',i:start+j,j:offset+j,line:5,vars:{j,comparisons},
                    note:{en:same ? 'These characters agree; extend the matched prefix.' : 'These characters differ; this alignment cannot match.',
                          bn:same ? 'অক্ষর দুটো মেলে; আরও এক ঘর এগিয়ে দেখো।' : 'অক্ষর দুটো মেলে না; এই শুরুতে পুরো ম্যাচ হবে না।'}});
                if (!same) break;
                j++;
            }
            if (j === m) {
                matches.push(start);
                steps.push({op:'list',name:'matches',items:matches.slice(),line:8,
                    note:{en:'All pattern characters agree, so retain this start.',bn:'প্যাটার্নের সব অক্ষর মেলে, তাই এই শুরুর ইনডেক্স রাখো।'}});
            }
            steps.push({op:'clear-ranges',note:{en:'Move the pattern one position, even after a match.'}});
        }
    }
    steps.push({op:'done',vars:{count:matches.length,comparisons},note:{en:`Found ${matches.length} overlapping occurrence(s).`,bn:`ওভারল্যাপসহ ${matches.length}টা ম্যাচ পাওয়া গেছে।`}});
    return {init:{array:[...text,'|',...pattern]},steps};
}
