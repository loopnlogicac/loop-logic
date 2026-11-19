function trace(input) {
    const sets=[[[2,4],[3,5],[4,7]],[[2,3]],[[1,5],[1,5]],[]];
    const items=sets[input.items],n=items.length,capacity=input.capacity;
    const dp=Array.from({length:n+1},()=>Array(capacity+1).fill(0)),steps=[];
    for(let c=0;c<=capacity;c++) steps.push({op:'set',r:0,c,value:0,line:1,note:{en:'No items can earn value, regardless of available capacity.'}});
    for(let i=1;i<=n;i++) {
        const [weight,value]=items[i-1];
        for(let c=0;c<=capacity;c++) {
            dp[i][c]=dp[i-1][c];
            let take=false;
            if(weight<=c&&value+dp[i-1][c-weight]>dp[i][c]) {dp[i][c]=value+dp[i-1][c-weight];take=true;}
            steps.push({op:'set',r:i,c,value:dp[i][c],line:6,vars:{i,c},note:{en:take?`Taking item ${i-1} improves value to ${dp[i][c]}.`:`Skipping item ${i-1} is at least as good.`,bn:take?'এই জিনিসটি নিলে মোট মূল্য বাড়ে।':'এই জিনিসটি বাদ দিলেও মান কমে না।'}});
            steps.push({op:'pointer',name:'source',target:[i-1,take?c-weight:c],line:6,note:{en:take?'Take reads the previous row at capacity reduced by this item weight.':'Up means reuse the same capacity without this item.'}});
        }
    }
    let c=capacity;const chosen=[];
    for(let i=n;i>0;i--) {
        steps.push({op:'mark',targets:[[i,c]],tone:'path',line:7,note:{en:'Compare this value with the previous item row to recover a choice.'}});
        if(dp[i][c]!==dp[i-1][c]) {chosen.push(i-1);c-=items[i-1][0];}
    }
    chosen.reverse();
    steps.push({op:'done',line:8,vars:{value:dp[n][capacity],chosen:chosen.join(' ')},note:{en:'Each recovered item is used once because the row decreases.',bn:'প্রতি ধাপে আগের সারিতে যাওয়ায় কোনো জিনিস দুবার নেওয়া হয় না।'}});
    return {init:{rows:n+1,cols:capacity+1,rowLabels:['none',...items.map(([w,v],i)=>`${i}: w${w} v${v}`)],colLabels:dp[0].map((_,i)=>String(i))},steps};
}
