function trace(input) {
  const names = ['A','B','C','D','E','F'];
  const pos = [[10,50],[35,15],[35,85],[65,15],[65,85],[90,50]];
  const directed = false;
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

  const dist = names.map(() => -1), parent = names.map(() => -1), queue=[s], order=[];
  dist[s]=0;
  for(let u=0;u<6;u++) label(u,dist[u],'Distance -1 means no route has been found yet.',1);
  list('queue',queue.map(u=>names[u]),'The source is the only known layer-zero vertex.',1);
  while(queue.length) {
    const u=queue.shift(); order.push(names[u]);
    list('queue',queue.map(v=>names[v]),'FIFO removes the oldest discovered vertex.',2);
    emit('visit',{id:u,tone:'current'},`Explore ${names[u]} at distance ${dist[u]}.`,2);
    for(const [v,w,e] of adj[u]) {
      if(dist[v]===-1) {
        dist[v]=dist[u]+1; parent[v]=u; queue.push(v);
        emit('edge',{id:e,tone:'tree'},`${names[v]} is new, so its first distance is ${dist[v]}.`,4,'নতুন নোডে প্রথম পৌঁছানো পথেই সবচেয়ে কম এজ লাগে।');
        label(v,dist[v],'One additional edge reaches this next layer.',4);
        list('queue',queue.map(v=>names[v]),'Enqueue only after marking, so no vertex enters twice.',5);
      } else emit('note',{},`${names[v]} already has a shortest layer; keep its parent.`,4);
    }
    emit('visit',{id:u,tone:'done'},'Every neighbour of this vertex has been examined.',2);
    list('order',order,'Removal order never decreases the BFS layer.',2);
  }
  list('parents',parent,'Each parent gives a route back toward the source.',6);
  list('dist',dist,'Unreachable vertices retain distance -1.',6);
  emit('done',{},'Distances count edges; the displayed weights are ignored by BFS.',6,'BFS এখানে এজ গুনে দূরত্ব বের করেছে; এজের ওজন ব্যবহার করেনি।');

  return {init:{nodes,edges,directed},steps};
}
