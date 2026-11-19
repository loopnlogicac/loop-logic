function trace(input) {
    const positions = [[10,50],[30,20],[30,80],[55,20],[55,80],[80,50],[95,90]];
    let pairs = input.graph === 0 ? [[0,1],[0,2],[1,3],[1,4],[2,4],[3,5],[4,5]] : [];
    if (input.graph === 1) { for (let i = 0; i < 6; i++) { pairs.push([i, i + 1]); } }
    if (input.graph === 3) { for (let u = 0; u < 7; u++) { for (let v = u + 1; v < 7; v++) { pairs.push([u,v]); } } }
    const nodes = positions.map((p,id) => ({id, label: String(id), x: p[0], y:p[1]}));
    const edges = pairs.map(([from,to],i) => ({id: 'e'+i, from, to}));
    const adj = Array.from({length:7},()=>[]);
    pairs.forEach(([u,v],i)=> { adj[u].push([v,'e'+i]); adj[v].push([u,'e'+i]); });
    adj.forEach(a => a.sort((x,y)=>x[0]-y[0]));
    const steps = [];
    const add = (op, fields, line, en, bn) => steps.push({op, ...fields, line, note: {en, bn}});
    const seen=Array(7).fill(false), enter=Array(7).fill(0), leave=Array(7).fill(0);
    const stack=[{u:input.start,next:0}], order=[input.start], finish=[], tree=new Set();
    let clock=1;
    seen[input.start]=true; enter[input.start]=clock;
    add('visit',{id:input.start,tone:'current'},1,'Discover the source and suspend its frame when descending.','সোর্স থেকে শুরু করো, নিচে নামলে তার ফ্রেম রেখে দাও।');
    add('label',{id:input.start,text:'1/-'},1,'An entry time is known before the return time.','ঢোকার সময় জানা গেছে, ফেরার সময় এখনো নয়।');
    add('list',{name:'stack',items:stack.map(f=>f.u)},1,'The stack lists active calls from root to current.','স্ট্যাকে রুট থেকে বর্তমান কল পর্যন্ত আছে।');
    while(stack.length) {
        const frame=stack[stack.length-1], u=frame.u;
        if(frame.next < adj[u].length) {
            const [v,e]=adj[u][frame.next++];
            add('note',{vars:{u,v,next:frame.next}},3,'Advance the saved neighbor index before descending.','নিচে যাওয়ার আগে পরের নেইবারের ইনডেক্স এগিয়ে রাখো।');
            if(!seen[v]) {
                seen[v]=true; enter[v]=++clock; order.push(v); tree.add(e);
                add('edge',{id:e,tone:'tree'},4,'An unseen neighbor becomes a child of the active frame.','নতুন নেইবার বর্তমান ফ্রেমের চাইল্ড হবে।');
                add('visit',{id:v,tone:'current'},4,'Mark on entry to avoid revisiting a cycle.','ঢোকার সময় মার্ক করো, সাইকেলে আবার ঢুকবে না।');
                add('label',{id:v,text:enter[v]+'/-'},4,'Assign a discovery time before exploring children.','চাইল্ড দেখার আগে ডিসকভারি সময় রাখো।');
                stack.push({u:v,next:0});
                add('list',{name:'stack',items:stack.map(f=>f.u)},5,'Push a fresh frame with next neighbor zero.','নতুন ফ্রেমে নেইবারের ইনডেক্স শূন্য থেকে শুরু।');
            } else if(!tree.has(e)) {
                add('edge',{id:e,tone:'considered'},4,'The neighbor is already discovered; do not recurse again.','নেইবার আগেই পাওয়া গেছে, আবার কল করবে না।');
            }
        } else {
            leave[u]=++clock; finish.push(u); stack.pop();
            add('label',{id:u,text:enter[u]+'/'+leave[u]},6,'All children are finished, so record the exit time.','সব চাইল্ডের কাজ শেষ, এবার বের হওয়ার সময় লেখো।');
            add('visit',{id:u,tone:'done'},6,'Returning releases this active DFS frame.','ফেরার সময় এই ফ্রেমের কাজ শেষ হয়।');
            add('list',{name:'stack',items:stack.map(f=>f.u)},7,'Resume the parent at its saved next neighbor.','প্যারেন্টের মনে রাখা পরের নেইবার থেকে কাজ চলবে।');
        }
    }
    add('list',{name:'order',items:order},8,'Discovery records entry, not return.','ডিসকভারির ক্রমে ঢোকার ঘটনা থাকে।');
    add('list',{name:'finish',items:finish},8,'Descendants finish before their ancestors.','চাইল্ডের কাজ প্যারেন্টের আগে শেষ হয়।');
    add('list',{name:'enter',items:enter},8,'Zero denotes an unreachable vertex.','শূন্য মানে এই সার্চে পৌঁছানো যায়নি।');
    add('list',{name:'leave',items:leave},8,'Keep finish times separate from discovery times.','ফিনিশের সময় ডিসকভারির সময় থেকে আলাদা রাখো।');
    add('done',{},8,'The explicit frames reproduce recursive DFS in ascending neighbor order.','ফ্রেমের স্ট্যাক রিকার্সিভ ডিএফএসের একই ক্রম দেয়।');
    return {init:{nodes,edges,directed:false},steps};
}
