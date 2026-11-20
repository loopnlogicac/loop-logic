import { el, api, getLang } from './common.js';
import { renderFigure } from './lab-player.js';
export const studyPlanStrings = {
  en: { planHeading: 'Next for you', planNext: 'Next topic', planReview: 'Try these again', planCheck: 'Check answer', planEmpty: 'You are up to date. Open another track to keep learning.', planError: 'Could not load your study plan. Try again.', planPick: 'Choose an answer first.', planCorrect: 'Correct', planWrong: 'Try this topic again', planRefresh: 'Refresh plan' },
  bn: { planHeading: 'তোমার পরের ধাপ', planNext: 'পরের টপিক', planReview: 'আবার চেষ্টা করো', planCheck: 'উত্তর যাচাই করো', planEmpty: 'এই পর্যন্ত সব দেখা হয়েছে। শেখা চালাতে আরেকটি ট্র্যাক খোলো।', planError: 'তোমার পড়ার পরিকল্পনা আসেনি। আবার চেষ্টা করো।', planPick: 'আগে একটি উত্তর বেছে নাও।', planCorrect: 'ঠিক হয়েছে', planWrong: 'টপিকটি আবার দেখো', planRefresh: 'পরিকল্পনা আবার দেখো' },
};
export function studyPlan(L, context) {
  const box = el('section', { class: 'card study-plan' });
  const load = async () => {
    box.replaceChildren(el('h2', { text: L.planHeading }));
    const query = new URLSearchParams({ lang: getLang() });
    if (context) { query.set('track', context.track); query.set('topic', context.topic); }
    try {
      const d = await api('GET', `/api/study-plan?${query}`);
      if (d.next) box.append(el('h3', { text: L.planNext }), el('a', { href: d.next.href, text: d.next.title }), el('p', { class: 'muted small', text: d.next.reason }));
      if (d.review.length) box.append(el('h3', { text: L.planReview }));
      for (const [i, r] of d.review.entries()) {
        const q = r.question; let choice = null;
        const status = el('p', { role: 'status' });
        const button = el('button', { type: 'button', class: 'btn secondary small', text: L.planCheck });
        button.onclick = async () => {
          if (choice === null) { status.textContent = L.planPick; return; }
          button.disabled = true;
          try {
            const graded = await api('POST', `/api/learn/${encodeURIComponent(r.track)}/${encodeURIComponent(r.topic)}/quiz`, { answers: { [q.id]: choice }, lang: getLang(), review: true });
            const result = graded.results[q.id]; status.textContent = `${result.correct ? L.planCorrect : L.planWrong}: ${result.explanation}`;
          } catch { status.textContent = L.planError; button.disabled = false; }
        };
        box.append(el('fieldset', { class: 'quiz-item', style: 'margin:16px 0;padding:16px;border:1px solid var(--line);border-radius:12px' }, el('legend', { text: q.prompt }), el('a', { href: r.href, text: r.title }), el('p', { class: 'small muted', text: r.reason }), q.figure ? renderFigure(q.figure) : null, q.code ? el('pre', {}, el('code', { text: q.code })) : null,
          ...q.options.map((o, k) => el('label', { class: 'opt', style: 'display:flex;align-items:flex-start;gap:8px;margin:10px 0' }, el('input', { type: 'radio', name: `review-${i}`, onchange: () => { choice = k; } }), o)), button, status));
      }
      if (!d.next && !d.review.length) box.append(el('p', { text: L.planEmpty }));
      box.append(el('button', { type: 'button', class: 'btn ghost small', text: L.planRefresh, onclick: load }));
    } catch { box.append(el('p', { role: 'status', text: L.planError })); }
  };
  load(); return box;
}
