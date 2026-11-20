function trace(input) {
  const points = input.points.map((p,i) => ({ ...p, y:p.cls, id:'p'+i }));
  const positives = points.filter(p => p.cls === 1).length, negatives = points.length - positives;
  const note = (en,bn) => ({en,bn}), round = v => Math.round(v*1000)/1000;
  const init = { plot: {
    xRange:[0,1.05], yRange:[-0.2,1.2], xLabel:'Class-one score', yLabel:'Known class row',
    classes:[{id:0,label:'Known zero'},{id:1,label:'Known one'}], points
  }, chart:{ xLabel:'False positive rate', yLabel:'True positive rate', xRange:[0,1], yRange:[0,1],
    series:[{id:'roc',label:'ROC',type:'line',points:positives && negatives ? [[0,0]] : []},
      {id:'selected',label:'Selected threshold',type:'scatter',points:[]}] } };
  const steps=[];
  if (!positives || !negatives) {
    steps.push({op:'note',line:1,vars:{status:'undefined',auc:null,selectedFPR:null,selectedTPR:null},
      note:note('ROC/AUC needs both actual classes; one rate denominator is absent. No numeric AUC is invented.',
        'ROC/AUC-এর জন্য দুই আসল ক্লাস-ই চাই; একটি rate-এর denominator নেই। বানানো AUC দেখানো হবে না।')});
    steps.push({op:'done',line:8,note:note('Add examples of the missing class before comparing rankings.','না থাকা ক্লাস-এর উদাহরণ যোগ করে তারপর ranking মেলাও।')});
    return {init,steps};
  }
  const thresholds=[...new Set(points.map(p=>p.x))].sort((a,b)=>b-a);
  steps.push({op:'shape',id:'threshold',type:'line',w:[1,0],b:-(thresholds[0]+0.01),line:1,
    note:note('Begin above the highest score: no positive predictions, so ROC starts at (0,0).',
      'সবচেয়ে বড় score-এর ওপর থেকে শুরু: positive prediction নেই, তাই ROC শুরু (0,0)-তে।')});
  let tp=0,fp=0,area=0,previous=[0,0];
  for (const threshold of thresholds) {
    steps.push({op:'shape',id:'threshold',type:'line',w:[1,0],b:-threshold,line:2,
      note:note(`Lower the inclusive threshold to ${threshold}; all tied scores enter together.`,
        `Inclusive threshold ${threshold}-এ নামাও; সমান score একসঙ্গে ঢুকবে।`)});
    const group=points.filter(p=>p.x===threshold);
    for (const p of group) {
      if(p.cls===1) ++tp; else ++fp;
      steps.push({op:'point-mark',targets:[p.id],tone:p.cls===1?'found':'discarded',line:3,
        note:note(`${p.id} now predicts one; its known class adds a ${p.cls===1?'true':'false'} positive.`,
          `${p.id}-এ এখন এক predict হয়; আসল ক্লাস অনুযায়ী ${p.cls===1?'true':'false'} positive যোগ হয়।`)});
    }
    const fpr=fp/negatives,tpr=tp/positives;
    steps.push({op:'note',line:4,note:note(`TPR=${tp}/${positives}=${round(tpr)}; FPR=${fp}/${negatives}=${round(fpr)}.`,
      `TPR=${tp}/${positives}=${round(tpr)}; FPR=${fp}/${negatives}=${round(fpr)}।`)});
    steps.push({op:'series-add',id:'roc',x:fpr,y:tpr,line:5,
      note:note('Add one ROC point after the complete score-tie group, not one arbitrary tie ordering.',
        'সমান score-এর পুরো দল শেষে একটি ROC point যোগ করো; ইচ্ছেমতো tie ভেঙে নয়।')});
    area+=(fpr-previous[0])*(tpr+previous[1])/2;previous=[fpr,tpr];
    steps.push({op:'point-clear-marks',line:5,note:note('Keep the curve point and continue to the next distinct score.',
      'Curve-এর point রেখে পরের আলাদা score-এ যাও।')});
  }
  const stp=points.filter(p=>p.cls===1&&p.x>=input.threshold).length;
  const sfp=points.filter(p=>p.cls===0&&p.x>=input.threshold).length;
  const fpr=sfp/negatives,tpr=stp/positives;
  steps.push({op:'shape',id:'threshold',type:'line',w:[1,0],b:-input.threshold,line:6,
    note:note(`Return to your selected threshold ${input.threshold}; AUC remains a ranking summary across thresholds.`,
      `তোমার threshold ${input.threshold}-এ ফেরো; AUC সব threshold জুড়ে ranking-এর সারাংশ।`)});
  steps.push({op:'series-add',id:'selected',x:fpr,y:tpr,line:6,
    note:note('This marker is one operating point, not a new trained model.', 'এই marker একটি operating point; নতুন train করা মডেল নয়।')});
  steps.push({op:'note',line:7,vars:{status:'defined',auc:round(area),selectedFPR:round(fpr),selectedTPR:round(tpr)},
    note:note(`Trapezoidal AUC ${round(area)} gives score ties half credit in the pair-ranking view.`,
      `Trapezoid-এর AUC ${round(area)}; pair-ranking হিসাবে সমান score অর্ধেক credit পায়।`)});
  steps.push({op:'done',line:8,note:note('Compare ranking quality with the decision threshold and class prevalence separately.',
    'Ranking-এর মান, সিদ্ধান্তের threshold ও ক্লাস-এর অনুপাত আলাদা করে বোঝো।')});
  return {init,steps};
}
