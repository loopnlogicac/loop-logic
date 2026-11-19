function trace(input) {
  const steps = [];
  const r = v => Math.round(v * 1000) / 1000;
  const say = (op, fields, en, bn, line = 1) => steps.push({op, ...fields, line, note: {en, bn}});

  let x=input.start;
  const positions=[x];
  for(let t=0;t<input.iterations;t++){ x=x-input.lr*2*(x-1); positions.push(x); }
  const low=Math.min(-1,...positions)-1, high=Math.max(3,...positions)+1;
  const maxCost=Math.max(1,...positions.map(v=>(v-1)**2));
  const bowl=[];for(let i=0;i<=100;i++){const v=low+(high-low)*i/100;bowl.push([v,(v-1)**2]);}
  const init={chart:{xLabel:'Position x',yLabel:'Cost',xRange:[low,high],yRange:[0,maxCost*1.2],series:[{id:'bowl',label:'Cost bowl',type:'line',tone:'active',points:bowl},{id:'ball',label:'Current position',type:'scatter',tone:'current',points:[[input.start,(input.start-1)**2]]}]}};
  x=input.start;
  for(let t=1;t<=input.iterations;t++) {
    const slope=2*(x-1), old=x; x=x-input.lr*slope;
    say('note',{vars:{slope:r(slope),oldX:r(old)}},`Slope ${r(slope)} points uphill; subtract lr*slope = ${r(input.lr*slope)}.`, 'ঢাল ওপরের দিক জানায়; তার বিপরীত দিকে পা ফেলি।',4);
    // The chart point updates position and cost together in one operation.
    say('series-set',{id:'ball',points:[[x,(x-1)**2]],vars:{iteration:t,x:r(x),cost:r((x-1)**2)}},
      `Step ${t}: x=${r(x)}, cost=${r((x-1)**2)}. ${input.lr>1?'The oversized step grows the error.':'Compare this height with the last step.'}`,
      input.lr>1?'পা বেশি বড় হওয়ায় ভুল বাড়ছে; ছোট learning rate দিয়ে দেখো।':'নতুন জায়গার উচ্চতাই এই ধাপের cost।',5);

  }
  say('done',{vars:{x:r(x),cost:r((x-1)**2)}},'A zero slope is stationary; this bowl has its unique minimum at x = 1.', 'এই বাটির সর্বনিম্ন জায়গা x = 1; সেখানেই ঢাল শূন্য।',5);

  return {init, steps};
}
