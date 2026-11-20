function trace(input) {
  const note=(en,bn)=>({en,bn}),round=v=>Math.round(v*1000)/1000;
  let state=input.seed>>>0;
  const samples=Array.from({length:3},()=>Array.from({length:input.points.length},()=>{
    state=(Math.imul(1664525,state)+1013904223)>>>0;
    return Math.floor(state*input.points.length/4294967296);
  }));
  function fit(points,degree){
    const size=degree+1,matrix=Array.from({length:size},(_,i)=>Array.from({length:size+1},(_,j)=>j===i?0.001:0));
    for(const p of points){
      const powers=Array.from({length:size},(_,j)=>p.x**j);
      for(let i=0;i<size;++i){
        for(let j=0;j<size;++j)matrix[i][j]+=powers[i]*powers[j];
        matrix[i][size]+=powers[i]*p.y;
      }
    }
    for(let col=0;col<size;++col){
      let pivot=col;for(let r=col+1;r<size;++r)if(Math.abs(matrix[r][col])>Math.abs(matrix[pivot][col]))pivot=r;
      [matrix[col],matrix[pivot]]=[matrix[pivot],matrix[col]];
      const divisor=matrix[col][col];
      for(let j=col;j<=size;++j)matrix[col][j]/=divisor;
      for(let r=0;r<size;++r)if(r!==col){
        const factor=matrix[r][col];for(let j=col;j<=size;++j)matrix[r][j]-=factor*matrix[col][j];
      }
    }
    return matrix.map(row=>row[size]);
  }
  const predict=(coeff,x)=>coeff.reduce((sum,w,j)=>sum+w*x**j,0);
  const mse=(points,coeff)=>points.reduce((s,p)=>s+(predict(coeff,p.x)-p.y)**2,0)/points.length;
  const all=[];
  for(let degree=1;degree<=5;++degree){
    const models=samples.map(indices=>{
      const rows=indices.map(i=>input.points[i]),coeff=fit(rows,degree);
      return {indices,coeff,train:mse(rows,coeff),validation:mse(input.validation,coeff),
        predictions:input.validation.map(p=>predict(coeff,p.x)),
        curve:Array.from({length:61},(_,i)=>{const x=-2+i*4/60;return [x,predict(coeff,x)];})};
    });
    const train=models.reduce((s,m)=>s+m.train,0)/3,validation=models.reduce((s,m)=>s+m.validation,0)/3;
    const variance=input.validation.reduce((s,_,i)=>{
      const mean=models.reduce((a,m)=>a+m.predictions[i],0)/3;
      return s+models.reduce((a,m)=>a+(m.predictions[i]-mean)**2,0)/3;
    },0)/input.validation.length;
    all.push({degree,models,train,validation,variance});
  }
  const plotted=[...input.points.map(p=>p.y),...input.validation.map(p=>p.y),...all.flatMap(a=>a.models.flatMap(m=>m.curve.map(p=>p[1])))];
  const low=Math.min(-4,...plotted),high=Math.max(6,...plotted),padding=(high-low)*0.05;
  const init={plot:{xRange:[-2,2],yRange:[low-padding,high+padding],xLabel:'Feature x',yLabel:'Target y',
    points:[...input.points.map((p,i)=>({...p,id:'t'+i,label:'T'})),...input.validation.map((p,i)=>({...p,id:'v'+i,label:'V'}))]},
    chart:{xLabel:'Polynomial degree',yLabel:'Mean squared error',series:[
      {id:'train',label:'Bootstrap training',type:'line',points:[]},
      {id:'validation',label:'Fixed validation',type:'line',points:[]}]}};
  const steps=[{op:'note',line:1,note:note('Use the same three seeded bootstrap samples for every degree; ridge alpha 0.001 penalises every coefficient, including the constant.',
    'সব degree-তে একই তিনটি seeded bootstrap sample নাও; ridge alpha 0.001-এ constant-সহ সব coefficient-এ penalty লাগে।')}];
  for(const a of all){
    a.models.forEach((model,i)=>{
      steps.push({op:'list',name:'sample rows',items:model.indices.map(j=>j+1),line:2,
        note:note(`Degree ${a.degree}, sample ${i+1}: repeated row numbers are sampling with replacement.`,
          `Degree ${a.degree}, sample ${i+1}: একই row বারবার আসা replacement-সহ sampling।`)});
      steps.push({op:'shape',id:'sample'+i,type:'curve',points:model.curve,label:`Sample ${i+1}, degree ${a.degree}`,line:3,
        note:note(`Fit the actual polynomial: training MSE ${round(model.train)}, fixed validation MSE ${round(model.validation)}.`,
          `সত্যিকারের polynomial fit: ট্রেনিং MSE ${round(model.train)}, আলাদা validation MSE ${round(model.validation)}।`)});
    });
    steps.push({op:'series-add',id:'train',x:a.degree,y:a.train,line:4,
      note:note('Average training errors over the three resampled fits.', 'তিনটি resampled fit-এর ট্রেনিং error গড় করো।')});
    steps.push({op:'series-add',id:'validation',x:a.degree,y:a.validation,line:4,
      note:note('Score the same validation cards for each fit, without fitting on them.', 'প্রতি fit একই validation কার্ডে মাপো; ওই কার্ডে fit করবে না।')});
    steps.push({op:'note',line:5,note:note(`Degree ${a.degree} prediction variance across these three fits is ${round(a.variance)}; this is a small-sample illustration, not population variance.`,
      `Degree ${a.degree}-এ এই তিন fit-এর prediction variance ${round(a.variance)}; এটি ছোট sample-এর উদাহরণ, population variance নয়।`)});
  }
  const selected=all[input.degree-1];
  selected.models.forEach((model,i)=>steps.push({op:'shape',id:'sample'+i,type:'curve',points:model.curve,label:`Selected sample ${i+1}`,line:6,
    note:note(`Restore your selected degree ${input.degree} to compare its three fitted curves.`,
      `তোমার degree ${input.degree}-এ ফিরে তিনটি fitted curve মেলাও।`)}));
  steps.push({op:'note',line:7,vars:{selectedDegree:input.degree,trainMSE:round(selected.train),validationMSE:round(selected.validation),predictionVariance:round(selected.variance)},
    note:note('Report actual selected-model errors and resampling variation; no hand-written error curve is used.',
      'বেছে নেওয়া মডেলের সত্যিকারের error ও resampling-এর ফারাক জানাও; বানানো error curve নেই।')});
  steps.push({op:'done',line:8,note:note('Change degree, seed or data, and compare fit error with sensitivity to resampling.',
    'Degree, seed বা ডেটা বদলে fit-এর ভুল ও resampling-এর প্রভাব মেলাও।')});
  return {init,steps};
}
