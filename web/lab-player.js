// Lab player: plays the step-by-step labs from the tutorials, and draws quiz figures.
// The state model is the same file the content checker uses (/lab-model.js), so what
// passed the checker plays here exactly the same way.
import { startState, stepState, viewState, cloneState } from '/lab-model.js';
import { api, el, getLang } from './common.js';

const T = {
  en: { run: 'Run', preset: 'Example', start: 'Start', back: 'Back', play: 'Play', pause: 'Pause', next: 'Next', end: 'End', speed: 'Speed', step: (i, n) => `Step ${i} of ${n}`, ready: 'Press Play, or step through with Next.', vars: 'Variables', code: 'Steps', clearPts: 'Clear points', ptsHelp: 'Click to add a point; click a point to remove it.', cls: (n) => `Class ${n}`, loading: 'Running…', time: 'Time', space: 'Space', yourInput: 'Your input' },
  bn: { run: 'চালাও', preset: 'উদাহরণ', start: 'শুরু', back: 'পেছনে', play: 'চালাও', pause: 'থামাও', next: 'পরের ধাপ', end: 'শেষ', speed: 'গতি', step: (i, n) => `ধাপ ${i} / ${n}`, ready: 'Play চাপো, অথবা পরের ধাপ দিয়ে এক এক করে দেখো।', vars: 'ভেরিয়েবল', code: 'ধাপসমূহ', clearPts: 'বিন্দু মুছে দাও', ptsHelp: 'ক্লিক করে বিন্দু যোগ করো; বিন্দুতে ক্লিক করলে মুছে যাবে।', cls: (n) => `শ্রেণি ${n}`, loading: 'চলছে…', time: 'সময়', space: 'জায়গা', yourInput: 'তোমার ইনপুট' },
};
const t = () => T[getLang()] ?? T.en;

export const TONE = { active: '#f2b705', compare: '#e8812f', sorted: '#2e9e5b', found: '#1f7a4d', pivot: '#8e5bd1', min: '#2a7de1', max: '#d64545', discarded: '#c3cac6', window: '#bcdcff', visited: '#9fd3c0', current: '#f2b705', frontier: '#7fb3e6', done: '#2e9e5b', path: '#d6336c', considered: '#e9a23b', tree: '#116b58', rejected: '#d64545', relaxed: '#2a7de1', error: '#b4233e' };
export const CLASS = ['#2a7de1', '#e8812f', '#2e9e5b', '#8e5bd1', '#d64545', '#1aa3a3'];
const INK = '#173a36', MUTED = '#6b7a76', LINE = '#cfd8d3';
const fmt = (v) => (typeof v === 'number' ? (Number.isInteger(v) ? String(v) : String(Math.round(v * 1000) / 1000)) : v === null || v === undefined ? '∅' : String(v));
const darkText = (tone) => ['discarded', 'window', 'visited', 'frontier', 'active', 'current', 'considered'].includes(tone);

// ── tiny SVG helper ──
const NS = 'http://www.w3.org/2000/svg';
function S(tag, attrs = {}, ...kids) {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== undefined && v !== null && v !== false) n.setAttribute(k, v);
  for (const c of kids.flat()) if (c !== null && c !== undefined && c !== false) n.append(c instanceof Node ? c : document.createTextNode(String(c)));
  return n;
}
let uid = 0;
function svgRoot(w, h, label) {
  const id = `m${++uid}`;
  const svg = S('svg', { viewBox: `0 0 ${w} ${h}`, class: 'lp-svg', role: 'img', 'aria-label': label ?? 'diagram', preserveAspectRatio: 'xMidYMid meet' });
  svg.append(S('defs', {}, S('marker', { id: `${id}a`, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, S('path', { d: 'M0,0 L10,5 L0,10 z', fill: 'context-stroke' }))));
  svg.dataset.arrow = `url(#${id}a)`;
  svg.dataset.id = id;
  return svg;
}
const txt = (x, y, s, a = {}) => S('text', { x, y, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': 13, fill: INK, ...a }, s);

// ── renderers per kind ──
function drawArray(s, heap) {
  const n = s.array.length, bw = 46, gap = 6, w = Math.max(n * (bw + gap) + 20, 200);
  const ptrRows = {};
  for (const [name, i] of Object.entries(s.pointers ?? {})) (ptrRows[i] ??= []).push(name);
  const maxPtr = Math.max(0, ...Object.values(ptrRows).map((a) => a.length));
  const h = 96 + maxPtr * 16 + (heap ? 40 + Math.ceil(Math.log2(n + 1)) * 56 : 0);
  const svg = svgRoot(w, h, 'array');
  const x0 = (w - n * (bw + gap) + gap) / 2;
  const X = (i) => x0 + i * (bw + gap);
  for (const r of s.ranges ?? []) svg.append(S('rect', { x: X(r.from) - 4, y: 14, width: X(r.to) - X(r.from) + bw + 8, height: 56, rx: 8, fill: TONE[r.tone], opacity: 0.35 }));
  s.array.forEach((v, i) => {
    const tone = s.marks?.[String(i)];
    svg.append(S('rect', { x: X(i), y: 20, width: bw, height: 44, rx: 6, fill: tone ? TONE[tone] : '#fff', stroke: tone ? TONE[tone] : LINE, 'stroke-width': 2 }));
    svg.append(txt(X(i) + bw / 2, 42, fmt(v), { 'font-weight': 600, fill: tone && !darkText(tone) ? '#fff' : INK }));
    svg.append(txt(X(i) + bw / 2, 76, i, { 'font-size': 11, fill: MUTED }));
    (ptrRows[i] ?? []).forEach((name, k) => svg.append(txt(X(i) + bw / 2, 94 + k * 16, `↑ ${name}`, { 'font-size': 12, fill: '#116b58', 'font-weight': 600 })));
  });
  if (heap && n) {
    const top = 104 + maxPtr * 16;
    const pos = (i) => { const d = Math.floor(Math.log2(i + 1)); const k = i - (2 ** d - 1); const cnt = 2 ** d; return [((k + 0.5) / cnt) * w, top + d * 56]; };
    for (let i = 1; i < n; i++) { const [x1, y1] = pos(Math.floor((i - 1) / 2)); const [x2, y2] = pos(i); svg.append(S('line', { x1, y1, x2, y2, stroke: LINE, 'stroke-width': 2 })); }
    for (let i = 0; i < n; i++) { const [x, y] = pos(i); const tone = s.marks?.[String(i)]; svg.append(S('circle', { cx: x, cy: y, r: 17, fill: tone ? TONE[tone] : '#fff', stroke: tone ? TONE[tone] : LINE, 'stroke-width': 2 })); svg.append(txt(x, y, fmt(s.array[i]), { 'font-size': 12, fill: tone && !darkText(tone) ? '#fff' : INK })); }
  }
  return svg;
}

function drawLinkedList(s) {
  const ids = Object.keys(s.nodes);
  const order = []; const seen = new Set();
  let cur = s.head;
  while (cur !== null && cur !== undefined && !seen.has(cur) && cur in s.nodes) { seen.add(cur); order.push(cur); cur = s.next[cur] ?? null; }
  for (const id of ids) if (!seen.has(id)) order.push(id);
  const bw = 64, gap = 40, w = Math.max(order.length * (bw + gap) + 60, 220), h = 150;
  const svg = svgRoot(w, h, 'linked list');
  const X = Object.fromEntries(order.map((id, i) => [id, 30 + i * (bw + gap)]));
  const y = 60;
  for (const id of order) {
    const nx = s.next[id];
    if (nx !== undefined && nx !== null && nx in X) {
      const a = X[id] + bw, b = X[nx];
      const adjacent = b === a + gap;
      svg.append(adjacent ? S('line', { x1: a - 10, y1: y + 18, x2: b, y2: y + 18, stroke: INK, 'stroke-width': 1.6, 'marker-end': svg.dataset.arrow })
        : S('path', { d: `M${a - 10},${y + 10} C${a + 30},${y - 40} ${b - 30},${y - 40} ${b + 8},${y}`, fill: 'none', stroke: INK, 'stroke-width': 1.6, 'marker-end': svg.dataset.arrow }));
    } else if (nx === null) svg.append(txt(X[id] + bw + 14, y + 18, '∅', { fill: MUTED }));
    const pv = s.prev[id];
    if (pv !== undefined && pv !== null && pv in X) svg.append(S('path', { d: `M${X[id] + 6},${y + 36} C${X[id] - 10},${y + 62} ${X[pv] + bw + 10},${y + 62} ${X[pv] + bw - 6},${y + 38}`, fill: 'none', stroke: '#8e5bd1', 'stroke-width': 1.3, 'stroke-dasharray': '4 3', 'marker-end': svg.dataset.arrow }));
  }
  for (const id of order) {
    const tone = s.marks?.[id];
    svg.append(S('rect', { x: X[id], y, width: bw, height: 36, rx: 6, fill: tone ? TONE[tone] : '#fff', stroke: tone ? TONE[tone] : LINE, 'stroke-width': 2 }));
    svg.append(S('line', { x1: X[id] + bw - 16, y1: y, x2: X[id] + bw - 16, y2: y + 36, stroke: LINE }));
    svg.append(txt(X[id] + (bw - 16) / 2, y + 18, fmt(s.nodes[id]), { 'font-weight': 600, fill: tone && !darkText(tone) ? '#fff' : INK }));
    const labels = [];
    if (s.head === id) labels.push('head');
    if (s.tail === id) labels.push('tail');
    for (const [name, target] of Object.entries(s.pointers ?? {})) if (String(target) === id) labels.push(name);
    labels.forEach((l, k) => svg.append(txt(X[id] + bw / 2, y - 14 - k * 15, l, { 'font-size': 12, fill: '#116b58', 'font-weight': 600 })));
  }
  if (!order.length) svg.append(txt(w / 2, h / 2, 'head → ∅', { fill: MUTED }));
  return svg;
}

function drawStack(s) {
  const n = s.items.length, cap = s.capacity ?? Math.max(n, 4), bh = 30, w = 220, h = cap * (bh + 4) + 50;
  const svg = svgRoot(w, h, 'stack');
  svg.append(S('path', { d: `M50,10 L50,${h - 30} L170,${h - 30} L170,10`, fill: 'none', stroke: MUTED, 'stroke-width': 2 }));
  s.items.forEach((v, i) => {
    const y = h - 34 - (i + 1) * (bh + 4) + 4; const tone = s.marks?.[String(i)];
    svg.append(S('rect', { x: 56, y, width: 108, height: bh, rx: 5, fill: tone ? TONE[tone] : '#fff', stroke: tone ? TONE[tone] : LINE, 'stroke-width': 2 }));
    svg.append(txt(110, y + bh / 2, fmt(v), { 'font-weight': 600 }));
    if (i === n - 1) svg.append(txt(194, y + bh / 2, '← top', { 'font-size': 12, fill: '#116b58' }));
  });
  return svg;
}

function drawQueue(s) {
  const n = s.items.length, bw = 50, w = Math.max(n * (bw + 6) + 120, 240), h = 110;
  const svg = svgRoot(w, h, 'queue');
  const x0 = 60;
  s.items.forEach((v, i) => {
    const tone = s.marks?.[String(i)];
    svg.append(S('rect', { x: x0 + i * (bw + 6), y: 30, width: bw, height: 40, rx: 6, fill: tone ? TONE[tone] : '#fff', stroke: tone ? TONE[tone] : LINE, 'stroke-width': 2 }));
    svg.append(txt(x0 + i * (bw + 6) + bw / 2, 50, fmt(v), { 'font-weight': 600 }));
  });
  if (n) { svg.append(txt(x0 + bw / 2, 88, 'front', { 'font-size': 12, fill: '#116b58' })); svg.append(txt(x0 + (n - 1) * (bw + 6) + bw / 2, 16, 'rear', { 'font-size': 12, fill: '#116b58' })); }
  else svg.append(txt(w / 2, 50, 'empty', { fill: MUTED }));
  return svg;
}

function drawTree(s) {
  const pos = {}; let col = 0; let depthMax = 0;
  const width = (id) => Math.max(36, String(fmt(s.nodes[id])).length * 7.5 + 16);
  const kids = (id) => (s.multiway ? (s.children[id] ?? []) : [s.left[id], s.right[id]].filter((c) => c !== undefined && c !== null));
  const seen = new Set();
  function place(id, d) {
    if (id === null || id === undefined || seen.has(id) || !(id in s.nodes)) return;
    seen.add(id); depthMax = Math.max(depthMax, d);
    if (s.multiway) {
      const cs = kids(id);
      if (!cs.length) { pos[id] = [col++, d]; return; }
      cs.forEach((c) => place(c, d + 1));
      const xs = cs.filter((c) => pos[c]).map((c) => pos[c][0]);
      pos[id] = [xs.length ? (Math.min(...xs) + Math.max(...xs)) / 2 : col++, d];
    } else {
      place(s.left[id], d + 1); pos[id] = [col++, d]; place(s.right[id], d + 1);
    }
  }
  place(s.root, 0);
  const loose = Object.keys(s.nodes).filter((id) => !pos[id]);
  const maxW = Math.max(40, ...Object.keys(s.nodes).map(width));
  const dx = maxW + 10, dy = 70;
  const w = Math.max((col + loose.length) * dx + 40, 200), h = (depthMax + 1) * dy + 40 + (loose.length ? 60 : 0);
  loose.forEach((id, i) => { pos[id] = [col + i, depthMax + 1.2]; });
  const svg = svgRoot(w, h, 'tree');
  const P = (id) => [20 + dx / 2 + pos[id][0] * dx, 30 + pos[id][1] * dy];
  for (const id of Object.keys(pos)) for (const c of kids(id)) if (pos[c]) { const [x1, y1] = P(id); const [x2, y2] = P(c); svg.append(S('line', { x1, y1, x2, y2, stroke: LINE, 'stroke-width': 2 })); }
  for (const id of Object.keys(pos)) {
    const [x, y] = P(id); const tone = s.marks?.[id]; const bw = width(id);
    svg.append(S('rect', { x: x - bw / 2, y: y - 16, width: bw, height: 32, rx: 16, fill: tone ? TONE[tone] : '#fff', stroke: tone ? TONE[tone] : LINE, 'stroke-width': 2 }));
    svg.append(txt(x, y, fmt(s.nodes[id]), { 'font-size': 12, 'font-weight': 600, fill: tone && !darkText(tone) ? '#fff' : INK }));
    const ptrs = Object.entries(s.pointers ?? {}).filter(([, v]) => String(v) === id).map(([k]) => k);
    if (s.root === id) ptrs.unshift('root');
    if (ptrs.length) svg.append(txt(x, y - 26, ptrs.join(', '), { 'font-size': 11, fill: '#116b58', 'font-weight': 600 }));
  }
  if (!Object.keys(s.nodes).length) svg.append(txt(w / 2, h / 2, 'empty tree', { fill: MUTED }));
  return svg;
}

function drawGraph(s, weights) {
  const W = 620, H = 420, P = 30;
  const svg = svgRoot(W, H, 'graph');
  const xy = (n) => [P + (n.x / 100) * (W - 2 * P), P + (n.y / 100) * (H - 2 * P)];
  for (const [id, e] of Object.entries(s.edges)) {
    const a = s.nodes[e.from], b = s.nodes[e.to]; if (!a || !b) continue;
    let [x1, y1] = xy(a); let [x2, y2] = xy(b);
    const len = Math.hypot(x2 - x1, y2 - y1) || 1; const ux = (x2 - x1) / len, uy = (y2 - y1) / len;
    x1 += ux * 18; y1 += uy * 18; x2 -= ux * 18; y2 -= uy * 18;
    const tone = s.edgeTones?.[id];
    svg.append(S('line', { x1, y1, x2, y2, stroke: tone ? TONE[tone] : LINE, 'stroke-width': tone ? 3.5 : 2, 'marker-end': s.directed ? svg.dataset.arrow : null }));
    const wv = weights ? weights[id] : e.weight;
    if (wv !== null && wv !== undefined) svg.append(txt((x1 + x2) / 2 - uy * 10, (y1 + y2) / 2 + ux * 10, fmt(wv), { 'font-size': 11, fill: MUTED, 'paint-order': 'stroke', stroke: '#fff', 'stroke-width': 3 }));
  }
  for (const [id, n] of Object.entries(s.nodes)) {
    const [x, y] = xy(n); const tone = s.nodeTones?.[id] ?? s.marks?.[id];
    svg.append(S('circle', { cx: x, cy: y, r: 17, fill: tone ? TONE[tone] : '#fff', stroke: tone ? TONE[tone] : INK, 'stroke-width': 2 }));
    svg.append(txt(x, y, n.label, { 'font-size': 12, 'font-weight': 600, fill: tone && !darkText(tone) ? '#fff' : INK }));
    const lab = s.labels?.[id];
    if (lab !== undefined) { svg.append(S('rect', { x: x + 10, y: y - 30, width: Math.max(22, String(lab).length * 7 + 8), height: 18, rx: 9, fill: '#e6efb5', stroke: '#116b58' })); svg.append(txt(x + 10 + Math.max(22, String(lab).length * 7 + 8) / 2, y - 21, lab, { 'font-size': 11, fill: '#0c4d40', 'font-weight': 600 })); }
  }
  return svg;
}

function drawGrid(s, name) {
  const table = el('table', { class: 'lp-grid' });
  if (name) table.append(el('caption', { text: name }));
  const head = s.colLabels ? el('tr', {}, el('th', {}), ...s.colLabels.map((c) => el('th', { text: fmt(c) }))) : null;
  if (head) table.append(el('thead', {}, head));
  const body = el('tbody');
  const ptr = {};
  for (const [k, v] of Object.entries(s.pointers ?? {})) if (Array.isArray(v)) (ptr[v.join(',')] ??= []).push(k);
  const arrow = { up: '↑ ', left: '← ', diag: '↖ ' };
  for (let r = 0; r < s.rows; r++) {
    const tr = el('tr', {}, s.rowLabels ? el('th', { text: fmt(s.rowLabels[r]) }) : null);
    for (let c = 0; c < s.cols; c++) {
      const key = `${r},${c}`; const tone = s.marks?.[key];
      const v = s.cells[r][c];
      const td = el('td', { class: ptr[key] ? 'ptr' : '', style: tone ? `background:${TONE[tone]};color:${darkText(tone) ? INK : '#fff'}` : null, text: (arrow[s.arrows?.[key]] ?? '') + (v === null ? '' : fmt(v)) });
      if (ptr[key]) td.append(el('sup', { text: ptr[key].join(',') }));
      tr.append(td);
    }
    body.append(tr);
  }
  table.append(body);
  return el('div', { class: 'lp-grid-wrap' }, table);
}

function drawHash(s) {
  const rows = s.buckets.map((b, i) => {
    const tone = s.marks?.[String(i)];
    const cells = s.method === 'chaining' ? (b.length ? b.map((k) => el('span', { class: 'chip-k', text: fmt(k) })) : [el('span', { class: 'muted', text: '∅' })]) : [el('span', { class: b === null ? 'muted' : 'chip-k', text: b === null ? '∅' : fmt(b) })];
    return el('div', { class: 'hash-row', style: tone ? `background:${TONE[tone]}55` : null }, el('span', { class: 'hash-i', text: i }), el('div', { class: 'hash-b' }, ...cells));
  });
  return el('div', { class: 'hash' }, ...rows);
}

// ── ml panels ──
export function drawPlot(p, opts = {}) {
  const W = 520, H = 400, m = 44;
  const svg = svgRoot(W, H, 'plot');
  const [x0, x1] = p.xRange, [y0, y1] = p.yRange;
  const sx = (x) => m + ((x - x0) / (x1 - x0)) * (W - m - 16);
  const sy = (y) => H - m - ((y - y0) / (y1 - y0)) * (H - m - 16);
  const clip = `${svg.dataset.id}c`;
  svg.querySelector('defs').append(S('clipPath', { id: clip }, S('rect', { x: m, y: 16, width: W - m - 16, height: H - m - 16 })));
  const plot = S('g', { 'clip-path': `url(#${clip})` });
  svg.append(S('rect', { x: m, y: 16, width: W - m - 16, height: H - m - 16, fill: '#fbfcf9', stroke: LINE }));
  // regions
  if (p.regions) {
    const { rows, cols, cells, mode } = p.regions;
    const cw = (W - m - 16) / cols, ch = (H - m - 16) / rows;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const v = cells[r][c]; if (v === null) continue;
      const fill = mode === 'value' ? `rgb(${Math.round(42 + v * 190)},${Math.round(125 - v * 40)},${Math.round(225 - v * 180)})` : CLASS[v];
      plot.append(S('rect', { x: m + c * cw, y: 16 + r * ch, width: cw + 0.5, height: ch + 0.5, fill, opacity: 0.2 }));
    }
  }
  // ticks
  for (let k = 0; k <= 5; k++) {
    const xv = x0 + ((x1 - x0) * k) / 5, yv = y0 + ((y1 - y0) * k) / 5;
    svg.append(S('line', { x1: sx(xv), y1: 16, x2: sx(xv), y2: H - m, stroke: '#eef1ec' }));
    svg.append(S('line', { x1: m, y1: sy(yv), x2: W - 16, y2: sy(yv), stroke: '#eef1ec' }));
    svg.append(txt(sx(xv), H - m + 14, fmt(Math.round(xv * 100) / 100), { 'font-size': 11, fill: MUTED }));
    svg.append(txt(m - 16, sy(yv), fmt(Math.round(yv * 100) / 100), { 'font-size': 11, fill: MUTED }));
  }
  if (p.xLabel) svg.append(txt((W + m) / 2, H - 10, p.xLabel, { 'font-size': 12, fill: INK }));
  if (p.yLabel) svg.append(txt(12, H / 2, p.yLabel, { 'font-size': 12, fill: INK, transform: `rotate(-90 12 ${H / 2})` }));
  svg.append(plot);
  // shapes
  const scol = (sh) => (sh.cls !== undefined && sh.cls !== null ? CLASS[sh.cls] : sh.tone ? TONE[sh.tone] : INK);
  for (const sh of Object.values(p.shapes ?? {})) {
    const dash = sh.dash ? '6 4' : null; const col = scol(sh);
    if (sh.type === 'line') {
      const [w1, w2] = sh.w; const span = (x1 - x0) * 10;
      let a, b;
      if (Math.abs(w2) > 1e-12) { const f = (x) => -(w1 * x + sh.b) / w2; a = [x0 - span, f(x0 - span)]; b = [x1 + span, f(x1 + span)]; }
      else { const xv = -sh.b / w1; a = [xv, y0 - (y1 - y0) * 10]; b = [xv, y1 + (y1 - y0) * 10]; }
      plot.append(S('line', { x1: sx(a[0]), y1: sy(a[1]), x2: sx(b[0]), y2: sy(b[1]), stroke: col, 'stroke-width': 2.2, 'stroke-dasharray': dash }));
      if (sh.label) { const mx = Math.min(Math.max((x0 + x1) / 2, x0), x1); const my = Math.abs(w2) > 1e-12 ? -(w1 * mx + sh.b) / w2 : (y0 + y1) / 2; plot.append(txt(sx(Math.abs(w2) > 1e-12 ? mx : -sh.b / w1) + 6, sy(Math.min(Math.max(my, y0), y1)) - 10, sh.label, { 'font-size': 11, fill: col, 'text-anchor': 'start', 'paint-order': 'stroke', stroke: '#fff', 'stroke-width': 3 })); }
    } else if (sh.type === 'segment' || sh.type === 'arrow') {
      plot.append(S('line', { x1: sx(sh.from[0]), y1: sy(sh.from[1]), x2: sx(sh.to[0]), y2: sy(sh.to[1]), stroke: col, 'stroke-width': sh.type === 'arrow' ? 2.2 : 1.6, 'stroke-dasharray': dash, 'marker-end': sh.type === 'arrow' ? svg.dataset.arrow : null }));
      if (sh.label) plot.append(txt((sx(sh.from[0]) + sx(sh.to[0])) / 2, (sy(sh.from[1]) + sy(sh.to[1])) / 2 - 9, sh.label, { 'font-size': 11, fill: col, 'paint-order': 'stroke', stroke: '#fff', 'stroke-width': 3 }));
    } else if (sh.type === 'circle') {
      plot.append(S('ellipse', { cx: sx(sh.center[0]), cy: sy(sh.center[1]), rx: Math.abs(sx(sh.center[0] + sh.r) - sx(sh.center[0])), ry: Math.abs(sy(sh.center[1] + sh.r) - sy(sh.center[1])), fill: sh.tone ? TONE[sh.tone] : 'none', 'fill-opacity': sh.tone ? 0.15 : 0, stroke: col, 'stroke-width': 1.8, 'stroke-dasharray': dash }));
    } else if (sh.type === 'rect') {
      const xa = Math.min(sx(sh.from[0]), sx(sh.to[0])), ya = Math.min(sy(sh.from[1]), sy(sh.to[1]));
      plot.append(S('rect', { x: xa, y: ya, width: Math.abs(sx(sh.to[0]) - sx(sh.from[0])), height: Math.abs(sy(sh.to[1]) - sy(sh.from[1])), fill: col, 'fill-opacity': 0.13, stroke: col, 'stroke-opacity': 0.5, 'stroke-dasharray': dash ?? '3 3' }));
      if (sh.label) plot.append(txt(xa + 6, ya + 12, sh.label, { 'font-size': 11, fill: col, 'text-anchor': 'start' }));
    } else if (sh.type === 'curve') {
      plot.append(S('polyline', { points: sh.points.map(([x, y]) => `${sx(x)},${sy(y)}`).join(' '), fill: 'none', stroke: col, 'stroke-width': 2.2, 'stroke-dasharray': dash }));
    }
  }
  // points
  for (const [id, q] of Object.entries(p.points ?? {})) {
    const tone = p.marks?.[id]; const r = Math.min(4.5 * (q.size ?? 1) + 1, 16);
    if (tone) plot.append(S('circle', { cx: sx(q.x), cy: sy(q.y), r: r + 4, fill: 'none', stroke: TONE[tone], 'stroke-width': 3 }));
    plot.append(S('circle', { cx: sx(q.x), cy: sy(q.y), r, fill: q.cls === null || q.cls === undefined ? '#a9b3ae' : CLASS[q.cls], stroke: '#fff', 'stroke-width': 1.5, opacity: tone === 'discarded' ? 0.4 : 1 }, S('title', {}, `${id} (${fmt(q.x)}, ${fmt(q.y)})`)));
    if (q.label) plot.append(txt(sx(q.x) + r + 4, sy(q.y) - 8, q.label, { 'font-size': 10, fill: MUTED, 'text-anchor': 'start' }));
  }
  // markers on top
  for (const sh of Object.values(p.shapes ?? {})) {
    if (sh.type !== 'marker') continue;
    const x = sx(sh.at[0]), y = sy(sh.at[1]); const fill = sh.cls !== undefined && sh.cls !== null ? CLASS[sh.cls] : '#fff';
    const sym = sh.symbol ?? 'star';
    const star = Array.from({ length: 10 }, (_, k) => { const a = (Math.PI / 5) * k - Math.PI / 2; const rr = k % 2 ? 5 : 12; return `${x + rr * Math.cos(a)},${y + rr * Math.sin(a)}`; }).join(' ');
    const shape = sym === 'star' ? S('polygon', { points: star }) : sym === 'diamond' ? S('polygon', { points: `${x},${y - 11} ${x + 11},${y} ${x},${y + 11} ${x - 11},${y}` }) : sym === 'square' ? S('rect', { x: x - 8, y: y - 8, width: 16, height: 16 }) : S('path', { d: sym === 'cross' ? `M${x - 9},${y - 9} L${x + 9},${y + 9} M${x + 9},${y - 9} L${x - 9},${y + 9}` : `M${x - 10},${y} L${x + 10},${y} M${x},${y - 10} L${x},${y + 10}` });
    shape.setAttribute('fill', fill); shape.setAttribute('stroke', sym === 'cross' || sym === 'plus' ? (sh.cls !== undefined && sh.cls !== null ? CLASS[sh.cls] : INK) : INK); shape.setAttribute('stroke-width', sym === 'cross' || sym === 'plus' ? 4 : 1.6);
    plot.append(shape);
    if (sh.label) plot.append(txt(x + 14, y - 12, sh.label, { 'font-size': 12, 'font-weight': 600, 'text-anchor': 'start', 'paint-order': 'stroke', stroke: '#fff', 'stroke-width': 3 }));
  }
  if (opts.onClick) {
    svg.style.cursor = 'crosshair';
    svg.addEventListener('click', (ev) => {
      const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
      const loc = pt.matrixTransform(svg.getScreenCTM().inverse());
      const x = x0 + ((loc.x - m) / (W - m - 16)) * (x1 - x0), y = y0 + ((H - m - loc.y) / (H - m - 16)) * (y1 - y0);
      if (x >= x0 && x <= x1 && y >= y0 && y <= y1) opts.onClick(x, y);
    });
  }
  const wrap = el('div', { class: 'ml-plot' }, svg);
  if (p.classes?.length) wrap.append(el('div', { class: 'legend' }, ...p.classes.map((c) => el('span', {}, el('i', { style: `background:${CLASS[c.id]}` }), c.label))));
  return wrap;
}

function drawChart(c) {
  const W = 520, H = 300, m = 46;
  const svg = svgRoot(W, H, 'chart');
  const series = Object.entries(c.series ?? {});
  const all = series.flatMap(([, s]) => s.points);
  const cats = [...new Set(all.filter((p) => typeof p[0] === 'string').map((p) => p[0]))];
  const xs = all.filter((p) => typeof p[0] === 'number').map((p) => p[0]).concat((c.vlines ?? []).map((v) => v.x));
  const ys = all.map((p) => p[1]);
  let [x0, x1] = c.xRange ?? [Math.min(...xs, 0), Math.max(...xs, 1)];
  let [y0, y1] = c.yRange ?? [Math.min(0, ...ys), Math.max(...ys, 1)];
  if (x0 === x1) x1 = x0 + 1; if (y0 === y1) y1 = y0 + 1;
  const sx = (x) => (typeof x === 'string' ? m + ((cats.indexOf(x) + 0.5) / Math.max(cats.length, 1)) * (W - m - 16) : m + ((x - x0) / (x1 - x0)) * (W - m - 16));
  const sy = (y) => H - m - ((y - y0) / (y1 - y0)) * (H - m - 16);
  svg.append(S('rect', { x: m, y: 16, width: W - m - 16, height: H - m - 16, fill: '#fbfcf9', stroke: LINE }));
  for (let k = 0; k <= 4; k++) { const yv = y0 + ((y1 - y0) * k) / 4; svg.append(S('line', { x1: m, y1: sy(yv), x2: W - 16, y2: sy(yv), stroke: '#eef1ec' })); svg.append(txt(m - 18, sy(yv), fmt(Math.round(yv * 100) / 100), { 'font-size': 11, fill: MUTED })); }
  if (!cats.length) for (let k = 0; k <= 5; k++) { const xv = x0 + ((x1 - x0) * k) / 5; svg.append(txt(sx(xv), H - m + 14, fmt(Math.round(xv * 100) / 100), { 'font-size': 11, fill: MUTED })); }
  cats.forEach((cat) => svg.append(txt(sx(cat), H - m + 14, cat, { 'font-size': 11, fill: MUTED })));
  if (c.xLabel) svg.append(txt((W + m) / 2, H - 8, c.xLabel, { 'font-size': 12 }));
  if (c.yLabel) svg.append(txt(12, H / 2, c.yLabel, { 'font-size': 12, transform: `rotate(-90 12 ${H / 2})` }));
  for (const v of c.vlines ?? []) { svg.append(S('line', { x1: sx(v.x), y1: 16, x2: sx(v.x), y2: H - m, stroke: '#d6336c', 'stroke-dasharray': '5 4' })); if (v.label) svg.append(txt(sx(v.x) + 4, 26, v.label, { 'font-size': 11, fill: '#d6336c', 'text-anchor': 'start' })); }
  const bars = series.filter(([, s]) => s.type === 'bar');
  series.forEach(([id, s], si) => {
    const col = s.tone ? TONE[s.tone] : CLASS[si % CLASS.length];
    if (s.type === 'bar') {
      const k = bars.findIndex(([bid]) => bid === id); const slot = (W - m - 16) / Math.max(cats.length || s.points.length, 1) * 0.8 / Math.max(bars.length, 1);
      for (const [x, y] of s.points) svg.append(S('rect', { x: sx(x) - (slot * bars.length) / 2 + k * slot, y: Math.min(sy(y), sy(0)), width: slot - 2, height: Math.abs(sy(y) - sy(Math.max(y0, 0))), fill: col, opacity: 0.85 }, S('title', {}, `${s.label}: ${fmt(y)}`)));
    } else if (s.type === 'scatter') {
      for (const [x, y] of s.points) svg.append(S('circle', { cx: sx(x), cy: sy(y), r: 4, fill: col }));
    } else if (s.points.length) {
      svg.append(S('polyline', { points: s.points.map(([x, y]) => `${sx(x)},${sy(y)}`).join(' '), fill: 'none', stroke: col, 'stroke-width': 2.2 }));
      const [lx, ly] = s.points.at(-1); svg.append(S('circle', { cx: sx(lx), cy: sy(ly), r: 3.5, fill: col }));
    }
  });
  return el('div', { class: 'ml-chart' }, svg, series.length > 1 || series[0]?.[1].label ? el('div', { class: 'legend' }, ...series.map(([, s], si) => el('span', {}, el('i', { style: `background:${s.tone ? TONE[s.tone] : CLASS[si % CLASS.length]}` }), s.label))) : null);
}

function drawMl(s) {
  const parts = [];
  if (s.plot) parts.push(drawPlot(s.plot));
  if (s.chart) parts.push(drawChart(s.chart));
  if (s.tree) parts.push(el('div', { class: 'ml-tree' }, drawTree(s.tree)));
  if (s.network) parts.push(el('div', { class: 'ml-net' }, drawGraph(s.network, s.network.weights)));
  if (s.tables) for (const [name, g] of Object.entries(s.tables)) parts.push(drawGrid(g, name));
  return el('div', { class: `ml-panels n${parts.length}` }, ...parts);
}

export function drawState(kind, state) {
  switch (kind) {
    case 'array': return drawArray(state, false);
    case 'heap': return drawArray(state, true);
    case 'linked-list': return drawLinkedList(state);
    case 'stack': return drawStack(state);
    case 'queue': return drawQueue(state);
    case 'tree': return drawTree(state);
    case 'graph': return drawGraph(state);
    case 'grid': return drawGrid(state);
    case 'hash-table': return drawHash(state);
    case 'ml': return drawMl(state);
    default: return el('p', { class: 'muted', text: `Unknown lab kind ${kind}` });
  }
}

/** A static figure (quiz, practice, exam): { panels, caption? }. */
export function renderFigure(fig) {
  try {
    const state = viewState('ml', startState('ml', fig.panels));
    const cap = fig.caption ? (getLang() === 'bn' && fig.caption.bn ? fig.caption.bn : fig.caption.en) : null;
    return el('figure', { class: 'lp-figure' }, drawMl(state), cap ? el('figcaption', { text: cap }) : null);
  } catch (e) {
    return el('p', { class: 'muted small', text: `(figure could not be drawn: ${e.message})` });
  }
}

// ── the player ──
export async function mountLab(host, { track, topic, labId }) {
  const L = t();
  host.classList.add('lp');
  host.replaceChildren(el('div', { class: 'skeleton' }));
  let lab;
  try { lab = await api('GET', `/api/learn/${track}/${topic}/labs/${labId}?lang=${getLang()}`); }
  catch (e) { host.replaceChildren(el('p', { class: 'muted', text: e.message })); return; }

  const values = structuredClone(lab.presets[0]?.input ?? {});
  const stage = el('div', { class: 'lp-stage' });
  const note = el('div', { class: 'lp-note', 'aria-live': 'polite' });
  const code = el('ol', { class: 'lp-code' }, ...lab.pseudocode.map((line) => el('li', {}, el('code', { text: line }))));
  const vars = el('dl', { class: 'lp-vars' });
  const lists = el('div', { class: 'lp-lists' });
  const counter = el('span', { class: 'lp-count muted small' });
  const range = el('input', { type: 'range', min: 0, max: 0, value: 0, 'aria-label': 'step' });
  const speed = el('select', { 'aria-label': L.speed }, ...[['0.5×', 1400], ['1×', 800], ['2×', 400], ['4×', 150]].map(([n, v]) => el('option', { value: v, selected: v === 800 || null, text: n })));
  const playBtn = el('button', { type: 'button', class: 'btn primary small', text: `▶ ${L.play}` });
  let run = null, pos = 0, timer = null, snaps = [];

  function stateAt(p) {
    const k = Math.min(Math.floor(p / 25), snaps.length - 1);
    const s = cloneState(snaps[k]);
    for (let i = k * 25; i < p; i++) {
      stepState(run.kind, s, run.steps[i], { n: i, total: run.steps.length, lines: lab.pseudocode.length });
      if ((i + 1) % 25 === 0 && snaps.length === (i + 1) / 25) snaps.push(cloneState(s));
    }
    return s;
  }
  function show(p) {
    if (!run) return;
    pos = Math.max(0, Math.min(p, run.steps.length));
    const s = viewState(run.kind, stateAt(pos));
    stage.replaceChildren(drawState(run.kind, s));
    const st = run.steps[pos - 1];
    const bn = getLang() === 'bn';
    note.textContent = st ? (bn && st.note.bn ? st.note.bn : st.note.en) : L.ready;
    note.className = `lp-note${st?.op === 'done' ? ' done' : ''}`;
    [...code.children].forEach((li, i) => li.classList.toggle('on', st?.line === i + 1));
    vars.replaceChildren(...Object.entries(s.vars ?? {}).flatMap(([k, v]) => [el('dt', { text: k }), el('dd', { text: fmt(v) })]));
    lists.replaceChildren(...Object.entries(s.lists ?? {}).map(([k, items]) => el('div', { class: 'lp-list' }, el('strong', { text: k }), el('div', {}, ...(items.length ? items.map((v) => el('span', { class: 'chip-k', text: fmt(v) })) : [el('span', { class: 'muted', text: '∅' })])))));
    range.max = run.steps.length; range.value = pos;
    counter.textContent = L.step(pos, run.steps.length);
  }
  function stop() { clearInterval(timer); timer = null; playBtn.textContent = `▶ ${L.play}`; }
  function play() {
    if (!run) return;
    if (timer) return stop();
    if (pos >= run.steps.length) show(0);
    playBtn.textContent = `⏸ ${L.pause}`;
    timer = setInterval(() => { if (pos >= run.steps.length) return stop(); show(pos + 1); }, Number(speed.value));
  }
  speed.onchange = () => { if (timer) { stop(); play(); } };
  playBtn.onclick = play;
  range.oninput = () => { stop(); show(Number(range.value)); };

  let reported = false;
  async function doRun() {
    stop();
    note.textContent = L.loading;
    try {
      run = await api('POST', `/api/learn/${track}/${topic}/labs/${labId}/run`, { input: values, lang: getLang() });
      if (!reported) { reported = true; api('POST', '/api/learn-activity', { kind: 'lab', track, topic, lab: labId }).catch(() => {}); }
      snaps = [startState(run.kind, run.init)];
      show(0);
    } catch (e) { note.textContent = e.message; note.className = 'lp-note err'; }
  }

  // input form
  const form = el('form', { class: 'lp-form' });
  form.onsubmit = (e) => { e.preventDefault(); doRun(); };
  const presetSel = lab.presets.length > 1 ? el('select', { 'aria-label': L.preset }, ...lab.presets.map((p, i) => el('option', { value: i, text: p.name }))) : null;
  if (presetSel) presetSel.onchange = () => { Object.assign(values, structuredClone(lab.presets[Number(presetSel.value)].input)); drawInputs(); doRun(); };
  const inputsBox = el('div', { class: 'lp-inputs' });
  const ptsBox = el('div', { class: 'pts-editor' });
  function drawInputs() {
    inputsBox.replaceChildren();
    for (const f of lab.inputs) {
      const v = values[f.name];
      if (f.type === 'int') inputsBox.append(el('label', {}, f.label, el('input', { type: 'number', min: f.min, max: f.max, step: 1, value: v ?? f.min, onchange: (e) => { values[f.name] = Math.max(f.min, Math.min(f.max, Math.round(Number(e.target.value)))); } })));
      else if (f.type === 'int-array') inputsBox.append(el('label', { class: 'wide' }, f.label, el('input', { type: 'text', value: (v ?? []).join(', '), placeholder: '5, 2, 9, 1', onchange: (e) => { values[f.name] = e.target.value.split(/[\s,]+/).filter(Boolean).map(Number).filter(Number.isFinite).map(Math.round).slice(0, f.maxLength); } })));
      else if (f.type === 'string') inputsBox.append(el('label', {}, f.label, el('input', { type: 'text', maxlength: f.maxLength, value: v ?? '', onchange: (e) => { values[f.name] = e.target.value; } })));
      else if (f.type === 'number') {
        const out = el('output', { text: fmt(v ?? f.min) });
        inputsBox.append(el('label', {}, f.label, el('span', { class: 'slider' }, el('input', { type: 'range', min: f.min, max: f.max, step: f.step, value: v ?? f.min, oninput: (e) => { values[f.name] = Number(Number(e.target.value).toFixed(10)); out.textContent = fmt(values[f.name]); }, onchange: () => doRun() }), out)));
      } else if (f.type === 'choice') inputsBox.append(el('label', {}, f.label, el('select', { onchange: (e) => { values[f.name] = e.target.value; doRun(); } }, ...f.options.map((o) => el('option', { value: o, selected: o === v || null, text: o })))));
      else if (f.type === 'points') drawPointsEditor(f);
    }
  }
  function drawPointsEditor(f) {
    let cls = 0;
    const box = ptsBox;
    const redraw = () => {
      const pts = values[f.name] ?? [];
      const p = { xRange: f.xRange, yRange: f.yRange, classes: f.classes ? Array.from({ length: f.classes }, (_, i) => ({ id: i, label: L.cls(i + 1) })) : [], points: Object.fromEntries(pts.map((q, i) => [`p${i + 1}`, { x: q.x, y: q.y, cls: f.classes ? q.cls : null, size: 1 }])), shapes: {}, marks: {} };
      const plot = drawPlot(p, { onClick: (x, y) => {
        const list = values[f.name] ?? [];
        const span = (f.xRange[1] - f.xRange[0]) / 40;
        const hit = list.findIndex((q) => Math.hypot(q.x - x, q.y - y) < span);
        if (hit >= 0) { if (list.length > f.minLength) list.splice(hit, 1); }
        else if (list.length < f.maxLength) list.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, ...(f.classes ? { cls } : {}) });
        values[f.name] = list; redraw();
      } });
      const clsBtns = f.classes ? el('div', { class: 'cls-btns' }, ...Array.from({ length: f.classes }, (_, i) => el('button', { type: 'button', class: `chip${i === cls ? ' on' : ''}`, style: `border-color:${CLASS[i]}`, onclick: () => { cls = i; redraw(); } }, el('i', { style: `background:${CLASS[i]}` }), L.cls(i + 1)))) : null;
      box.replaceChildren(...[el('p', { class: 'small muted', text: `${f.label} · ${L.ptsHelp}` }), clsBtns, plot,
        el('button', { type: 'button', class: 'chip', text: L.clearPts, onclick: () => { values[f.name] = (values[f.name] ?? []).slice(0, f.minLength); redraw(); } })].filter(Boolean));
    };
    redraw();
  }
  drawInputs();
  form.append(...[presetSel ? el('label', {}, L.preset, presetSel) : null, inputsBox, el('button', { type: 'submit', class: 'btn primary small', text: `▶ ${L.run}` })].filter(Boolean));

  const controls = el('div', { class: 'lp-controls' },
    el('button', { type: 'button', class: 'chip', title: L.start, 'aria-label': L.start, text: '⏮', onclick: () => { stop(); show(0); } }),
    el('button', { type: 'button', class: 'chip', title: L.back, 'aria-label': L.back, text: '◀', onclick: () => { stop(); show(pos - 1); } }),
    playBtn,
    el('button', { type: 'button', class: 'chip', title: L.next, 'aria-label': L.next, text: '▶|', onclick: () => { stop(); show(pos + 1); } }),
    el('button', { type: 'button', class: 'chip', title: L.end, 'aria-label': L.end, text: '⏭', onclick: () => { stop(); show(run?.steps.length ?? 0); } }),
    range, counter, el('label', { class: 'small muted' }, L.speed, ' ', speed));

  const hasPoints = lab.inputs.some((f) => f.type === 'points');
  host.replaceChildren(...[
    el('div', { class: 'lp-head' }, el('span', { class: 'pill', text: 'LAB' }), el('h3', { text: lab.title }), el('p', { class: 'muted', text: lab.summary }),
      lab.complexity ? el('p', { class: 'small muted', text: `${L.time}: ${lab.complexity.time} · ${L.space}: ${lab.complexity.space}` }) : null),
    form,
    hasPoints ? el('details', { class: 'pts-wrap' }, el('summary', { text: L.yourInput }), ptsBox) : null,
    el('div', { class: 'lp-body' }, stage, el('aside', { class: 'lp-side' }, el('h4', { text: L.code }), code, el('h4', { text: L.vars }), vars, lists)),
    note, controls].filter(Boolean));
  host.addEventListener('keydown', (e) => { if (e.target.closest('input,select,textarea')) return; if (e.key === 'ArrowRight') { stop(); show(pos + 1); } if (e.key === 'ArrowLeft') { stop(); show(pos - 1); } });
  host.tabIndex = 0;
  await doRun();
}
