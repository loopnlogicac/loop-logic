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

  const colour=names.map(()=>-1),parent=names.map(()=>-1);let bipartite=true,cycle=false;
  for(let offset=0;offset<6;offset++){
    const root=(s+offset)%6;if(colour[root]!==-1)continue;
    const queue=[root];colour[root]=0;label(root,0,'Start a new disconnected component with either colour.',2);
    while(queue.length){
      const u=queue.shift();emit('visit',{id:u,tone:'current'},'Check every adjacent vertex against this vertex colour.',3);
      for(const [v,w,e] of adj[u]){
        if(colour[v]===-1){colour[v]=1-colour[u];parent[v]=u;queue.push(v);label(v,colour[v],'Adjacent vertices must receive opposite colours.',5);emit('edge',{id:e,tone:'tree'},'A newly discovered neighbour extends the BFS forest.',5);}
        else{
          if(v!==parent[u]){cycle=true;emit('note',{},'A visited non-parent neighbour reveals a cycle in this simple undirected graph.',6);}
          if(colour[v]===colour[u]){bipartite=false;emit('edge',{id:e,tone:'error'},'Equal colours at both endpoints contradict a bipartition.',7,'একই রঙের দুই নোডের মাঝে এজ আছে, তাই গ্রাফটা bipartite নয়।');}
          else emit('note',{},'These opposite colours satisfy this edge even if a cycle exists elsewhere.',7);
        }
      }
      list('queue',queue.map(u=>names[u]),'Continue until the entire component has been checked.',3);
    }
  }
  list('colours',colour,'An unsuccessful colouring is evidence of conflict, not a valid partition.',8);
  emit('done',{vars:{bipartite:Number(bipartite),cycle:Number(cycle)}},bipartite?'Every edge joins opposite colours.':'A same-colour edge proves an odd cycle exists.',8,'সব কম্পোনেন্ট দেখার পর রঙের শর্ত মিলিয়ে ফল পাওয়া গেছে।');

  return {init:{nodes,edges,directed},steps};
}
