function trace(input) {
  const steps = [];
  const r = v => Math.round(v * 1000) / 1000;
  const say = (op, fields, en, bn, line = 1) => steps.push({op, ...fields, line, note: {en, bn}});

  const m=input.slope,c=input.intercept;
  const ys=[c,m*10+c,...input.points.map(p=>p.y)];
  const init={plot:{xRange:[0,10],yRange:[Math.min(-1,...ys)-1,Math.max(1,...ys)+1],points:input.points.map((p,i)=>({id:'p'+i,...p})),shapes:{}}};
  for(let t=1;t<=10;t++) say('shape',{id:'line',type:'segment',from:[0,c],to:[t,m*t+c],label:'y = m*x + c'},
    `At x=${t}, prediction is ${m}*${t}+${c} = ${r(m*t+c)}.`, 'x এক ঘর বাড়লে প্রেডিকশন ঢালের সমান বদলায়।',2);
  let total=0;
  input.points.forEach((p,i)=>{
    const predicted=m*p.x+c, residual=p.y-predicted; total+=residual**2;
    say('shape',{id:'gap'+i,type:'segment',from:[p.x,predicted],to:[p.x,p.y],label:'residual '+r(residual)},
      `Observed ${p.y} minus predicted ${r(predicted)} gives residual ${r(residual)}.`, 'একই x-এ আসল মান থেকে প্রেডিকশন বাদ দিয়ে খাড়া ফাঁক পাই।',4);
    say('note',{vars:{point:i+1,residual:r(residual),squaredGap:r(residual**2)}},'A squared gap counts errors above and below the line positively.', 'বর্গ করলে লাইনের ওপরের আর নিচের ভুল দুটোই যোগ হয়।',5);
  });
  say('shape',{id:'query',type:'marker',at:[input.qx,m*input.qx+c],symbol:'star',label:'Prediction'},
    'The query follows the same slope and intercept as every observed point.', 'নতুন x-এও একই ঢাল আর ইন্টারসেপ্ট দিয়ে হিসাব করি।',6);
  say('done',{vars:{prediction:r(m*input.qx+c),mse:r(total/input.points.length)}},
    'Changing the sliders changes the rule; no automatic fitting occurs here.', 'স্লাইডার দিয়ে তুমি নিয়ম ঠিক করছ; এখানে মডেল নিজে ফিট করে না।',6);

  return {init, steps};
}
