function trace(input) {
    const values=input.values,n=values.length,steps=[];
    const dp=Array(n).fill(1),previous=Array(n).fill(-1);
    let best=0;
    for(let i=0;i<n;i++) {
        steps.push({op:'set',r:0,c:i,value:values[i],line:1,note:{en:'This column refers to an original input position.'}});
        steps.push({op:'set',r:1,c:i,value:1,line:1,note:{en:'Every single value starts a length-one subsequence.'}});
        steps.push({op:'set',r:2,c:i,value:-1,line:1,note:{en:'No predecessor is needed until an extension improves the length.'}});
    }
    for(let i=0;i<n;i++) {
        for(let j=0;j<i;j++) {
            steps.push({op:'compare',a:[0,j],b:[0,i],line:4,note:{en:values[j]<values[i]?'The earlier value is smaller and may precede this one.':'Equal or larger values cannot extend a strict increasing sequence.',bn:'আগের মানটি ছোট হলেই কেবল ধারাটি বাড়ানো যায়।'}});
            if(values[j]<values[i]&&dp[j]+1>dp[i]) {
                dp[i]=dp[j]+1;previous[i]=j;
                steps.push({op:'set',r:1,c:i,value:dp[i],line:5,note:{en:'This predecessor gives a strictly longer chain.'}});
                steps.push({op:'set',r:2,c:i,value:j,line:5,note:{en:'Save the original index to recover a real subsequence.'}});
            }
        }
        if(dp[i]>dp[best]) best=i;
    }
    const answer=[];
    for(let at=n?best:-1;at!==-1;at=previous[at]) {
        answer.push(values[at]);
        steps.push({op:'mark',targets:[[0,at],[2,at]],tone:'path',line:7,note:{en:'Follow the saved predecessor to an earlier input position.'}});
    }
    steps.push({op:'list',name:'sequence',items:answer.reverse(),line:7,note:{en:'These values follow increasing original indices.'}});
    steps.push({op:'done',line:8,vars:{length:n?dp[best]:0},note:{en:'Reverse the recovered chain to restore input order.',bn:'পেছন থেকে পাওয়া ধারাটি উল্টে লেখো।'}});
    return {init:{rows:3,cols:Math.max(1,n),rowLabels:['value','length','previous'],colLabels:Array.from({length:Math.max(1,n)},(_,i)=>n?String(i):'empty')},steps};
}
