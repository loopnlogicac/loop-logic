#!/usr/bin/env node
// Loop & Logic — C tutorial package checker (format 1.0).
// Zero dependencies. Node 18+. Needs gcc or clang on PATH to compile and run code.
//
//   node tools/check-tutorial.mjs <package-dir> [options]
//
//   --topic <id>      check only this topic (plus the manifest)
//   --no-run          skip compiling/running code (format checks only)
//   --sanitize        also build normal examples with -fsanitize=address,undefined (Linux/macOS)
//   --cc <compiler>   compiler to use (default: gcc, then clang)
//   --report <file>   also write the report to a file (e.g. CHECK_REPORT.txt)
//   --curriculum <f>  default: ../spec/curriculum.json next to this script
//   --videos <f>      default: ../spec/videos.json next to this script
//
// Exit code 0 = no errors (warnings allowed). The Loop & Logic importer runs this
// same script; a package with errors is not imported.

import { readFileSync, existsSync, readdirSync, statSync, mkdtempSync, writeFileSync, copyFileSync, rmSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve, relative, basename, extname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

export const FORMAT_VERSION = '1.0';
const here = dirname(fileURLToPath(import.meta.url));

// ── rules (kept in step with CODEX_PROMPT.md) ───────────────────────────────
const LEVELS = ['beginner', 'intermediate', 'advanced'];
const KINDS = ['lesson', 'project', 'question-bank'];
const STANDARDS = { c89: 'c89', c99: 'c99', c11: 'c11', c17: 'c17', c23: 'c2x' };
const REQUIRED_SECTIONS = ['introduction', 'examples', 'common-mistakes', 'summary'];
const RECOMMENDED_SECTIONS = ['syntax', 'how-it-works', 'version-notes'];
const WORDS = { beginner: [900, 1800], intermediate: [1200, 2400], advanced: [1500, 3000] };
const COUNTS = {
  lesson: { examples: [3, 8], practice: [4, 8], quiz: [10, 20], outputQuiz: 3, keyPoints: [5, 10], examQuestions: [3, 8] },
  project: { examples: [1, 8], practice: [2, 6], quiz: [8, 20], outputQuiz: 0, keyPoints: [4, 10], examQuestions: [2, 8] },
  'question-bank': { examples: [0, 40], practice: [0, 20], quiz: [15, 20], outputQuiz: 5, keyPoints: [3, 10], examQuestions: [10, 60] },
};
const QUIZ_LIMITS = { prompt: 1000, option: 300, explanation: 1500, options: [2, 6], codeLines: 40 };
const APPROVED_HOSTS = ['en.cppreference.com', 'www.open-std.org', 'open-std.org', 'gcc.gnu.org', 'www.gnu.org', 'man7.org', 'clang.llvm.org', 'valgrind.org'];
const DEMONSTRATES = ['compile-error', 'warning', 'undefined-behavior', 'runtime-error'];
const BANNED = [
  [/\bgets\s*\(/, 'gets() was removed in C11 — use fgets'],
  [/conio\.h/, 'conio.h is not standard C'],
  [/\bvoid\s+main\s*\(/, 'main must return int'],
  [/fflush\s*\(\s*stdin\s*\)/, 'fflush(stdin) is undefined behavior'],
  [/\bclrscr\s*\(|\bgetch\s*\(/, 'Turbo C functions are not standard C'],
];

const TAGS = {
  h2: ['id'], h3: ['id'], h4: ['id'], p: ['class'], br: [], hr: [], ul: [], ol: ['start'], li: [],
  strong: [], em: [], code: ['class'], pre: ['class'], kbd: [], dfn: [], abbr: ['title'], sup: [], sub: [],
  table: ['class'], thead: [], tbody: [], tr: [], th: ['scope', 'colspan', 'rowspan'], td: ['colspan', 'rowspan'], caption: [],
  blockquote: [], a: ['href'], figure: [], figcaption: [], img: ['src', 'alt', 'width', 'height'], div: ['class', 'data-example'],
};
const VOID = new Set(['br', 'hr', 'img']);
const CLASSES = {
  p: ['callout-title', 'lead'], pre: ['diagram', 'output'], code: ['language-c', 'language-bash', 'language-text'], table: ['ref'],
  div: ['callout note', 'callout tip', 'callout warning', 'callout danger', 'callout version', 'callout exam'],
};
const ENTITIES = new Set(['amp', 'lt', 'gt', 'quot', 'apos', 'nbsp', 'ndash', 'mdash', 'hellip', 'rarr', 'larr', 'uarr', 'darr', 'times', 'divide', 'le', 'ge', 'ne', 'plusmn', 'deg', 'middot', 'bull', 'copy']);
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// ── report ──────────────────────────────────────────────────────────────────
const out = { errors: [], warnings: [], rows: [] };
const err = (where, msg) => out.errors.push(`ERROR   ${where}: ${msg}`);
const warn = (where, msg) => out.warnings.push(`WARNING ${where}: ${msg}`);

// ── small helpers ───────────────────────────────────────────────────────────
const isStr = (v) => typeof v === 'string' && v.trim().length > 0;
const isBi = (v) => v && typeof v === 'object' && isStr(v.en) && isStr(v.bn);
const between = (n, [lo, hi]) => n >= lo && n <= hi;
const readJson = (file, where) => {
  try { return JSON.parse(readFileSync(file, 'utf8')); } catch (e) { err(where, `cannot read JSON (${e.message})`); return null; }
};
const norm = (s) => s.replace(/\r\n/g, '\n');
const normLoose = (s) => norm(s).split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');
const lineOf = (text, idx) => text.slice(0, idx).split('\n').length;

// ── HTML check ──────────────────────────────────────────────────────────────
export function checkHtml(html, where, ctx) {
  const info = { h2: [], headings: [], placeholders: [], words: 0, links: [], images: [] };
  const stack = [];
  let i = 0;
  let textBuf = '';
  let inPre = 0;
  const flushText = () => {
    if (!inPre) info.words += textBuf.replace(/&[a-z#0-9]+;/gi, ' ').split(/\s+/).filter((w) => /[A-Za-z0-9\u0980-\u09FF]/.test(w)).length;
    textBuf = '';
  };
  let lastHeading = 1;
  let pendingHeading = null;
  while (i < html.length) {
    const ch = html[i];
    if (ch === '&') {
      const m = /^&(#\d+|#x[0-9a-fA-F]+|[a-zA-Z]+);/.exec(html.slice(i, i + 12));
      if (!m) err(where, `line ${lineOf(html, i)}: raw "&" — write &amp;`);
      else if (!m[1].startsWith('#') && !ENTITIES.has(m[1])) err(where, `line ${lineOf(html, i)}: unknown entity &${m[1]};`);
      textBuf += ' ';
      if (pendingHeading) pendingHeading.text += 'x';
      i += m ? m[0].length : 1;
      continue;
    }
    if (ch !== '<') {
      textBuf += ch;
      if (pendingHeading) pendingHeading.text += ch;
      i++;
      continue;
    }
    if (html.startsWith('<!--', i)) { err(where, `line ${lineOf(html, i)}: remove HTML comments`); const e = html.indexOf('-->', i); i = e < 0 ? html.length : e + 3; continue; }
    const m = /^<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:"[^"<>]*"|'[^'<>]*'))?)*)\s*(\/?)>/.exec(html.slice(i, i + 2000));
    if (!m) { err(where, `line ${lineOf(html, i)}: raw "<" (in C code write &lt;, e.g. #include &lt;stdio.h&gt;)`); textBuf += ' '; i++; continue; }
    flushText();
    const [whole, closing, rawTag, rawAttrs] = m;
    const tag = rawTag.toLowerCase();
    const line = lineOf(html, i);
    i += whole.length;
    if (!(tag in TAGS)) { err(where, `line ${line}: tag <${tag}> is not allowed`); continue; }
    if (closing) {
      const top = stack.pop();
      if (top !== tag) err(where, `line ${line}: </${tag}> closes <${top ?? 'nothing'}>`);
      if (tag === 'pre') inPre--;
      if (/^h[234]$/.test(tag) && pendingHeading) {
        if (!pendingHeading.text.trim()) err(where, `line ${line}: empty <${tag}>`);
        info.headings.push(pendingHeading);
        pendingHeading = null;
      }
      continue;
    }
    const attrs = {};
    for (const a of rawAttrs.matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g)) {
      const name = a[1].toLowerCase();
      const value = a[2] ?? a[3] ?? '';
      if (name.startsWith('on') || name === 'style') { err(where, `line ${line}: attribute ${name} is not allowed`); continue; }
      if (!TAGS[tag].includes(name)) { err(where, `line ${line}: <${tag}> may not have attribute "${name}"`); continue; }
      attrs[name] = value;
    }
    if (attrs.class !== undefined && !(CLASSES[tag] ?? []).includes(attrs.class)) err(where, `line ${line}: <${tag} class="${attrs.class}"> — allowed: ${(CLASSES[tag] ?? []).join(', ') || 'none'}`);
    if (tag === 'div' && attrs['data-example'] === undefined && attrs.class === undefined) err(where, `line ${line}: <div> needs class="callout …" or data-example`);
    if (tag === 'div' && attrs['data-example'] !== undefined) {
      info.placeholders.push(attrs['data-example']);
      if (!html.slice(i).startsWith('</div>')) err(where, `line ${line}: example placeholder must be empty: <div data-example="${attrs['data-example']}"></div>`);
    }
    if (/^h[234]$/.test(tag)) {
      const level = Number(tag[1]);
      if (level > lastHeading + 1) err(where, `line ${line}: <${tag}> skips a level`);
      lastHeading = level;
      if (tag === 'h2' && !attrs.id) err(where, `line ${line}: every <h2> needs an id (the section id)`);
      if (attrs.id !== undefined && !KEBAB.test(attrs.id)) err(where, `line ${line}: id "${attrs.id}" must be kebab-case`);
      if (tag === 'h2' && attrs.id) info.h2.push(attrs.id);
      pendingHeading = { tag, id: attrs.id ?? null, text: '' };
    }
    if (tag === 'a') {
      if (!attrs.href) err(where, `line ${line}: <a> needs href`);
      else info.links.push({ href: attrs.href, line });
    }
    if (tag === 'img') {
      if (!isStr(attrs.alt)) err(where, `line ${line}: <img> needs alt text`);
      info.images.push({ src: attrs.src ?? '', line });
    }
    if (tag === 'th' && attrs.scope !== undefined && !['col', 'row'].includes(attrs.scope)) err(where, `line ${line}: th scope must be col or row`);
    if (VOID.has(tag) || m[4] === '/') continue;
    stack.push(tag);
    if (tag === 'pre') inPre++;
  }
  flushText();
  if (stack.length) err(where, `unclosed tags at end: ${stack.map((t) => `<${t}>`).join(' ')}`);
  return info;
}

// ── compiling and running ───────────────────────────────────────────────────
let CC = null;
function findCompiler(pref) {
  for (const c of [pref, 'gcc', 'clang', 'cc'].filter(Boolean)) {
    const r = spawnSync(c, ['--version'], { encoding: 'utf8' });
    if (r.status === 0) return { cmd: c, version: (r.stdout.split('\n')[0] ?? '').trim() };
  }
  return null;
}

function build(srcText, { std = 'c17', flags = [], werror = true, sanitize = false }) {
  const dir = mkdtempSync(join(tmpdir(), 'llc-'));
  const src = join(dir, 'main.c');
  writeFileSync(src, srcText);
  const exe = join(dir, process.platform === 'win32' ? 'main.exe' : 'main');
  const args = [`-std=${STANDARDS[std] ?? 'c17'}`, '-Wall', '-Wextra', '-Wpedantic', '-O2', '-fno-diagnostics-color', ...(werror ? ['-Werror'] : []),
    ...(sanitize ? ['-fsanitize=address,undefined', '-fno-omit-frame-pointer', '-fno-sanitize-recover=all'] : []), src, '-o', exe, ...flags];
  const r = spawnSync(CC.cmd, args, { encoding: 'utf8' });
  return { ok: r.status === 0, diagnostics: (r.stderr || '').trim(), exe, dir };
}

function run(exe, { stdin = '', args = [], cwd, files = [] }) {
  for (const f of files) copyFileSync(f, join(cwd, basename(f)));
  const r = spawnSync(exe, args, { input: stdin, cwd, encoding: 'utf8', timeout: 5000, maxBuffer: 4 * 1024 * 1024, env: { ...process.env, ASAN_OPTIONS: 'detect_leaks=1' } });
  return { status: r.status, signal: r.signal, stdout: r.stdout ?? '', stderr: r.stderr ?? '', timedOut: r.error?.code === 'ETIMEDOUT' };
}

const firstLines = (s, n = 6) => s.split('\n').slice(0, n).join('\n');

function checkSourceStyle(text, where, { demonstrates }) {
  if (/\t/.test(text)) err(where, 'use 4 spaces, not tabs');
  if (!demonstrates) for (const [re, why] of BANNED) if (re.test(text)) err(where, why);
  text.split('\n').forEach((l, n) => { if (l.length > 100) warn(where, `line ${n + 1} is longer than 100 characters`); });
}

function checkProgram({ where, src, std, flags, stdin, args, files, expected, demonstrates, exitCode, opts }) {
  if (opts.noRun) return;
  if (!CC) return;
  if (demonstrates === 'compile-error') {
    const b = build(src, { std, flags, werror: false });
    if (b.ok) err(where, 'marked compile-error but it compiles');
    rmSync(b.dir, { recursive: true, force: true });
    return;
  }
  if (demonstrates === 'warning') {
    const b1 = build(src, { std, flags, werror: false });
    const b2 = build(src, { std, flags, werror: true });
    if (!b1.ok) err(where, `marked warning but it does not compile:\n${firstLines(b1.diagnostics)}`);
    else if (b2.ok) err(where, 'marked warning but the compiler gives no warning with -Wall -Wextra -Wpedantic');
    for (const b of [b1, b2]) rmSync(b.dir, { recursive: true, force: true });
    return;
  }
  const lenient = demonstrates === 'undefined-behavior';
  const b = build(src, { std, flags, werror: !lenient });
  if (!b.ok) { err(where, `does not compile cleanly (-std=${std} -Wall -Wextra -Wpedantic -Werror):\n${firstLines(b.diagnostics)}`); rmSync(b.dir, { recursive: true, force: true }); return; }
  if (lenient) { rmSync(b.dir, { recursive: true, force: true }); return; }
  const r = run(b.exe, { stdin, args, cwd: b.dir, files });
  if (r.timedOut) err(where, 'did not finish within 5 seconds');
  else if (demonstrates === 'runtime-error') { if (r.status === 0 && !r.signal) err(where, 'marked runtime-error but it exits normally'); }
  else {
    const want = exitCode ?? 0;
    if (r.status !== want) err(where, `exit code ${r.status ?? r.signal}, expected ${want}${r.stderr ? `; stderr: ${firstLines(r.stderr, 3)}` : ''}`);
    if (expected !== null && expected !== undefined && norm(r.stdout) !== norm(expected)) {
      err(where, `output differs from the expected file.\n--- expected ---\n${firstLines(norm(expected), 12)}\n--- actual ---\n${firstLines(norm(r.stdout), 12)}`);
    }
  }
  rmSync(b.dir, { recursive: true, force: true });
  if (opts.sanitize && !demonstrates) {
    const s = build(src, { std, flags, werror: true, sanitize: true });
    if (s.ok) {
      const rs = run(s.exe, { stdin, args, cwd: s.dir, files });
      if (rs.status !== (exitCode ?? 0) || /runtime error|AddressSanitizer|LeakSanitizer/.test(rs.stderr)) err(where, `sanitizer found a problem:\n${firstLines(rs.stderr, 8)}`);
    }
    rmSync(s.dir, { recursive: true, force: true });
  }
}

// ── topic check ─────────────────────────────────────────────────────────────
function checkTopic(pkg, mod, topicId, ctx, opts) {
  const dir = join(pkg, 'topics', mod.id, topicId);
  const rel = (f) => relative(pkg, f).split('\\').join('/');
  const tw = rel(join(dir, 'topic.json'));
  const row = { id: topicId, words: 0, examples: 0, practice: 0, quiz: 0, start: out.errors.length, errors: 0 };
  out.rows.push(row);
  if (!existsSync(join(dir, 'topic.json'))) { err(tw, 'missing'); return; }
  const t = readJson(join(dir, 'topic.json'), tw);
  if (!t) return;
  const planned = ctx.topics.get(topicId);

  if (t.schemaVersion !== FORMAT_VERSION) err(tw, `schemaVersion must be "${FORMAT_VERSION}"`);
  if (t.id !== topicId) err(tw, `id "${t.id}" must equal the folder name "${topicId}"`);
  if (t.module !== mod.id) err(tw, `module must be "${mod.id}"`);
  if (planned && t.order !== planned.order) err(tw, `order must be ${planned.order} (curriculum)`);
  if (!isBi(t.title)) err(tw, 'title needs en and bn');
  if (!isBi(t.summary)) err(tw, 'summary needs en and bn');
  else if (t.summary.en.length > 220) warn(tw, 'summary.en is long (keep under 220 characters)');
  if (!LEVELS.includes(t.level)) err(tw, `level must be one of ${LEVELS.join(', ')}`);
  else if (planned && t.level !== planned.level) warn(tw, `level differs from curriculum (${planned.level})`);
  const kind = t.kind ?? 'lesson';
  if (!KINDS.includes(kind)) err(tw, `kind must be one of ${KINDS.join(', ')}`);
  if (!Number.isInteger(t.estMinutes) || !between(t.estMinutes, [5, 120])) err(tw, 'estMinutes must be a whole number 5–120');
  for (const f of ['prerequisites', 'related']) {
    if (!Array.isArray(t[f])) { err(tw, `${f} must be an array (may be empty)`); continue; }
    for (const id of t[f]) if (!ctx.topics.has(id)) err(tw, `${f}: "${id}" is not a curriculum topic`);
  }
  if (!Array.isArray(t.keywords) || !between(t.keywords.length, [3, 15])) err(tw, 'keywords: 3–15 search words');
  if (!t.standards || !Object.keys(STANDARDS).includes(t.standards.minimum)) err(tw, `standards.minimum must be one of ${Object.keys(STANDARDS).join(', ')}`);
  if (t.standards && !Array.isArray(t.standards.notes)) err(tw, 'standards.notes must be an array of short strings');
  if (!Array.isArray(t.videos)) err(tw, 'videos must be an array (may be empty)');
  else for (const v of t.videos) if (!ctx.videos.has(v?.videoId)) err(tw, `videos: "${v?.videoId}" is not in spec/videos.json`);
  if (!Array.isArray(t.references)) err(tw, 'references must be an array');
  else for (const r of t.references) { try { const h = new URL(r.url).host; if (!APPROVED_HOSTS.includes(h)) err(tw, `reference host ${h} is not approved`); } catch { err(tw, `reference url invalid: ${r?.url}`); } }
  if (!t.review || t.review.status !== 'draft') err(tw, 'review.status must be "draft" (Loop & Logic reviewers change it)');
  const C = COUNTS[kind] ?? COUNTS.lesson;

  // body
  const bodyFile = join(dir, 'body.en.html');
  let body = null;
  if (!existsSync(bodyFile)) err(rel(bodyFile), 'missing');
  else {
    const html = readFileSync(bodyFile, 'utf8');
    if (/^\s*<!doctype|<html|<head|<body/i.test(html)) err(rel(bodyFile), 'write a fragment: no <html>, <head> or <body>');
    body = checkHtml(html, rel(bodyFile), ctx);
    row.words = body.words;
    const ids = (t.sections ?? []).map((s) => s.id);
    if (!Array.isArray(t.sections) || t.sections.some((s) => !isStr(s?.id) || !isStr(s?.title))) err(tw, 'sections must be [{id, title}]');
    if (JSON.stringify(ids) !== JSON.stringify(body.h2)) err(tw, `sections ${JSON.stringify(ids)} must match the <h2> ids in body.en.html, in order: ${JSON.stringify(body.h2)}`);
    for (const s of REQUIRED_SECTIONS) if (kind === 'lesson' && !body.h2.includes(s)) err(rel(bodyFile), `missing required section <h2 id="${s}">`);
    for (const s of RECOMMENDED_SECTIONS) if (kind === 'lesson' && !body.h2.includes(s)) warn(rel(bodyFile), `consider a "${s}" section`);
    if (kind === 'lesson' && t.level) {
      const [lo, hi] = WORDS[t.level] ?? [0, 1e9];
      if (body.words < lo * 0.6) err(rel(bodyFile), `${body.words} words — far below the ${lo}–${hi} target for ${t.level}`);
      else if (body.words < lo) warn(rel(bodyFile), `${body.words} words — below the ${lo}–${hi} target`);
      else if (body.words > hi * 1.3) warn(rel(bodyFile), `${body.words} words — consider splitting (target ${lo}–${hi})`);
    }
    for (const l of body.links) {
      if (l.href.startsWith('topic:')) { if (!ctx.topics.has(l.href.slice(6).split('#')[0])) err(rel(bodyFile), `line ${l.line}: link to unknown topic ${l.href}`); }
      else if (l.href.startsWith('#')) { if (!body.headings.some((h) => h.id === l.href.slice(1))) err(rel(bodyFile), `line ${l.line}: anchor ${l.href} not found`); }
      else { try { const h = new URL(l.href).host; if (!l.href.startsWith('https://') || !APPROVED_HOSTS.includes(h)) err(rel(bodyFile), `line ${l.line}: external link ${l.href} — only https to ${APPROVED_HOSTS.join(', ')}`); } catch { err(rel(bodyFile), `line ${l.line}: bad href ${l.href}`); } }
    }
    for (const im of body.images) {
      const p = join(dir, im.src);
      if (!/^assets\/[a-z0-9-]+\.(svg|png|webp)$/.test(im.src)) err(rel(bodyFile), `line ${im.line}: img src must be assets/<kebab-name>.svg|png|webp`);
      else if (!existsSync(p)) err(rel(bodyFile), `line ${im.line}: ${im.src} not found`);
      else if (im.src.endsWith('.svg') && /<script|href\s*=\s*["']https?:|<foreignObject/i.test(readFileSync(p, 'utf8'))) err(rel(p), 'SVG must not contain scripts, external links or foreignObject');
    }
  }
  const bnFile = join(dir, 'body.bn.html');
  if (existsSync(bnFile) && body) {
    const bn = checkHtml(readFileSync(bnFile, 'utf8'), rel(bnFile), ctx);
    if (JSON.stringify(bn.h2) !== JSON.stringify(body.h2)) err(rel(bnFile), 'Bangla body must have the same <h2> ids in the same order');
    if (JSON.stringify([...bn.placeholders].sort()) !== JSON.stringify([...body.placeholders].sort())) err(rel(bnFile), 'Bangla body must place the same examples');
  }

  // examples
  const exs = Array.isArray(t.examples) ? t.examples : (err(tw, 'examples must be an array'), []);
  row.examples = exs.length;
  if (!between(exs.length, C.examples)) err(tw, `examples: ${exs.length}, need ${C.examples[0]}–${C.examples[1]}`);
  const exIds = new Set();
  for (const [n, e] of exs.entries()) {
    const w = `${tw} examples[${n}]`;
    if (!/^ex-\d+$/.test(e?.id ?? '')) err(w, 'id must be ex-1, ex-2, …');
    if (exIds.has(e.id)) err(w, `duplicate id ${e.id}`);
    exIds.add(e.id);
    if (!isStr(e.title)) err(w, 'title missing');
    if (!isStr(e.explanationHtml)) err(w, 'explanationHtml missing');
    else checkHtml(e.explanationHtml, `${w}.explanationHtml`, ctx);
    if (e.demonstrates !== undefined && !DEMONSTRATES.includes(e.demonstrates)) err(w, `demonstrates must be one of ${DEMONSTRATES.join(', ')}`);
    if (e.standard !== undefined && !(e.standard in STANDARDS)) err(w, 'standard must be c89|c99|c11|c17|c23');
    if (typeof e.tryNow !== 'boolean') err(w, 'tryNow must be true or false');
    const src = join(dir, e.file ?? '');
    if (!/^examples\/ex-\d+\.c$/.test(e.file ?? '') || !existsSync(src)) { err(w, `file must be examples/${e.id}.c and exist`); continue; }
    const text = readFileSync(src, 'utf8');
    checkSourceStyle(text, rel(src), e);
    const stdin = e.stdin ? (existsSync(join(dir, e.stdin)) ? readFileSync(join(dir, e.stdin), 'utf8') : (err(w, `stdin file ${e.stdin} missing`), '')) : '';
    let expected = null;
    if (e.output) {
      if (!existsSync(join(dir, e.output))) err(w, `output file ${e.output} missing`);
      else expected = readFileSync(join(dir, e.output), 'utf8');
    } else if (!e.demonstrates && e.deterministic !== false) err(w, 'output file required (or set "deterministic": false with outputNote)');
    if (e.deterministic === false && !isStr(e.outputNote)) err(w, 'deterministic:false needs outputNote explaining why output varies');
    const files = (e.workdirFiles ?? []).map((f) => join(dir, f));
    for (const f of files) if (!existsSync(f)) err(w, `workdirFile ${f} missing`);
    checkProgram({ where: rel(src), src: text, std: e.standard ?? 'c17', flags: e.compilerFlags ?? [], stdin, args: e.args ?? [], files, expected: e.deterministic === false ? null : expected, demonstrates: e.demonstrates, exitCode: e.exitCode, opts });
  }
  if (body) {
    for (const id of exIds) { const c = body.placeholders.filter((p) => p === id).length; if (c !== 1) err(rel(bodyFile), `example ${id} must be placed exactly once with <div data-example="${id}"></div> (found ${c})`); }
    for (const p of body.placeholders) if (!exIds.has(p)) err(rel(bodyFile), `placeholder ${p} has no example in topic.json`);
  }

  // practice
  const prs = Array.isArray(t.practice) ? t.practice : (err(tw, 'practice must be an array'), []);
  row.practice = prs.length;
  if (!between(prs.length, C.practice)) err(tw, `practice: ${prs.length}, need ${C.practice[0]}–${C.practice[1]}`);
  for (const [n, p] of prs.entries()) {
    const w = `${tw} practice[${n}]`;
    if (!/^p-\d+$/.test(p?.id ?? '')) err(w, 'id must be p-1, p-2, …');
    if (!['easy', 'medium', 'hard'].includes(p.difficulty)) err(w, 'difficulty must be easy|medium|hard');
    if (!isStr(p.title)) err(w, 'title missing');
    if (!isStr(p.statementHtml)) err(w, 'statementHtml missing'); else checkHtml(p.statementHtml, `${w}.statementHtml`, ctx);
    if (!Array.isArray(p.hints) || p.hints.length < 1) err(w, 'at least one hint');
    const sol = join(dir, p.solution ?? '');
    if (!/^practice\/p-\d+\.c$/.test(p.solution ?? '') || !existsSync(sol)) { err(w, 'solution must be practice/p-N.c and exist'); continue; }
    const text = readFileSync(sol, 'utf8');
    checkSourceStyle(text, rel(sol), {});
    if (!Array.isArray(p.tests) || p.tests.length < 2) { err(w, 'at least 2 tests [{stdin, output}]'); continue; }
    for (const [k, tc] of p.tests.entries()) {
      const tin = tc.stdin ? join(dir, tc.stdin) : null;
      const tout = join(dir, tc.output ?? '');
      if (tin && !existsSync(tin)) { err(w, `tests[${k}].stdin missing`); continue; }
      if (!existsSync(tout)) { err(w, `tests[${k}].output missing`); continue; }
      checkProgram({ where: `${rel(sol)} test ${k + 1}`, src: text, std: p.standard ?? 'c17', flags: p.compilerFlags ?? [], stdin: tin ? readFileSync(tin, 'utf8') : '', args: [], files: [], expected: readFileSync(tout, 'utf8'), opts });
    }
  }

  // quiz
  const qs = Array.isArray(t.quiz) ? t.quiz : (err(tw, 'quiz must be an array'), []);
  row.quiz = qs.length;
  if (!between(qs.length, C.quiz)) err(tw, `quiz: ${qs.length} questions, need ${C.quiz[0]}–${C.quiz[1]}`);
  const outQ = qs.filter((q) => q?.type === 'output').length;
  if (outQ < C.outputQuiz) err(tw, `quiz: ${outQ} output questions, need at least ${C.outputQuiz}`);
  const qIds = new Set();
  const answerAt = [0, 0, 0, 0, 0, 0];
  for (const [n, q] of qs.entries()) {
    const w = `${tw} quiz[${n}]`;
    if (!/^q-\d+$/.test(q?.id ?? '')) err(w, 'id must be q-1, q-2, …');
    if (qIds.has(q.id)) err(w, `duplicate id ${q.id}`);
    qIds.add(q.id);
    if (!['mcq', 'output'].includes(q.type)) err(w, 'type must be mcq or output');
    if (!['easy', 'medium', 'hard'].includes(q.difficulty)) err(w, 'difficulty must be easy|medium|hard');
    if (!isStr(q.prompt) || q.prompt.length > QUIZ_LIMITS.prompt) err(w, `prompt required, ≤ ${QUIZ_LIMITS.prompt} characters`);
    if (!Array.isArray(q.options) || !between(q.options.length, QUIZ_LIMITS.options)) { err(w, 'options: 2–6'); continue; }
    if (q.options.some((o) => typeof o !== 'string' || !o.trim() || o.length > QUIZ_LIMITS.option)) err(w, `each option: non-empty, ≤ ${QUIZ_LIMITS.option} characters`);
    if (new Set(q.options.map((o) => normLoose(String(o)))).size !== q.options.length) err(w, 'options must all be different');
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) { err(w, 'answer must be the index of the correct option'); continue; }
    answerAt[q.answer]++;
    if (!isStr(q.explanation) || q.explanation.length > QUIZ_LIMITS.explanation) err(w, `explanation required, ≤ ${QUIZ_LIMITS.explanation} characters`);
    if (q.code !== undefined) {
      if (!isStr(q.code)) err(w, 'code must be a string');
      else if (q.code.split('\n').length > QUIZ_LIMITS.codeLines) err(w, `code ≤ ${QUIZ_LIMITS.codeLines} lines`);
    }
    if (q.type === 'output') {
      if (!isStr(q.code) || !/\bmain\s*\(/.test(q.code)) { err(w, 'output questions need code: a complete program with main'); continue; }
      checkSourceStyle(q.code, `${w}.code`, {});
      if (!opts.noRun && CC) {
        const b = build(q.code, { std: q.standard ?? 'c17', flags: q.compilerFlags ?? [] });
        if (!b.ok) err(w, `code does not compile cleanly:\n${firstLines(b.diagnostics)}`);
        else {
          const r = run(b.exe, { cwd: b.dir });
          const actual = normLoose(r.stdout);
          if (actual !== normLoose(q.options[q.answer])) err(w, `options[${q.answer}] is ${JSON.stringify(q.options[q.answer])} but the program prints ${JSON.stringify(actual)}`);
          const dup = q.options.findIndex((o, k) => k !== q.answer && normLoose(o) === actual);
          if (dup >= 0) err(w, `option ${dup} also matches the real output`);
        }
        rmSync(b.dir, { recursive: true, force: true });
      }
    }
  }
  if (qs.length >= 6 && Math.max(...answerAt) > qs.length * 0.5) warn(tw, `quiz answers bunch on one position (${answerAt.slice(0, 4).join('/')}) — vary them`);

  // the rest
  if (!Array.isArray(t.keyPoints) || !between(t.keyPoints.length, C.keyPoints) || t.keyPoints.some((k) => !isBi(k))) err(tw, `keyPoints: ${C.keyPoints[0]}–${C.keyPoints[1]} items, each {en, bn}`);
  if (!Array.isArray(t.examQuestions) || !between(t.examQuestions.length, C.examQuestions)) err(tw, `examQuestions: ${C.examQuestions[0]}–${C.examQuestions[1]}`);
  else for (const [n, q] of t.examQuestions.entries()) {
    const w = `${tw} examQuestions[${n}]`;
    if (!isStr(q.question)) err(w, 'question missing');
    if (!['short', 'long', 'output', 'program'].includes(q.type)) err(w, 'type must be short|long|output|program');
    if (!isStr(q.answerHtml)) err(w, 'answerHtml missing'); else checkHtml(q.answerHtml, `${w}.answerHtml`, ctx);
  }
}

// ── package check ───────────────────────────────────────────────────────────
export function checkPackage(pkg, opts = {}) {
  pkg = resolve(pkg);
  const curriculum = readJson(opts.curriculum ?? join(here, '..', 'spec', 'curriculum.json'), 'curriculum.json');
  const videosSpec = readJson(opts.videos ?? join(here, '..', 'spec', 'videos.json'), 'videos.json');
  if (!curriculum || !videosSpec) return out;
  const ctx = { topics: new Map(), modules: new Map(), videos: new Set(videosSpec.videos.map((v) => v.videoId)) };
  for (const m of curriculum.modules) { ctx.modules.set(m.id, m); for (const t of m.topics) ctx.topics.set(t.id, { ...t, module: m.id }); }

  if (!opts.noRun) {
    CC = findCompiler(opts.cc);
    if (!CC) err('compiler', 'gcc/clang not found — install one, or pass --no-run (the package cannot be accepted without running the code)');
  }

  const mw = 'manifest.json';
  const man = existsSync(join(pkg, mw)) ? readJson(join(pkg, mw), mw) : (err(mw, 'missing'), null);
  if (!man) return out;
  if (man.schemaVersion !== FORMAT_VERSION) err(mw, `schemaVersion must be "${FORMAT_VERSION}"`);
  if (man.packageId !== curriculum.packageId) err(mw, `packageId must be "${curriculum.packageId}"`);
  if (!/^\d+\.\d+\.\d+$/.test(man.packageVersion ?? '')) err(mw, 'packageVersion must be semver, e.g. 0.3.0');
  if (!isStr(man.generatedAt) || Number.isNaN(Date.parse(man.generatedAt))) err(mw, 'generatedAt must be an ISO date-time');
  if (!isStr(man.compiler)) err(mw, 'compiler must record the compiler and version used, e.g. "gcc 13.3.0"');
  if (!Array.isArray(man.modules)) { err(mw, 'modules must be an array'); return out; }
  let lastOrder = 0;
  const listed = new Set();
  for (const mm of man.modules) {
    const cm = ctx.modules.get(mm.id);
    if (!cm) { err(mw, `module "${mm.id}" is not in the curriculum`); continue; }
    if (cm.order <= lastOrder) err(mw, `module "${mm.id}" is out of curriculum order`);
    lastOrder = cm.order;
    if (!Array.isArray(mm.topics)) { err(mw, `module ${mm.id}: topics must be an array`); continue; }
    let lastT = 0;
    for (const tid of mm.topics) {
      const ct = cm.topics.find((x) => x.id === tid);
      if (!ct) { err(mw, `topic "${tid}" is not in module ${mm.id} of the curriculum`); continue; }
      if (ct.order <= lastT) err(mw, `topic "${tid}" is out of curriculum order`);
      lastT = ct.order;
      listed.add(tid);
      if (!opts.topic || opts.topic === tid) {
        checkTopic(pkg, cm, tid, ctx, opts);
        const row = out.rows.at(-1);
        if (row && row.id === tid) row.errors = out.errors.length - row.start;
      }
    }
  }
  // folders that exist but are not listed
  const topicsDir = join(pkg, 'topics');
  if (existsSync(topicsDir)) for (const m of readdirSync(topicsDir)) {
    if (!statSync(join(topicsDir, m)).isDirectory()) continue;
    for (const tid of readdirSync(join(topicsDir, m))) if (statSync(join(topicsDir, m, tid)).isDirectory() && !listed.has(tid)) err(`topics/${m}/${tid}`, 'folder exists but is not listed in manifest.json');
  }
  if (opts.topic && !listed.has(opts.topic)) err(mw, `topic ${opts.topic} is not listed`);
  out.compiler = CC?.version ?? '(not run)';
  out.delivered = listed.size;
  out.planned = ctx.topics.size;
  return out;
}

function formatReport(r) {
  const lines = [`Loop & Logic C tutorial check — format ${FORMAT_VERSION} — ${new Date().toISOString()}`, `Compiler: ${r.compiler ?? '-'}    Topics delivered: ${r.delivered ?? 0}/${r.planned ?? '?'}`, ''];
  if (r.rows.length) {
    lines.push('topic'.padEnd(36) + 'words'.padStart(7) + 'ex'.padStart(5) + 'prac'.padStart(6) + 'quiz'.padStart(6) + 'errors'.padStart(8));
    for (const x of r.rows) lines.push(x.id.padEnd(36) + String(x.words).padStart(7) + String(x.examples).padStart(5) + String(x.practice).padStart(6) + String(x.quiz).padStart(6) + String(x.errors).padStart(8));
    lines.push('');
  }
  lines.push(...r.errors, ...r.warnings, '', `${r.errors.length} error(s), ${r.warnings.length} warning(s)`, r.errors.length ? 'RESULT: NOT READY' : 'RESULT: READY FOR IMPORT');
  return lines.join('\n');
}

// ── CLI ─────────────────────────────────────────────────────────────────────
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2);
  const opt = (name) => { const i = a.indexOf(name); return i >= 0 ? a[i + 1] : undefined; };
  const pkg = a.find((x, i) => !x.startsWith('--') && !['--topic', '--cc', '--report', '--curriculum', '--videos'].includes(a[i - 1]));
  if (!pkg) { console.error('usage: node tools/check-tutorial.mjs <package-dir> [--topic id] [--no-run] [--sanitize] [--cc gcc] [--report file]'); process.exit(2); }
  const r = checkPackage(pkg, { topic: opt('--topic'), noRun: a.includes('--no-run'), sanitize: a.includes('--sanitize'), cc: opt('--cc'), curriculum: opt('--curriculum'), videos: opt('--videos') });
  const text = formatReport(r);
  console.log(text);
  if (opt('--report')) writeFileSync(opt('--report'), text + '\n');
  process.exit(r.errors.length ? 1 : 0);
}
