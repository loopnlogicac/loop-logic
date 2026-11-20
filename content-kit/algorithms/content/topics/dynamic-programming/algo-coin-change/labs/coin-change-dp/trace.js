function trace(input) {
    const coins=Array.from(new Set(input.coins)).sort((a,b)=>a-b),amount=input.amount;
    const dp=Array(amount+1).fill(21),take=Array(amount+1).fill(0),steps=[];
    dp[0]=0;
    for(let r=0;r<2;r++) steps.push({op:'set',r,c:0,value:0,line:1,note:{en:'Amount zero needs no final coin.', bn: "Amount zero-তে final coin লাগে না।"}});
    for(let a=1;a<=amount;a++) {
        for(const coin of coins) {
            if(coin<=a) {
                steps.push({op:'mark',targets:[[0,a-coin]],tone:'considered',line:5,note:{en:`Try final coin ${coin}; the smaller amount is ${a-coin}.`, bn: `শেষ coin ${coin} নিলে ছোট amount ${a-coin}; সেটি চেষ্টা করো।`}});
                if(dp[a-coin]+1<dp[a]) {dp[a]=dp[a-coin]+1;take[a]=coin;}
            }
        }
        steps.push({op:'set',r:0,c:a,value:dp[a]===21?-1:dp[a],line:6,note:{en:dp[a]===21?'No denomination reaches this amount exactly.':`The fewest coins for ${a} is ${dp[a]}.`,bn:'সব শেষ কয়েনের সম্ভাবনা দেখে সেরা মান রাখো।'}});
        steps.push({op:'set',r:1,c:a,value:take[a],line:6,note:{en:'Remember the final coin of a strict improvement.', bn: "Strict improvement-এর final coin মনে রাখো।"}});
    }
    const payment=[];
    if(dp[amount]!==21) {
        for(let a=amount;a>0;a-=take[a]) {
            payment.push(take[a]);
            steps.push({op:'mark',targets:[[1,a]],tone:'path',line:7,note:{en:`Take ${take[a]} and reduce the remaining amount.`,bn:'বেছে নেওয়া কয়েন নিয়ে বাকি টাকা কমাও।'}});
        }
    }
    steps.push({op:'list',name:'payment',items:payment,line:7,note:{en:'The recovered coins make the exact target when it is reachable.', bn: "Target reachable হলে recovered coin মিলে ঠিক target হয়।"}});
    steps.push({op:'done',line:8,vars:{minimum:dp[amount]===21?-1:dp[amount]},note:{en:'A -1 count means no exact payment exists.', bn: "কাউন্ট -1 মানে exact payment নেই।"}});
    return {init:{rows:2,cols:amount+1,rowLabels:['minimum','take'],colLabels:dp.map((_,i)=>String(i))},steps};
}
