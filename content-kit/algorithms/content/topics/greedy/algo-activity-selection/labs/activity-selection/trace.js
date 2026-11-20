function trace(input) {
    const sets=[[[1,4],[3,5],[0,6],[5,7],[8,9],[5,9]],[[0,1],[1,2],[2,3]],[[0,5],[1,6],[2,7]],[]];
    const a=sets[input.schedule].map(([start,finish],id)=>({start,finish,id}));
    a.sort((x,y)=>x.finish-y.finish||x.id-y.id);
    const steps=[],selected=[];
    let last=0;
    steps.push({op:'list',name:'meetings',items:a.map(x=>`${x.id}: [${x.start},${x.finish})`),line:1,
        note:{en:'Finish order gives the next meeting the earliest possible free time.', bn: "Finish order পরের meeting-কে যত আগে সম্ভব free time দেয়।"}});
    for(let i=0;i<a.length;i++) {
        const x=a[i],accept=selected.length===0||x.start>=last;
        steps.push({op:'mark',targets:[i],tone:accept?'found':'discarded',line:4,
            vars:{id:x.id,start:x.start,finish:x.finish},note:{en:accept?'This meeting fits after the chosen prefix.':'This meeting overlaps the last chosen meeting.',bn:accept?'আগের সভার পরে এটি নেওয়া যায়।':'আগের সভার সঙ্গে সময় মিলে যাচ্ছে।'}});
        if(accept) { selected.push(x.id); last=x.finish; }
        steps.push({op:'list',name:'selected',items:selected.slice(),line:5,
            vars:{count:selected.length,last},note:{en:'Keep original IDs so finish sorting does not lose meeting identities.', bn: "Original ID রাখো, যেন finish-sort-এ meeting-এর পরিচয় না হারায়।"}});
    }
    steps.push({op:'list',name:'selected',items:selected.slice(),note:{en:'These meetings form the selected schedule.', bn: "এই meeting-গুলোই নির্বাচিত schedule।"}});
    steps.push({op:'done',line:6,vars:{count:selected.length},note:{en:`Selected ${selected.length} compatible meetings.`,bn:'নির্বাচিত সভাগুলোর সময় পরস্পরের সঙ্গে মেলে না।'}});
    return {init:{array:a.map(x=>x.finish)},steps};
}
