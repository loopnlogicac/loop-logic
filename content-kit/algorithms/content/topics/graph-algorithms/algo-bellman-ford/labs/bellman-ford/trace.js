function trace(input) {
  const names = ['A','B','C','D','E','F'];
  const pos = [[10,50],[35,15],[35,85],[65,15],[65,85],[90,50]];
  const directed = true;
  let pairs = [[0,1,4],[0,2,2],[1,2,1],[1,3,5],[2,4,8],[3,4,2],[3,5,6],[4,5,3]];
  if (input.graph === 1) {
    pairs = true ? pairs.concat([[4,1,-6]]) : [[0,1,1],[1,2,1],[2,3,1],[3,4,1],[4,5,1]];
    if (directed && !true) pairs.push([5,0,1]);
  }
  if (input.graph === 2) pairs = pairs.filter(e => e[1] !== 5);
  if (input.graph === 3) pairs = [];
  if (true && input.graph !== 3) pairs[2][2] = -3;
  if (input.graph === 1 && !true) {
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

  const dist=names.map(()=>Infinity),affected=names.map(()=>false);dist[s]=0;
  for(let u=0;u<6;u++)label(u,Number.isFinite(dist[u])?dist[u]:'INF','Only a reachable tail may start a relaxation.',1);
  for(let pass=1;pass<6;pass++){
    let changed=false;
    emit('note',{vars:{pass}},'Another full edge scan extends the guaranteed path length by one.',2);
    for(const e of edges){
      emit('edge',{id:e.id,tone:'considered'},'Check this directed edge even if earlier scans did not improve it.',3);
      if(Number.isFinite(dist[e.from])&&dist[e.from]+e.weight<dist[e.to]){
        dist[e.to]=dist[e.from]+e.weight;changed=true;
        emit('edge',{id:e.id,tone:'relaxed'},'A reachable cheaper route improves the destination.',4,'এই এজ দিয়ে কম খরচের পথ পাওয়া গেছে।');
        label(e.to,dist[e.to],'Updates are visible immediately within this same pass.',4);
      }
    }
    if(!changed){emit('note',{},'No edge improved, so every later identical scan would also do nothing.',5);break;}
  }
  for(const e of edges)if(Number.isFinite(dist[e.from])&&dist[e.from]+e.weight<dist[e.to]){
    affected[e.to]=true;emit('edge',{id:e.id,tone:'error'},'A reachable improvement after V-1 passes signals a negative cycle.',6,'আরও দূরত্ব কমছে, তাই পৌঁছানো যায় এমন নেগেটিভ সাইকেল আছে।');
  }
  for(let pass=0;pass<6;pass++)for(const e of edges)if(affected[e.from])affected[e.to]=true;
  const result=dist.map((d,u)=>affected[u]?'-INF':Number.isFinite(d)?String(d):'INF');
  for(let u=0;u<6;u++)label(u,result[u],affected[u]?'A reachable negative cycle can reduce this cost without bound.':'This vertex is unaffected by reachable negative cycles.',8);
  list('dist',result,'Finite distances are meaningful only outside the affected set.',8);
  emit('done',{vars:{negativeCycle:Number(affected.some(Boolean))}},'Only vertices downstream from a reachable negative cycle lose finite shortest distances.',8,'নেগেটিভ সাইকেল থেকে যাওয়া যায় এমন নোডের জন্য finite শর্টেস্ট পাথ নেই।');

  return {init:{nodes,edges,directed},steps};
}
