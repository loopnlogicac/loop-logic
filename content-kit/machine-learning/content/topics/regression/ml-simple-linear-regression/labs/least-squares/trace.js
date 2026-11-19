function trace(input) {

  const steps = [];
  const r = v => Math.round(v * 1000) / 1000;
  const say = (op, fields, en, bn, line = 1) =>
    steps.push({op, ...fields, line, note: {en, bn}});
  const pts = input.points.map((p, i) => ({id: 'p'+i, x:p.x, y:p.y}));
  const mse = (w,b) => pts.reduce((s,p)=>s+(p.y-w*p.x-b)**2,0)/pts.length;

  const init={plot:{xRange:[0,6],yRange:[-2,12],xLabel:'Feature x',yLabel:'Target y',points:pts}};
  say('shape',{id:'line',type:'line',w:[input.slope,-1],b:input.intercept},
      'Start with your guessed line; vertical gaps measure target error.','আগে তোমার রেখা বসাই; ওপর-নিচের ফাঁকই অনুমানের ভুল।',1);
  for(const p of pts) {
    const guess=input.slope*p.x+input.intercept;
    say('shape',{id:'gap'+p.id,type:'segment',from:[p.x,guess],to:[p.x,p.y],tone:'error'},
        `At ${p.id}, residual=${r(p.y-guess)}; its square is ${r((p.y-guess)**2)}.`,
        'আসল মান থেকে অনুমান বাদ দিই; বর্গ করলে দুই দিকের ভুলই ধরা পড়ে।',1);
  }
  const xm=pts.reduce((s,p)=>s+p.x,0)/pts.length, ym=pts.reduce((s,p)=>s+p.y,0)/pts.length;
  say('shape',{id:'mean',type:'marker',at:[xm,ym],symbol:'cross',label:'Means',vars:{xMean:r(xm),yMean:r(ym)}},
      'The fitted line must pass through the mean feature and mean target.','সেরা রেখা দুই গড়ের পয়েন্ট দিয়ে যায়।',2);
  let sxx=0,sxy=0;
  for(const p of pts) {
    const dx=p.x-xm,dy=p.y-ym; sxx+=dx*dx;sxy+=dx*dy;
    say('point-mark',{targets:[p.id],tone:'active',vars:{dx:r(dx),dy:r(dy)}},
        `${p.id}: subtract the means before multiplying; dx=${r(dx)}, dy=${r(dy)}.`,
        'গড় থেকে ফাঁক নিলে রেখার ঢাল আর শুরুর উচ্চতা আলাদা করা যায়।',3);
    say('note',{vars:{sxx:r(sxx),sxy:r(sxy)}},
        `Add dx squared and dx*dy: running totals ${r(sxx)} and ${r(sxy)}.`,
        'ফাঁকের বর্গ আর দুই ফাঁকের গুণ যোগ করে রাখি।',3);
  }
  const w=sxx===0?0:sxy/sxx,b=ym-w*xm;
  say('shape',{id:'line',type:'line',w:[w,-1],b,vars:{slope:r(w),intercept:r(b)}},
      sxx===0?'All x are equal; choose zero slope and the mean target.':`sxy/sxx gives slope ${r(w)}; the means give intercept ${r(b)}.`,
      sxx===0?'সব x এক; তাই ঢাল শূন্য ধরে গড় মান দিই।':'গুণের যোগফলকে বর্গের যোগফল দিয়ে ভাগ করেই ঢাল পাই।',5);
  for(const p of pts) say('shape',{id:'gap'+p.id,type:'segment',from:[p.x,w*p.x+b],to:[p.x,p.y],tone:'error'},
      `The fitted residual at ${p.id} is now ${r(p.y-w*p.x-b)}.`,
      'নতুন রেখায় প্রতিটা ফাঁক আবার মাপি; সব ফাঁক শূন্য হওয়া জরুরি নয়।',6);
  say('done',{vars:{slope:r(w),intercept:r(b),mse:r(mse(w,b))}},
      'This line minimises squared vertical gaps, not horizontal distances.','এই রেখা ওপর-নিচের ফাঁকের বর্গের যোগফল সবচেয়ে কমায়।',6);

  return {init, steps};
}
