function trace(input) {
  const steps = [];
  const r = v => Math.round(v * 1000) / 1000;
  const say = (op, fields, en, bn, line = 1) => steps.push({op, ...fields, line, note: {en, bn}});

  const n=input.points.length,w=[input.w1,input.w2];
  const init={tables:{x:{rows:n,cols:2,cells:input.points.map(p=>[p.x,p.y]),colLabels:['Feature 1','Feature 2']},w:{rows:2,cols:1,cells:w.map(v=>[v]),rowLabels:['Weight 1','Weight 2']},output:{rows:n,cols:1,cells:input.points.map(()=>[null]),colLabels:['X @ w']}}};
  let total=0;const results=[];
  input.points.forEach((p,i)=>{
    let value=0;const row=[p.x,p.y];
    say('note',{vars:{row:i+1,value:0}},`Row ${i+1} is one example; both columns must match the two weights.`, 'একটা সারি মানে একটা উদাহরণ; কলামের সঙ্গে ওজনের ক্রম মিলতে হবে।',2);
    for(let j=0;j<2;j++) {
      say('table-mark',{table:'x',targets:[[i,j]],tone:'current'},`Read X[${i},${j}] = ${row[j]}.`, 'সারির এই ঘরের সঙ্গে একই ক্রমের ওজন গুণ করব।',4);
      say('table-mark',{table:'w',targets:[[j,0]],tone:'compare'},`Its matching weight is ${w[j]}.`, 'কলাম বদলালে ওজনের জায়গাও বদলায়।',4);
      value+=row[j]*w[j];
      say('table-set',{table:'output',r:i,c:0,value:r(value),vars:{product:r(row[j]*w[j]),value:r(value)}},
        `${row[j]} * ${w[j]} = ${r(row[j]*w[j])}; partial sum = ${r(value)}.`, 'গুণফল আগের যোগফলের সঙ্গে যোগ করি; এভাবেই ডট প্রোডাক্ট হয়।',4);
      say('table-unmark',{table:'x',targets:[[i,j]]},'The feature value stays unchanged after multiplication.', 'গুণ করলেও আসল ডেটা বদলাই না।',4);
      say('table-unmark',{table:'w',targets:[[j,0]]},'Use the same weights again for the next matching feature.', 'পরের সারিতেও একই ওজন ব্যবহার হবে।',4);
    }
    results.push(r(value));total+=value;
  });
  say('list',{name:'output',items:results},'One complete dot product gives each output entry.', 'প্রতি সারির পুরো ডট প্রোডাক্ট থেকে একটা আউটপুট পাই।',5);
  say('done',{vars:{rows:n,cols:2,total:r(total)}},'The number of outputs equals the number of input rows.', 'যতগুলো সারি, ততগুলো আউটপুট; ভেতরের দুই মাপ মিলে গেছে।',5);

  return {init, steps};
}
