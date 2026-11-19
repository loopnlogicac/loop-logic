function trace(input) {
  const steps=[];
  const round=v=>Math.round(v*1000)/1000;
  const say=(op,fields,en,bn,line=1)=>steps.push({op,...fields,line,note:{en,bn}});

  const rows=input.points.map(p=>[p.x,p.y]),q=[input.qx,input.qy],n=rows.length;
  const offsets=[0,1].map(j=>input.method==='min-max'?Math.min(...rows.map(p=>p[j])):rows.reduce((a,p)=>a+p[j],0)/n);
  const divisors=[0,1].map(j=>{
    const v=input.method==='min-max'?Math.max(...rows.map(p=>p[j]))-offsets[j]:Math.sqrt(rows.reduce((a,p)=>a+(p[j]-offsets[j])**2,0)/n);
    return v||1;
  });
  const transform=p=>p.map((v,j)=>(v-offsets[j])/divisors[j]);
  const changed=rows.map(transform),tq=transform(q);
  // One common multiplier per view preserves Euclidean neighbour rankings.
  const rawScale=Math.max(1,...rows.flat().map(Math.abs),...q.map(Math.abs));
  const newScale=Math.max(1,...changed.flat().map(Math.abs),...tq.map(Math.abs));
  const left=p=>p.map(v=>v/rawScale),right=p=>[3+p[0]/newScale,p[1]/newScale];
  const init={plot:{xRange:[-1.5,4.5],yRange:[-1.5,1.5],xLabel:'Raw left; transformed right',yLabel:'Uniform display units',points:rows.map((p,i)=>({id:'raw'+i,x:left(p)[0],y:left(p)[1],label:'R'+(i+1)})),shapes:{rawQuery:{type:'marker',at:left(q),symbol:'star',label:'Raw query'},newQuery:{type:'marker',at:right(tq),symbol:'star',label:'Scaled query'}}}};
  say('note',{},'Each view uses one display multiplier for BOTH axes; this preserves its distances and nearest-neighbour ranking.','দুই পাশ আলাদা করে আঁকা; প্রতি পাশে দুই অক্ষ একই গুণে ছোট করা, তাই কাছের পয়েন্টের ক্রম ঠিক থাকে।');
  say('note',{vars:{offsetX:round(offsets[0]),offsetY:round(offsets[1]),divisorX:round(divisors[0]),divisorY:round(divisors[1])}},'Fit offsets and divisors on training points only. A zero range or standard deviation uses divisor 1.','কোয়েরি দিয়ে স্কেল শেখাই না; কলাম একই মানের হলে ভাগের সংখ্যা ১ নিই।');
  offsets.forEach((offset,j)=>{
    say('note',{},`Feature ${j+1} subtracts its training ${input.method==='min-max'?'minimum':'mean'}: ${round(offset)}.`, 'এই ফিচারের ট্রেনিং থেকে শেখা শুরুর মানটা আগে বিয়োগ করি।',1);
    say('note',{},`Feature ${j+1} divides by ${round(divisors[j])}; use 1 if the fitted spread was zero.`, 'একই কলামের শেখা মাপ দিয়ে ভাগ করি; ছড়ানো শূন্য হলে ১ নিই।',1);
  });
  say('note',{},`The query transforms to (${round(tq[0])}, ${round(tq[1])}) using those same fitted values.`, 'কোয়েরির জন্যও একই শেখা মান; কোয়েরি দিয়ে শুরুর মান বা মাপ বদলাই না।',3);
  let rawBest=Infinity,newBest=Infinity,rawNearest=0,scaledNearest=0;
  rows.forEach((p,i)=>{
    const rd=Math.hypot(p[0]-q[0],p[1]-q[1]);
    if(rd<rawBest){rawBest=rd;rawNearest=i+1;}
    say('point-mark',{targets:['raw'+i],tone:'considered',vars:{rawDistance:round(rd)}},`Raw distance to row ${i+1} is ${round(rd)} in the original numeric coordinates.`, 'স্কেল বদলানোর আগে আসল সংখ্যাগুলো দিয়ে দূরত্ব মাপি।',2);
    const t=changed[i],a=right(t);
    say('point-add',{id:'scaled'+i,x:a[0],y:a[1],label:'S'+(i+1),vars:{scaledX:round(t[0]),scaledY:round(t[1])}},`Row ${i+1} transforms to (${round(t[0])}, ${round(t[1])}).`, 'আগে শেখা মান দিয়ে দুই ফিচার বদলাই; নতুন মান পাশে দেখো।',3);
    say('shape',{id:'move'+i,type:'arrow',from:left(p),to:a,tone:'considered'},'The arrow matches the same observation across the two views, not a distance used by KNN.','তীরটা একই রেকর্ডের দুই ছবি মেলায়; এটা KNN-এর দূরত্ব নয়।',3);
    const nd=Math.hypot(t[0]-tq[0],t[1]-tq[1]);
    if(nd<newBest){newBest=nd;scaledNearest=i+1;}
    say('note',{vars:{scaledDistance:round(nd)}},`Transformed distance to row ${i+1} is ${round(nd)}.`, 'দুই ফিচার বদলানোর পর নতুন সংখ্যায় দূরত্ব মাপি।',4);
    say('point-unmark',{targets:['raw'+i]},'Keep the observation; compare the next row before choosing a neighbour.','সব পয়েন্টের দূরত্ব দেখে তারপর কাছেরটা বাছি।',4);
  });
  say('shape',{id:'rawLink',type:'segment',from:left(q),to:left(rows[rawNearest-1]),tone:'found'},`Raw nearest is row ${rawNearest}; equal distances keep the earlier row.`, 'দূরত্ব সমান হলে আগে দেওয়া সারিটা নিই।',5);
  say('shape',{id:'scaledLink',type:'segment',from:right(tq),to:right(changed[scaledNearest-1]),tone:'found'},`Transformed nearest is row ${scaledNearest}.`, 'এককের প্রভাব কমালে সবচেয়ে কাছের পয়েন্ট বদলাতে পারে।',5);
  say('done',{vars:{rawNearest,scaledNearest,firstX:round(changed[0][0]),firstY:round(changed[0][1])}},'Min-max sets training ranges; standardisation uses population variance. A future query may lie outside 0–1.','নতুন ডেটা ০–১-এর বাইরেও যেতে পারে; তাই নতুন করে স্কেল শেখাবে না।',5);
  return {init,steps};
}
