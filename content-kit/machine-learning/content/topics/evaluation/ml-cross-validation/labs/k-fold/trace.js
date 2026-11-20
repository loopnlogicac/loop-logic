function trace(input) {
  const points=input.points.map((p,i)=>({...p,id:'p'+i,index:i}));
  const groups=[points.filter(p=>p.cls===0),points.filter(p=>p.cls===1)];
  const note=(en,bn)=>({en,bn}),round=n=>Math.round(n*1000)/1000;
  const init={tables:{data:{rows:points.length,cols:4,rowLabels:points.map((_,i)=>String(i+1)),
    colLabels:['Feature x','Feature y','Label','Fold'],cells:points.map(p=>[p.x,p.y,p.cls,null])}},
    chart:{xLabel:'Held-out fold',yLabel:'Accuracy',xRange:[0.5,5.5],yRange:[0,1],
      series:[{id:'scores',label:'Fold accuracy',type:'bar',points:[]}]}};
  const steps=[];
  if(Math.min(groups[0].length,groups[1].length)<2){
    steps.push({op:'note',line:1,vars:{status:'insufficient',folds:0,mean:null,spread:null,foldScores:''},
      note:note('Stratified validation needs at least two examples in each actual class; no fold score is fabricated.',
        'Stratified validation-এর জন্য প্রতি আসল ক্লাস-এ অন্তত দুটি উদাহরণ চাই; বানানো fold score দেখানো হবে না।')});
    steps.push({op:'done',line:8,note:note('Add the missing class evidence before splitting.','Split করার আগে কম থাকা ক্লাস-এর উদাহরণ যোগ করো।')});
    return {init,steps};
  }
  const count=Math.min(input.folds,groups[0].length,groups[1].length),folds=Array.from({length:count},()=>[]);
  steps.push({op:'note',line:1,note:note(`Use ${count} folds, clamped to the smaller class count; assign each class in input order round-robin.`,
    `ছোট ক্লাস-এর সংখ্যা মেনে ${count}টি fold নাও; প্রতি ক্লাস-এ ইনপুটের ক্রম ধরে পালা করে ভাগ করো।`)});
  for(const group of groups)group.forEach((p,i)=>{
    const fold=i%count;folds[fold].push(p.index);
    steps.push({op:'table-set',table:'data',r:p.index,c:3,value:fold+1,line:2,
      note:note(`Example ${p.index+1} joins fold ${fold+1}; preserve near-balanced counts within each class.`,
        `উদাহরণ ${p.index+1} fold ${fold+1}-এ যায়; প্রতিটি ক্লাস-এর ভাগ প্রায় সমান রাখো।`)});
  });
  function predict(training,p){
    const ranked=training.map(q=>({q,d:(q.x-p.x)**2+(q.y-p.y)**2})).sort((a,b)=>a.d-b.d||a.q.index-b.q.index);
    const selected=ranked.slice(0,Math.min(input.neighbours,training.length));
    const ones=selected.filter(v=>v.q.cls===1).length;
    return Number(ones>selected.length-ones);
  }
  const scores=[];
  for(let fold=0;fold<count;++fold){
    const held=new Set(folds[fold]),training=points.filter(p=>!held.has(p.index));
    steps.push({op:'list',name:'training rows',items:training.map(p=>p.index+1),line:3,
      note:note(`Refit from ${training.length} training cards; fold ${fold+1} is excluded entirely.`,
        `${training.length}টি ট্রেনিং কার্ডে নতুন fit; fold ${fold+1} পুরো বাইরে।`)});
    steps.push({op:'table-mark',table:'data',targets:folds[fold].map(i=>[i,3]),tone:'current',line:4,
      note:note('These highlighted cards are held out for this turn, not permanent test data.',
        'এই পালায় চিহ্নিত কার্ডগুলো বাইরে; এগুলো স্থায়ী final টেস্ট নয়।')});
    let correct=0;
    for(const index of folds[fold]){
      const p=points[index],prediction=predict(training,p);correct+=Number(prediction===p.cls);
      steps.push({op:'note',line:4,note:note(`Row ${index+1}: predict ${prediction}, actual ${p.cls}; its own row never voted.`,
        `Row ${index+1}-এ মডেলের লেবেল ${prediction}, আসল ${p.cls}; নিজের row ভোট দেয়নি।`)});
    }
    const accuracy=correct/folds[fold].length;scores.push(accuracy);
    steps.push({op:'series-add',id:'scores',x:fold+1,y:accuracy,line:5,
      note:note(`Fold ${fold+1}: ${correct}/${folds[fold].length} correct, accuracy ${round(accuracy)}.`,
        `Fold ${fold+1}-এ ${folds[fold].length}টির মধ্যে ${correct}টি ঠিক; অ্যাকুরেসি ${round(accuracy)}।`)});
  }
  const mean=scores.reduce((a,b)=>a+b,0)/count,spread=Math.sqrt(scores.reduce((a,b)=>a+(b-mean)**2,0)/count);
  steps.push({op:'series',id:'mean',label:'Mean accuracy',type:'line',points:[[1,mean],[count,mean]],line:7,
    note:note('The line summarises the mean, while fold differences remain visible.', 'রেখাটি গড় বোঝায়; আলাদা fold-এর ফারাকও দেখা যায়।')});
  steps.push({op:'note',line:8,vars:{status:'finished',folds:count,mean:round(mean),spread:round(spread),foldScores:scores.map(s=>s.toFixed(2)).join(',')},
    note:note(`Mean ${round(mean)}, population standard deviation ${round(spread)}; this spread is not a confidence interval.`,
      `গড় ${round(mean)}, population standard deviation ${round(spread)}; এই spread confidence interval নয়।`)});
  steps.push({op:'done',line:8,note:note('Fit any preprocessing inside each training fold and reserve a separate final test when tuning.',
    'প্রতি ট্রেনিং fold-এর ভেতরে preprocessing fit করো; tuning হলে final টেস্ট আলাদা রাখো।')});
  return {init,steps};
}
