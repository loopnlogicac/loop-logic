// Search results (/search.html?q=…): tutorial topics, videos, labs, courses and blog posts.
import { getLang, applyI18n, mountNav, el, num, errorBox } from './common.js';

const T = {
  en: {
    tagline: 'Learn with purpose', title: 'Search', placeholder: 'Search topics, videos, labs…', go: 'Search',
    found: (n, q) => `${n} result${n === 1 ? '' : 's'} for “${q}”`, none: (q) => `Nothing found for “${q}”.`,
    tips: 'Try a shorter word (“pointer” instead of “pointers in C”), the English name of the topic, or browse the tutorials.',
    browse: 'Browse all tutorials', empty: 'Type what you want to learn, for example “linked list”, “for loop” or “SQL join”.',
    groups: { topic: 'Tutorial topics', video: 'Videos', lab: 'Interactive labs', course: 'Courses', post: 'Blog posts' },
  },
  bn: {
    tagline: 'উদ্দেশ্য নিয়ে শেখা', title: 'খোঁজো', placeholder: 'টপিক, ভিডিও, ল্যাব খোঁজো…', go: 'খোঁজো',
    found: (n, q) => `“${q}”-এর জন্য ${n}টি ফল`, none: (q) => `“${q}”-এর জন্য কিছু পাওয়া যায়নি।`,
    tips: 'ছোট শব্দে খোঁজো (“pointers in C”-এর বদলে “pointer”), টপিকের ইংরেজি নাম লেখো, অথবা টিউটোরিয়ালগুলো ঘুরে দেখো।',
    browse: 'সব টিউটোরিয়াল দেখো', empty: 'কী শিখতে চাও লেখো, যেমন “linked list”, “for loop” বা “SQL join”।',
    groups: { topic: 'টিউটোরিয়াল টপিক', video: 'ভিডিও', lab: 'ইন্টারঅ্যাকটিভ ল্যাব', course: 'কোর্স', post: 'ব্লগ' },
  },
};
const ICON = { topic: '📘', lab: '🧪', course: '🎓', video: '▶', post: '📰' };
const t = () => T[getLang()];
const main = document.getElementById('main');

async function render() {
  const L = t();
  applyI18n({ tagline: L.tagline });
  const q = (new URLSearchParams(location.search).get('q') ?? '').trim();
  document.title = `${q ? `${q} · ` : ''}${L.title} · Loop & Logic`;
  const input = el('input', { type: 'search', name: 'q', value: q, placeholder: L.placeholder, 'aria-label': L.title, autocomplete: 'off' });
  const form = el('form', { class: 'srch-form', role: 'search', action: '/search.html', method: 'get' }, input, el('button', { class: 'btn primary', type: 'submit', text: L.go }));
  const head = el('div', { class: 'page-head' }, el('h1', { text: L.title }), form);
  if (!q) { main.replaceChildren(head, el('p', { class: 'muted', text: L.empty })); input.focus(); return; }
  main.replaceChildren(head, el('div', { class: 'skeleton' }));
  try {
    const r = await fetch(`/api/search?lang=${getLang()}&q=${encodeURIComponent(q)}`).then((x) => x.json());
    if (!r.groups?.length) {
      main.replaceChildren(head, el('div', { class: 'srch-none' }, el('h2', { text: L.none(q) }), el('p', { class: 'muted', text: L.tips }), el('a', { class: 'btn secondary', href: '/learn.html', text: L.browse })));
      return;
    }
    const shown = r.groups.reduce((n, g) => n + g.hits.length, 0);
    main.replaceChildren(head,
      el('p', { class: 'muted srch-count', text: L.found(num(shown), q) }),
      el('nav', { class: 'srch-jump', 'aria-label': L.title }, ...r.groups.map((g) => el('a', { class: 'chip small', href: `#g-${g.type}`, text: `${L.groups[g.type]} · ${num(g.hits.length)}` }))),
      ...r.groups.map((g) => el('section', { class: 'srch-group', id: `g-${g.type}` },
        el('h2', { text: L.groups[g.type] }),
        el('ul', { class: 'srch-list' }, ...g.hits.map((h) => el('li', {}, el('a', { href: h.href, class: 'srch-hit' },
          el('span', { class: 'srch-ico', 'aria-hidden': 'true', text: ICON[h.type] }),
          el('span', {}, el('strong', { text: h.title }), el('small', { text: h.subtitle })))))))));
  } catch (e) { errorBox(main, e.message, render); }
}

mountNav('search', render);
render();
