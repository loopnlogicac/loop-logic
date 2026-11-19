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

  const pq=[];
  function push(value,u,parent){pq.push([value,u,parent]);pq.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);}
  function showpq(line){list('pq',pq.map(e=>names[e[1]]+':'+e[0]),'The smallest key will be removed next; old entries may remain.',line);}

  const dist=names.map(()=>Infinity),parent=names.map(()=>-1),order=[];
  dist[s]=0;push(0,s,-1);
  for(let u=0;u<6;u++)label(u,Number.isFinite(dist[u])?dist[u]:'INF','Only the source has a finite initial route.',1);
  while(pq.length){
    const [value,u]=pq.shift();showpq(2);
    if(value!==dist[u]){emit('note',{},'A better route replaced this queued value; ignore the stale entry.',3);continue;}
    order.push(names[u]);emit('visit',{id:u,tone:'done'},`The minimum unsettled distance ${value} is final.`,2,'সব ওজন শূন্য বা ধনাত্মক, তাই এই নোডের দূরত্ব আর কমবে না।');
    for(const [v,w,e] of adj[u]){
      const candidate=dist[u]+w;
      emit('edge',{id:e,tone:'considered'},`Compare route ${candidate} through ${names[u]} with the current distance.`,4);
      if(candidate<dist[v]){
        dist[v]=candidate;parent[v]=u;push(candidate,v,u);
        label(v,candidate,'This real route improves the previous upper bound.',5);
        emit('edge',{id:e,tone:'relaxed'},'Strict improvement changes the predecessor toward the source.',5,'কম দূরত্ব পাওয়ায় নোডের parent বদলাও।');showpq(6);
      }
    }
  }
  list('dist',dist.map(d=>Number.isFinite(d)?d:-1),'Use -1 in the result list for vertices unreachable from the source.',7);
  list('parents',parent,'Reverse these predecessor links to print a shortest path.',7);
  list('order',order,'Vertices are settled in nondecreasing distance order.',7);
  emit('done',{},'Every reachable distance is final; weights were never negative.',7,'যেসব নোডে পৌঁছানো যায়, তাদের শর্টেস্ট পাথ পাওয়া গেছে।');

  return {init:{nodes,edges,directed},steps};
}
