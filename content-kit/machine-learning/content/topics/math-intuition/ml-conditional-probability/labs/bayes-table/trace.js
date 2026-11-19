function trace(input) {
  const steps = [];
  const r = v => Math.round(v * 1000) / 1000;
  const say = (op, fields, en, bn, line = 1) => steps.push({op, ...fields, line, note: {en, bn}});

  const sick=input.sick,healthy=1000-sick;
  const tp=sick*input.sensitivity,fp=healthy*input.falsePositive;
  const cells=[[tp,sick-tp],[fp,healthy-fp]];
  const init={tables:{counts:{rows:2,cols:2,cells:[[null,null],[null,null]],rowLabels:['Ill','Healthy'],colLabels:['Positive','Negative']}},chart:{xLabel:'Condition',yLabel:'Probability',yRange:[0,1],series:[{id:'chance',label:'Chance of illness',type:'bar',tone:'active',points:[]}]}};
  say('note',{vars:{sick,healthy}},`Of 1000 people, ${sick} are ill and ${healthy} healthy.`, 'আগে মোট লোকের মধ্যে অসুস্থ কতজন দেখি; এটাই শুরুর হার।',1);
  for(let row=0;row<2;row++) for(let col=0;col<2;col++) {
    say('table-mark',{table:'counts',targets:[[row,col]],tone:'current'},`Focus on ${row===0?'ill':'healthy'} people with ${col===0?'positive':'negative'} results.`, 'একই দলের মানুষ আর একই টেস্টের ফল এক ঘরে রাখি।',row===0?2:3);
    say('note',{vars:{group:row===0?sick:healthy,share:r(col===0?(row===0?input.sensitivity:input.falsePositive):(1-(row===0?input.sensitivity:input.falsePositive)))}},'Multiply the group size by its relevant test-result share.', 'দলের মোট সংখ্যা আর সেই দলের টেস্টের হার গুণ করি।',row===0?2:3);
    say('table-set',{table:'counts',r:row,c:col,value:r(cells[row][col])},`Expected count = ${r(cells[row][col])}; decimal counts describe averages over repeated populations.`, 'ভগ্নাংশ থাকলে সেটা গড় হিসেবে আশা করা সংখ্যা, আংশিক মানুষ নয়।',row===0?2:3);
    say('table-unmark',{table:'counts',targets:[[row,col]]},'Keep this count while filling the other cells.', 'এই সংখ্যাটা রেখে বাকি ঘর পূরণ করি।',3);
  }
  say('table-mark',{table:'counts',targets:[[0,0],[1,0]],tone:'found'},'Given positive means keep only the positive column.', 'পজিটিভ জানা থাকলে শুধু পজিটিভ কলামটাই আমাদের নতুন মোট।',4);
  say('series-add',{id:'chance',x:'Before',y:r(sick/1000)},'The prior uses all 1000 people as its denominator.', 'টেস্টের আগে পুরো হাজার জন দিয়ে অসুস্থের সংখ্যা ভাগ হয়।',1);
  say('series-add',{id:'chance',x:'After positive',y:r(tp/(tp+fp))},'The posterior divides true positives by all positives.', 'টেস্টের পরে সব পজিটিভের মধ্যে সত্যি অসুস্থ কতজন দেখি।',5);
  say('done',{vars:{truePositive:r(tp),falsePositive:r(fp),positive:r(tp+fp),posterior:r(tp/(tp+fp))}},
    'A positive result changes the chance; it does not alone establish a diagnosis.', 'পজিটিভ ফলে সম্ভাবনা বদলায়; এই খেলনার টেবিল দিয়ে রোগ নির্ণয় করা যায় না।',5);

  return {init, steps};
}
