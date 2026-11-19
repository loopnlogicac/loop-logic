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

  const sorted=edges.slice().sort((a,b)=>a.weight-b.weight||Number(a.id.slice(1))-Number(b.id.slice(1)));
  const parent=names.map((_,i)=>i),size=names.map(()=>1),chosen=[];let total=0;
  function find(u){if(parent[u]!==u)parent[u]=find(parent[u]);return parent[u];}
  list('sorted',sorted.map(e=>e.id+':'+e.weight),'Process lighter edges before heavier ones; ties retain listed order.',1);
  for(const e of sorted){
    let a=find(e.from),b=find(e.to);
    emit('edge',{id:e.id,tone:'considered'},'Compare the representatives of the two endpoint components.',4);
    if(a===b){emit('edge',{id:e.id,tone:'rejected'},'Both endpoints already have a path between them; this would close a cycle.',5,'দুই নোড একই কম্পোনেন্টে আছে, তাই এজ নিলে সাইকেল হবে।');continue;}
    if(size[a]<size[b]){const t=a;a=b;b=t;}
    parent[b]=a;size[a]+=size[b];chosen.push(e.id);total+=e.weight;
    emit('edge',{id:e.id,tone:'tree'},'This light edge joins two separate components safely.',6,'আলাদা দুই কম্পোনেন্টকে এই এজ দিয়ে জোড়া দাও।');
    list('representatives',names.map((_,u)=>find(u)),'Union changes connectivity; these parent links are not graph edges.',6);
  }
  list('tree',chosen,'A disconnected graph produces a minimum spanning forest.',7);
  emit('done',{vars:{total,components:6-chosen.length}},'Each accepted edge reduced the number of components by exactly one.',7,'প্রতিটি নেওয়া এজে কম্পোনেন্টের সংখ্যা এক কমেছে।');

  return {init:{nodes,edges,directed},steps};
}
