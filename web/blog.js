// Blog list (/blog.html) and one post (/post.html?slug=…), written in the admin site.
import { getLang, applyI18n, mountNav, el, fillAdSlots } from './common.js';

const T = {
  en: { tagline: 'Learn with purpose', title: 'Blog and news', sub: 'Updates, study guides and exam notices from the Loop & Logic team.', none: 'No posts yet. Check back soon.', back: '← All posts', notFound: 'This post could not be found.', types: { blog: 'Blog', news: 'News', changelog: 'What is new', 'exam-notice': 'Exam notice' } },
  bn: { tagline: 'উদ্দেশ্য নিয়ে শেখা', title: 'ব্লগ ও খবর', sub: 'Loop & Logic টিমের আপডেট, পড়ার গাইড আর পরীক্ষার নোটিশ।', none: 'এখনো কোনো পোস্ট নেই। শিগগিরই আবার দেখো।', back: '← সব লেখা', notFound: 'এই লেখাটি পাওয়া যায়নি।', types: { blog: 'ব্লগ', news: 'খবর', changelog: 'নতুন কী', 'exam-notice': 'পরীক্ষার নোটিশ' } },
};
const t = () => T[getLang()];
const main = document.getElementById('main');
const slug = new URLSearchParams(location.search).get('slug');
const date = (iso) => new Date(iso).toLocaleDateString(getLang() === 'bn' ? 'bn-BD' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

async function load() {
  const L = t();
  applyI18n({ tagline: L.tagline });
  const lang = getLang();
  if (!slug) {
    document.title = `${L.title} · Loop & Logic`;
    const { posts } = await fetch(`/api/posts?lang=${lang}`).then((r) => r.json());
    main.replaceChildren(el('h1', { text: L.title }), el('p', { class: 'muted', text: L.sub }), el('div', { id: 'ad-inline', class: 'ad-slot' }),
      posts.length ? el('div', { class: 'blog-list' }, ...posts.map((p) => el('a', { class: 'blog-item', href: `/post.html?slug=${encodeURIComponent(p.slug)}` },
        el('div', { class: 'blog-meta' }, el('span', { class: 'blog-type', text: L.types[p.type] ?? p.type }), el('span', { text: date(p.publishedAt) })),
        el('h2', { text: p.title }), el('p', { text: p.excerpt })))) : el('p', { class: 'muted', text: L.none }));
  } else {
    const r = await fetch(`/api/posts/${encodeURIComponent(slug)}?lang=${lang}`);
    if (!r.ok) { main.replaceChildren(el('a', { href: '/blog.html', text: L.back }), el('h1', { text: L.notFound })); return; }
    const p = await r.json();
    document.title = `${p.title} · Loop & Logic`;
    const body = el('div', { class: 'blog-body tut-html', lang: p.bodyLang });
    body.innerHTML = p.bodyHtml; // built on the server from escaped Markdown, then filtered again
    for (const a of body.querySelectorAll('a[href^="https://"]')) { a.target = '_blank'; a.rel = 'noopener'; }
    main.replaceChildren(el('a', { href: '/blog.html', text: L.back }),
      el('div', { class: 'blog-meta' }, el('span', { class: 'blog-type', text: L.types[p.type] ?? p.type }), el('span', { text: `${date(p.publishedAt)} · ${p.author}` })),
      el('h1', { text: p.title }), el('div', { id: 'ad-inline', class: 'ad-slot' }), body,
      p.tags?.length ? el('div', { class: 'blog-tags' }, ...p.tags.map((x) => el('span', { text: x }))) : null);
  }
  fillAdSlots();
}

mountNav('blog', load);
load().catch((e) => main.replaceChildren(el('p', { text: e.message })));
