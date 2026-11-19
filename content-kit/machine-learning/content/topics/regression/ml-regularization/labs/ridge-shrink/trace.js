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

  const init={plot:{xRange:[-1.05,1.05],yRange:[-5,6],xLabel:'Input x',yLabel:'Target y',points:pts},
      chart:{xLabel:'Alpha (linear scale)',yLabel:'Scaled weight L2 norm',
      series:[{id:'norm',label:'Weight norm',type:'line',points:[]}]}};
  const alphas=[.1,.2,.5,1,2,5,10,20,50,100];
  let chosen;
  for(const alpha of alphas) {
    const model=fit(8,alpha);
    const norm=Math.sqrt(model.weights.reduce((s,v)=>s+v*v,0));
    const cost=pts.reduce((s,p)=>s+(p.y-model.predict(p.x))**2,0)/pts.length;
    const curve=Array.from({length:121},(_,i)=>{const x=-1+2*i/120;return [x,model.predict(x)];});
    say('note',{vars:{trialAlpha:alpha,weightNorm:r(norm)}},
        `Alpha ${alpha}: solve the penalised system with the same fitted feature scales.`,
        'ফিচারের একই স্কেল রেখে penalty বদলাই; intercept-এ penalty দিই না।',3);
    say('shape',{id:'fit',type:'curve',points:curve,tone:'active'},
        `The degree-eight curve now has training MSE ${r(cost)}.`,
        'penalty বাড়ালে কার্ভ কম বাঁকতে পারে, তবে ট্রেনিংয়ের ভুল বাড়তেও পারে।',4);
    say('series-add',{id:'norm',x:alpha,y:norm},
        `The combined weight norm is ${r(norm)}; individual weights need not shrink monotonically.`,
        'সব ওজনের মোট L2 norm দেখি; আলাদা ওজন সব সময় একভাবে কমে না।',4);
  }
  const model=fit(8,input.alpha);
  const norm=Math.sqrt(model.weights.reduce((s,v)=>s+v*v,0));
  const cost=pts.reduce((s,p)=>s+(p.y-model.predict(p.x))**2,0)/pts.length;
  const curve=Array.from({length:121},(_,i)=>{const x=-1+2*i/120;return [x,model.predict(x)];});
  say('shape',{id:'fit',type:'curve',points:curve,tone:'found'},
      'Restore your slider value; the comparison chart keeps the same standardised features.','স্লাইডারের alpha ফিরিয়ে আনি; স্কেল আগেরটাই থাকে।',5);
  say('vline',{x:input.alpha,label:'Selected alpha'},'This marker locates your selected penalty.','এই দাগ তোমার বেছে নেওয়া penalty দেখায়।',5);
  say('done',{vars:{alpha:input.alpha,weightNorm:r(norm),trainMse:r(cost)}},
      'A flatter curve is not automatically better; select alpha on validation data.','কার্ভ কম বাঁকলেই ভালো নয়; validation দিয়ে alpha বেছে নাও।',5);

  return {init, steps};
}
