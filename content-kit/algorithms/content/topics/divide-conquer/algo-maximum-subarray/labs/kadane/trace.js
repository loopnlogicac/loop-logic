function trace(input) {
    const values = input.values.slice(), steps = [];
    let ending = values[0], best = ending;
    steps.push({op:'mark',targets:[0],tone:'current',line:1,
        vars:{ending,best},note:{en:'A nonempty answer starts with the first value.',bn:'খালি অংশ নেওয়া যাবে না, তাই প্রথম মান দিয়ে শুরু করো।'}});
    for (let i=1;i<values.length;i++) {
        const extended=ending+values[i];
        ending=Math.max(values[i],extended);
        steps.push({op:'mark',targets:[i],tone:'current',line:3,
            vars:{i,ending},note:{en:values[i]>extended?'The old ending sum is negative, so start here.':'Extending the previous interval is at least as good.',bn:'এখান থেকে শুরু করা আর আগের অংশ বাড়ানো তুলনা করো।'}});
        best=Math.max(best,ending);
        steps.push({op:'note',line:4,vars:{best},note:{en:`The best sum seen anywhere is now ${best}.`, bn: `এখন পর্যন্ত যেকোনো interval-এর best sum ${best}।`}});
    }
    steps.push({op:'done',line:5,vars:{best},note:{en:`The maximum nonempty sum is ${best}.`,bn:`সর্বোচ্চ যোগফল ${best}।`}});
    return {init:{array:values},steps};
}
