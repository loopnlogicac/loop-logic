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

  const dist=names.map((_,i)=>names.map((_,j)=>i===j?0:Infinity));
  const next=names.map(()=>names.map(()=>-1));
  for(const e of edges){dist[e.from][e.to]=e.weight;next[e.from][e.to]=e.to;}
  const cells=dist.map(row=>row.map(d=>Number.isFinite(d)?d:'INF'));
  for(let k=0;k<6;k++){
    emit('note',{vars:{k:names[k]}},'Allow one more intermediate vertex; keep k as the outer loop.',2,'এবার এই নোডকে পথের মাঝখানে ব্যবহার করা যাবে।');
    for(let i=0;i<6;i++)for(let j=0;j<6;j++){
      if(Number.isFinite(dist[i][k])&&Number.isFinite(dist[k][j])){
        emit('compare',{a:[i,k],b:[k,j]},`Try ${names[i]} -> ${names[k]} -> ${names[j]}.`,4);
        if(dist[i][k]+dist[k][j]<dist[i][j]){
          dist[i][j]=dist[i][k]+dist[k][j];next[i][j]=next[i][k];
          emit('set',{r:i,c:j,value:dist[i][j]},'The two existing subpaths give a cheaper route.',5,'দুই ছোট পথ জুড়ে কম দূরত্ব পাওয়া গেছে।');
        }else emit('note',{},'This intermediate vertex gives no strict improvement.',4);
      }
    }
  }
  const path=[];let u=s;
  if(u===5||next[u][5]!==-1){path.push(names[u]);while(u!==5){u=next[u][5];path.push(names[u]);}}
  list('path',path,'An empty path list means F cannot be reached from the selected start.',6);
  emit('done',{},'The matrix now allows every vertex as an intermediate; -1 next entries mean no route.',6,'সব নোডকে মাঝখানে নেওয়ার পর পুরো দূরত্বের টেবিল পাওয়া গেছে।');
  return {init:{rows:6,cols:6,cells,rowLabels:names,colLabels:names},steps};
}
