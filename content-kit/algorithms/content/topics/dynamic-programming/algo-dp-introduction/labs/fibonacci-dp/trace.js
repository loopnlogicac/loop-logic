function trace(input) {
    const n=input.n,dp=Array(n+1).fill(0),steps=[];
    steps.push({op:'set',r:0,c:0,value:0,line:1,note:{en:'F(0) is the first base value.',bn:'শুরুর মান F(0)=0।'}});
    if(n>=1) {dp[1]=1;steps.push({op:'set',r:0,c:1,value:1,line:1,note:{en:'F(1) is the second base value.', bn: "F(1) দ্বিতীয় base value।"}});}
    for(let i=2;i<=n;i++) {
        steps.push({op:'compare',a:[0,i-2],b:[0,i-1],line:3,note:{en:'Both dependencies are already filled because indices increase.', bn: "Index বাড়ে বলে দুই dependency আগেই পূর্ণ।"}});
        dp[i]=dp[i-1]+dp[i-2];
        steps.push({op:'set',r:0,c:i,value:dp[i],line:3,vars:{i},note:{en:`${dp[i-2]} + ${dp[i-1]} = ${dp[i]}.`,bn:'আগের দুই ঘরের যোগফল নতুন ঘরে রাখো।'}});
    }
    steps.push({op:'mark',targets:[[0,n]],tone:'found',line:4,note:{en:'The requested index identifies the final scalar answer.', bn: "চাওয়া index-এই final scalar answer আছে।"}});
    steps.push({op:'done',line:4,vars:{answer:dp[n]},note:{en:`F(${n}) = ${dp[n]}.`, bn: `চাওয়া মান F(${n}) = ${dp[n]}।`}});
    return {init:{rows:1,cols:n+1,rowLabels:['F'],colLabels:dp.map((_,i)=>String(i))},steps};
}
