function trace(input) {
    const dims=input.dims,n=dims.length-1,steps=[];
    const dp=Array.from({length:n},()=>Array(n).fill(0));
    const split=Array.from({length:n},()=>Array(n).fill(0));
    for(let i=0;i<n;i++) steps.push({op:'set',r:i,c:i,value:0,line:1,note:{en:'One matrix needs no multiplication, so diagonal costs are zero.'}});
    for(let length=2;length<=n;length++) for(let i=0;i+length<=n;i++) {
        const j=i+length-1;let best=1000000000;
        for(let k=i;k<j;k++) {
            const candidate=dp[i][k]+dp[k+1][j]+dims[i]*dims[k+1]*dims[j+1];
            steps.push({op:'mark',targets:[[i,k],[k+1,j]],tone:'considered',line:5,
                vars:{i,j,k,candidate},note:{en:`Split after A${k+1}: child costs plus final multiplication give ${candidate}.`,bn:'দুই ছোট চেইনের খরচের সঙ্গে শেষ গুণের খরচ যোগ করো।'}});
            if(candidate<best) {best=candidate;split[i][j]=k;}
        }
        dp[i][j]=best;
        steps.push({op:'set',r:i,c:j,value:best,line:6,note:{en:`Keep cost ${best} and split ${split[i][j]} for this interval.`}});
    }
    function order(i,j) {
        steps.push({op:'mark',targets:[[i,j]],tone:'path',line:7,note:{en:'The saved split recursively determines these parentheses.'}});
        return i===j?`A${i+1}`:`(${order(i,split[i][j])}${order(split[i][j]+1,j)})`;
    }
    const result=order(0,n-1);
    steps.push({op:'list',name:'order',items:result.match(/A[0-9]+|[()]/g),line:7,note:{en:'Read these tokens together as the optimal parenthesisation.'}});
    steps.push({op:'done',line:8,vars:{cost:dp[0][n-1]},note:{en:'Parentheses change work without changing the matrix product.',bn:'বন্ধনী বদলালে কাজের পরিমাণ বদলায়, গুণফল বদলায় না।'}});
    return {init:{rows:n,cols:n,rowLabels:dp.map((_,i)=>`A${i+1}`),colLabels:dp.map((_,i)=>`A${i+1}`)},steps};
}
