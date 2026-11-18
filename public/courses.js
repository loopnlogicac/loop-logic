// Course catalog: search and filter the Loop & Logic courses.
import { getLang, applyI18n, mountNav, el, num, errorBox } from './common.js';
import { courseCard } from './ui.js';

const T = {
  en: {
    tagline: 'Learn with purpose', foot: 'Loop & Logic · answers come only from reviewed notes and approved websites',
    title: 'Courses', sub: (n, v) => `${n} university courses with ${v} Bangla video lessons. Courses marked “Lessons + labs” also have adaptive lessons with select-to-ask help and a hands-on lab.`,
    search: 'Search courses, e.g. “OS”, “MAT-101”, “ডেটা”', all: 'All', adaptiveOnly: 'With lessons and labs only',
    adaptive: 'Lessons + labs', videoOnly: 'Video playlists', videos: 'videos', lessonsLabs: (l, b) => `${l} lessons · ${b} labs`,
    none: 'No course matches that search.', clear: 'Clear filters', count: (n) => `${n} courses`,
  },
  bn: {
    tagline: 'উদ্দেশ্য নিয়ে শেখা', foot: 'লুপ অ্যান্ড লজিক · উত্তর আসে শুধু পর্যালোচিত নোট আর অনুমোদিত ওয়েবসাইট থেকে',
    title: 'কোর্স', sub: (n, v) => `${n}টি বিশ্ববিদ্যালয় কোর্স, ${v}টি বাংলা ভিডিও লেসন। “পাঠ + ল্যাব” চিহ্নিত কোর্সে সিলেক্ট করে প্রশ্ন করার সুবিধাসহ অ্যাডাপটিভ পাঠ আর হাতে-কলমে ল্যাবও আছে।`,
    search: 'কোর্স খোঁজো, যেমন “OS”, “MAT-101”, “ডেটা”', all: 'সব', adaptiveOnly: 'শুধু পাঠ ও ল্যাবসহ',
    adaptive: 'পাঠ + ল্যাব', videoOnly: 'ভিডিও প্লেলিস্ট', videos: 'ভিডিও', lessonsLabs: (l, b) => `${l}টি পাঠ · ${b}টি ল্যাব`,
    none: 'এই খোঁজে কোনো কোর্স মেলেনি।', clear: 'ফিল্টার মুছে দাও', count: (n) => `${n}টি কোর্স`,
  },
};
const t = () => T[getLang()];
const state = { q: new URLSearchParams(location.search).get('q') ?? '', subject: 'all', adaptiveOnly: false };
let data = null;
const main = document.getElementById('main');

function matches(c) {
  if (state.subject !== 'all' && c.subject !== state.subject) return false;
  if (state.adaptiveOnly && !c.adaptive) return false;
  const q = state.q.trim().toLowerCase();
  if (!q) return true;
  return [c.title, c.blurb, c.code ?? '', c.subjectName, c.id.replace(/-/g, ' ')].join(' ').toLowerCase().includes(q);
}

function render() {
  const L = t();
  applyI18n(L);
  document.title = `${L.title} · Loop & Logic`;
  const totalVideos = data.courses.reduce((n, c) => n + c.videos, 0);
  const input = el('input', { type: 'search', value: state.q, placeholder: L.search, 'aria-label': L.search });
  input.addEventListener('input', () => { state.q = input.value; drawGrid(); });
  const chips = el('div', { class: 'fchips', role: 'group', 'aria-label': 'Subject' },
    ...[{ id: 'all', name: L.all }, ...data.subjects].map((s) => el('button', { type: 'button', 'aria-pressed': String(state.subject === s.id), text: s.name, onclick: () => { state.subject = s.id; render(); } })));
  const only = el('label', { class: 'toggle' }, el('input', { type: 'checkbox', checked: state.adaptiveOnly || null, onchange: (e) => { state.adaptiveOnly = e.target.checked; drawGrid(); } }), L.adaptiveOnly);
  const grid = el('div', { class: 'grid', id: 'grid' });
  const count = el('p', { class: 'muted small', id: 'count' });
  main.replaceChildren(
    el('div', { class: 'page-head' }, el('h1', { text: L.title }), el('p', { text: L.sub(num(data.courses.length), num(totalVideos)) })),
    el('div', { class: 'filters' }, el('div', { class: 'search' }, input), only),
    chips, count, grid);
  drawGrid();
}

function drawGrid() {
  const L = t();
  const list = data.courses.filter(matches).sort((a, b) => Number(b.adaptive) - Number(a.adaptive));
  document.getElementById('count').textContent = L.count(num(list.length));
  const grid = document.getElementById('grid');
  if (!list.length) {
    grid.replaceChildren(el('div', { class: 'card empty', style: 'grid-column: 1 / -1' }, el('p', { text: L.none }),
      el('button', { type: 'button', class: 'btn secondary', text: L.clear, onclick: () => { Object.assign(state, { q: '', subject: 'all', adaptiveOnly: false }); render(); } })));
    return;
  }
  grid.replaceChildren(...list.map((c) => courseCard(c, L)));
}

async function load() {
  try {
    data = await fetch(`/api/courses?lang=${getLang()}`).then((r) => { if (!r.ok) throw new Error(r.statusText); return r.json(); });
    render();
  } catch (e) { errorBox(main, e.message, load); }
}

mountNav('courses', load);
applyI18n(t());
load();
