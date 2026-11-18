// Shared UI pieces for the app pages.
import { el, num } from './common.js';

/** Course card. L needs: adaptive, videoOnly, videos. */
export function courseCard(c, L) {
  const initials = (c.code ?? c.title).replace(/[^A-Za-z0-9ঀ-৿ ]/g, '').split(/\s+/).map((w) => w[0]).join('').slice(0, 3).toUpperCase();
  return el('a', { class: 'course-card', href: `/course.html?id=${encodeURIComponent(c.id)}` },
    el('div', { class: 'top-row' },
      el('span', { class: `course-ico s-${c.subject}`, 'aria-hidden': 'true', text: c.code ? c.code.replace('-', '') : initials }),
      el('span', { class: `tag ${c.adaptive ? 'live' : ''}`, text: c.adaptive ? L.adaptive : L.videoOnly })),
    el('h3', { text: c.title }),
    el('p', { text: c.blurb }),
    el('div', { class: 'meta' }, el('span', { text: c.subjectName }), el('span', { text: `${num(c.videos)} ${L.videos}` }),
      c.adaptive && L.lessonsLabs ? el('span', { text: L.lessonsLabs(num(c.lessons), num(c.labs)) }) : null));
}
