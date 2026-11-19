// Loop & Logic — lab (visualiser/simulator) format 1.1: the state model.
// Pure JavaScript with no Node imports: the checker (labs.mjs) and the site's lab player
// in the browser both use this file, so a trace that passes the checker plays the same on the site.
// Spec: content-kit/LAB_FORMAT.md

export const LAB_KINDS = ['array', 'heap', 'linked-list', 'stack', 'queue', 'tree', 'graph', 'grid', 'hash-table', 'ml'];
export const TONES = ['active', 'compare', 'sorted', 'found', 'pivot', 'min', 'max', 'discarded', 'window', 'visited', 'current', 'frontier', 'done', 'path', 'considered', 'tree', 'rejected', 'relaxed', 'error'];
const MAX_STEPS = 3000;
export const FORBIDDEN = /\b(require|import|process|globalThis|Function|eval|fetch|XMLHttpRequest|setTimeout|setInterval|setImmediate|queueMicrotask|Date|(?<!['"])window(?!['"])|document|Atomics|SharedArrayBuffer|WebAssembly)\b|Math\.random/;

const isInt = (v) => Number.isInteger(v);
const isId = (v) => (typeof v === 'string' && /^[A-Za-z0-9_-]{1,24}$/.test(v)) || isInt(v);
const isVal = (v) => (typeof v === 'number' && Number.isFinite(v)) || (typeof v === 'string' && v.length <= 24) || v === null;
const clone = (v) => JSON.parse(JSON.stringify(v));

class LabError extends Error {}
const fail = (msg) => { throw new LabError(msg); };
const need = (cond, msg) => { if (!cond) fail(msg); };
const tone = (t) => need(TONES.includes(t), `tone "${t}" is not one of ${TONES.join(', ')}`);

// ── reducers: init validation + op application ──────────────────────────────
// Every state also carries marks (id → tone), pointers (name → id/index), vars and lists.
const common = (s) => { s.marks ??= {}; s.pointers ??= {}; s.vars ??= {}; s.lists ??= {}; return s; };

function markOps(s, step, validTarget) {
  if (step.op === 'mark') { need(Array.isArray(step.targets) && step.targets.length, 'mark needs targets[]'); tone(step.tone); for (const t of step.targets) { validTarget(t); s.marks[String(t)] = step.tone; } return true; }
  if (step.op === 'unmark') { need(Array.isArray(step.targets), 'unmark needs targets[]'); for (const t of step.targets) delete s.marks[String(t)]; return true; }
  if (step.op === 'clear-marks') { s.marks = {}; return true; }
  if (step.op === 'pointer') { need(typeof step.name === 'string' && step.name.length <= 12, 'pointer needs a short name'); if (step.target === null) delete s.pointers[step.name]; else { validTarget(step.target); s.pointers[step.name] = step.target; } return true; }
  if (step.op === 'list') { need(typeof step.name === 'string' && step.name.length <= 16, 'list needs a name'); need(Array.isArray(step.items) && step.items.length <= 64 && step.items.every(isVal), 'list items: up to 64 numbers/short strings'); s.lists[step.name] = clone(step.items); return true; }
  return false;
}

const REDUCERS = {
  array: {
    init(s) {
      need(Array.isArray(s.array) && s.array.length <= 64 && s.array.every(isVal), 'init.array: up to 64 values');
      return common({ array: clone(s.array), ranges: [], ...pick(s, ['pointers', 'vars', 'lists']) });
    },
    apply(s, st) {
      const idx = (i) => need(isInt(i) && i >= 0 && i < s.array.length, `index ${i} out of range 0..${s.array.length - 1}`);
      if (markOps(s, st, idx)) return;
      switch (st.op) {
        case 'compare': idx(st.i); idx(st.j); return;
        case 'swap': idx(st.i); idx(st.j); [s.array[st.i], s.array[st.j]] = [s.array[st.j], s.array[st.i]]; return;
        case 'set': idx(st.i); need(isVal(st.value), 'set needs value'); s.array[st.i] = st.value; return;
        case 'insert': need(isInt(st.i) && st.i >= 0 && st.i <= s.array.length && s.array.length < 64, 'insert index out of range'); need(isVal(st.value), 'insert needs value'); s.array.splice(st.i, 0, st.value); return;
        case 'remove': idx(st.i); s.array.splice(st.i, 1); return;
        case 'range': idx(st.from); idx(st.to); need(st.from <= st.to, 'range from > to'); tone(st.tone); s.ranges.push({ from: st.from, to: st.to, tone: st.tone }); return;
        case 'clear-ranges': s.ranges = []; return;
        default: fail(`unknown op "${st.op}" for array`);
      }
    },
  },
  'linked-list': {
    init(s) {
      need(Array.isArray(s.nodes) && s.nodes.length <= 40, 'init.nodes: up to 40 nodes');
      const st = common({ nodes: {}, next: {}, prev: {}, head: s.head ?? null, tail: s.tail ?? null, ...pick(s, ['pointers', 'vars', 'lists']) });
      for (const n of s.nodes) { need(isId(n.id) && isVal(n.value), 'node needs id and value'); need(!(String(n.id) in st.nodes), `duplicate node ${n.id}`); st.nodes[String(n.id)] = n.value; }
      for (const f of ['next', 'prev']) for (const [a, b] of Object.entries(s[f] ?? {})) { need(a in st.nodes && (b === null || String(b) in st.nodes), `init.${f} refers to a missing node`); st[f][a] = b === null ? null : String(b); }
      for (const f of ['head', 'tail']) need(st[f] === null || String(st[f]) in st.nodes, `init.${f} is not a node`), st[f] = st[f] === null ? null : String(st[f]);
      return st;
    },
    apply(s, st) {
      const node = (id) => need(String(id) in s.nodes, `node ${id} does not exist`);
      if (markOps(s, st, node)) return;
      switch (st.op) {
        case 'create': need(isId(st.id) && !(String(st.id) in s.nodes) && Object.keys(s.nodes).length < 40, `create: bad or duplicate id ${st.id}`); need(isVal(st.value), 'create needs value'); s.nodes[String(st.id)] = st.value; return;
        case 'link': { node(st.from); need(st.to === null || String(st.to) in s.nodes, `link to missing node ${st.to}`); const f = st.field ?? 'next'; need(f === 'next' || f === 'prev', 'field must be next or prev'); s[f][String(st.from)] = st.to === null ? null : String(st.to); return; }
        case 'set-head': need(st.id === null || String(st.id) in s.nodes, 'set-head: missing node'); s.head = st.id === null ? null : String(st.id); return;
        case 'set-tail': need(st.id === null || String(st.id) in s.nodes, 'set-tail: missing node'); s.tail = st.id === null ? null : String(st.id); return;
        case 'set-value': node(st.id); need(isVal(st.value), 'set-value needs value'); s.nodes[String(st.id)] = st.value; return;
        case 'visit': node(st.id); return;
        case 'delete': {
          node(st.id); const id = String(st.id);
          need(s.head !== id && s.tail !== id, `delete ${id}: still head/tail — move them first`);
          for (const f of ['next', 'prev']) for (const [a, b] of Object.entries(s[f])) need(b !== id || a === id, `delete ${id}: node ${a}.${f} still points to it`);
          delete s.nodes[id]; delete s.next[id]; delete s.prev[id]; delete s.marks[id];
          for (const [k, v] of Object.entries(s.pointers)) if (String(v) === id) delete s.pointers[k];
          return;
        }
        default: fail(`unknown op "${st.op}" for linked-list`);
      }
    },
    final(s) { const order = []; let cur = s.head; const seen = new Set(); while (cur !== null && cur !== undefined && !seen.has(cur) && order.length < 64) { seen.add(cur); order.push(s.nodes[cur]); cur = s.next[cur] ?? null; } return { ...s, values: order }; },
  },
  stack: {
    init(s) { need(Array.isArray(s.items ?? []) && (s.items ?? []).every(isVal), 'init.items: values bottom→top'); need(s.capacity === undefined || (isInt(s.capacity) && s.capacity <= 32), 'capacity ≤ 32'); return common({ items: clone(s.items ?? []), capacity: s.capacity ?? null, ...pick(s, ['vars', 'lists']) }); },
    apply(s, st) {
      if (markOps(s, st, (i) => need(isInt(i) && i >= 0 && i < s.items.length, 'stack index out of range'))) return;
      switch (st.op) {
        case 'push': need(isVal(st.value), 'push needs value'); need(s.capacity === null || s.items.length < s.capacity, 'push on a full stack (show overflow with a note instead)'); s.items.push(st.value); return;
        case 'pop': need(s.items.length > 0, 'pop on an empty stack (show underflow with a note instead)'); s.items.pop(); return;
        case 'peek': need(s.items.length > 0, 'peek on an empty stack'); return;
        default: fail(`unknown op "${st.op}" for stack`);
      }
    },
  },
  queue: {
    init(s) { need(Array.isArray(s.items ?? []) && (s.items ?? []).every(isVal), 'init.items: values front→rear'); need(s.capacity === undefined || (isInt(s.capacity) && s.capacity <= 32), 'capacity ≤ 32'); return common({ items: clone(s.items ?? []), capacity: s.capacity ?? null, ...pick(s, ['vars', 'lists']) }); },
    apply(s, st) {
      if (markOps(s, st, (i) => need(isInt(i) && i >= 0 && i < s.items.length, 'queue index out of range'))) return;
      switch (st.op) {
        case 'enqueue': need(isVal(st.value), 'enqueue needs value'); need(s.capacity === null || s.items.length < s.capacity, 'enqueue on a full queue'); s.items.push(st.value); return;
        case 'dequeue': need(s.items.length > 0, 'dequeue on an empty queue'); s.items.shift(); return;
        case 'enqueue-front': need(isVal(st.value), 'needs value'); need(s.capacity === null || s.items.length < s.capacity, 'full'); s.items.unshift(st.value); return;
        case 'dequeue-rear': need(s.items.length > 0, 'empty'); s.items.pop(); return;
        case 'peek': need(s.items.length > 0, 'peek on an empty queue'); return;
        default: fail(`unknown op "${st.op}" for queue`);
      }
    },
  },
  tree: {
    init(s) {
      need(Array.isArray(s.nodes ?? []) && (s.nodes ?? []).length <= 63, 'init.nodes: up to 63');
      const t = common({ nodes: {}, left: {}, right: {}, children: {}, root: null, ...pick(s, ['pointers', 'vars', 'lists']) });
      t.multiway = Boolean(s.multiway);
      for (const n of s.nodes ?? []) { need(isId(n.id) && isVal(n.value), 'node needs id and value'); t.nodes[String(n.id)] = n.value; }
      for (const f of ['left', 'right']) for (const [a, b] of Object.entries(s[f] ?? {})) { need(a in t.nodes && (b === null || String(b) in t.nodes), `init.${f} refers to a missing node`); t[f][a] = b === null ? null : String(b); }
      for (const [a, list] of Object.entries(s.children ?? {})) { need(a in t.nodes && Array.isArray(list) && list.every((c) => String(c) in t.nodes), 'init.children refers to a missing node'); t.children[a] = list.map(String); }
      need(s.root === undefined || s.root === null || String(s.root) in t.nodes, 'init.root is not a node');
      t.root = s.root === undefined || s.root === null ? null : String(s.root);
      return t;
    },
    apply(s, st) {
      const node = (id) => need(String(id) in s.nodes, `node ${id} does not exist`);
      if (markOps(s, st, node)) return;
      switch (st.op) {
        case 'create': need(isId(st.id) && !(String(st.id) in s.nodes) && Object.keys(s.nodes).length < 63, `create: bad or duplicate id ${st.id}`); need(isVal(st.value), 'create needs value'); s.nodes[String(st.id)] = st.value; return;
        case 'set-child': node(st.parent); need(st.side === 'left' || st.side === 'right', 'side must be left or right'); need(st.child === null || String(st.child) in s.nodes, 'set-child: missing child'); s[st.side][String(st.parent)] = st.child === null ? null : String(st.child); return;
        case 'add-child': node(st.parent); node(st.child); (s.children[String(st.parent)] ??= []).push(String(st.child)); return;
        case 'set-root': need(st.id === null || String(st.id) in s.nodes, 'set-root: missing node'); s.root = st.id === null ? null : String(st.id); return;
        case 'set-value': node(st.id); need(isVal(st.value), 'set-value needs value'); s.nodes[String(st.id)] = st.value; return;
        case 'visit': node(st.id); return;
        case 'compare': node(st.id); need(isVal(st.value), 'compare needs value'); return;
        case 'delete': {
          node(st.id); const id = String(st.id);
          need(s.root !== id, `delete ${id}: it is still the root`);
          for (const f of ['left', 'right']) for (const [a, b] of Object.entries(s[f])) need(b !== id, `delete ${id}: node ${a}.${f} still points to it`);
          for (const [a, list] of Object.entries(s.children)) need(!list.includes(id), `delete ${id}: still a child of ${a}`);
          delete s.nodes[id]; delete s.left[id]; delete s.right[id]; delete s.children[id]; delete s.marks[id];
          return;
        }
        default: fail(`unknown op "${st.op}" for tree`);
      }
    },
    final(s) {
      const inorder = []; const seen = new Set();
      const walk = (id) => { if (id === null || id === undefined || seen.has(id) || inorder.length > 70) return; seen.add(id); walk(s.left[id] ?? null); inorder.push(s.nodes[id]); walk(s.right[id] ?? null); };
      walk(s.root);
      const height = (id, d = 0) => (id === null || id === undefined || d > 70 ? 0 : 1 + Math.max(height(s.left[id] ?? null, d + 1), height(s.right[id] ?? null, d + 1)));
      return { ...s, inorder, height: height(s.root), size: Object.keys(s.nodes).length };
    },
  },
  graph: {
    init(s) {
      need(Array.isArray(s.nodes) && s.nodes.length >= 1 && s.nodes.length <= 26, 'init.nodes: 1–26 nodes');
      const g = common({ nodes: {}, edges: {}, directed: Boolean(s.directed), nodeTones: {}, edgeTones: {}, labels: {}, ...pick(s, ['vars', 'lists']) });
      for (const n of s.nodes) { need(isId(n.id), 'node needs id'); need(typeof n.label === 'string' && n.label.length <= 8, 'node label ≤ 8 chars'); need(typeof n.x === 'number' && typeof n.y === 'number' && n.x >= 0 && n.x <= 100 && n.y >= 0 && n.y <= 100, `node ${n.id}: x, y must be 0–100`); g.nodes[String(n.id)] = { label: n.label, x: n.x, y: n.y }; }
      need(Array.isArray(s.edges) && s.edges.length <= 60, 'init.edges: up to 60');
      for (const e of s.edges) { need(isId(e.id) && String(e.from) in g.nodes && String(e.to) in g.nodes, `edge ${e.id}: bad id or endpoint`); need(e.weight === undefined || typeof e.weight === 'number', 'edge weight must be a number'); g.edges[String(e.id)] = { from: String(e.from), to: String(e.to), weight: e.weight ?? null }; }
      return g;
    },
    apply(s, st) {
      const node = (id) => need(String(id) in s.nodes, `node ${id} does not exist`);
      const edge = (id) => need(String(id) in s.edges, `edge ${id} does not exist`);
      if (st.op === 'mark' || st.op === 'unmark' || st.op === 'clear-marks' || st.op === 'pointer' || st.op === 'list') { markOps(s, st, node); return; }
      switch (st.op) {
        case 'visit': node(st.id); tone(st.tone ?? 'visited'); s.nodeTones[String(st.id)] = st.tone ?? 'visited'; return;
        case 'edge': edge(st.id); tone(st.tone); s.edgeTones[String(st.id)] = st.tone; return;
        case 'label': node(st.id); need(st.text === null || (typeof st.text === 'string' && st.text.length <= 8) || typeof st.text === 'number', 'label text ≤ 8 chars'); if (st.text === null) delete s.labels[String(st.id)]; else s.labels[String(st.id)] = String(st.text); return;
        case 'compare': node(st.a); node(st.b); return;
        default: fail(`unknown op "${st.op}" for graph`);
      }
    },
  },
  grid: {
    init(s) {
      need(isInt(s.rows) && isInt(s.cols) && s.rows >= 1 && s.cols >= 1 && s.rows <= 24 && s.cols <= 24, 'init.rows/cols: 1–24');
      const cells = s.cells ?? Array.from({ length: s.rows }, () => Array(s.cols).fill(null));
      need(Array.isArray(cells) && cells.length === s.rows && cells.every((r) => Array.isArray(r) && r.length === s.cols && r.every(isVal)), 'init.cells must be rows × cols of values');
      for (const f of ['rowLabels', 'colLabels']) need(s[f] === undefined || (Array.isArray(s[f]) && s[f].length === (f === 'rowLabels' ? s.rows : s.cols) && s[f].every(isVal)), `${f} length must match`);
      return common({ rows: s.rows, cols: s.cols, cells: clone(cells), rowLabels: s.rowLabels ?? null, colLabels: s.colLabels ?? null, arrows: {}, ...pick(s, ['vars', 'lists']) });
    },
    apply(s, st) {
      const cell = (rc) => need(Array.isArray(rc) && isInt(rc[0]) && isInt(rc[1]) && rc[0] >= 0 && rc[0] < s.rows && rc[1] >= 0 && rc[1] < s.cols, `cell ${JSON.stringify(rc)} out of range`);
      if (st.op === 'mark' || st.op === 'unmark') { need(Array.isArray(st.targets), `${st.op} needs targets[] of [r, c]`); for (const t of st.targets) cell(t); }
      if (st.op === 'pointer' && st.target !== null) cell(st.target);
      if (st.op === 'mark') { tone(st.tone); for (const t of st.targets) s.marks[t.join(',')] = st.tone; return; }
      if (st.op === 'unmark') { for (const t of st.targets) delete s.marks[t.join(',')]; return; }
      if (st.op === 'clear-marks') { s.marks = {}; return; }
      if (st.op === 'pointer') { need(typeof st.name === 'string' && st.name.length <= 12, 'pointer needs a short name'); if (st.target === null) delete s.pointers[st.name]; else s.pointers[st.name] = st.target; return; }
      if (st.op === 'list') { markOps(s, st, () => {}); return; }
      switch (st.op) {
        case 'set': cell([st.r, st.c]); need(isVal(st.value), 'set needs value'); s.cells[st.r][st.c] = st.value; return;
        case 'compare': cell(st.a); cell(st.b); return;
        case 'arrow': cell([st.r, st.c]); need(['up', 'left', 'diag', null].includes(st.dir), 'arrow dir: up | left | diag | null'); if (st.dir === null) delete s.arrows[`${st.r},${st.c}`]; else s.arrows[`${st.r},${st.c}`] = st.dir; return;
        default: fail(`unknown op "${st.op}" for grid`);
      }
    },
  },
  'hash-table': {
    init(s) {
      need(isInt(s.size) && s.size >= 2 && s.size <= 31, 'init.size: 2–31');
      need(['chaining', 'linear', 'quadratic', 'double'].includes(s.method), 'init.method: chaining | linear | quadratic | double');
      const buckets = s.buckets ?? Array.from({ length: s.size }, () => (s.method === 'chaining' ? [] : null));
      need(Array.isArray(buckets) && buckets.length === s.size, 'init.buckets length must equal size');
      return common({ size: s.size, method: s.method, buckets: clone(buckets), ...pick(s, ['vars', 'lists']) });
    },
    apply(s, st) {
      const b = (i) => need(isInt(i) && i >= 0 && i < s.size, `bucket ${i} out of range`);
      if (markOps(s, st, b)) return;
      switch (st.op) {
        case 'hash': b(st.index); need(isVal(st.key), 'hash needs key'); need(st.formula === undefined || (typeof st.formula === 'string' && st.formula.length <= 60), 'formula ≤ 60 chars'); return;
        case 'probe': b(st.index); return;
        case 'insert': b(st.index); need(isVal(st.key) && st.key !== null, 'insert needs key');
          if (s.method === 'chaining') s.buckets[st.index].push(st.key); else { need(s.buckets[st.index] === null || s.buckets[st.index] === '†', `insert into occupied slot ${st.index} (probe first)`); s.buckets[st.index] = st.key; }
          return;
        case 'remove': b(st.index);
          if (s.method === 'chaining') { const k = s.buckets[st.index].indexOf(st.key); need(k >= 0, `key ${st.key} not in bucket ${st.index}`); s.buckets[st.index].splice(k, 1); } else { need(s.buckets[st.index] === st.key, `slot ${st.index} does not hold ${st.key}`); s.buckets[st.index] = '†'; }
          return;
        default: fail(`unknown op "${st.op}" for hash-table`);
      }
    },
  },
};
REDUCERS.heap = REDUCERS.array;

// ── ml: a lab made of panels (plot, chart, tree, tables, network) ───────────
// Used by machine-learning labs and by quiz/practice figures. Spec: LAB_FORMAT.md §3, "ml".
const SHAPES = ['line', 'segment', 'circle', 'rect', 'curve', 'marker', 'arrow'];
const SYMBOLS = ['star', 'cross', 'diamond', 'plus', 'square'];
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const isXY = (p) => Array.isArray(p) && p.length === 2 && isNum(p[0]) && isNum(p[1]);
const isRange = (r) => Array.isArray(r) && r.length === 2 && isNum(r[0]) && isNum(r[1]) && r[0] < r[1];
const shortText = (v, n = 24) => v === undefined || (typeof v === 'string' && v.length <= n);
const MAX_POINTS = 150, MAX_SHAPES = 80, MAX_REGION_OPS = 30, MAX_SERIES = 6, MAX_SERIES_POINTS = 300, MAX_TABLES = 3;

function checkShape(sh) {
  need(sh && SHAPES.includes(sh.type), `shape type must be one of ${SHAPES.join(', ')}`);
  if (sh.tone !== undefined) tone(sh.tone);
  need(sh.dash === undefined || typeof sh.dash === 'boolean', 'dash must be true or false');
  need(shortText(sh.label), 'shape label ≤ 24 characters');
  switch (sh.type) {
    case 'line': need(Array.isArray(sh.w) && sh.w.length === 2 && sh.w.every(isNum) && (sh.w[0] !== 0 || sh.w[1] !== 0) && isNum(sh.b), 'line needs w: [w1, w2] (not both 0) and b, meaning w1·x + w2·y + b = 0'); break;
    case 'segment': case 'arrow': need(isXY(sh.from) && isXY(sh.to), `${sh.type} needs from: [x, y] and to: [x, y]`); break;
    case 'circle': need(isXY(sh.center) && isNum(sh.r) && sh.r > 0, 'circle needs center: [x, y] and r > 0'); break;
    case 'rect': need(isXY(sh.from) && isXY(sh.to), 'rect needs from: [x, y] and to: [x, y]'); need(sh.cls === undefined || sh.cls === null || (isInt(sh.cls) && sh.cls >= 0 && sh.cls <= 5), 'rect cls: a class id 0–5 or null'); break;
    case 'curve': need(Array.isArray(sh.points) && sh.points.length >= 2 && sh.points.length <= 200 && sh.points.every(isXY), 'curve needs 2–200 points [[x, y], …]'); break;
    case 'marker': need(isXY(sh.at) && SYMBOLS.includes(sh.symbol ?? 'star'), `marker needs at: [x, y] and symbol: ${SYMBOLS.join(' | ')}`); need(sh.cls === undefined || sh.cls === null || (isInt(sh.cls) && sh.cls >= 0 && sh.cls <= 5), 'marker cls: a class id 0–5 or null'); break;
  }
  return clone(sh);
}

function checkRegions(r) {
  need(r && isInt(r.rows) && isInt(r.cols) && r.rows >= 2 && r.cols >= 2 && r.rows <= 50 && r.cols <= 50, 'regions: rows and cols 2–50');
  const mode = r.mode ?? 'class';
  need(mode === 'class' || mode === 'value', 'regions mode: class | value');
  const okCell = mode === 'class' ? (v) => v === null || (isInt(v) && v >= 0 && v <= 5) : (v) => v === null || (isNum(v) && v >= 0 && v <= 1);
  need(Array.isArray(r.cells) && r.cells.length === r.rows && r.cells.every((row) => Array.isArray(row) && row.length === r.cols && row.every(okCell)), `regions.cells: rows × cols of ${mode === 'class' ? 'class ids 0–5 (or null)' : 'values 0–1'}; row 0 is the top (largest y)`);
  return { rows: r.rows, cols: r.cols, mode, cells: clone(r.cells) };
}

function point(p) {
  need(p && isId(p.id) && isNum(p.x) && isNum(p.y), 'point needs id, x, y');
  need(p.cls === undefined || p.cls === null || (isInt(p.cls) && p.cls >= 0 && p.cls <= 5), `point ${p.id}: cls must be a class id 0–5 or null`);
  need(p.size === undefined || (isNum(p.size) && p.size > 0 && p.size <= 10), `point ${p.id}: size 0–10 (1 = normal)`);
  need(shortText(p.label, 12), `point ${p.id}: label ≤ 12 characters`);
  return { x: p.x, y: p.y, cls: p.cls ?? null, size: p.size ?? 1, ...(p.label ? { label: p.label } : {}) };
}

function initPlot(p) {
  need(isRange(p.xRange) && isRange(p.yRange), 'plot needs xRange and yRange: [min, max]');
  need(shortText(p.xLabel, 30) && shortText(p.yLabel, 30), 'xLabel / yLabel ≤ 30 characters');
  const classes = p.classes ?? [];
  need(Array.isArray(classes) && classes.length <= 6 && classes.every((c, i) => c && c.id === i && typeof c.label === 'string' && c.label.length >= 1 && c.label.length <= 16), 'plot.classes: up to 6 { id: 0, 1, 2…, label ≤ 16 }');
  const s = { xRange: [...p.xRange], yRange: [...p.yRange], xLabel: p.xLabel ?? null, yLabel: p.yLabel ?? null, classes: clone(classes), points: {}, shapes: {}, regions: null, marks: {}, regionOps: 0 };
  need(Array.isArray(p.points ?? []) && (p.points ?? []).length <= MAX_POINTS, `plot.points: up to ${MAX_POINTS}`);
  for (const q of p.points ?? []) { need(!(String(q.id) in s.points), `duplicate point ${q.id}`); s.points[String(q.id)] = point(q); }
  for (const [id, sh] of Object.entries(p.shapes ?? {})) { need(isId(id), `shape id ${id}`); s.shapes[id] = checkShape(sh); }
  need(Object.keys(s.shapes).length <= MAX_SHAPES, `plot.shapes: up to ${MAX_SHAPES}`);
  if (p.regions) s.regions = checkRegions(p.regions);
  for (const q of Object.values(s.points)) need(q.cls === null || !classes.length || q.cls < classes.length, `point class ${q.cls} has no plot.classes entry`);
  return s;
}

function initChart(c) {
  need(shortText(c.xLabel, 30) && shortText(c.yLabel, 30), 'chart xLabel / yLabel ≤ 30 characters');
  need(c.xRange === undefined || isRange(c.xRange), 'chart.xRange: [min, max]');
  need(c.yRange === undefined || isRange(c.yRange), 'chart.yRange: [min, max]');
  const s = { xLabel: c.xLabel ?? null, yLabel: c.yLabel ?? null, xRange: c.xRange ?? null, yRange: c.yRange ?? null, series: {}, vlines: [] };
  for (const sr of c.series ?? []) addSeries(s, sr);
  for (const v of c.vlines ?? []) { need(isNum(v.x) && shortText(v.label), 'vline needs x and an optional label'); s.vlines.push({ x: v.x, label: v.label ?? null }); }
  return s;
}
function addSeries(s, sr) {
  need(sr && isId(sr.id) && typeof sr.label === 'string' && sr.label.length >= 1 && sr.label.length <= 24, 'series needs id and label ≤ 24');
  need(['line', 'bar', 'scatter'].includes(sr.type ?? 'line'), 'series type: line | bar | scatter');
  if (sr.tone !== undefined) tone(sr.tone);
  const pts = sr.points ?? (s.series[String(sr.id)]?.points ?? []);
  need(Array.isArray(pts) && pts.length <= MAX_SERIES_POINTS && pts.every((p) => Array.isArray(p) && p.length === 2 && (isNum(p[0]) || (typeof p[0] === 'string' && p[0].length <= 16)) && isNum(p[1])), `series points: up to ${MAX_SERIES_POINTS} [x, y] (x may be a short category name for bars)`);
  s.series[String(sr.id)] = { label: sr.label, type: sr.type ?? 'line', tone: sr.tone ?? null, points: clone(pts) };
  need(Object.keys(s.series).length <= MAX_SERIES, `chart: up to ${MAX_SERIES} series`);
}

const ML_PANELS = ['plot', 'chart', 'tree', 'tables', 'network'];
function initMl(s) {
  need(s && typeof s === 'object', 'init must be an object of panels');
  const unknown = Object.keys(s).filter((k) => !ML_PANELS.includes(k) && !['vars', 'lists'].includes(k));
  need(!unknown.length, `unknown panel(s) ${unknown.join(', ')} — use ${ML_PANELS.join(', ')}`);
  need(ML_PANELS.some((k) => s[k]), `init needs at least one panel: ${ML_PANELS.join(', ')}`);
  const st = common({ ...pick(s, ['vars', 'lists']) });
  if (s.plot) st.plot = initPlot(s.plot);
  if (s.chart) st.chart = initChart(s.chart);
  if (s.tree) st.tree = REDUCERS.tree.init(s.tree);
  if (s.tables) {
    need(typeof s.tables === 'object' && Object.keys(s.tables).length >= 1 && Object.keys(s.tables).length <= MAX_TABLES, `tables: 1–${MAX_TABLES} named grids`);
    st.tables = {};
    for (const [name, g] of Object.entries(s.tables)) { need(/^[a-z][a-zA-Z0-9]{0,15}$/.test(name), `table name "${name}": camelCase ≤ 16`); st.tables[name] = REDUCERS.grid.init(g); }
  }
  if (s.network) { st.network = REDUCERS.graph.init(s.network); st.network.weights = Object.fromEntries(Object.entries(st.network.edges).map(([id, e]) => [id, e.weight])); }
  return st;
}

function applyMl(s, st) {
  const op = st.op;
  if (op === 'list') { markOps(s, st, () => {}); return; }
  const panel = (name) => { need(s[name], `op ${op} needs the ${name} panel in init`); return s[name]; };
  if (op.startsWith('point') || op.startsWith('shape') || op.startsWith('regions')) {
    const p = panel('plot');
    const pt = (id) => need(String(id) in p.points, `point ${id} does not exist`);
    const clsOk = (q) => { need(q.cls === null || !p.classes.length || q.cls < p.classes.length, `class ${q.cls} is not in plot.classes`); return q; };
    switch (op) {
      case 'point-add': need(!(String(st.id) in p.points), `point ${st.id} already exists`); need(Object.keys(p.points).length < MAX_POINTS, `up to ${MAX_POINTS} points`); p.points[String(st.id)] = clsOk(point(st)); return;
      case 'point-set': { pt(st.id); const q = p.points[String(st.id)]; const next = point({ id: st.id, x: st.x ?? q.x, y: st.y ?? q.y, cls: st.cls === undefined ? q.cls : st.cls, size: st.size ?? q.size, label: st.label ?? q.label }); p.points[String(st.id)] = clsOk(next); return; }
      case 'point-remove': pt(st.id); delete p.points[String(st.id)]; delete p.marks[String(st.id)]; return;
      case 'point-mark': need(Array.isArray(st.targets) && st.targets.length, 'point-mark needs targets[]'); tone(st.tone); for (const t of st.targets) { pt(t); p.marks[String(t)] = st.tone; } return;
      case 'point-unmark': need(Array.isArray(st.targets), 'point-unmark needs targets[]'); for (const t of st.targets) delete p.marks[String(t)]; return;
      case 'point-clear-marks': p.marks = {}; return;
      case 'shape': need(isId(st.id), 'shape needs an id'); { const { op: _o, note: _n, line: _l, vars: _v, id, ...sh } = st; p.shapes[String(id)] = checkShape(sh); } need(Object.keys(p.shapes).length <= MAX_SHAPES, `up to ${MAX_SHAPES} shapes`); return;
      case 'shape-remove': need(String(st.id) in p.shapes, `shape ${st.id} does not exist`); delete p.shapes[String(st.id)]; return;
      case 'shapes-clear': p.shapes = {}; return;
      case 'regions': need(++p.regionOps <= MAX_REGION_OPS, `at most ${MAX_REGION_OPS} regions steps per trace (they are large)`); p.regions = checkRegions(st); return;
      case 'regions-clear': p.regions = null; return;
      default: fail(`unknown op "${op}" for an ml plot`);
    }
  }
  if (op === 'series' || op === 'series-add' || op === 'series-set' || op === 'vline' || op === 'vlines-clear') {
    const c = panel('chart');
    switch (op) {
      case 'series': addSeries(c, st); return;
      case 'series-add': { need(String(st.id) in c.series, `series ${st.id} does not exist (create it with op "series")`); const sr = c.series[String(st.id)]; need((isNum(st.x) || (typeof st.x === 'string' && st.x.length <= 16)) && isNum(st.y), 'series-add needs x and y'); need(sr.points.length < MAX_SERIES_POINTS, `up to ${MAX_SERIES_POINTS} points per series`); sr.points.push([st.x, st.y]); return; }
      case 'series-set': need(String(st.id) in c.series, `series ${st.id} does not exist`); addSeries(c, { ...c.series[String(st.id)], id: st.id, points: st.points }); return;
      case 'vline': need(isNum(st.x) && shortText(st.label), 'vline needs x and an optional label ≤ 24'); c.vlines.push({ x: st.x, label: st.label ?? null }); return;
      case 'vlines-clear': c.vlines = []; return;
    }
  }
  if (op.startsWith('tree-')) { REDUCERS.tree.apply(panel('tree'), { ...st, op: op.slice(5) }); return; }
  if (op.startsWith('table-')) {
    const ts = panel('tables');
    need(typeof st.table === 'string' && st.table in ts, `${op} needs table: one of ${Object.keys(ts).join(', ')}`);
    REDUCERS.grid.apply(ts[st.table], { ...st, op: op.slice(6) });
    return;
  }
  if (op.startsWith('net-')) {
    const n = panel('network');
    if (op === 'net-weight') { need(String(st.id) in n.edges, `edge ${st.id} does not exist`); need(isNum(st.value), 'net-weight needs a number value'); n.weights[String(st.id)] = st.value; return; }
    REDUCERS.graph.apply(n, { ...st, op: op.slice(4) });
    return;
  }
  fail(`unknown op "${op}" for ml (see LAB_FORMAT.md, kind "ml")`);
}

function finalMl(s) {
  const r = { vars: s.vars, lists: s.lists };
  if (s.plot) { const { regionOps: _r, ...p } = s.plot; r.plot = p; }
  if (s.chart) r.chart = s.chart;
  if (s.tree) r.tree = REDUCERS.tree.final(s.tree);
  if (s.tables) r.tables = s.tables;
  if (s.network) r.network = s.network;
  return r;
}
REDUCERS.ml = { init: initMl, apply: applyMl, final: finalMl };

/** A static figure for a quiz question, practice problem or exam question: { panels, caption? }. Returns an error message or null. */
export function checkFigure(fig) {
  try {
    need(fig && typeof fig === 'object' && fig.panels && typeof fig.panels === 'object', 'figure needs panels: { plot | chart | tree | tables | network }');
    need(JSON.stringify(fig).length <= 40000, 'figure is too large (keep it under 40 KB)');
    need(fig.caption === undefined || (fig.caption && typeof fig.caption.en === 'string' && fig.caption.en.length <= 200), 'figure.caption: { en ≤ 200, bn }');
    initMl(fig.panels);
    return null;
  } catch (e) { if (e instanceof LabError) return e.message; throw e; }
}
function pick(o, keys) { const r = {}; for (const k of keys) if (o[k] !== undefined) r[k] = clone(o[k]); return r; }

// ── running a trace ─────────────────────────────────────────────────────────
/** Starting state for a lab of this kind (validates init). */
export function startState(kind, init) {
  const R = REDUCERS[kind];
  if (!R) fail(`unknown lab kind "${kind}"`);
  return R.init(init ?? {});
}

/** Apply one step to a state in place (validates the step). n is its index, total the number of steps. */
export function stepState(kind, s, st, { n = 0, total = 1, lines = 30 } = {}) {
  try {
    need(st && typeof st.op === 'string', 'each step needs op');
    need(st.note && typeof st.note.en === 'string' && st.note.en.trim().length > 0 && st.note.en.length <= 160, 'note.en: 1–160 characters');
    need(st.note.bn === undefined || (typeof st.note.bn === 'string' && st.note.bn.length <= 200), 'note.bn ≤ 200 characters');
    need(st.line === undefined || st.line === null || (isInt(st.line) && st.line >= 1 && st.line <= lines), `line must be 1–${lines}`);
    if (st.vars !== undefined) { need(st.vars && typeof st.vars === 'object' && Object.keys(st.vars).length <= 10 && Object.values(st.vars).every(isVal), 'vars: up to 10 simple values'); s.vars = { ...s.vars, ...st.vars }; }
    if (st.op === 'note') return s;
    if (st.op === 'done') { need(n === total - 1, 'done must be the last step'); return s; }
    REDUCERS[kind].apply(s, st);
    return s;
  } catch (e) {
    if (e instanceof LabError) throw new LabError(`step ${n + 1} (${st?.op}): ${e.message}`);
    throw e;
  }
}

/** The state as drawn and as checked (adds derived fields such as a linked list's values). */
export function viewState(kind, s) { const R = REDUCERS[kind]; return R.final ? R.final(s) : s; }

export function playTrace(kind, result, { lines }) {
  need(result && typeof result === 'object', 'trace(input) must return { init, steps }');
  need(Array.isArray(result.steps) && result.steps.length >= 1 && result.steps.length <= MAX_STEPS, `steps: 1–${MAX_STEPS}`);
  const s = startState(kind, result.init);
  const total = result.steps.length;
  result.steps.forEach((st, n) => stepState(kind, s, st, { n, total, lines }));
  need(result.steps.at(-1).op === 'done', 'the last step must be { op: "done" }');
  return viewState(kind, s);
}

export const cloneState = clone;

export function partialMatch(actual, expected, path = '') {
  if (expected === null || typeof expected !== 'object') return JSON.stringify(actual) === JSON.stringify(expected) ? null : `${path || 'state'} is ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`;
  if (Array.isArray(expected)) return JSON.stringify(actual) === JSON.stringify(expected) ? null : `${path} is ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`;
  if (!actual || typeof actual !== 'object') return `${path} missing`;
  for (const [k, v] of Object.entries(expected)) { const r = partialMatch(actual[k], v, path ? `${path}.${k}` : k); if (r) return r; }
  return null;
}

// ── inputs ──────────────────────────────────────────────────────────────────
const INPUT_TYPES = ['int-array', 'int', 'string', 'number', 'choice', 'points'];
export function checkInputSpec(inputs) {
  need(Array.isArray(inputs), 'inputs must be an array (empty = presets only)');
  need(inputs.length <= 6, 'at most 6 inputs');
  for (const f of inputs) {
    need(typeof f.name === 'string' && /^[a-z][a-zA-Z0-9]*$/.test(f.name), 'input name: camelCase');
    need(typeof f.label === 'string' && f.label.length <= 40, 'input label ≤ 40 chars');
    need(INPUT_TYPES.includes(f.type), `input type: ${INPUT_TYPES.join(' | ')}`);
    if (f.type === 'int' || f.type === 'int-array') need(isInt(f.min) && isInt(f.max) && f.min <= f.max, `${f.name}: min/max whole numbers`);
    if (f.type === 'int-array') need(isInt(f.minLength) && isInt(f.maxLength) && f.minLength >= 0 && f.maxLength <= 16 && f.minLength <= f.maxLength, `${f.name}: minLength/maxLength, at most 16`);
    if (f.type === 'string') need(isInt(f.maxLength) && f.maxLength >= 1 && f.maxLength <= 24 && (f.alphabet === undefined || (typeof f.alphabet === 'string' && f.alphabet.length >= 2)), `${f.name}: maxLength ≤ 24, optional alphabet`);
    if (f.type === 'number') need(isNum(f.min) && isNum(f.max) && f.min < f.max && isNum(f.step) && f.step > 0 && (f.max - f.min) / f.step <= 10000, `${f.name}: number needs min < max and step > 0 (a slider, at most 10 000 positions)`);
    if (f.type === 'choice') need(Array.isArray(f.options) && f.options.length >= 2 && f.options.length <= 8 && f.options.every((o) => typeof o === 'string' && o.length >= 1 && o.length <= 24) && new Set(f.options).size === f.options.length, `${f.name}: choice needs 2–8 different options ≤ 24 characters`);
    if (f.type === 'points') need(isInt(f.minLength) && isInt(f.maxLength) && f.minLength >= 0 && f.minLength <= f.maxLength && f.maxLength <= 60 && isInt(f.classes) && f.classes >= 0 && f.classes <= 6 && isRange(f.xRange) && isRange(f.yRange), `${f.name}: points needs minLength ≤ maxLength ≤ 60, classes 0–6 (0 = unlabelled) and xRange, yRange`);
  }
}

const onStep = (v, f) => Math.abs((v - f.min) / f.step - Math.round((v - f.min) / f.step)) < 1e-6;
export function validInput(inputs, input) {
  if (!inputs.length) return null;
  if (!input || typeof input !== 'object') return 'input must be an object';
  for (const f of inputs) {
    const v = input[f.name];
    if (f.type === 'int') { if (!isInt(v) || v < f.min || v > f.max) return `${f.name} must be a whole number ${f.min}–${f.max}`; }
    else if (f.type === 'int-array') { if (!Array.isArray(v) || v.length < f.minLength || v.length > f.maxLength || v.some((x) => !isInt(x) || x < f.min || x > f.max)) return `${f.name} must be ${f.minLength}–${f.maxLength} whole numbers ${f.min}–${f.max}`; }
    else if (f.type === 'number') { if (!isNum(v) || v < f.min - 1e-9 || v > f.max + 1e-9 || !onStep(v, f)) return `${f.name} must be a number ${f.min}–${f.max} in steps of ${f.step}`; }
    else if (f.type === 'choice') { if (!f.options.includes(v)) return `${f.name} must be one of ${f.options.join(', ')}`; }
    else if (f.type === 'points') {
      if (!Array.isArray(v) || v.length < f.minLength || v.length > f.maxLength) return `${f.name} must have ${f.minLength}–${f.maxLength} points`;
      for (const p of v) {
        if (!p || !isNum(p.x) || !isNum(p.y) || p.x < f.xRange[0] || p.x > f.xRange[1] || p.y < f.yRange[0] || p.y > f.yRange[1]) return `${f.name}: each point needs x in ${f.xRange} and y in ${f.yRange}`;
        if (f.classes > 0 ? !(isInt(p.cls) && p.cls >= 0 && p.cls < f.classes) : (p.cls !== undefined && p.cls !== null)) return `${f.name}: ${f.classes > 0 ? `each point needs cls 0–${f.classes - 1}` : 'points are unlabelled (no cls)'}`;
      }
    }
    else if (typeof v !== 'string' || v.length > f.maxLength || (f.alphabet && [...v].some((ch) => !f.alphabet.includes(ch)))) return `${f.name} must be a string of up to ${f.maxLength}${f.alphabet ? ` characters from "${f.alphabet}"` : ''}`;
  }
  return null;
}

/** Deterministic random inputs for fuzzing (no Math.random). */
export function* fuzzInputs(inputs, count = 25, seed = 12345) {
  let x = seed;
  const rnd = () => { x = (x * 1103515245 + 12345) & 0x7fffffff; return x / 0x7fffffff; };
  const int = (lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1));
  for (let n = 0; n < count; n++) {
    const input = {};
    for (const f of inputs) {
      if (f.type === 'int') input[f.name] = int(f.min, f.max);
      else if (f.type === 'int-array') input[f.name] = Array.from({ length: n === 0 ? f.minLength : n === 1 ? f.maxLength : int(f.minLength, f.maxLength) }, () => int(f.min, f.max));
      else if (f.type === 'number') { const k = Math.floor((f.max - f.min) / f.step + 1e-9); input[f.name] = Number((f.min + f.step * (n === 0 ? 0 : n === 1 ? k : int(0, k))).toFixed(10)); }
      else if (f.type === 'choice') input[f.name] = f.options[n < f.options.length ? n : int(0, f.options.length - 1)];
      else if (f.type === 'points') {
        const len = n === 0 ? f.minLength : n === 1 ? f.maxLength : int(f.minLength, f.maxLength);
        const coord = ([lo, hi]) => Math.round((lo + rnd() * (hi - lo)) * 10) / 10;
        input[f.name] = Array.from({ length: len }, () => ({ x: coord(f.xRange), y: coord(f.yRange), ...(f.classes > 0 ? { cls: int(0, f.classes - 1) } : {}) }));
      }
      else { const a = f.alphabet ?? 'abcdefghij'; input[f.name] = Array.from({ length: n === 0 ? 0 : int(0, f.maxLength) }, () => a[int(0, a.length - 1)]).join(''); }
    }
    yield input;
  }
}

export { LabError };
