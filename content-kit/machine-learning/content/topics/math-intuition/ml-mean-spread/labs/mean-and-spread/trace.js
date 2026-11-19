function trace(input) {
  const steps = [];
  const r = v => Math.round(v * 1000) / 1000;
  const say = (op, fields, en, bn, line = 1) => steps.push({op, ...fields, line, note: {en, bn}});

  const values=[...input.values,input.outlier], n=values.length;
  const mean=values.reduce((a,b)=>a+b,0)/n;
  const sorted=[...values].sort((a,b)=>a-b);
  const median=n%2 ? sorted[(n-1)/2] : (sorted[n/2-1]+sorted[n/2])/2;
  const max=Math.max(1,...values), squares=values.map(v=>(v-mean)**2);
  const init={plot:{xRange:[-1,max+1],yRange:[-1,2],points:values.map((x,i)=>({id:'p'+i,x,y:0.1*(i%3),label:String(x)})),shapes:{}},chart:{xLabel:'Observation index',yLabel:'Squared gap',series:[{id:'squares',label:'Squared distances',type:'bar',tone:'active',points:[]}]}};
  say('shape',{id:'mean',type:'line',w:[1,0],b:-mean,label:'Mean '+r(mean)},'The balance point shares the total equally.', 'মোট মান সমান করে ভাগ করলে গড়ের জায়গা পাই।',2);
  say('shape',{id:'median',type:'line',w:[1,0],b:-median,label:'Median '+r(median),dash:true},'The middle position in sorted order gives the median.', 'ছোট থেকে বড় সাজিয়ে মাঝের মানটা খুঁজি।',3);
  let total=0;
  for (let i=0;i<n;i++) {
    say('point-mark',{targets:['p'+i],tone:'current'},`Observation ${i+1} is ${values[i]}; compare it with mean ${r(mean)}.`, 'এই মানটা গড় থেকে কত দূরে, তা মাপি।',4);
    say('shape',{id:'gap'+i,type:'segment',from:[values[i],0.1*(i%3)],to:[mean,0.1*(i%3)],label:'gap '+r(values[i]-mean)},
      `Gap = ${values[i]} - ${r(mean)} = ${r(values[i]-mean)}.`, 'মান থেকে গড় বাদ দিই; ঋণাত্মক পার্থক্যও রাখা হয়।',4);
    total+=squares[i];
    say('series-add',{id:'squares',x:i+1,y:r(squares[i]),vars:{squareSum:r(total)}},
      `Squaring gives ${r(squares[i])}; opposite gaps no longer cancel.`, 'বর্গ করলে দুই দিকের পার্থক্য একে অন্যকে বাতিল করে না।',5);
    say('point-unmark',{targets:['p'+i]},'Keep the gap and move to the next observation.', 'পার্থক্যটা রেখে পরের মানে যাই।',4);
  }
  say('done',{vars:{mean:r(mean),median:r(median),variance:r(total/n),std:r(Math.sqrt(total/n))}},
    `Divide by all ${n} observations: this is population variance, not the n-1 estimate.`, 'এখানে সব ডেটার variance হিসাব করি, তাই মোট সংখ্যা দিয়ে ভাগ হয়।',6);

  return {init, steps};
}
