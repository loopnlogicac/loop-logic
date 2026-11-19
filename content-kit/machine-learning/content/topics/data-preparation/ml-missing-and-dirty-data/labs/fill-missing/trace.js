function trace(input) {
  const steps=[];
  const round=v=>Math.round(v*1000)/1000;
  const say=(op,fields,en,bn,line=1)=>steps.push({op,...fields,line,note:{en,bn}});

  const rows=input.points.map((p,i)=>[i===2||i===5?null:p.x,i===3?null:p.y]);
  const n=rows.length;
  const init={tables:{raw:{rows:n,cols:2,cells:rows,colLabels:['x (training)','y (training)']},filled:{rows:n,cols:2,cells:rows.map(()=>[null,null]),colLabels:['Filled x','Filled y']}}};
  say('note',{},'Blanks are fixed at row 3 x, row 4 y and row 6 x; their clicked placeholder values are ignored.','৩ নম্বর সারির x, ৪ নম্বরের y আর ৬ নম্বরের x অজানা; এগুলো শূন্য নয়।');
  const fills=[0,1].map(j=>{
    const observed=rows.map(row=>row[j]).filter(v=>v!==null).sort((a,b)=>a-b);
    for(let i=0;i<n;i++) say('table-mark',{table:'raw',targets:[[i,j]],tone:rows[i][j]===null?'error':'considered'},
      rows[i][j]===null?'This cell is unknown, so exclude it from fitting.':`Observed ${rows[i][j]} contributes to feature ${j+1}.`,
      rows[i][j]===null?'ফাঁকা ঘর দিয়ে গড় বা মাঝের মান শেখাব না।':'যে মানটা মাপা আছে, সেটাই হিসাবের মধ্যে যাবে।',2);
    const m=observed.length;
    const value=input.strategy==='mean'?observed.reduce((a,b)=>a+b,0)/m:(observed[Math.floor((m-1)/2)]+observed[Math.floor(m/2)])/2;
    say('note',{vars:{[j===0?'fillX':'fillY']:round(value)}},`Fit ${input.strategy} from ${m} observed values: ${round(value)}.`, 'শুধু মাপা মানগুলো থেকে এই কলামের ফাঁকা ঘর পূরণের মান শিখি।',3);
    return value;
  });
  let total=0;
  rows.forEach((row,i)=>row.forEach((v,j)=>{
    const value=v===null?fills[j]:v;total+=value;
    say('table-set',{table:'filled',r:i,c:j,value:round(value)},v===null?`Use fitted ${input.strategy} ${round(value)}; the true missing value is still unknown.`:`Copy observed ${value}; imputation must not overwrite it.`,v===null?'শেখা মান বসালেও হারানো আসল মানটা জানা যায় না।':'মাপা মান ঠিক রাখি; শুধু ফাঁকা ঘর পূরণ করি।',4);
  }));
  say('done',{vars:{missing:3,total:round(total)}},'Keep these fitted statistics for future data; never refit them on a test set.','টেস্ট ডেটায় নতুন করে এই মান শেখাবে না; ট্রেনিং থেকে শেখা মানই ব্যবহার করো।',5);
  return {init,steps};
}
