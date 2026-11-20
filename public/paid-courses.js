// Premium courses (/paid-courses.html): only courses that are sold, with price,
// free samples and Buy. A student who already has a course sees "Owned · Continue",
// and a payment waiting for the admin shows "Payment under review".
import { api, getLang, applyI18n, mountNav, el, num, errorBox, currentUser } from './common.js';
import { courseAccess, paidCourses } from './course-access.js';

const T = {
  en: {
    tagline: 'Learn with purpose', foot: 'Loop & Logic · answers come only from reviewed notes and approved websites',
    title: 'Premium courses',
    sub: 'Full video courses you buy once. Watch the free sample videos first, then pay with bKash or Nagad. An admin checks the payment and unlocks the course, usually within a day.',
    privacy: 'What we keep about payments',
    videos: (v, h) => `${v} videos · ${h} h`, samples: (n) => `${n} free sample videos`,
    watchSamples: 'Watch free samples', buy: 'Buy', owned: 'Owned · Continue', pending: 'Payment under review',
    empty: 'Premium courses are coming soon. Meanwhile, all our video courses and tutorials are free.', browse: 'Browse all courses',
  },
  bn: {
    tagline: 'উদ্দেশ্য নিয়ে শেখা', foot: 'লুপ অ্যান্ড লজিক · উত্তর আসে শুধু পর্যালোচিত নোট আর অনুমোদিত ওয়েবসাইট থেকে',
    title: 'প্রিমিয়াম কোর্স',
    sub: 'একবার কিনলেই পুরো ভিডিও কোর্স। আগে ফ্রি নমুনা ভিডিওগুলো দেখো, তারপর bKash বা Nagad দিয়ে পেমেন্ট করো। একজন অ্যাডমিন পেমেন্ট মিলিয়ে কোর্সটা খুলে দেন, সাধারণত এক দিনের মধ্যে।',
    privacy: 'পেমেন্টের কোন তথ্য আমরা রাখি',
    videos: (v, h) => `${v}টি ভিডিও · ${h} ঘণ্টা`, samples: (n) => `${n}টি ফ্রি নমুনা ভিডিও`,
    watchSamples: 'ফ্রি নমুনা দেখো', buy: 'কিনো', owned: 'কেনা আছে · দেখা চালিয়ে যাও', pending: 'পেমেন্ট যাচাই চলছে',
    empty: 'প্রিমিয়াম কোর্স শিগগিরই আসছে। এর মধ্যে আমাদের সব ভিডিও কোর্স আর টিউটোরিয়াল ফ্রি।', browse: 'সব কোর্স দেখো',
  },
};
const t = () => T[getLang()];
const main = document.getElementById('main');
const enc = encodeURIComponent;

function card(c, L, mine) {
  const acc = courseAccess(c, getLang());
  const owned = mine.owned.includes(c.id), pending = mine.pending.includes(c.id);
  const action = owned
    ? el('a', { class: 'btn primary small', href: `/watch.html?course=${enc(c.id)}`, text: L.owned })
    : pending
      ? el('a', { class: 'btn ghost small', href: `/buy.html?course=${enc(c.id)}`, text: L.pending })
      : el('a', { class: 'btn primary small', href: `/buy.html?course=${enc(c.id)}`, text: acc.price ? `${L.buy} · ${acc.price}` : L.buy });
  return el('article', { class: 'course-card paid-card' },
    el('div', { class: 'top-row' }, el('span', { class: `course-ico s-${c.subject}`, 'aria-hidden': 'true', text: (c.code ?? c.title).replace(/[^A-Za-z0-9ঀ-৿ ]/g, '').split(/\s+/).map((w) => w[0]).join('').slice(0, 3).toUpperCase() }),
      el('span', { class: 'access-tag paid', text: acc.label })),
    el('h3', {}, el('a', { href: `/course.html?id=${enc(c.id)}`, text: c.title })),
    el('p', { text: c.blurb }),
    el('div', { class: 'meta' }, el('span', { text: L.videos(num(c.videos), num(c.hours)) }), c.samples ? el('span', { text: L.samples(num(c.samples)) }) : null),
    el('div', { class: 'course-cell-actions' }, c.samples && !owned ? el('a', { class: 'btn ghost small', href: `/watch.html?course=${enc(c.id)}`, text: L.watchSamples }) : null, action));
}

async function load() {
  const L = t();
  applyI18n(L);
  document.title = `${L.title} · Loop & Logic`;
  try {
    const data = await fetch(`/api/courses?lang=${getLang()}`).then((r) => { if (!r.ok) throw new Error(r.statusText); return r.json(); });
    const list = paidCourses(data.courses);
    const mine = list.length && currentUser() ? await api('GET', '/api/my-course-access').catch(() => ({ owned: [], pending: [] })) : { owned: [], pending: [] };
    main.replaceChildren(
      el('div', { class: 'page-head' }, el('h1', { text: L.title }), el('p', { text: L.sub }),
        el('p', { class: 'small' }, el('a', { href: '/privacy.html#what-we-collect', text: L.privacy }))),
      list.length
        ? el('div', { class: 'grid' }, ...list.map((c) => card(c, L, mine)))
        : el('div', { class: 'card empty' }, el('p', { text: L.empty }), el('a', { class: 'btn primary', href: '/courses.html', text: L.browse })));
  } catch (e) { errorBox(main, e.message, load); }
}

mountNav('paid', load);
window.addEventListener('ll-auth', () => load());
applyI18n(t());
load();
