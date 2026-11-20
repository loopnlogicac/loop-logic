// Reading style on tutorial pages: Simpler · Standard · Concise.
// Standard is the reviewed text. Concise keeps the first paragraph of each
// section and the code, labs and figures, and folds the rest. Simpler shows a
// plain-words version of a section, written by the AI from that section only and
// checked before it is shown (stored once per section and shared by everyone).
// The suggested style comes from the learner's reading evidence, with the reason.
import { api, getLang, el } from './common.js';

export const readingStyleStrings = {
  en: {
    rsLabel: 'Reading style', rsSimpler: 'Simpler', rsStandard: 'Standard', rsConcise: 'Concise',
    rsSuggested: (s) => `Showing ${s} for you.`, rsBecause: 'Based on your recent reading.', rsUseStandard: 'Show the standard text',
    rsShort: 'In short', rsMore: (n) => `Show the full section (${n} more)`,
    rsLoad: '✨ Simpler wording for this part', rsLoading: 'Writing a simpler version and checking it…',
    rsChecked: 'Simpler wording · checked against this section', rsOriginal: 'Show the original wording', rsHideOriginal: 'Hide the original wording',
    rsAiOff: 'Simpler wording needs the AI, which is switched off right now. The original text is below.',
    rsLimit: 'You have used today’s AI answers. Parts other learners already simplified still open; the original text is below.',
    rsFailed: 'The simpler version did not pass our check, so you are reading the original text.',
  },
  bn: {
    rsLabel: 'পড়ার ধরন', rsSimpler: 'সহজ', rsStandard: 'সাধারণ', rsConcise: 'সংক্ষেপে',
    rsSuggested: (s) => `তোমার জন্য "${s}" দেখানো হচ্ছে।`, rsBecause: 'তোমার সাম্প্রতিক পড়ার ভিত্তিতে।', rsUseStandard: 'সাধারণ লেখা দেখাও',
    rsShort: 'এক নজরে', rsMore: (n) => `পুরো অংশ দেখাও (আরও ${n}টি)`,
    rsLoad: '✨ এই অংশ সহজ ভাষায়', rsLoading: 'সহজ সংস্করণ লেখা ও যাচাই হচ্ছে…',
    rsChecked: 'সহজ ভাষা · এই অংশের সঙ্গে যাচাই করা', rsOriginal: 'মূল লেখা দেখাও', rsHideOriginal: 'মূল লেখা লুকাও',
    rsAiOff: 'সহজ ভাষার জন্য এআই দরকার, যা এখন বন্ধ। মূল লেখা নিচে আছে।',
    rsLimit: 'আজকের এআই উত্তর শেষ। অন্যরা আগে যে অংশ সহজ করেছে সেগুলো খুলবে; মূল লেখা নিচে আছে।',
    rsFailed: 'সহজ সংস্করণটি আমাদের যাচাইয়ে পাস করেনি, তাই মূল লেখাই দেখছ।',
  },
};

const KEY = 'll-tut-style';
const STYLES = ['simpler', 'standard', 'concise'];
const stored = () => { try { const v = localStorage.getItem(KEY); return STYLES.includes(v) ? v : null; } catch { return null; } };
const store = (v) => { try { localStorage.setItem(KEY, v); } catch { /* private window: keep it for this page only */ } };

const isProse = (n) => n.matches('p, ul, ol, blockquote, table, dl, h3, h4, .callout');

/** The article's children grouped at each <h2>; ids match the server's section ids. */
function sectionsOf(body) {
  const out = [];
  let cur = { id: 'intro', head: null, nodes: [] };
  for (const n of [...body.children]) {
    if (n.tagName === 'H2') {
      if (cur.head || cur.nodes.length) out.push(cur);
      cur = { id: n.id || `section-${out.length}`, head: n, nodes: [] };
    } else cur.nodes.push(n);
  }
  if (cur.head || cur.nodes.length) out.push(cur);
  return out;
}

/**
 * @param {{ body: HTMLElement, track: string, topic: string, keyPoints: string[], L: object }} o
 * @returns {Promise<HTMLElement>} the style bar (placed above the article by the caller)
 */
export async function readingStyle({ body, track, topic, keyPoints, L }) {
  const sugg = await api('GET', `/api/learn/${encodeURIComponent(track)}/${encodeURIComponent(topic)}/style?lang=${getLang()}`).catch(() => ({ suggested: 'standard', simplerAvailable: false }));
  const offered = STYLES.filter((s) => s !== 'simpler' || sugg.simplerAvailable);
  const label = { simpler: L.rsSimpler, standard: L.rsStandard, concise: L.rsConcise };
  const choice = stored();
  let current = choice ?? (offered.includes(sugg.suggested) ? sugg.suggested : 'standard');
  const auto = !choice && current !== 'standard';

  const why = el('p', { class: 'rs-why small', hidden: !auto });
  if (auto) why.append(`${L.rsSuggested(label[current])} ${sugg.why ?? L.rsBecause} `, el('button', { type: 'button', class: 'linkish small', text: L.rsUseStandard, onclick: () => pick('standard') }));
  const buttons = offered.map((s) => el('button', { type: 'button', class: 'rs-opt', 'data-style': s, text: label[s], onclick: () => pick(s) }));
  const bar = el('div', { class: 'rs-bar', role: 'group', 'aria-label': L.rsLabel },
    el('div', { class: 'rs-row' }, el('span', { class: 'rs-label', text: L.rsLabel }), el('div', { class: 'rs-opts' }, ...buttons)), why);

  const sections = sectionsOf(body);
  function reset() {
    for (const n of body.parentElement.querySelectorAll('.rs-added')) n.remove();
    for (const n of body.querySelectorAll('.rs-hide')) n.classList.remove('rs-hide');
  }
  function concise() {
    if (keyPoints.length) body.before(el('section', { class: 'rs-added rs-short' }, el('h2', { text: L.rsShort }), el('ul', {}, ...keyPoints.map((k) => el('li', { text: k })))));
    for (const s of sections) {
      const prose = s.nodes.filter(isProse);
      const keep = prose.find((n) => n.tagName === 'P');
      const fold = prose.filter((n) => n !== keep);
      if (!fold.length) continue;
      for (const n of fold) n.classList.add('rs-hide');
      const more = el('button', { type: 'button', class: 'rs-added rs-more chip small', text: L.rsMore(fold.length), onclick: () => { for (const n of fold) n.classList.remove('rs-hide'); more.remove(); } });
      (s.nodes[s.nodes.length - 1] ?? s.head).after(more);
    }
  }
  function simpler() {
    let first = true;
    for (const s of sections) {
      const prose = s.nodes.filter(isProse);
      if (prose.reduce((n, x) => n + x.textContent.length, 0) < 160) continue;
      const box = el('div', { class: 'rs-added rs-simpler' });
      const load = async () => {
        box.replaceChildren(el('p', { class: 'small muted', text: L.rsLoading }));
        try {
          const r = await api('POST', `/api/learn/${encodeURIComponent(track)}/${encodeURIComponent(topic)}/simpler`, { section: s.id, lang: getLang() });
          if (r.origin !== 'ai_checked') { box.replaceChildren(el('p', { class: 'small muted', text: { ai_off: L.rsAiOff, limit: L.rsLimit }[r.reason] ?? L.rsFailed })); return; }
          for (const n of prose) n.classList.add('rs-hide');
          const toggle = el('button', { type: 'button', class: 'linkish small', text: L.rsOriginal });
          toggle.onclick = () => { const hidden = prose[0]?.classList.toggle('rs-hide'); for (const n of prose.slice(1)) n.classList.toggle('rs-hide', hidden); toggle.textContent = hidden ? L.rsOriginal : L.rsHideOriginal; };
          box.replaceChildren(el('span', { class: 'rs-badge', text: L.rsChecked }), ...r.text.split(/\n\s*\n/).map((p) => el('p', { text: p.trim() })), toggle);
        } catch (e) { box.replaceChildren(el('p', { class: 'small muted', text: e.message })); }
      };
      box.append(el('button', { type: 'button', class: 'chip small', text: L.rsLoad, onclick: load }));
      if (s.head) s.head.after(box); else body.prepend(box);
      // The first section loads by itself; the rest on request, to keep AI use low.
      if (first) { first = false; load(); }
    }
  }
  function apply() {
    reset();
    document.documentElement.dataset.readingStyle = current;
    for (const b of buttons) b.setAttribute('aria-pressed', String(b.dataset.style === current));
    if (current === 'concise') concise();
    if (current === 'simpler') simpler();
  }
  function pick(s) {
    current = s;
    store(s);
    why.hidden = true;
    apply();
  }
  apply();
  return bar;
}
