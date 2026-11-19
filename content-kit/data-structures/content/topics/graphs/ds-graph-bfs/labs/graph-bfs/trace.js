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
    const dist = Array(7).fill(-1), parent = Array(7).fill(-1);
    const queue = [input.start], order = [], tree = new Set();
    dist[input.start] = 0;
    for (let v = 0; v < 7; v++) {
        add('label', {id:v, text:String(dist[v])}, 1,
            'Minus one means undiscovered; the source alone starts at zero.', 'সোর্সের দূরত্ব শূন্য, বাকিগুলো এখনো পাওয়া যায়নি।');
    }
    add('visit', {id:input.start, tone:'frontier'}, 2, 'Mark the source before enqueueing it.', 'সোর্স কিউতে ঢোকানোর আগেই মার্ক করো।');
    add('list', {name:'queue',items:queue.slice()}, 2, 'The source is waiting for expansion.', 'সোর্সের নেইবার দেখা এখনো বাকি।');
    while (queue.length) {
        const u = queue.shift(); order.push(u);
        add('list',{name:'queue',items:queue.slice()},3,'Remove the oldest waiting vertex to preserve distance layers.','আগে ঢোকা ভার্টেক্স আগে নাও, এতে দূরত্বের স্তর ঠিক থাকে।');
        add('visit',{id:u,tone:'current'},3,`Expand neighbors of ${u} in increasing order.`,'ছোট আইডি থেকে নেইবার দেখো।');
        for (const [v,e] of adj[u]) {
            if (dist[v] === -1) {
                dist[v] = dist[u]+1; parent[v]=u; queue.push(v); tree.add(e);
                add('edge',{id:e,tone:'tree'},5,'A first discovery creates a BFS tree edge.','প্রথমবার পাওয়া ভার্টেক্সের জন্য ট্রি এজ রাখো।');
                add('visit',{id:v,tone:'frontier'},5,'Mark now so a second parent cannot enqueue it again.','এখনই মার্ক করো, যাতে অন্য প্যারেন্ট আবার কিউতে না ঢোকায়।');
                add('label',{id:v,text:String(dist[v])},5,`The new distance is ${dist[v]}, one more than its parent.`,'প্যারেন্টের দূরত্বের সঙ্গে এক যোগ করো।');
                add('list',{name:'queue',items:queue.slice()},6,'Append the newly discovered vertex after earlier arrivals.','নতুন ভার্টেক্স কিউয়ের শেষে রাখো।');
            } else {
                if (!tree.has(e)) { add('edge',{id:e,tone:'considered'},4,'This neighbor already has a distance; do not enqueue it again.','এই নেইবার আগেই পাওয়া গেছে, আবার কিউতে ঢোকাবে না।'); }
                else { add('note',{},4,'The tree edge also appears in the reverse undirected list.','আনডিরেক্টেড লিস্টে ট্রি এজ উল্টো দিকেও আছে।'); }
            }
        }
        add('visit',{id:u,tone:'done'},7,'All neighbors of this vertex have been inspected.','এই ভার্টেক্সের সব নেইবার দেখা শেষ।');
        add('list',{name:'order',items:order.slice()},7,'Record completed queue expansions.','কিউ থেকে নিয়ে দেখা ভার্টেক্সের ক্রম রাখো।');
    }
    add('list',{name:'parents',items:parent},8,'Parents reconstruct shortest-hop paths; -1 has no parent.','প্যারেন্ট ধরে কম এজের পথ পাওয়া যায়; -১ মানে প্যারেন্ট নেই।');
    add('done',{},8,'Only vertices reachable from the source have nonnegative distances.','সোর্স থেকে যাওয়া যায় এমন ভার্টেক্সের দূরত্বই শূন্য বা বেশি।');
    return {init:{nodes,edges,directed:false},steps};
}
