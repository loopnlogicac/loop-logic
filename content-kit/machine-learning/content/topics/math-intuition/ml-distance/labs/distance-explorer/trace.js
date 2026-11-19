function trace(input) {
  const steps = [];
  const r = v => Math.round(v * 1000) / 1000;
  const say = (op, fields, en, bn, line = 1) => steps.push({op, ...fields, line, note: {en, bn}});

  const [a,b]=input.points;
  const dx=b.x-a.x,dy=b.y-a.y;
  const init={plot:{xRange:[0,10],yRange:[0,10],points:input.points.map((p,i)=>({id:'p'+i,...p})),shapes:{}}};
  for (let t=1;t<=7;t++) say('shape',{id:'horizontal',type:'segment',from:[a.x,a.y],to:[a.x+dx*t/7,a.y],label:'|dx| = '+r(Math.abs(dx))},
    `Horizontal travel adds |${r(dx)}| = ${r(Math.abs(dx))}; direction does not make distance negative.`, 'বাঁয়ে গেলেও দূরত্ব ঋণাত্মক হয় না, তাই পরম মান নিই।',3);
  for (let t=1;t<=7;t++) say('shape',{id:'vertical',type:'segment',from:[b.x,a.y],to:[b.x,a.y+dy*t/7],label:'|dy| = '+r(Math.abs(dy))},
    `Vertical travel adds |${r(dy)}| = ${r(Math.abs(dy))}.`, 'খাড়া পথটা যোগ করলে ব্লক ধরে হাঁটার দূরত্ব পাই।',3);
  for (let t=1;t<=6;t++) say('shape',{id:'straight',type:'segment',from:[a.x,a.y],to:[a.x+dx*t/6,a.y+dy*t/6],label:'sqrt(dx² + dy²)',tone:'found'},
    `Pythagoras uses ${r(dx*dx)} + ${r(dy*dy)} under the square root.`, 'সোজা পথ পেতে দুই পার্থক্যের বর্গ যোগ করে বর্গমূল নিই।',5);
  say('done',{vars:{dx:r(dx),dy:r(dy),euclidean:r(Math.hypot(dx,dy)),manhattan:r(Math.abs(dx)+Math.abs(dy))}},
    'Both routes join the same endpoints, but obey different movement rules.', 'একই দুই বিন্দুর জন্য পথের নিয়ম বদলালে দূরত্বও বদলায়।',6);

  return {init, steps};
}
