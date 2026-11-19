function trace(input) {

  const steps = [];
  const r = v => Math.round(v * 1000) / 1000;
  const say = (op, fields, en, bn, line = 1) =>
    steps.push({op, ...fields, line, note: {en, bn}});
  const pts = input.points.map((p, i) => ({id: 'p'+i, x:p.x, y:p.y}));
  const mse = (w,b) => pts.reduce((s,p)=>s+(p.y-w*p.x-b)**2,0)/pts.length;

  const b=input.intercept;
  const init={plot:{xRange:[0,6],yRange:[-3,12],xLabel:'Feature x',yLabel:'Target y',points:pts},
      chart:{xLabel:'Slope (intercept fixed)',yLabel:'MSE',series:[{id:'cost',label:'Cost slice',type:'line',points:[]},
      {id:'selected',label:'Your slope',type:'scatter',points:[[input.slope,mse(input.slope,b)]]}]}};
  let bestSlope=-1,bestMse=Infinity;
  for(let k=-10;k<=40;k++) {
    const w=k/10,cost=mse(w,b);
    if(cost<bestMse) {bestMse=cost;bestSlope=w;}
    say('shape',{id:'line',type:'line',w:[w,-1],b,vars:{trialSlope:w,trialMse:r(cost)}},
        `With intercept ${b} held fixed, slope ${w} gives MSE ${r(cost)}.`,
        'intercept একই রাখি; শুধু ঢাল বদলে ভুল মাপি।',3);
    say('series-add',{id:'cost',x:w,y:cost},
        'The chart records the cost of the line just drawn.','এই রেখার ভুলটাই চার্টে যোগ করি।',3);
  }
  say('vline',{x:bestSlope,label:'Sampled minimum'},
      `The smallest sampled MSE is ${r(bestMse)} at slope ${bestSlope}.`,
      'গ্রিডে দেখা সবচেয়ে কম cost এখানে; এটা আটকে রাখা intercept-এর জন্য।',4);
  say('shape',{id:'line',type:'line',w:[input.slope,-1],b},
      'Restore your selected slope so its star can be compared with the minimum.','তোমার ঢাল ফিরিয়ে আনি, যাতে সর্বনিম্ন মানের সঙ্গে মেলাতে পারো।',5);
  say('done',{vars:{slope:input.slope,mse:r(mse(input.slope,b)),bestSlope,bestMse:r(bestMse)}},
      'This sampled minimum is conditional on the intercept and the slope grid.','এই সর্বনিম্ন মান intercept আর ঢালের গ্রিডের শর্ত মেনে পাওয়া।',5);

  return {init, steps};
}
