function trace(input) {
  const steps=[];
  const round=v=>Math.round(v*1000)/1000;
  const say=(op,fields,en,bn,line=1)=>steps.push({op,...fields,line,note:{en,bn}});

  const n=input.points.length,k=Math.floor(0.3*n+0.5);
  const shuffle=(values,state)=>{
    const a=values.slice();
    for(let i=a.length-1;i>0;i--){state=(1664525*state+1013904223)%4294967296;const j=Math.floor(state/4294967296*(i+1));[a[i],a[j]]=[a[j],a[i]];}
    return {a,state};
  };
  const indices=input.points.map((_,i)=>i),random=shuffle(indices,input.seed).a.slice(0,k);
  const groups=[0,1].map(c=>indices.filter(i=>input.points[i].cls===c));
  const quota=groups.map(g=>g.length*k/n),sizes=quota.map(Math.floor);
  const remainder=k-sizes[0]-sizes[1];
  [0,1].sort((a,b)=>(quota[b]-sizes[b])-(quota[a]-sizes[a])||a-b).slice(0,remainder).forEach(c=>sizes[c]++);
  let state=input.seed;const stratified=[];
  groups.forEach((g,c)=>{const next=shuffle(g,state);state=next.state;stratified.push(...next.a.slice(0,sizes[c]));});
  const selected=input.method==='random'?random:stratified;
  const init={plot:{xRange:[0,31],yRange:[0,11],xLabel:'Example coordinate',yLabel:'Original class in label',classes:[{id:0,label:'Training'},{id:1,label:'Test'}],points:input.points.map((p,i)=>({id:'p'+i,x:p.x,y:p.y,cls:null,label:(i+1)+': label '+p.cls}))},chart:{xLabel:'Partition',yLabel:'Class-1 share',yRange:[0,1],series:[{id:'random',label:'Random',type:'bar',points:[]},{id:'stratified',label:'Stratified',type:'bar',points:[]}]}};
  say('list',{name:'random test IDs',items:random.map(i=>i+1)},'Shuffle with the displayed seed, then reserve the first 30% rounded to whole rows.','সিড দিয়ে সারি এলোমেলো করি; মোটের প্রায় ৩০% টেস্টে রাখি।',1);
  groups.forEach((g,c)=>say('note',{vars:{class:c,quota:round(quota[c]),testRows:sizes[c]}},`Class ${c}: ideal quota ${round(quota[c])}; allocated ${sizes[c]} test rows.`, 'ভগ্নাংশের কোটা থেকে পুরো সারি নিই; বড় অবশিষ্ট অংশ আগে জায়গা পায়।',3));
  say('list',{name:'stratified IDs',items:stratified.map(i=>i+1)},'Shuffle within each class and take its allocated quota. Integer counts can only approximate the original ratio.','প্রতি ক্লাসের ভেতরে শাফল করি; পুরো সারি দিয়ে অনুপাত যতটা সম্ভব রাখি।',4);
  input.points.forEach((p,i)=>{
    const isTest=selected.includes(i);
    say('point-mark',{targets:['p'+i],tone:'current'},`Row ${i+1} has original label ${p.cls}; each row goes to exactly one partition.`, 'একটা সারি ট্রেনিং আর টেস্ট দুই জায়গায় রাখি না।',6);
    say('point-set',{id:'p'+i,cls:isTest?1:0},`Send row ${i+1} to ${isTest?'test':'training'} under the selected ${input.method} split.`, isTest?'এই সারিটা টেস্টে রাখি; মডেল ট্রেনিংয়ে এটা দেখবে না।':'এই সারিটা ট্রেনিংয়ে যাবে; প্রস্তুতির মান এখান থেকেই শিখব।',6);
  });
  for(const [id,test] of [['random',random],['stratified',stratified]]){
    const count=test.filter(i=>input.points[i].cls===1).length,total=groups[1].length;
    for(const [x,y] of [['source',total/n],['train',(total-count)/(n-k)],['test',count/k]])
      say('series-add',{id,x,y:round(y)},`${id} ${x}: class-1 share ${round(y)}.`, 'বারে ক্লাস ১-এর অনুপাত দেখো; শূন্য বার হলে ওই ভাগে ক্লাসটা নেই।',6);
  }
  say('done',{vars:{train:n-k,test:k,randomTestMinority:random.filter(i=>input.points[i].cls===1).length,stratifiedTestMinority:stratified.filter(i=>input.points[i].cls===1).length}},'These are teaching shuffles, not sklearn internals; rare classes may still be absent. Use chronological splits for future events.','এটা শেখার জন্য নির্দিষ্ট শাফল; খুব কম উদাহরণের ক্লাস বাদ পড়তে পারে। ভবিষ্যতের ডেটায় সময় ধরে ভাগ করো।',6);
  return {init,steps};
}
