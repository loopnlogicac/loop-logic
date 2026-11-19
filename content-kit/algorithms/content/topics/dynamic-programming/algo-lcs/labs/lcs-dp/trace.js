function trace(input) {
    const a=input.a,b=input.b,n=a.length,m=b.length;
    const dp=Array.from({length:n+1},()=>Array(m+1).fill(0)),steps=[];
    for(let i=0;i<=n;i++) steps.push({op:'set',r:i,c:0,value:0,line:1,note:{en:'An empty second prefix has no matching letters.'}});
    for(let j=1;j<=m;j++) steps.push({op:'set',r:0,c:j,value:0,line:1,note:{en:'An empty first prefix also has LCS length zero.'}});
    for(let i=1;i<=n;i++) for(let j=1;j<=m;j++) {
        let dir;
        if(a[i-1]===b[j-1]) {dp[i][j]=dp[i-1][j-1]+1;dir='diag';}
        else if(dp[i-1][j]>=dp[i][j-1]) {dp[i][j]=dp[i-1][j];dir='up';}
        else {dp[i][j]=dp[i][j-1];dir='left';}
        steps.push({op:'set',r:i,c:j,value:dp[i][j],line:dir==='diag'?4:5,note:{en:dir==='diag'?`${a[i-1]} matches, so extend the diagonal answer.`:'The letters differ, so retain a longer smaller-prefix answer.',bn:dir==='diag'?'অক্ষর মিলেছে, তির্যক ঘরের মানে এক যোগ করো।':'অক্ষর মেলেনি, ওপর ও বাঁয়ের বড় মান নাও।'}});
        steps.push({op:'arrow',r:i,c:j,dir,line:dir==='diag'?4:5,note:{en:'This predecessor records a choice for reconstructing one longest sequence.'}});
    }
    let i=n,j=m;const answer=[];
    while(i>0&&j>0) {
        steps.push({op:'mark',targets:[[i,j]],tone:'path',line:6,note:{en:'Follow the recorded optimum toward shorter prefixes.'}});
        if(a[i-1]===b[j-1]) {answer.push(a[i-1]);i--;j--;}
        else if(dp[i-1][j]>=dp[i][j-1]) i--; else j--;
    }
    steps.push({op:'done',line:7,vars:{length:dp[n][m],sequence:answer.reverse().join('')},note:{en:'Reverse the matched letters because reconstruction visited the end first.',bn:'পেছন থেকে পাওয়া অক্ষর উল্টে LCS লেখো।'}});
    return {init:{rows:n+1,cols:m+1,rowLabels:['empty',...a],colLabels:['empty',...b]},steps};
}
