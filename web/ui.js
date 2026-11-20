// Shared UI pieces for the app pages.
import { el, num, getLang } from './common.js';
import { courseAccess } from './course-access.js';

/** Course card. L needs: adaptive, videoOnly, videos; with `L.buy`, a paid course also gets a Buy link under the card. */
export function courseCard(c, L) {
  const acc = courseAccess(c, getLang());
  const initials = (c.code ?? c.title).replace(/[^A-Za-z0-9ঀ-৿ ]/g, '').split(/\s+/).map((w) => w[0]).join('').slice(0, 3).toUpperCase();
  const card = el('a', { class: 'course-card', href: `/course.html?id=${encodeURIComponent(c.id)}` },
    el('div', { class: 'top-row' },
      el('span', { class: `course-ico s-${c.subject}`, 'aria-hidden': 'true', text: c.code ? c.code.replace('-', '') : initials }),
      el('span', { class: `tag ${c.adaptive ? 'live' : ''}`, text: c.adaptive ? L.adaptive : L.videoOnly })),
    el('h3', { text: c.title }),
    el('p', { text: c.blurb }),
    el('div', { class: 'meta' }, el('span', { class: `access-tag ${acc.paid ? 'paid' : 'free'}`, text: acc.label }), el('span', { text: c.subjectName }), el('span', { text: `${num(c.videos)} ${L.videos}` }),
      c.adaptive && L.lessonsLabs ? el('span', { text: L.lessonsLabs(num(c.lessons), num(c.labs)) }) : null));
  if (!acc.paid || !L.buy) return card;
  return el('div', { class: 'course-cell' }, card,
    el('div', { class: 'course-cell-actions' },
      c.samples ? el('a', { class: 'btn ghost small', href: `/watch.html?course=${encodeURIComponent(c.id)}`, text: L.samples }) : null,
      el('a', { class: 'btn primary small', href: `/buy.html?course=${encodeURIComponent(c.id)}`, text: acc.price ? `${L.buy} · ${acc.price}` : L.buy })));
}
