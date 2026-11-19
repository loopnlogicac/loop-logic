function trace(input) {
  const steps = [];
  const r = v => Math.round(v * 1000) / 1000;
  const say = (op, fields, en, bn, line = 1) => steps.push({op, ...fields, line, note: {en, bn}});

  const functions=[['line','2x + 1',x=>2*x+1],['square','x squared',x=>x*x],['exp','exp(x)',x=>Math.exp(x)],['log','log(x)',x=>Math.log(x)],['sigmoid','sigmoid(x)',x=>1/(1+Math.exp(-x))]];
  const init={chart:{xLabel:'Input x',yLabel:'Output value',xRange:[-4,4],yRange:[-8,56],series:[]}};
  const vars={};
  functions.forEach(([id,label,fn])=>{
    say('series',{id,label,type:'line',tone:'active',points:[]},`${label} has its own rule; compare outputs at the same x.`, 'একই ইনপুটে আলাদা নিয়ম আলাদা আউটপুট দেয়।',2);
    // Groups of ten samples keep all five curves below the panel limits.
    let points=[];
    for(let k=0;k<=80;k++) {
      const x=-4+k/10;
      if(id==='log' && x<=0) continue;
      points.push([r(x),r(fn(x))]);
      if(points.length%10===0 || k===80) say('series-set',{id,points:points.map(p=>[...p])},
        `${label}: sample ${r(x)} gives ${r(fn(x))}; log is drawn only for x > 0.`, 'ডোমেইনের মধ্যে মান বসিয়ে বাঁক আঁকি; log-এর ইনপুট ধনাত্মক হতে হয়।',3);
    }
    vars[id]=r(fn(input.x));
    say('note',{vars:{[id]:vars[id]}},`At x=${input.x}, ${label} = ${vars[id]}.`, 'স্লাইডারের x-এ এই ফাংশনের মান পড়ো।',4);
  });
  say('vline',{x:input.x,label:'Chosen x'},'Follow this vertical line to compare the five outputs.', 'খাড়া দাগ ধরে পাঁচটা আউটপুট তুলনা করো।',4);
  say('done',{vars},'The sigmoid stays between zero and one; squaring folds negative inputs upward.', 'sigmoid-এর মান শূন্য আর একের মধ্যে থাকে; বর্গে ঋণাত্মক ইনপুটও ধনাত্মক হয়।',4);

  return {init, steps};
}
