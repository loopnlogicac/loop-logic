function trace(input) {
  const names = ['A','B','C','D','E','F'];
  const pos = [[10,50],[35,15],[35,85],[65,15],[65,85],[90,50]];
  const directed = true;
  let pairs = [[0,1,4],[0,2,2],[1,2,1],[1,3,5],[2,4,8],[3,4,2],[3,5,6],[4,5,3]];
  if (input.graph === 1) {
    pairs = false ? pairs.concat([[4,1,-6]]) : [[0,1,1],[1,2,1],[2,3,1],[3,4,1],[4,5,1]];
    if (directed && !false) pairs.push([5,0,1]);
  }
  if (input.graph === 2) pairs = pairs.filter(e => e[1] !== 5);
  if (input.graph === 3) pairs = [];
  if (false && input.graph !== 3) pairs[2][2] = -3;
  if (input.graph === 1 && !false) {
    const ring = [[10,50],[35,15],[65,15],[90,50],[65,85],[35,85]];
    for (let u=0;u<6;u++) {pos[u][0]=ring[u][0];pos[u][1]=ring[u][1];}
  }
  const nodes = names.map((label,id) => ({id,label,x:pos[id][0],y:pos[id][1]}));
  const edges = pairs.map(([from,to,weight],k) => ({id:'e'+k,from,to,weight}));
  const adj = names.map(() => []);
  edges.forEach(e => {adj[e.from].push([e.to,e.weight,e.id]); if (!directed) adj[e.to].push([e.from,e.weight,e.id]);});
  adj.forEach(a => a.sort((a,b) => a[0]-b[0]));
  const steps = [];
  const note = (en,bn) => bn ? {en,bn} : {en};
  const emit = (op,fields,en,line,bn) => steps.push({op,...fields,note:note(en,bn),line});
  const list = (name,items,en,line) => emit('list',{name,items:items.slice()},en,line);
  const label = (id,text,en,line) => emit('label',{id,text:String(text)},en,line);
  const s = input.start;

  const indegree=names.map(()=>0),queue=[],order=[];
  edges.forEach(e=>indegree[e.to]++);
  for(let u=0;u<6;u++){label(u,indegree[u],'This many prerequisites still enter the vertex.',1);if(!indegree[u])queue.push(u);}
  list('queue',queue.map(u=>names[u]),'Only vertices with no remaining prerequisites are ready.',2);
  while(queue.length){
    const u=queue.shift();order.push(names[u]);
    emit('visit',{id:u,tone:'done'},'No remaining arc requires another vertex before this one.',3);
    list('order',order,'Every removed vertex follows all of its prerequisites.',3);
    for(const [v,w,e] of adj[u]){
      indegree[v]--;emit('edge',{id:e,tone:'considered'},'Removing the source satisfies one incoming dependency.',5);
      label(v,indegree[v],'The incoming dependency count falls by one.',5);
      if(!indegree[v]){queue.push(v);emit('note',{},`${names[v]} has no prerequisites left and can enter the queue.`,5,'সব আগের কাজ শেষ, তাই নোডটা কিউতে যাবে।');}
    }
    list('queue',queue.map(u=>names[u]),'The next ready vertex is taken in FIFO order.',3);
  }
  emit('done',{vars:{cycle:Number(order.length!==6),count:order.length}},order.length===6?'All six vertices form a valid topological order.':'The remaining dependency cycle prevents a complete order.',6,'কিউ খালি হলে নেওয়া নোডের সংখ্যা দেখে সাইকেল আছে কি না বোঝো।');

  return {init:{nodes,edges,directed},steps};
}
