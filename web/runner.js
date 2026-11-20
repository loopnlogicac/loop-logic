// Run code in the page: an editable code box with Run, input (stdin) and output.
// The code runs in an outside sandbox, never on our server. An unchanged example
// answers at once with the output that was checked when it was written.
import { api, getConfig, getLang, el } from './common.js';

const T = {
  en: {
    run: '▶ Run', running: 'Running…', reset: 'Reset', copy: 'Copy', copied: 'Copied', edited: 'edited',
    input: 'Input (what the program reads)', inputHint: 'Type the input here, one value per line, before you press Run.',
    output: 'Output', verified: 'Output · checked when this example was written', yours: 'Your output',
    ok: (ms) => (ms === null ? '✓ Finished' : ms < 1000 ? `✓ Finished in ${ms} ms` : `✓ Finished in ${(ms / 1000).toFixed(1)} s`), compile: '✗ Did not compile', runtime: (c) => `✗ Stopped with an error${c !== null ? ` (exit code ${c})` : ''}`,
    timeout: '✗ Took too long (time limit 5 s). Check for an endless loop.', error: '✗ The sandbox could not run this program.',
    nothing: '(no output)', errors: 'Error messages', compiler: 'Compiler messages',
    expected: 'Expected output', match: '✓ Your output matches the expected output.', differ: '✗ Your output is different from the expected output. Compare them line by line.',
    tip: 'Ctrl + Enter runs the code', tryNow: 'Open in online compiler',
    lang: { c: 'C', cpp: 'C++', java: 'Java', python: 'Python', sql: 'SQL' },
  },
  bn: {
    run: '▶ চালাও', running: 'চলছে…', reset: 'আগের মতো করো', copy: 'কপি', copied: 'কপি হয়েছে', edited: 'বদলানো',
    input: 'ইনপুট (প্রোগ্রাম যা পড়বে)', inputHint: 'চালানোর আগে ইনপুট এখানে লেখো, প্রতি লাইনে একটি মান।',
    output: 'আউটপুট', verified: 'আউটপুট · উদাহরণটি লেখার সময় যাচাই করা', yours: 'তোমার আউটপুট',
    ok: (ms) => (ms === null ? '✓ শেষ হয়েছে' : ms < 1000 ? `✓ ${ms} মিলিসেকেন্ডে শেষ` : `✓ ${(ms / 1000).toFixed(1)} সেকেন্ডে শেষ`), compile: '✗ কম্পাইল হয়নি', runtime: (c) => `✗ এরর দিয়ে থেমে গেছে${c !== null ? ` (exit code ${c})` : ''}`,
    timeout: '✗ অনেক সময় নিচ্ছে (সীমা ৫ সেকেন্ড)। অসীম লুপ আছে কি না দেখো।', error: '✗ স্যান্ডবক্স প্রোগ্রামটি চালাতে পারেনি।',
    nothing: '(কোনো আউটপুট নেই)', errors: 'এরর মেসেজ', compiler: 'কম্পাইলারের মেসেজ',
    expected: 'প্রত্যাশিত আউটপুট', match: '✓ তোমার আউটপুট প্রত্যাশিত আউটপুটের সঙ্গে মিলেছে।', differ: '✗ তোমার আউটপুট প্রত্যাশিত আউটপুট থেকে আলাদা। লাইন ধরে মিলিয়ে দেখো।',
    tip: 'Ctrl + Enter চাপলেও চলে', tryNow: 'অনলাইন কম্পাইলারে খোলো',
    lang: { c: 'C', cpp: 'C++', java: 'Java', python: 'Python', sql: 'SQL' },
  },
};
const t = () => T[getLang()];
const READS_INPUT = /\bscanf\s*\(|\bgetchar\s*\(|\bfgets\s*\(|\bgets\s*\(|\bcin\s*>>|\binput\s*\(|\bsys\.stdin\b|\bScanner\s*\(|\bBufferedReader\b/;
const same = (a, b) => { const n = (s) => String(s ?? '').replace(/\r\n?/g, '\n').split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, ''); return n(a) === n(b); };

let status = null;
/** { enabled, languages } — whether this site can run students' own code. */
export async function runnerStatus() {
  if (!status) status = getConfig().then((c) => c.runner ?? { enabled: false, languages: [] }).catch(() => ({ enabled: false, languages: [] }));
  return status;
}

async function copyText(s) { try { await navigator.clipboard.writeText(s); return true; } catch { return false; } }

/**
 * An editable code box with Run.
 * opts: { code, language, stdin?, ref?: {track, topic, example}, expected?: string, tryNowUrl?, onRun?(result), onReset?() }
 */
export function codeRunner(opts) {
  const L = t();
  const original = opts.code ?? '';
  const originalIn = opts.stdin ?? '';
  const area = el('textarea', { class: 'rn-code', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', 'aria-label': `${L.lang[opts.language] ?? opts.language} code`, wrap: 'off' });
  area.value = original;
  const fit = () => { area.style.height = 'auto'; area.style.height = `${Math.min(area.scrollHeight + 2, 640)}px`; };
  const wantsInput = Boolean(originalIn) || READS_INPUT.test(original);
  const input = el('textarea', { class: 'rn-in', spellcheck: 'false', rows: String(Math.max(2, Math.min(6, originalIn.split('\n').length))), placeholder: L.inputHint, 'aria-label': L.input });
  input.value = originalIn;
  const inputBox = el('details', { class: 'rn-input', open: wantsInput ? true : null }, el('summary', { text: L.input }), input);
  const editedTag = el('span', { class: 'rn-edited', hidden: true, text: L.edited });
  const runBtn = el('button', { type: 'button', class: 'rn-run', text: L.run, title: L.tip });
  const resetBtn = el('button', { type: 'button', class: 'chip small', hidden: true, text: L.reset });
  const copyBtn = el('button', { type: 'button', class: 'chip small', text: L.copy });
  const tryLink = opts.tryNowUrl ? el('a', { class: 'chip small', href: opts.tryNowUrl, target: '_blank', rel: 'noopener', text: L.tryNow, onclick: () => copyText(area.value) }) : null;
  const result = el('div', { class: 'rn-result', 'aria-live': 'polite' });

  const sync = () => { const changed = area.value !== original || input.value !== originalIn; editedTag.hidden = !changed; resetBtn.hidden = !changed; };
  area.addEventListener('input', () => { fit(); sync(); });
  input.addEventListener('input', sync);
  area.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const s = area.selectionStart, end = area.selectionEnd;
      area.setRangeText('    ', s, end, 'end');
      area.dispatchEvent(new Event('input'));
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); }
  });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); } });
  resetBtn.onclick = () => { area.value = original; input.value = originalIn; fit(); sync(); result.replaceChildren(); opts.onReset?.(); };
  copyBtn.onclick = async () => { if (await copyText(area.value)) { copyBtn.textContent = L.copied; setTimeout(() => (copyBtn.textContent = L.copy), 1500); } };

  async function run() {
    if (runBtn.disabled) return;
    runBtn.disabled = true; runBtn.textContent = L.running;
    result.replaceChildren(el('div', { class: 'rn-wait' }, el('span', { class: 'rn-spin', 'aria-hidden': 'true' }), L.running));
    try {
      const r = await api('POST', '/api/run', { language: opts.language, code: area.value, stdin: input.value, ref: opts.ref ?? null });
      result.replaceChildren(...view(r));
      opts.onRun?.(r);
    } catch (e) {
      result.replaceChildren(el('p', { class: 'rn-msg bad', text: e.message }));
    } finally {
      runBtn.disabled = false; runBtn.textContent = L.run;
    }
  }
  runBtn.onclick = run;

  function view(r) {
    const head = r.status === 'ok' ? L.ok(r.timeMs) : r.status === 'compile_error' ? L.compile : r.status === 'runtime_error' ? L.runtime(r.exitCode) : r.status === 'timeout' ? L.timeout : L.error;
    const out = [el('div', { class: `rn-status ${r.status === 'ok' ? 'ok' : 'bad'}` }, el('span', { text: head }), r.verified ? el('span', { class: 'rn-tag', text: L.verified }) : null)];
    if (r.compileOutput && r.status === 'compile_error') out.push(el('div', { class: 'rn-block' }, el('span', { class: 'small muted', text: L.compiler }), el('pre', { class: 'rn-err', text: r.compileOutput })));
    if (r.status !== 'compile_error') out.push(el('div', { class: 'rn-block' }, el('span', { class: 'small muted', text: r.verified ? L.output : L.yours }), el('pre', { class: 'rn-out', text: r.stdout || L.nothing })));
    if (r.stderr) out.push(el('div', { class: 'rn-block' }, el('span', { class: 'small muted', text: L.errors }), el('pre', { class: 'rn-err', text: r.stderr })));
    if (typeof opts.expected === 'string' && r.status === 'ok') {
      const ok = same(r.stdout, opts.expected);
      out.push(el('p', { class: `rn-msg ${ok ? 'good' : 'bad'}`, text: ok ? L.match : L.differ }));
      if (!ok) out.push(el('div', { class: 'rn-block' }, el('span', { class: 'small muted', text: L.expected }), el('pre', { class: 'rn-out', text: opts.expected })));
    }
    return out;
  }

  const box = el('div', { class: 'rn' },
    el('div', { class: 'tut-code-bar rn-bar' }, el('span', {}, el('span', { text: (L.lang[opts.language] ?? opts.language).toUpperCase() }), editedTag), el('span', { class: 'rn-actions' }, resetBtn, copyBtn, tryLink, runBtn)),
    area, inputBox, result);
  requestAnimationFrame(fit);
  // fit again once the box is visible (inside closed <details> its height is 0 at first)
  if ('IntersectionObserver' in window) { const io = new IntersectionObserver((es) => { if (es.some((x) => x.isIntersecting)) { fit(); io.disconnect(); } }); io.observe(area); }
  return box;
}
