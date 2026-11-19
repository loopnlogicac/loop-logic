function trace(input) {
    const a=input.a,b=input.b,n=a.length,m=b.length,steps=[];
    const dp=Array.from({length:n+1},()=>Array(m+1).fill(0));
    const dirs=Array.from({length:n+1},()=>Array(m+1).fill(null));
    for(let i=0;i<=n;i++) {dp[i][0]=i;dirs[i][0]=i?'up':null;steps.push({op:'set',r:i,c:0,value:i,line:1,note:{en:'Delete every source character to reach an empty target.'}});}
    for(let j=1;j<=m;j++) {dp[0][j]=j;dirs[0][j]='left';steps.push({op:'set',r:0,c:j,value:j,line:1,note:{en:'Insert every target character when the source is empty.'}});}
    for(let i=1;i<=n;i++) for(let j=1;j<=m;j++) {
        let best=dp[i-1][j-1]+(a[i-1]===b[j-1]?0:1),dir='diag';
        if(dp[i-1][j]+1<best) {best=dp[i-1][j]+1;dir='up';}
        if(dp[i][j-1]+1<best) {best=dp[i][j-1]+1;dir='left';}
        dp[i][j]=best;dirs[i][j]=dir;
        steps.push({op:'set',r:i,c:j,value:best,line:5,note:{en:`Minimum cost for prefixes ${i} and ${j} is ${best}.`,bn:'মিল বা বদল, মোছা ও যোগ করার খরচ তুলনা করো।'}});
        steps.push({op:'arrow',r:i,c:j,dir,line:6,note:{en:'A diagonal tie is preferred, then deletion, then insertion.'}});
    }
    let i=n,j=m;const edits=[];
    while(i>0||j>0) {
        steps.push({op:'mark',targets:[[i,j]],tone:'path',line:7,note:{en:'The predecessor explains the last edit for these prefixes.'}});
        const dir=dirs[i][j];
        if(dir==='diag') {if(a[i-1]!==b[j-1]) edits.push(`replace ${a[i-1]} with ${b[j-1]}`);i--;j--;}
        else if(dir==='up') {edits.push(`delete ${a[i-1]}`);i--;}
        else {edits.push(`insert ${b[j-1]}`);j--;}
    }
    steps.push({op:'list',name:'edits',items:edits.reverse(),line:7,note:{en:'Paid edits are now in forward alignment order.'}});
    steps.push({op:'done',line:8,vars:{distance:dp[n][m]},note:{en:'Read recovered edits in forward alignment order.',bn:'এবার সম্পাদনাগুলো সামনে থেকে পড়ো।'}});
    return {init:{rows:n+1,cols:m+1,rowLabels:['empty',...a],colLabels:['empty',...b]},steps};
}
