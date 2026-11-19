function trace(input) {

  const steps = [];
  const r = v => Math.round(v * 1000) / 1000;
  const say = (op, fields, en, bn, line = 1) =>
    steps.push({op, ...fields, line, note: {en, bn}});
  const pts = input.points.map((p, i) => ({id: 'p'+i, x:p.x, y:p.y}));
  const mse = (w,b) => pts.reduce((s,p)=>s+(p.y-w*p.x-b)**2,0)/pts.length;

  let w=0,b=0;
  const history=[{w,b,cost:mse(w,b)}];
  for(let t=1;t<=input.iterations;t++) {
    const gw=2*pts.reduce((s,p)=>s+(w*p.x+b-p.y)*p.x,0)/pts.length;
    const gb=2*pts.reduce((s,p)=>s+w*p.x+b-p.y,0)/pts.length;
    w-=input.lr*gw; b-=input.lr*gb;
    history.push({w,b,cost:mse(w,b),gw,gb});
  }
  const ys=history.flatMap(h=>[-2*h.w+h.b,2*h.w+h.b]);
  const init={plot:{xRange:[-2.5,2.5],yRange:[Math.min(-6,...ys)-1,Math.max(8,...ys)+1],
      xLabel:'Centred feature x',yLabel:'Target y',points:pts,shapes:{line:{type:'line',w:[0,-1],b:0}}},
      chart:{xLabel:'Update',yLabel:'MSE',series:[{id:'loss',label:'Training MSE',type:'line',points:[[0,history[0].cost]]}]}};
  for(let t=1;t<history.length;t++) {
    const h=history[t], grew=h.cost>history[t-1].cost+1e-12;
    say('note',{vars:{gradW:r(h.gw),gradB:r(h.gb)}},
        `Both derivatives use the old line: grad_w=${r(h.gw)}, grad_b=${r(h.gb)}.`,
        'দুটো derivative-ই আগের রেখা থেকে নিই; তারপর একসঙ্গে মান বদলাই।',2);
    say('shape',{id:'line',type:'line',w:[h.w,-1],b:h.b,vars:{iteration:t,slope:r(h.w),intercept:r(h.b),mse:r(h.cost)}},
        `Update ${t}: MSE ${r(h.cost)}. ${grew?'Error grew; reduce the learning rate.':'The new line follows the negative gradient.'}`,
        grew?'ভুল বেড়েছে; learning rate কমিয়ে আবার চেষ্টা করো।':'gradient-এর উল্টো দিকে সরে নতুন রেখা পেলাম।',3);
    say('series-add',{id:'loss',x:t,y:h.cost},
        `Record update ${t}, the same line and cost; no extra training occurs here.`,
        'একই ধাপের একই cost চার্টে রাখি; এখানে আর কোনো ট্রেনিং হয় না।',4);
  }
  say('done',{vars:{slope:r(w),intercept:r(b),mse:r(mse(w,b))}},
      'A small displayed MSE may be rounding; inspect the trajectory before claiming convergence.','দেখানো MSE শূন্য হলেও সেটা rounding হতে পারে; চলার পথটাও দেখো।',5);

  return {init, steps};
}
