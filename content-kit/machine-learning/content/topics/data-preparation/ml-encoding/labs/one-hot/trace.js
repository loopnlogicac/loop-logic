function trace(input) {
  const steps=[];
  const round=v=>Math.round(v*1000)/1000;
  const say=(op,fields,en,bn,line=1)=>steps.push({op,...fields,line,note:{en,bn}});

  const codes=input.districts.split(''),cats=['B','M','U'],names={B:'Badda',M:'Mirpur',U:'Uttara','?':'Unseen'};
  const n=Math.max(1,codes.length);
  const init={tables:{raw:{rows:n,cols:1,cells:codes.length?codes.map(c=>[names[c]]):[['No rows']],colLabels:['District']},encoded:{rows:n,cols:3,colLabels:['Badda','Mirpur','Uttara']}}};
  say('note',{},'Vocabulary B, M, U was fitted on training data. We transform these rows without learning new columns.','ট্রেনিং ডেটা থেকে B, M, U কলাম শেখা আছে; এখন নতুন কলাম বানাব না।');
  let ones=0,unknown=0,errors=0;
  codes.forEach((code,i)=>{
    say('table-mark',{table:'raw',targets:[[i,0]],tone:'current'},`Read ${names[code]}; its spelling is a name, not a rank.`, 'ডিস্ট্রিক্টের নাম কোনো র‍্যাঙ্ক নয়।',2);
    if(code==='?') unknown++;
    const rejected=code==='?'&&input.policy==='error';if(rejected)errors++;
    cats.forEach((cat,j)=>{
      say('table-mark',{table:'encoded',targets:[[i,j]],tone:'compare'},`Does ${names[code]} equal ${names[cat]}?`, 'নাম মিললে ১, না মিললে ০ হবে।',3);
      const value=rejected?'ERROR':Number(code===cat);if(value===1)ones++;
      say('table-set',{table:'encoded',r:i,c:j,value},rejected?'This row is rejected: an unseen category cannot be transformed under the error policy.':`Write ${value}; this column always means ${names[cat]}.`,rejected?'নতুন নামের জন্য এই সারি রিজেক্ট হয়েছে; ERROR কোনো সংখ্যার এনকোডিং নয়।':'কলামের মানে বদলায় না; একই নাম একই কলাম পাবে।',4);
      say('table-unmark',{table:'encoded',targets:[[i,j]]},'Leave the result visible before checking the next category.','পরের ক্যাটাগরি দেখার আগে এই ফলটা রেখে দিই।',4);
    });
    if(code==='?')say('note',{},rejected?'A real encoder with handle_unknown="error" raises an exception; this table marks the rejected row.':'All zeros mean unseen here, not Badda or a missing baseline.',rejected?'আসল এনকোডার এখানে এরর দেবে; টেবিলে রিজেক্ট হওয়া সারিটা দেখানো আছে।':'সব শূন্য মানে নতুন নাম; এটা বদ্দার কলাম নয়।',5);
  });
  say('done',{vars:{rows:codes.length,ones,unknown,errors}},'Keep the same training vocabulary and policy when serving new predictions.','নতুন প্রেডিকশনেও ট্রেনিং থেকে শেখা কলাম আর একই নিয়ম রাখো।',5);
  return {init,steps};
}
