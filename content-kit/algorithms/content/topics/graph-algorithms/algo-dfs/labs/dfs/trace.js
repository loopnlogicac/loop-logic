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

  const discover=names.map(()=>0), finish=names.map(()=>0), comp=names.map(()=>-1), stack=[];
  let clock=0,components=0;
  function dfs(u,c,parent) {
    discover[u]=++clock;comp[u]=c;stack.push(names[u]);
    label(u,discover[u]+'/-','Discovery opens a new active DFS interval.',4);
    emit('visit',{id:u,tone:'current'},'Keep this call active until its descendants finish.',4);
    list('stack',stack,'The stack is the current root-to-vertex path.',4);
    for(const [v,w,e] of adj[u]) {
      if(!discover[v]) {
        emit('edge',{id:e,tone:'tree'},`${names[v]} is white, so recurse before the next neighbour.`,6,'নতুন নোডে আগে ঢোকো, তারপর বাকি এজ দেখো।');dfs(v,c,u);
      } else if(v===parent) emit('note',{},'The reverse tree arc leads to the parent; it is not a new cycle.',6);
      else emit('note',{},finish[v]?'This neighbour has already returned.':'An active non-parent ancestor reveals an undirected cycle.',6);
    }
    finish[u]=++clock;stack.pop();
    label(u,discover[u]+'/'+finish[u],'Finishing closes this vertex interval after every descendant.',7);
    emit('visit',{id:u,tone:'done'},'Return to the caller because no neighbour remains.',7);
    list('stack',stack,'The completed call leaves the active path.',7);
  }
  for(let offset=0;offset<6;offset++) {
    const root=(s+offset)%6;
    if(!discover[root]) {dfs(root,components,-1);components++;}
  }
  list('components',comp,'A new DFS root starts a new undirected component.',8);
  emit('done',{vars:{components}},'Each vertex now has a unique discovery and finish time.',8,'সব নোডের ঢোকার আর বের হওয়ার সময় পাওয়া গেছে।');

  return {init:{nodes,edges,directed},steps};
}
