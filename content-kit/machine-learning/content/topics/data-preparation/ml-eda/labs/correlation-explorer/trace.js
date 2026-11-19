function trace(input) {
  const steps=[];
  const round=v=>Math.round(v*1000)/1000;
  const say=(op,fields,en,bn,line=1)=>steps.push({op,...fields,line,note:{en,bn}});

  const raw=[-2,-1,0,0,1,2],noise=[1,-2,1,1,-2,1],n=6;
  const sx=Math.sqrt(raw.reduce((s,x)=>s+x*x,0)/n),se=Math.sqrt(noise.reduce((s,x)=>s+x*x,0)/n);
  const xs=raw.map(x=>x/sx),ys=xs.map((x,i)=>input.r*x+Math.sqrt(Math.max(0,1-input.r**2))*noise[i]/se);
  const init={plot:{xRange:[-3,3],yRange:[-3,3],xLabel:'Centred, unit-spread x',yLabel:'Constructed y',points:[],shapes:{}}};
  say('note',{},'The fixed noise has mean zero and zero dot product with x; both vectors are scaled to unit population spread.','নয়েজ আর x-এর ডট প্রোডাক্ট শূন্য; দুটোর গড় শূন্য আর স্ট্যান্ডার্ড ডেভিয়েশন ১।',1);
  let xx=0,yy=0,xy=0;
  xs.forEach((x,i)=>{
    const y=ys[i];
    say('point-add',{id:'p'+i,x,y,label:'p'+(i+1)},`Construct point ${i+1}: x=${round(x)}, y=${round(y)}.`, 'স্লাইডারের মান দিয়ে এই পয়েন্টের y হিসাব করি; ছবি দেখে সংখ্যা বানাই না।',3);
    say('shape',{id:'x'+i,type:'segment',from:[0,y],to:[x,y],dash:true,tone:'considered'},'Both axes are already centred, so x is its signed gap from the mean.','গড় শূন্য, তাই x নিজেই গড় থেকে তার পার্থক্য।',4);
    xx+=x*x;yy+=y*y;xy+=x*y;
    say('note',{vars:{xx:round(xx),yy:round(yy),xy:round(xy)}},`Add x*x, y*y and x*y; running xy is ${round(xy)}.`, 'একই দিকে গেলে গুণফল ধনাত্মক; উল্টো দিকে গেলে ঋণাত্মক।',4);
    say('shape-remove',{id:'x'+i},'Remove the guide after its contribution is counted.','অবদান যোগ হয়েছে; এবার পরের পয়েন্ট দেখি।',4);
  });
  const slope=xy/xx,intercept=ys.reduce((a,b)=>a+b,0)/n;
  say('shape',{id:'fit',type:'line',w:[slope,-1],b:intercept,label:'Least-squares line'},`Fit y = ${round(slope)}*x + ${round(intercept)}.`, 'সব খাড়া ভুলের বর্গের যোগ সবচেয়ে কম হয় এই রেখায়।',5);
  xs.forEach((x,i)=>say('shape',{id:'residual'+i,type:'segment',from:[x,slope*x+intercept],to:[x,ys[i]],tone:'considered'},`Residual ${i+1}: observed minus fitted y = ${round(ys[i]-slope*x-intercept)}.`, 'আসল y আর রেখার y-এর ফাঁকটা দেখো; করিলেশন কারণ প্রমাণ করে না।',5));
  say('done',{vars:{r:round(xy/Math.sqrt(xx*yy)),slope:round(slope),intercept:round(intercept)}},'The computed r matches the slider. Zero r describes linear association, not every possible relationship.','হিসাবের r স্লাইডারের সঙ্গে মেলে; r শূন্য হলেও বাঁকা সম্পর্ক থাকতে পারে।',6);
  return {init,steps};
}
