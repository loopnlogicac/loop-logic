// BFS on a fixed 8-vertex undirected graph. Pure and deterministic.
function trace(input) {
  const names = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const pos = [[10, 50], [32, 22], [32, 78], [55, 22], [55, 78], [76, 30], [76, 70], [94, 50]];
  const pairs = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [3, 5], [4, 6], [5, 7], [6, 7], [3, 4]];
  const nodes = names.map((label, id) => ({ id, label, x: pos[id][0], y: pos[id][1] }));
  const edges = pairs.map(([from, to], k) => ({ id: 'e' + k, from, to }));
  const adj = names.map(() => []);
  pairs.forEach(([a, b], k) => { adj[a].push([b, 'e' + k]); adj[b].push([a, 'e' + k]); });
  adj.forEach((list) => list.sort((x, y) => x[0] - y[0]));

  const s = input.start;
  const steps = [];
  const dist = names.map(() => -1);
  const queue = [s];
  const order = [];
  dist[s] = 0;
  steps.push({ op: 'visit', id: s, tone: 'frontier', line: 1, note: { en: `Start at ${names[s]}: distance 0, put it in the queue.`, bn: `${names[s]} থেকে শুরু: দূরত্ব ০, কিউতে রাখো।` } });
  steps.push({ op: 'label', id: s, text: '0', line: 1, note: { en: `dist[${names[s]}] = 0` } });
  steps.push({ op: 'list', name: 'queue', items: queue.map((v) => names[v]), line: 1, note: { en: 'The queue holds vertices waiting to be explored.' } });

  while (queue.length) {
    const u = queue.shift();
    order.push(names[u]);
    steps.push({ op: 'list', name: 'queue', items: queue.map((v) => names[v]), line: 3, note: { en: `Take ${names[u]} from the front of the queue.`, bn: `কিউয়ের সামনে থেকে ${names[u]} নাও।` }, vars: { u: names[u] } });
    steps.push({ op: 'visit', id: u, tone: 'current', line: 3, note: { en: `Explore the neighbours of ${names[u]}.` } });
    for (const [v, e] of adj[u]) {
      if (dist[v] === -1) {
        dist[v] = dist[u] + 1;
        queue.push(v);
        steps.push({ op: 'edge', id: e, tone: 'tree', line: 6, note: { en: `${names[v]} is new: distance ${dist[v]}.`, bn: `${names[v]} নতুন: দূরত্ব ${dist[v]}।` } });
        steps.push({ op: 'visit', id: v, tone: 'frontier', line: 6, note: { en: `Mark ${names[v]} visited.` } });
        steps.push({ op: 'label', id: v, text: String(dist[v]), line: 6, note: { en: `dist[${names[v]}] = ${dist[v]}` } });
        steps.push({ op: 'list', name: 'queue', items: queue.map((x) => names[x]), line: 7, note: { en: `Add ${names[v]} to the back of the queue.` } });
      } else {
        steps.push({ op: 'edge', id: e, tone: 'considered', line: 5, note: { en: `${names[v]} was already visited, skip it.` } });
      }
    }
    steps.push({ op: 'visit', id: u, tone: 'done', line: 2, note: { en: `${names[u]} is finished.` } });
    steps.push({ op: 'list', name: 'order', items: order.slice(), line: 2, note: { en: `Visit order so far: ${order.join(', ')}.` } });
  }
  steps.push({ op: 'done', note: { en: 'Every vertex reachable from the start has its shortest distance in edges.' } });
  return { init: { nodes, edges, directed: false }, steps };
}
