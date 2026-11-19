function trace(input) {

  const steps = [];
  const r = v => Math.round(v * 1000) / 1000;
  const say = (op, fields, en, bn, line = 1) =>
    steps.push({op, ...fields, line, note: {en, bn}});
  const pts = input.points.map((p, i) => ({id: 'p'+i, x:p.x, y:p.y}));
  const mse = (w,b) => pts.reduce((s,p)=>s+(p.y-w*p.x-b)**2,0)/pts.length;

  // Twice-reorthogonalised modified Gram-Schmidt on bounded monomials.
  // Dependent columns are explicitly omitted; the intercept always remains.
  const fit = (degree, alpha) => {
    const n=pts.length;
    const A=pts.map(p=>Array.from({length:degree+1},(_,j)=>p.x**j));
    if (alpha > 0) {
      const means=Array.from({length:degree},(_,j)=>A.reduce((s,a)=>s+a[j+1],0)/n);
      const scales=means.map((m,j)=>Math.sqrt(A.reduce((s,a)=>s+(a[j+1]-m)**2,0)/n)||1);
      const ybar=pts.reduce((s,p)=>s+p.y,0)/n;
      const Z=A.map(a=>means.map((m,j)=>(a[j+1]-m)/scales[j]));
      const G=means.map((_,j)=>means.map((_,k)=>Z.reduce((s,z)=>s+z[j]*z[k],0)+(j===k?alpha:0)));
      const rhs=means.map((_,j)=>Z.reduce((s,z,i)=>s+z[j]*(pts[i].y-ybar),0));
      for(let j=0;j<degree;j++) {
        let pivot=j;
        for(let k=j+1;k<degree;k++) if(Math.abs(G[k][j])>Math.abs(G[pivot][j])) pivot=k;
        [G[j],G[pivot]]=[G[pivot],G[j]]; [rhs[j],rhs[pivot]]=[rhs[pivot],rhs[j]];
        for(let k=j+1;k<degree;k++) {
          const ratio=G[k][j]/G[j][j];
          for(let h=j;h<degree;h++) G[k][h]-=ratio*G[j][h];
          rhs[k]-=ratio*rhs[j];
        }
      }
      const weights=Array(degree).fill(0);
      for(let j=degree-1;j>=0;j--) weights[j]=(rhs[j]-weights.reduce((s,v,k)=>s+(k>j?G[j][k]*v:0),0))/G[j][j];
      return {predict:x=>ybar+weights.reduce((s,v,j)=>s+v*(x**(j+1)-means[j])/scales[j],0),
              weights, rank:degree+1};
    }
    const Q=[], R=[], kept=[];
    for(let j=0;j<=degree;j++) {
      const v=A.map(a=>a[j]), projections=Array(Q.length).fill(0);
      for(let pass=0;pass<2;pass++) for(let k=0;k<Q.length;k++) {
        const dot=v.reduce((s,x,i)=>s+x*Q[k][i],0); projections[k]+=dot;
        for(let i=0;i<n;i++) v[i]-=dot*Q[k][i];
      }
      const norm=Math.sqrt(v.reduce((s,x)=>s+x*x,0));
      if(norm<1e-10) continue;
      for(let k=0;k<Q.length;k++) R[k].push(projections[k]);
      R.push([...Array(Q.length).fill(0),norm]);
      Q.push(v.map(x=>x/norm)); kept.push(j);
    }
    const beta=Q.map(q=>q.reduce((s,v,i)=>s+v*pts[i].y,0));
    const coef=Array(Q.length).fill(0);
    for(let j=Q.length-1;j>=0;j--) coef[j]=(beta[j]-coef.reduce((s,v,k)=>s+(k>j?R[j][k]*v:0),0))/R[j][j];
    return {predict:x=>coef.reduce((s,v,j)=>s+v*x**kept[j],0),weights:coef.slice(1),rank:Q.length};
  };

  const vx=Array.from({length:30},(_,i)=>-.95+1.9*i/29);
  const truth=x=>2+x-2*x*x+x*x*x;
  const init={plot:{xRange:[-1.05,1.05],yRange:[-5,6],xLabel:'Scaled input x',yLabel:'Target y',
      classes:[{id:0,label:'Training dots'},{id:1,label:'Validation rule'}],
      points:[...pts.map(p=>({...p,cls:0})),...vx.map((x,i)=>({id:'v'+i,x,y:truth(x),cls:1}))]},
      chart:{xLabel:'Degree',yLabel:'MSE',series:[{id:'train',label:'Training',type:'line',points:[]},
      {id:'validation',label:'Fixed validation',type:'line',points:[]}]}};
  let selected=null;
  for(let degree=1;degree<=12;degree++) {
    const model=fit(degree,0);
    const trainMse=pts.reduce((s,p)=>s+(p.y-model.predict(p.x))**2,0)/pts.length;
    const validationMse=vx.reduce((s,x)=>s+(truth(x)-model.predict(x))**2,0)/vx.length;
    const curve=Array.from({length:121},(_,i)=>{const x=-1+2*i/120;return [x,model.predict(x)];});
    if(degree===input.degree) selected={degree,trainMse:r(trainMse),validationMse:r(validationMse),curve};
    say('note',{vars:{degree,rank:model.rank}},`Degree ${degree} uses ${model.rank} independent columns; fit only the training measurements.`,
        'শুধু ট্রেনিং পয়েন্টে ওজন শেখাই; নির্ভরশীল ঘাত বাদ দিই।',2);
    say('shape',{id:'fit',type:'curve',points:curve,tone:'active'},
        'The curve evaluates the fitted polynomial between observations.','পয়েন্টের মাঝেও শেখা polynomial-এর মান বের করে কার্ভ আঁকি।',3);
    say('series-add',{id:'train',x:degree,y:trainMse},
        `Training MSE=${r(trainMse)}; extra powers can fit the measured noise.`,
        'ঘাত বাড়ালে মাপের শব্দও ফিট হতে পারে; ট্রেনিংয়ের ভুল একা যথেষ্ট নয়।',4);
    say('series-add',{id:'validation',x:degree,y:validationMse},
        `Fixed cubic validation MSE=${r(validationMse)}; these targets never train the weights.`,
        'এই validation-এর উত্তর দিয়ে ওজন শেখানো হয়নি; নতুন জায়গায় ভুল দেখি।',4);
  }
  say('shape',{id:'fit',type:'curve',points:selected.curve,tone:'found'},
      'Restore the selected degree; the orange validation points stay fixed even if you edit training measurements.',
      'বেছে নেওয়া degree ফিরিয়ে আনি; ট্রেনিং বদলালেও validation-এর নিয়ম একই।',5);
  say('vline',{x:input.degree,label:'Selected degree'},'Compare both error curves at this degree.','এই degree-তে ট্রেনিং আর validation দুটো ভুলই দেখো।',5);
  say('done',{vars:{degree:selected.degree,trainMse:selected.trainMse,validationMse:selected.validationMse}},
      'The fixed validation rule is a teaching assumption, not a universal truth about edited data.',
      'এই validation-এর cubic নিয়ম শেখার উদাহরণ; বদলানো সব ডেটার সত্যি নিয়ম নয়।',5);

  return {init, steps};
}
