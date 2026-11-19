function trace(input) {
  const steps = [];
  const r = v => Math.round(v * 1000) / 1000;
  const say = (op, fields, en, bn, line = 1) => steps.push({op, ...fields, line, note: {en, bn}});

  const [a,b] = input.points;
  const sum = [a.x+b.x,a.y+b.y];
  const end = sum.map(v => input.scale*v);
  const extent = Math.max(1,...sum,...end.map(Math.abs));
  const init = {plot:{xRange:[-extent-1,extent+1],yRange:[-extent-1,extent+1],points:[],shapes:{},xLabel:'First coordinate',yLabel:'Second coordinate'}};
  // Reveal each quarter-arrow so direction and endpoint remain visible together.
  for (let t=1;t<=5;t++) {
    say('shape',{id:'a',type:'arrow',from:[0,0],to:[a.x*t/5,a.y*t/5],label:'a'},
      `Walk ${t}/5 of a: the arrow keeps its direction.`, 'a-এর কিছুটা পথ আঁকি; তিরের দিক একই থাকে।',2);
  }
  for (let t=1;t<=5;t++) {
    say('shape',{id:'b',type:'arrow',from:[a.x,a.y],to:[a.x+b.x*t/5,a.y+b.y*t/5],label:'b, head to tail'},
      `Move b without turning: endpoint (${r(a.x+b.x*t/5)}, ${r(a.y+b.y*t/5)}).`, 'b-কে না ঘুরিয়ে a-এর মাথায় বসাই।',3);
  }
  for (let t=1;t<=5;t++) {
    say('shape',{id:'sum',type:'arrow',from:[0,0],to:sum.map(v=>v*t/5),label:'a + b',tone:'found'},
      `The direct arrow joins the same start and finish; x: ${a.x}+${b.x}, y: ${a.y}+${b.y}.`, 'দুই পথে হাঁটার শেষ ঠিকানাই যোগফলের মাথা।',4);
  }
  for (let t=1;t<=5;t++) {
    say('shape',{id:'scaled',type:'arrow',from:[0,0],to:end.map(v=>v*t/5),label:'scale * (a + b)',tone:'current'},
      `Multiply both coordinates by ${input.scale}: (${r(end[0])}, ${r(end[1])}).`, 'একই সংখ্যা দিয়ে দুই কোঅর্ডিনেট গুণ করো। ঋণাত্মক হলে দিক উল্টায়।',5);
  }
  say('done',{vars:{sumX:r(sum[0]),sumY:r(sum[1]),scaledX:r(end[0]),scaledY:r(end[1])}},
    'The sum follows both walks; scaling changes its length and possibly its direction.', 'যোগফল দুই হাঁটার শেষ দেখায়; স্কেল করলে দৈর্ঘ্য বদলায়।',5);

  return {init, steps};
}
