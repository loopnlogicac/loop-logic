function trace(input) {
  const steps = [];
  const r = v => Math.round(v * 1000) / 1000;
  const say = (op, fields, en, bn, line = 1) => steps.push({op, ...fields, line, note: {en, bn}});

  const init={chart:{xLabel:'Flips',yLabel:'Share of heads',xRange:[0,input.trials],yRange:[0,1],series:[{id:'frequency',label:'Running heads share',type:'line',tone:'active',points:[]},{id:'truth',label:'Chosen probability',type:'line',tone:'active',points:[[0,input.probability],[input.trials,input.probability]]}]}};
  let state=input.seed,heads=0,points=[];
  for(let t=1;t<=input.trials;t++) {
    state=(1664525*state+1013904223)>>>0;
    const u=state/4294967296,head=u<input.probability;
    if(head) heads++;
    // Show every early flip, then sample the path every five flips.
    if(t<=20 || t%5===0 || t===input.trials) {
      points.push([t,r(heads/t)]);
      say('series-set',{id:'frequency',points:points.map(p=>[...p]),vars:{heads,trials:t,frequency:r(heads/t)}},
        `${t}: ${head?'heads':'tails'}, heads=${heads}; share=${r(heads/t)}. After flip 20, show every fifth flip and the last.`,
        'হেডের সংখ্যা মোট ছোড়া দিয়ে ভাগ করি; বেশি ছুড়লেও প্রতিবার ব্যবধান কমবেই এমন নয়।',6);
    }
  }
  say('done',{vars:{heads,trials:input.trials,frequency:r(heads/input.trials)}},'A long-run tendency does not force the next toss to repair a streak.', 'আগে অনেক টেইল হলেও পরের ছোড়ায় হেড আসতেই হবে না।',6);

  return {init, steps};
}
