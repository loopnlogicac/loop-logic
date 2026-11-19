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

  const key=names.map(()=>Infinity),used=names.map(()=>false),chosen=[];
  let total=0,count=0;key[s]=0;push(0,s,-1);
  while(pq.length){
    const [value,u,parent]=pq.shift();showpq(2);
    if(used[u]||value!==key[u]){emit('note',{},'This entry is old or its vertex already joined the tree.',3);continue;}
    used[u]=true;total+=value;count++;
    emit('visit',{id:u,tone:'tree'},'The cheapest edge across the current cut safely grows the tree.',4,'ট্রির বাইরে যাওয়া সবচেয়ে হালকা এজটা নাও।');
    if(parent!==-1){const e=edges.find(e=>(e.from===u&&e.to===parent)||(e.to===u&&e.from===parent));chosen.push(e.id);emit('edge',{id:e.id,tone:'tree'},'Accept this parent edge; it connects one new vertex without a cycle.',4);}
    for(const [v,w,e] of adj[u]){
      if(used[v]){emit('note',{},'Both ends are already in the tree; this edge cannot add a new vertex.',5);continue;}
      emit('edge',{id:e,tone:'considered'},`Compare edge weight ${w} with the current key for ${names[v]}.`,5);
      if(w<key[v]){key[v]=w;push(w,v,u);label(v,w,'Prim stores one edge weight, not a source-to-vertex distance.',6);showpq(6);}
    }
  }
  // Reapply accepted tones after candidate comparisons.
  for(const id of chosen)emit('edge',{id,tone:'tree'},'This edge belongs to the final tree of the start component.',7);
  list('tree',chosen,'Accepted edges connect exactly the reached vertices.',7);
  emit('done',{vars:{total,count,connected:Number(count===6)}},count===6?'Five safe edges give an MST of the connected graph.':'Only the start component was reached; this is not a spanning tree of all vertices.',7,'মোট নেওয়া নোড গুনে দেখো পুরো গ্রাফ যুক্ত কি না।');

  return {init:{nodes,edges,directed},steps};
}
