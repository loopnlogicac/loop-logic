function trace(input){
  const note=(en,bn)=>({en,bn}),round=v=>Math.round(v*1000)/1000;
  function predict(p,k){
    const selected=input.points.map((q,i)=>({q,i,d:Math.hypot(q.x-p.x,q.y-p.y)})).sort((a,b)=>a.d-b.d||a.i-b.i).slice(0,Math.min(k,input.points.length));
    const zero=input.weights==='distance'&&selected.some(v=>v.d===0),votes=[0,0];
    for(const item of selected){if(zero){if(item.d===0)votes[item.q.cls]++;}else votes[item.q.cls]+=input.weights==='distance'?1/item.d:1;}
    return Number(votes[1]>votes[0]);
  }
  const score=(rows,k)=>rows.filter(p=>predict(p,k)===p.cls).length/rows.length;
  const init={plot:{xRange:[0,6],yRange:[0,6],xLabel:'Size score',yLabel:'Sweetness score',classes:[{id:0,label:'Apple'},{id:1,label:'Mango'}],
    points:[...input.points.map((p,i)=>({...p,id:'t'+i,label:'T'})),...input.validation.map((p,i)=>({...p,id:'v'+i,label:'V'}))]},
    chart:{xLabel:'Requested neighbours k',yLabel:'Accuracy',xRange:[1,9],yRange:[0,1],series:[
      {id:'train',label:'Training',type:'line',points:[]},{id:'validation',label:'Validation',type:'line',points:[]}]}};
  const steps=[],results=[];
  for(let k=1;k<=9;++k){
    const training=score(input.points,k),validation=score(input.validation,k);results.push({k,training,validation});
    steps.push({op:'note',line:1,note:note(`Try k=${k}, clamped to ${Math.min(k,input.points.length)} stored cards, with ${input.weights} weights.`,
      `k=${k} ও ${input.weights} ভোটে পাওয়া ${Math.min(k,input.points.length)}টি কার্ড নাও।`)});
    steps.push({op:'series-add',id:'train',x:k,y:training,line:2,
      note:note(`Training accuracy ${round(training)} includes each card in its own fitted reference set; it is not held-out evidence.`,
        `ট্রেনিং অ্যাকুরেসি ${round(training)}-এ কার্ড নিজের fitted দলে আছে; এটি held-out ফল নয়।`)});
    steps.push({op:'series-add',id:'validation',x:k,y:validation,line:3,
      note:note(`Validation accuracy ${round(validation)} uses V cards that never vote.`,
        `Validation অ্যাকুরেসি ${round(validation)}-তে V কার্ড কখনো ভোট দেয় না।`)});
  }
  const best=results.reduce((a,b)=>b.validation>a.validation?b:a),selected=results[input.k-1];
  steps.push({op:'vline',x:best.k,label:'Best validation',line:4,note:note('Maximise validation score; equal scores keep smaller k.',
    'Validation score বেশি নাও; সমান হলে ছোট k রাখো।')});
  steps.push({op:'note',line:5,vars:{selectedK:input.k,trainingAccuracy:round(selected.training),validationAccuracy:round(selected.validation),bestK:best.k,bestAccuracy:round(best.validation)},
    note:note('Report the selected candidate separately from the best grid value.', 'বেছে নেওয়া candidate ও grid-এর সেরা মান আলাদা জানাও।')});
  steps.push({op:'done',line:6,note:note('A validation winner still needs a separate final test; the curve is computed from real predictions.',
    'Validation-এ জেতার পরও final টেস্ট আলাদা চাই; curve সত্যিকারের prediction থেকে এসেছে।')});
  return {init,steps};
}
