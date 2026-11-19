#!/usr/bin/env node
// Loop & Logic — tutorial package checker, format 1.1 (also accepts 1.0 C packages).
// Zero dependencies. Node 18+. Runs code with: gcc/clang (C), javac/java 17+ (Java),
// python3 3.10+ (Python), mysql client + server 8.0+ (SQL).
//
//   node content-kit/tools/check.mjs <package-dir> [options]
//   node content-kit/tools/check.mjs --lab <lab-dir> --kind <kind>     (one lab on its own)
//
//   --topic <id>        check only this topic (plus the manifest)
//   --no-run            format checks only (the package cannot be accepted this way)
//   --sanitize          C: also run with -fsanitize=address,undefined
//   --require-sql       fail instead of skipping SQL when MySQL is not reachable
//   --require-packages  fail instead of skipping Python examples whose "requires" packages are missing
//   --cc <compiler>     C compiler (default: gcc, then clang)
//   --report <file>     also write the report to a file
//   --curriculum <f>    default: <package-dir>/../spec/curriculum.json
//   --videos <f>        default: content-kit/spec/videos.json
//
// MySQL connection: MYSQL_HOST, MYSQL_PORT, MYSQL_USER (default root), MYSQL_PWD.
// Exit code 0 = no errors. The Loop & Logic importer runs this same script.

import { readFileSync, existsSync, readdirSync, statSync, mkdtempSync, writeFileSync, copyFileSync, rmSync } from 'node:fs';
import { join, dirname, resolve, relative, basename } from 'node:path';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { LAB_KINDS, loadTrace, playTrace, partialMatch, checkInputSpec, validInput, fuzzInputs, checkFigure, LabError } from './labs.mjs';

export const FORMAT_VERSIONS = ['1.0', '1.1'];
const here = dirname(fileURLToPath(import.meta.url));

// ── rules ───────────────────────────────────────────────────────────────────
const LEVELS = ['beginner', 'intermediate', 'advanced'];
const KINDS = ['lesson', 'theory', 'project', 'question-bank'];
const C_STD = { c89: 'c89', c99: 'c99', c11: 'c11', c17: 'c17', c23: 'c2x' };
const LANGS = { c: '.c', java: '.java', python: '.py', sql: '.sql' };
const REQUIRED_SECTIONS = { lesson: ['introduction', 'examples', 'common-mistakes', 'summary'], theory: ['introduction', 'worked-examples', 'common-mistakes', 'summary'], project: ['introduction'], 'question-bank': ['introduction'] };
const RECOMMENDED_SECTIONS = { lesson: ['syntax', 'how-it-works', 'version-notes'], theory: ['how-it-works'] };
const WORDS = { beginner: [900, 1800], intermediate: [1200, 2400], advanced: [1500, 3000] };
const COUNTS = {
  lesson: { examples: [3, 8], practice: [4, 8], quiz: [10, 20], outputQuiz: 3, keyPoints: [5, 10], examQuestions: [3, 8], codePractice: 2 },
  theory: { examples: [0, 8], practice: [4, 8], quiz: [10, 20], outputQuiz: 0, keyPoints: [5, 10], examQuestions: [3, 8], codePractice: 0 },
  project: { examples: [1, 8], practice: [2, 6], quiz: [8, 20], outputQuiz: 0, keyPoints: [4, 10], examQuestions: [2, 8], codePractice: 1 },
  'question-bank': { examples: [0, 40], practice: [0, 20], quiz: [15, 20], outputQuiz: 5, keyPoints: [3, 10], examQuestions: [10, 60], codePractice: 0 },
};
const QUIZ_LIMITS = { prompt: 1000, option: 300, explanation: 1500, options: [2, 6], codeLines: 40 };
const APPROVED_HOSTS = ['en.cppreference.com', 'www.open-std.org', 'open-std.org', 'gcc.gnu.org', 'www.gnu.org', 'man7.org', 'clang.llvm.org', 'valgrind.org',
  'docs.oracle.com', 'openjdk.org', 'dev.java', 'docs.python.org', 'peps.python.org', 'numpy.org', 'pandas.pydata.org', 'matplotlib.org', 'scikit-learn.org', 'developers.google.com', 'pytorch.org',
  'dev.mysql.com', 'www.postgresql.org', 'sqlite.org', 'www.sqlite.org', 'ocw.mit.edu', 'openstax.org', 'www.gnu.org', 'westes.github.io'];
const DEMONSTRATES = ['compile-error', 'warning', 'undefined-behavior', 'runtime-error'];
const BANNED = {
  c: [[/\bgets\s*\(/, 'gets() was removed in C11 — use fgets'], [/conio\.h/, 'conio.h is not standard C'], [/\bvoid\s+main\s*\(/, 'main must return int'], [/fflush\s*\(\s*stdin\s*\)/, 'fflush(stdin) is undefined behavior'], [/\bclrscr\s*\(|\bgetch\s*\(/, 'Turbo C functions are not standard C']],
  java: [[/\bimport\s+java\.awt\.\*|\bimport\s+javax\.swing\.\*/, 'import the classes you use, not whole packages with *']],
  python: [[/\beval\s*\(\s*input\s*\(/, 'never eval(input()) — convert with int()/float()'], [/^\s*from\s+\S+\s+import\s+\*/m, 'avoid "from x import *"']],
  sql: [],
};
// phrases that describe how the content was produced, not the subject
const META_PHRASES = ['this batch', 'the checker', 'check-tutorial', 'check.mjs', 'stdout transcript', 'expected stdout', 'automatic grading', 'automatically graded', 'graded automatically', 'practice scaffold', 'codex', 'as an ai', 'manifest.json', 'topic.json'];

const TAGS = {
  h2: ['id'], h3: ['id'], h4: ['id'], p: ['class'], br: [], hr: [], ul: [], ol: ['start'], li: [],
  strong: [], em: [], code: ['class'], pre: ['class'], kbd: [], dfn: [], abbr: ['title'], sup: [], sub: [],
  table: ['class'], thead: [], tbody: [], tr: [], th: ['scope', 'colspan', 'rowspan'], td: ['colspan', 'rowspan'], caption: [],
  blockquote: [], a: ['href'], figure: [], figcaption: [], img: ['src', 'alt', 'width', 'height'], div: ['class', 'data-example', 'data-lab'],
};
const VOID = new Set(['br', 'hr', 'img']);
const CLASSES = {
  p: ['callout-title', 'lead'], pre: ['diagram', 'output'], code: ['language-c', 'language-java', 'language-python', 'language-sql', 'language-bash', 'language-text'], table: ['ref'],
  div: ['callout note', 'callout tip', 'callout warning', 'callout danger', 'callout version', 'callout exam', 'callout story', 'callout try-it', 'callout unplugged', 'callout deeper', 'callout math'],
};
const ENTITIES = new Set(['amp', 'lt', 'gt', 'quot', 'apos', 'nbsp', 'ndash', 'mdash', 'hellip', 'rarr', 'larr', 'uarr', 'darr', 'harr', 'rArr', 'lArr', 'hArr', 'times', 'divide', 'le', 'ge', 'ne', 'plusmn', 'deg', 'middot', 'bull', 'copy', 'epsilon', 'empty', 'isin', 'notin', 'cup', 'cap', 'sub', 'sube', 'sup', 'supe', 'forall', 'exist', 'and', 'or', 'not', 'sigma', 'Sigma', 'pi', 'lambda', 'alpha', 'beta', 'theta', 'Theta', 'Omega', 'omega', 'infin', 'sum', 'prod', 'radic', 'lfloor', 'rfloor', 'lceil', 'rceil', 'prime', 'Prime']);
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// ── report ──────────────────────────────────────────────────────────────────
let out;
const err = (where, msg) => out.errors.push(`ERROR   ${where}: ${msg}`);
const warn = (where, msg) => out.warnings.push(`WARNING ${where}: ${msg}`);

// ── helpers ─────────────────────────────────────────────────────────────────
const isStr = (v) => typeof v === 'string' && v.trim().length > 0;
const hasBangla = (s) => /[\u0980-\u09FF]/.test(s) && (s.match(/[\u0980-\u09FF]/g) ?? []).length >= (s.match(/[A-Za-z]/g) ?? []).length * 0.4;
const isBi = (v) => v && typeof v === 'object' && isStr(v.en) && isStr(v.bn);
const between = (n, [lo, hi]) => n >= lo && n <= hi;
const readJson = (file, where) => { try { return JSON.parse(readFileSync(file, 'utf8')); } catch (e) { err(where, `cannot read JSON (${e.message})`); return null; } };
const norm = (s) => s.replace(/\r\n/g, '\n');
const normLoose = (s) => norm(s).split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');
const lineOf = (text, idx) => text.slice(0, idx).split('\n').length;
const firstLines = (s, n = 6) => s.split('\n').filter((l) => !/^Picked up JAVA_TOOL_OPTIONS/.test(l)).slice(0, n).join('\n');
const textOf = (html) => html.replace(/<pre[\s\S]*?<\/pre>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&[a-zA-Z#0-9]+;/g, ' ');

// ── HTML ────────────────────────────────────────────────────────────────────
export function checkHtml(html, where) {
  const info = { h2: [], headings: [], placeholders: [], labs: [], words: 0, links: [], images: [] };
  const stack = [];
  let i = 0, textBuf = '', inPre = 0, lastHeading = 1, pendingHeading = null;
  const flushText = () => { if (!inPre) info.words += textBuf.split(/\s+/).filter((w) => /[A-Za-z0-9\u0980-\u09FF]/.test(w)).length; textBuf = ''; };
  while (i < html.length) {
    const ch = html[i];
    if (ch === '&') {
      const m = /^&(#\d+|#x[0-9a-fA-F]+|[a-zA-Z]+);/.exec(html.slice(i, i + 12));
      if (!m) err(where, `line ${lineOf(html, i)}: raw "&" — write &amp;`);
      else if (!m[1].startsWith('#') && !ENTITIES.has(m[1])) err(where, `line ${lineOf(html, i)}: unknown entity &${m[1]}; — use a numeric entity`);
      textBuf += ' '; if (pendingHeading) pendingHeading.text += 'x';
      i += m ? m[0].length : 1; continue;
    }
    if (ch !== '<') { textBuf += ch; if (pendingHeading) pendingHeading.text += ch; i++; continue; }
    if (html.startsWith('<!--', i)) { err(where, `line ${lineOf(html, i)}: remove HTML comments`); const e = html.indexOf('-->', i); i = e < 0 ? html.length : e + 3; continue; }
    const m = /^<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:"[^"<>]*"|'[^'<>]*'))?)*)\s*(\/?)>/.exec(html.slice(i, i + 2000));
    if (!m) { err(where, `line ${lineOf(html, i)}: raw "<" (in code write &lt;, e.g. #include &lt;stdio.h&gt; or List&lt;String&gt;)`); textBuf += ' '; i++; continue; }
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
      if (/^h[234]$/.test(tag) && pendingHeading) { if (!pendingHeading.text.trim()) err(where, `line ${line}: empty <${tag}>`); info.headings.push(pendingHeading); pendingHeading = null; }
      continue;
    }
    const attrs = {};
    for (const a of rawAttrs.matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g)) {
      const name = a[1].toLowerCase(); const value = a[2] ?? a[3] ?? '';
      if (name.startsWith('on') || name === 'style') { err(where, `line ${line}: attribute ${name} is not allowed`); continue; }
      if (!TAGS[tag].includes(name)) { err(where, `line ${line}: <${tag}> may not have attribute "${name}"`); continue; }
      attrs[name] = value;
    }
    if (attrs.class !== undefined && !(CLASSES[tag] ?? []).includes(attrs.class)) err(where, `line ${line}: <${tag} class="${attrs.class}"> — allowed: ${(CLASSES[tag] ?? []).join(', ') || 'none'}`);
    if (tag === 'div') {
      const n = ['data-example', 'data-lab', 'class'].filter((k) => attrs[k] !== undefined).length;
      if (n !== 1) err(where, `line ${line}: <div> needs exactly one of class="callout …", data-example or data-lab`);
      for (const k of ['data-example', 'data-lab']) if (attrs[k] !== undefined) {
        (k === 'data-example' ? info.placeholders : info.labs).push(attrs[k]);
        if (!html.slice(i).startsWith('</div>')) err(where, `line ${line}: placeholder must be empty: <div ${k}="${attrs[k]}"></div>`);
      }
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
    if (tag === 'a') { if (!attrs.href) err(where, `line ${line}: <a> needs href`); else info.links.push({ href: attrs.href, line }); }
    if (tag === 'img') { if (!isStr(attrs.alt)) err(where, `line ${line}: <img> needs alt text`); info.images.push({ src: attrs.src ?? '', line }); }
    if (tag === 'th' && attrs.scope !== undefined && !['col', 'row'].includes(attrs.scope)) err(where, `line ${line}: th scope must be col or row`);
    if (VOID.has(tag) || m[4] === '/') continue;
    stack.push(tag);
    if (tag === 'pre') inPre++;
  }
  flushText();
  if (stack.length) err(where, `unclosed tags at end: ${stack.map((t) => `<${t}>`).join(' ')}`);
  return info;
}

// ── runners ─────────────────────────────────────────────────────────────────
const RT = {};
function probe(cmd, args) { const r = spawnSync(cmd, args, { encoding: 'utf8' }); return r.status === 0 ? firstLines(`${r.stdout}\n${r.stderr}`.trim(), 1) : null; }
function detect(opts) {
  for (const c of [opts.cc, 'gcc', 'clang', 'cc'].filter(Boolean)) { const v = probe(c, ['--version']); if (v) { RT.c = { cmd: c, version: v }; break; } }
  const jv = probe('javac', ['-version']); if (jv && probe('java', ['-version'])) RT.java = { version: jv };
  for (const p of ['python3', 'python']) { const v = probe(p, ['--version']); if (v) { RT.python = { cmd: p, version: v }; break; } }
  const mv = probe('mysql', ['--version']);
  if (mv) {
    const args = mysqlArgs(); const ok = spawnSync('mysql', [...args, '-e', 'SELECT VERSION()'], { encoding: 'utf8', env: mysqlEnv() });
    if (ok.status === 0) RT.sql = { version: `MySQL ${ok.stdout.split('\n').filter(Boolean).at(-1)}` };
  }
}
const mysqlArgs = () => ['--batch', '--skip-column-names', '-u', process.env.MYSQL_USER ?? 'root', ...(process.env.MYSQL_HOST ? ['-h', process.env.MYSQL_HOST] : []), ...(process.env.MYSQL_PORT ? ['-P', process.env.MYSQL_PORT] : [])];
const mysqlEnv = () => ({ ...process.env });

function tmp() { return mkdtempSync(join(tmpdir(), 'llk-')); }

/** Compile (or syntax-check) one program. Returns { ok, diagnostics, run(stdin, args, files) }. */
function build(lang, src, { std = 'c17', flags = [], werror = true, sanitize = false } = {}) {
  const dir = tmp();
  if (lang === 'c') {
    const file = join(dir, 'main.c'); writeFileSync(file, src);
    const exe = join(dir, process.platform === 'win32' ? 'main.exe' : 'main');
    const r = spawnSync(RT.c.cmd, [`-std=${C_STD[std] ?? 'c17'}`, '-Wall', '-Wextra', '-Wpedantic', '-O2', '-fno-diagnostics-color', ...(werror ? ['-Werror'] : []), ...(sanitize ? ['-fsanitize=address,undefined', '-fno-omit-frame-pointer', '-fno-sanitize-recover=all'] : []), file, '-o', exe, ...flags], { encoding: 'utf8' });
    return { ok: r.status === 0, diagnostics: firstLines(r.stderr || ''), dir, cmd: [exe] };
  }
  if (lang === 'java') {
    if (!/\bclass\s+Main\b/.test(src)) return { ok: false, diagnostics: 'Java programs must have a class named Main with public static void main', dir, cmd: [] };
    writeFileSync(join(dir, 'Main.java'), src);
    const r = spawnSync('javac', ['--release', '17', '-encoding', 'UTF-8', '-Xlint:all', '-Xlint:-serial', ...(werror ? ['-Werror'] : []), 'Main.java'], { cwd: dir, encoding: 'utf8' });
    return { ok: r.status === 0, diagnostics: firstLines(`${r.stdout}${r.stderr}`), dir, cmd: ['java', '-Dfile.encoding=UTF-8', '-cp', dir, 'Main'] };
  }
  if (lang === 'python') {
    const file = join(dir, 'main.py'); writeFileSync(file, src);
    const r = spawnSync(RT.python.cmd, [...(werror ? ['-W', 'error'] : []), '-c', 'import ast,sys; ast.parse(open(sys.argv[1], encoding="utf-8").read(), sys.argv[1])', file], { encoding: 'utf8' });
    return { ok: r.status === 0, diagnostics: firstLines(r.stderr || ''), dir, cmd: [RT.python.cmd, '-I', '-X', 'utf8', file] };
  }
  if (lang === 'sql') { writeFileSync(join(dir, 'main.sql'), src); return { ok: true, diagnostics: '', dir, cmd: null }; }
  return { ok: false, diagnostics: `unknown language ${lang}`, dir, cmd: [] };
}

function run(b, { stdin = '', args = [], files = [] } = {}) {
  for (const f of files) copyFileSync(f, join(b.dir, basename(f)));
  const [cmd, ...rest] = b.cmd;
  const r = spawnSync(cmd, [...rest, ...args], { input: stdin, cwd: b.dir, encoding: 'utf8', timeout: 10000, maxBuffer: 8 * 1024 * 1024, env: { ...process.env, ASAN_OPTIONS: 'detect_leaks=1', PYTHONHASHSEED: '0', MPLBACKEND: 'Agg', OMP_NUM_THREADS: '1' } });
  return { status: r.status, signal: r.signal, stdout: r.stdout ?? '', stderr: firstLines(r.stderr ?? '', 8), timedOut: r.error?.code === 'ETIMEDOUT' };
}

let sqlDbCounter = 0;
function runSql(src, setupTexts) {
  const db = `llk_${process.pid}_${++sqlDbCounter}`;
  const base = mysqlArgs().filter((a) => a !== '--batch' && a !== '--skip-column-names');
  const exec = (sql, extra = []) => spawnSync('mysql', [...base, ...extra], { input: sql, encoding: 'utf8', env: mysqlEnv(), timeout: 20000 });
  exec(`DROP DATABASE IF EXISTS ${db}; CREATE DATABASE ${db} CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`);
  try {
    for (const s of setupTexts) { const r = exec(s, [db]); if (r.status !== 0) return { setupError: firstLines(r.stderr) }; }
    const r = exec(src, ['--table', db]);
    return { status: r.status, stdout: r.stdout ?? '', stderr: firstLines(r.stderr ?? '') };
  } finally { exec(`DROP DATABASE IF EXISTS ${db};`); }
}

function checkSourceStyle(lang, text, where, { demonstrates } = {}) {
  if (/\t/.test(text)) err(where, 'use spaces, not tabs');
  if (!demonstrates) for (const [re, why] of BANNED[lang] ?? []) if (re.test(text)) err(where, why);
  text.split('\n').forEach((l, n) => { if (l.length > 100) warn(where, `line ${n + 1} is longer than 100 characters`); });
  if (lang === 'sql' && !demonstrates) {
    const selects = text.split(';').filter((s) => /^\s*(WITH|SELECT)\b/i.test(s.replace(/--.*$/gm, '').trim()) && !/\bORDER\s+BY\b/i.test(s) && !/\bLIMIT\s+1\b|COUNT\s*\(|\bSUM\s*\(|\bAVG\s*\(|\bMAX\s*\(|\bMIN\s*\(/i.test(s));
    if (selects.length) warn(where, 'a SELECT without ORDER BY may print rows in a different order on another server');
  }
}

/** Build and run one program; compare stdout. */
function checkProgram({ where, lang, src, std, flags, stdin, args, files, expected, demonstrates, exitCode, runMode, setup, opts }) {
  if (opts.noRun) return;
  if (!RT[lang]) {
    if (lang === 'sql' && !opts.requireSql) { out.sqlSkipped++; return; }
    if (!out.missingRt.has(lang)) { out.missingRt.add(lang); err('runtime', `${lang} toolchain not found — install it (or use --no-run for format checks only)`); }
    return;
  }
  if (lang === 'sql') {
    const r = runSql(src, setup);
    if (r.setupError) { err(where, `dataset failed to load:\n${r.setupError}`); return; }
    if (demonstrates === 'compile-error' || demonstrates === 'runtime-error') { if (r.status === 0) err(where, `marked ${demonstrates} but MySQL runs it without error`); return; }
    if (r.status !== 0) { err(where, `MySQL error:\n${r.stderr}`); return; }
    if (expected !== null && expected !== undefined && norm(r.stdout) !== norm(expected)) err(where, `output differs from the expected file.\n--- expected ---\n${firstLines(norm(expected), 12)}\n--- actual ---\n${firstLines(norm(r.stdout), 12)}`);
    return;
  }
  if (demonstrates === 'compile-error') { const b = build(lang, src, { std, flags, werror: false }); if (b.ok) err(where, 'marked compile-error but it compiles'); rmSync(b.dir, { recursive: true, force: true }); return; }
  if (demonstrates === 'warning') {
    const b1 = build(lang, src, { std, flags, werror: false }); const b2 = build(lang, src, { std, flags, werror: true });
    if (!b1.ok) err(where, `marked warning but it does not compile:\n${b1.diagnostics}`); else if (b2.ok) err(where, 'marked warning but the compiler gives no warning');
    for (const b of [b1, b2]) rmSync(b.dir, { recursive: true, force: true }); return;
  }
  const lenient = demonstrates === 'undefined-behavior';
  const b = build(lang, src, { std, flags, werror: !lenient });
  if (!b.ok) { err(where, `does not compile cleanly:\n${b.diagnostics}`); rmSync(b.dir, { recursive: true, force: true }); return; }
  if (lenient || runMode === 'compile-only') { rmSync(b.dir, { recursive: true, force: true }); return; }
  const r = run(b, { stdin, args, files });
  if (r.timedOut) err(where, 'did not finish within 10 seconds');
  else if (demonstrates === 'runtime-error') { if (r.status === 0 && !r.signal) err(where, 'marked runtime-error but it exits normally'); }
  else {
    if (r.status !== (exitCode ?? 0)) err(where, `exit code ${r.status ?? r.signal}, expected ${exitCode ?? 0}${r.stderr ? `; stderr: ${r.stderr}` : ''}`);
    if (expected !== null && expected !== undefined && norm(r.stdout) !== norm(expected)) err(where, `output differs from the expected file.\n--- expected ---\n${firstLines(norm(expected), 12)}\n--- actual ---\n${firstLines(norm(r.stdout), 12)}`);
  }
  rmSync(b.dir, { recursive: true, force: true });
  if (opts.sanitize && lang === 'c' && !demonstrates) {
    const s = build('c', src, { std, flags, sanitize: true });
    if (s.ok) { const rs = run(s, { stdin, args, files }); if (rs.status !== (exitCode ?? 0) || /runtime error|AddressSanitizer|LeakSanitizer/.test(rs.stderr)) err(where, `sanitizer found a problem:\n${rs.stderr}`); }
    rmSync(s.dir, { recursive: true, force: true });
  }
}

function missingPythonPackages(requires) {
  if (!requires?.length || !RT.python) return [];
  return requires.filter((p) => spawnSync(RT.python.cmd, ['-c', `import ${p}`]).status !== 0);
}

// ── labs ────────────────────────────────────────────────────────────────────
export function checkLab(dir, where, { kind, topicExamples = null, panels = null }) {
  const lw = `${where}/lab.json`;
  if (!existsSync(join(dir, 'lab.json'))) { err(lw, 'missing'); return; }
  const lab = readJson(join(dir, 'lab.json'), lw); if (!lab) return;
  if (lab.schemaVersion !== '1.1') err(lw, 'schemaVersion must be "1.1"');
  if (lab.id !== basename(dir)) err(lw, `id must equal the folder name "${basename(dir)}"`);
  if (!LAB_KINDS.includes(lab.kind)) err(lw, `kind must be one of ${LAB_KINDS.join(', ')}`);
  if (kind && lab.kind !== kind) err(lw, `kind must be "${kind}" (curriculum)`);
  if (!isBi(lab.title)) err(lw, 'title needs en and bn');
  if (!isStr(lab.summary?.en) || lab.summary.en.length > 220) err(lw, 'summary.en: one sentence ≤ 220 characters');
  if (!Array.isArray(lab.pseudocode) || !between(lab.pseudocode.length, [3, 30]) || lab.pseudocode.some((l) => typeof l !== 'string' || l.length > 80)) err(lw, 'pseudocode: 3–30 lines, each ≤ 80 characters');
  if (!lab.complexity || !isStr(lab.complexity.time) || !isStr(lab.complexity.space)) err(lw, 'complexity: { time, space }');
  if (topicExamples && lab.codeExample !== undefined && !topicExamples.has(lab.codeExample)) err(lw, `codeExample ${lab.codeExample} is not an example of this topic`);
  try { checkInputSpec(lab.inputs ?? []); } catch (e) { err(lw, e.message); return; }
  if (!Array.isArray(lab.presets) || !between(lab.presets.length, [2, 8]) || lab.presets.some((p) => !isStr(p.name) || p.name.length > 30)) err(lw, 'presets: 2–8 named inputs');
  if (!Array.isArray(lab.checks) || lab.checks.length < 3) err(lw, 'checks: at least 3 { input, expect } including edge cases');
  if (!Array.isArray(lab.presets) || !Array.isArray(lab.checks) || !LAB_KINDS.includes(lab.kind)) return;
  const tf = join(dir, 'trace.js');
  if (!existsSync(tf)) { err(`${where}/trace.js`, 'missing'); return; }
  let trace;
  try { trace = loadTrace(readFileSync(tf, 'utf8')); } catch (e) { err(`${where}/trace.js`, e.message); return; }
  const lines = lab.pseudocode?.length ?? 0;
  const play = (input, label) => {
    const bad = validInput(lab.inputs ?? [], input);
    if (bad) { err(lw, `${label}: ${bad}`); return null; }
    try { return playTrace(lab.kind, trace(input), { lines }); } catch (e) { err(`${where}/trace.js`, `${label}: ${e instanceof LabError ? e.message : `crashed: ${e.message}`}`); return null; }
  };
  lab.presets.forEach((p, n) => play(p.input, `preset "${p.name ?? n}"`));
  if (panels && lab.kind === 'ml' && lab.presets[0]) { try { const init = trace(lab.presets[0].input)?.init ?? {}; for (const pn of panels) if (!init[pn]) err(`${where}/trace.js`, `the curriculum asks for the "${pn}" panel; init has ${Object.keys(init).join(', ') || 'none'}`); } catch { /* reported above */ } }
  lab.checks.forEach((c, n) => { const s = play(c.input, `check ${n + 1}`); if (s) { const d = partialMatch(s, c.expect); if (d) err(`${where}/trace.js`, `check ${n + 1}: ${d}`); } });
  if ((lab.inputs ?? []).length) { let k = 0; for (const input of fuzzInputs(lab.inputs)) { if (!play(input, `random input ${JSON.stringify(input)}`)) break; if (++k > 25) break; } }
}

// ── topic ───────────────────────────────────────────────────────────────────
function checkTopic(pkg, mod, topicId, ctx, opts) {
  const dir = join(pkg, 'topics', mod.id, topicId);
  const rel = (f) => relative(pkg, f).split('\\').join('/');
  const tw = rel(join(dir, 'topic.json'));
  const row = { id: topicId, words: 0, examples: 0, practice: 0, quiz: 0, labs: 0, start: out.errors.length, errors: 0 };
  out.rows.push(row);
  if (!existsSync(join(dir, 'topic.json'))) { err(tw, 'missing'); return; }
  const t = readJson(join(dir, 'topic.json'), tw);
  if (!t) return;
  const planned = ctx.topics.get(topicId);
  const trackLang = ctx.language;

  if (!FORMAT_VERSIONS.includes(t.schemaVersion)) err(tw, `schemaVersion must be one of ${FORMAT_VERSIONS.join(', ')}`);
  if (t.id !== topicId) err(tw, `id "${t.id}" must equal the folder name "${topicId}"`);
  if (t.module !== mod.id) err(tw, `module must be "${mod.id}"`);
  if (planned && t.order !== planned.order) err(tw, `order must be ${planned.order} (curriculum)`);
  for (const f of ['title', 'summary']) { if (!isBi(t[f])) err(tw, `${f} needs en and bn`); else if (!hasBangla(t[f].bn)) err(tw, `${f}.bn must be written in Bangla script`); }
  if (isBi(t.summary) && t.summary.en.length > 220) warn(tw, 'summary.en is long (keep under 220 characters)');
  if (!LEVELS.includes(t.level)) err(tw, `level must be one of ${LEVELS.join(', ')}`);
  else if (planned && t.level !== planned.level) warn(tw, `level differs from curriculum (${planned.level})`);
  const kind = t.kind ?? 'lesson';
  if (!KINDS.includes(kind)) err(tw, `kind must be one of ${KINDS.join(', ')}`);
  if (planned && (planned.kind ?? 'lesson') !== kind) err(tw, `kind must be "${planned.kind ?? 'lesson'}" (curriculum)`);
  if (!Number.isInteger(t.estMinutes) || !between(t.estMinutes, [5, 120])) err(tw, 'estMinutes must be a whole number 5–120');
  for (const f of ['prerequisites', 'related']) {
    if (!Array.isArray(t[f])) { err(tw, `${f} must be an array (may be empty)`); continue; }
    for (const id of t[f]) if (!ctx.topics.has(id) && !ctx.allTopics.has(id)) err(tw, `${f}: "${id}" is not a curriculum topic`);
  }
  if (!Array.isArray(t.keywords) || !between(t.keywords.length, [3, 15])) err(tw, 'keywords: 3–15 search words');
  if (trackLang === 'c' && (!t.standards || !Object.keys(C_STD).includes(t.standards.minimum))) err(tw, `standards.minimum must be one of ${Object.keys(C_STD).join(', ')}`);
  if (trackLang !== 'c' && (!t.standards || !isStr(t.standards.minimum))) err(tw, 'standards.minimum: the oldest version this topic needs, e.g. "Java 17", "Python 3.10", "MySQL 8.0"');
  if (t.standards && !Array.isArray(t.standards.notes)) err(tw, 'standards.notes must be an array of short strings');
  if (!Array.isArray(t.videos)) err(tw, 'videos must be an array (may be empty)');
  else for (const v of t.videos) if (!ctx.videos.has(v?.videoId)) err(tw, `videos: "${v?.videoId}" is not in spec/videos.json`);
  if (!Array.isArray(t.references)) err(tw, 'references must be an array');
  else for (const r of t.references) { try { const h = new URL(r.url).host; if (!APPROVED_HOSTS.includes(h)) err(tw, `reference host ${h} is not approved`); } catch { err(tw, `reference url invalid: ${r?.url}`); } }
  if (!t.review || t.review.status !== 'draft') err(tw, 'review.status must be "draft" (Loop & Logic reviewers change it)');
  const C = { ...(COUNTS[kind] ?? COUNTS.lesson), ...(planned?.counts ?? {}) };
  const texts = []; // for writing-quality rules

  // body
  const bodyFile = join(dir, 'body.en.html');
  let body = null;
  if (!existsSync(bodyFile)) err(rel(bodyFile), 'missing');
  else {
    const html = readFileSync(bodyFile, 'utf8');
    if (/^\s*<!doctype|<html|<head|<body/i.test(html)) err(rel(bodyFile), 'write a fragment: no <html>, <head> or <body>');
    body = checkHtml(html, rel(bodyFile));
    texts.push(textOf(html));
    row.words = body.words;
    const ids = (t.sections ?? []).map((s) => s.id);
    if (!Array.isArray(t.sections) || t.sections.some((s) => !isStr(s?.id) || !isStr(s?.title))) err(tw, 'sections must be [{id, title}]');
    if (JSON.stringify(ids) !== JSON.stringify(body.h2)) err(tw, `sections ${JSON.stringify(ids)} must match the <h2> ids in body.en.html, in order: ${JSON.stringify(body.h2)}`);
    for (const s of ctx.sections?.[kind]?.required ?? REQUIRED_SECTIONS[kind] ?? []) if (!body.h2.includes(s)) err(rel(bodyFile), `missing required section <h2 id="${s}">`);
    for (const s of ctx.sections?.[kind]?.recommended ?? RECOMMENDED_SECTIONS[kind] ?? []) if (!body.h2.includes(s)) warn(rel(bodyFile), `consider a "${s}" section`);
    if ((kind === 'lesson' || kind === 'theory') && t.level) {
      const [lo, hi] = WORDS[t.level] ?? [0, 1e9];
      if (body.words < lo * 0.6) err(rel(bodyFile), `${body.words} words — far below the ${lo}–${hi} target for ${t.level}`);
      else if (body.words < lo) warn(rel(bodyFile), `${body.words} words — below the ${lo}–${hi} target`);
      else if (body.words > hi * 1.3) warn(rel(bodyFile), `${body.words} words — consider splitting (target ${lo}–${hi})`);
    }
    for (const l of body.links) {
      if (l.href.startsWith('topic:')) { const id = l.href.slice(6).split('#')[0]; if (!ctx.topics.has(id) && !ctx.allTopics.has(id)) err(rel(bodyFile), `line ${l.line}: link to unknown topic ${l.href}`); }
      else if (l.href.startsWith('#')) { if (!body.headings.some((h) => h.id === l.href.slice(1))) err(rel(bodyFile), `line ${l.line}: anchor ${l.href} not found`); }
      else { try { const h = new URL(l.href).host; if (!l.href.startsWith('https://') || !APPROVED_HOSTS.includes(h)) err(rel(bodyFile), `line ${l.line}: external link ${l.href} — only https to approved sites`); } catch { err(rel(bodyFile), `line ${l.line}: bad href ${l.href}`); } }
    }
    for (const im of body.images) {
      const p = join(dir, im.src);
      if (!/^assets\/[a-z0-9-]+\.(svg|png|webp)$/.test(im.src)) err(rel(bodyFile), `line ${im.line}: img src must be assets/<kebab-name>.svg|png|webp`);
      else if (!existsSync(p)) err(rel(bodyFile), `line ${im.line}: ${im.src} not found`);
      else if (im.src.endsWith('.svg') && /<script|href\s*=\s*["']https?:|<foreignObject/i.test(readFileSync(p, 'utf8'))) err(rel(p), 'SVG must not contain scripts, external links or foreignObject');
    }
  }
  const bnFile = join(dir, 'body.bn.html');
  if (planned?.banglaBody && !existsSync(bnFile)) err(rel(bnFile), 'the curriculum asks for a full Bangla body for this topic (body.bn.html with the same sections)');
  if (existsSync(bnFile) && body) {
    const bnHtml = readFileSync(bnFile, 'utf8');
    const bn = checkHtml(bnHtml, rel(bnFile));
    if (!hasBangla(textOf(bnHtml))) err(rel(bnFile), 'body.bn.html must be written in Bangla');
    if (JSON.stringify(bn.h2) !== JSON.stringify(body.h2)) err(rel(bnFile), 'Bangla body must have the same <h2> ids in the same order');
    if (JSON.stringify([...bn.placeholders].sort()) !== JSON.stringify([...body.placeholders].sort()) || JSON.stringify([...bn.labs].sort()) !== JSON.stringify([...body.labs].sort())) err(rel(bnFile), 'Bangla body must place the same examples and labs');
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
    const lang = e.language ?? trackLang;
    if (!(lang in LANGS)) { err(w, `language must be one of ${Object.keys(LANGS).join(', ')}`); continue; }
    if (!isStr(e.title)) err(w, 'title missing');
    if (!isStr(e.explanationHtml)) err(w, 'explanationHtml missing'); else { checkHtml(e.explanationHtml, `${w}.explanationHtml`); texts.push(textOf(e.explanationHtml)); }
    if (e.demonstrates !== undefined && !DEMONSTRATES.includes(e.demonstrates)) err(w, `demonstrates must be one of ${DEMONSTRATES.join(', ')}`);
    if (lang === 'c' && e.standard !== undefined && !(e.standard in C_STD)) err(w, 'standard must be c89|c99|c11|c17|c23');
    if (typeof e.tryNow !== 'boolean') err(w, 'tryNow must be true or false');
    if (e.runMode !== undefined && !['run', 'compile-only'].includes(e.runMode)) err(w, 'runMode must be run or compile-only');
    if (e.runMode === 'compile-only' && !isStr(e.outputNote)) err(w, 'compile-only examples need outputNote (what the student will see)');
    const src = join(dir, e.file ?? '');
    if (!new RegExp(`^examples/ex-\\d+\\${LANGS[lang]}$`).test(e.file ?? '') || !existsSync(src)) { err(w, `file must be examples/${e.id}${LANGS[lang]} and exist`); continue; }
    const text = readFileSync(src, 'utf8');
    checkSourceStyle(lang, text, rel(src), e);
    const stdin = e.stdin ? (existsSync(join(dir, e.stdin)) ? readFileSync(join(dir, e.stdin), 'utf8') : (err(w, `stdin file ${e.stdin} missing`), '')) : '';
    let expected = null;
    if (e.output) { if (!existsSync(join(dir, e.output))) err(w, `output file ${e.output} missing`); else expected = readFileSync(join(dir, e.output), 'utf8'); }
    else if (!e.demonstrates && e.deterministic !== false && e.runMode !== 'compile-only') err(w, 'output file required (or set "deterministic": false with outputNote)');
    if (e.deterministic === false && !isStr(e.outputNote)) err(w, 'deterministic:false needs outputNote explaining why output varies');
    const files = (e.workdirFiles ?? []).map((f) => (f.startsWith('shared/') ? join(pkg, f) : join(dir, f)));
    for (const f of files) if (!existsSync(f)) err(w, `workdirFile ${f} missing`);
    const setup = (e.setup ?? []).map((f) => { const p = join(pkg, f); if (!existsSync(p)) { err(w, `setup file ${f} missing (paths are relative to the package root)`); return ''; } return readFileSync(p, 'utf8'); });
    const missing = lang === 'python' ? missingPythonPackages(e.requires) : [];
    if (missing.length) { (opts.requirePackages ? err : warn)(rel(src), `not run: Python package(s) ${missing.join(', ')} not installed here`); continue; }
    checkProgram({ where: rel(src), lang, src: text, std: e.standard ?? 'c17', flags: e.compilerFlags ?? [], stdin, args: e.args ?? [], files, expected: e.deterministic === false ? null : expected, demonstrates: e.demonstrates, exitCode: e.exitCode, runMode: e.runMode, setup, opts });
  }
  if (body) {
    for (const id of exIds) { const c = body.placeholders.filter((p) => p === id).length; if (c !== 1) err(rel(bodyFile), `example ${id} must be placed exactly once with <div data-example="${id}"></div> (found ${c})`); }
    for (const p of body.placeholders) if (!exIds.has(p)) err(rel(bodyFile), `placeholder ${p} has no example in topic.json`);
  }

  // labs
  const plannedLabs = planned?.labs ?? [];
  const labs = Array.isArray(t.labs) ? t.labs : [];
  if (t.labs !== undefined && !Array.isArray(t.labs)) err(tw, 'labs must be an array of lab ids');
  row.labs = labs.length;
  for (const pl of plannedLabs) if (!labs.includes(pl.id)) err(tw, `lab "${pl.id}" (${pl.kind}) from the curriculum is missing`);
  for (const id of labs) {
    const pl = plannedLabs.find((x) => x.id === id);
    if (!pl) { err(tw, `lab "${id}" is not in the curriculum for this topic`); continue; }
    const ld = join(dir, 'labs', id);
    if (!existsSync(ld)) { err(tw, `labs/${id}/ folder missing`); continue; }
    checkLab(ld, rel(ld), { kind: pl.kind, topicExamples: exIds, panels: pl.panels ?? null });
    if (body && body.labs.filter((x) => x === id).length !== 1) err(rel(bodyFile), `lab ${id} must be placed exactly once with <div data-lab="${id}"></div>`);
  }
  if (body) for (const id of body.labs) if (!labs.includes(id)) err(rel(bodyFile), `lab placeholder ${id} has no lab in topic.json`);

  // practice
  const prs = Array.isArray(t.practice) ? t.practice : (err(tw, 'practice must be an array'), []);
  row.practice = prs.length;
  if (!between(prs.length, C.practice)) err(tw, `practice: ${prs.length}, need ${C.practice[0]}–${C.practice[1]}`);
  const codePractice = prs.filter((p) => (p?.type ?? 'code') === 'code').length;
  if (codePractice < C.codePractice) err(tw, `practice: at least ${C.codePractice} must be code problems with tests`);
  for (const [n, p] of prs.entries()) {
    const w = `${tw} practice[${n}]`;
    if (!/^p-\d+$/.test(p?.id ?? '')) err(w, 'id must be p-1, p-2, …');
    if (!['easy', 'medium', 'hard'].includes(p.difficulty)) err(w, 'difficulty must be easy|medium|hard');
    if (!isStr(p.title)) err(w, 'title missing');
    if (!isStr(p.statementHtml)) err(w, 'statementHtml missing'); else { checkHtml(p.statementHtml, `${w}.statementHtml`); texts.push(textOf(p.statementHtml)); }
    if (!Array.isArray(p.hints) || p.hints.length < 1) err(w, 'at least one hint');
    if (p.figure !== undefined) { const fe = checkFigure(p.figure); if (fe) err(`${w}.figure`, fe); }
    const type = p.type ?? 'code';
    if (!['code', 'written'].includes(type)) { err(w, 'type must be code or written'); continue; }
    if (type === 'written') { if (!isStr(p.answerHtml)) err(w, 'written practice needs answerHtml (a full worked answer)'); else checkHtml(p.answerHtml, `${w}.answerHtml`); continue; }
    const lang = p.language ?? trackLang;
    const sol = join(dir, p.solution ?? '');
    if (!new RegExp(`^practice/p-\\d+\\${LANGS[lang]}$`).test(p.solution ?? '') || !existsSync(sol)) { err(w, `solution must be practice/p-N${LANGS[lang]} and exist`); continue; }
    const text = readFileSync(sol, 'utf8');
    checkSourceStyle(lang, text, rel(sol), {});
    if (!Array.isArray(p.tests) || p.tests.length < 2) { err(w, 'at least 2 tests [{stdin, output}]'); continue; }
    const setup = (p.setup ?? []).map((f) => (existsSync(join(pkg, f)) ? readFileSync(join(pkg, f), 'utf8') : (err(w, `setup file ${f} missing`), '')));
    for (const [k, tc] of p.tests.entries()) {
      const tin = tc.stdin ? join(dir, tc.stdin) : null;
      const tout = join(dir, tc.output ?? '');
      if (tin && !existsSync(tin)) { err(w, `tests[${k}].stdin missing`); continue; }
      if (!existsSync(tout)) { err(w, `tests[${k}].output missing`); continue; }
      const pmiss = lang === 'python' ? missingPythonPackages(p.requires) : [];
      if (pmiss.length) { (opts.requirePackages ? err : warn)(rel(sol), `not run: Python package(s) ${pmiss.join(', ')} not installed here`); break; }
      const pfiles = (p.workdirFiles ?? []).map((f) => (f.startsWith('shared/') ? join(pkg, f) : join(dir, f)));
      checkProgram({ where: `${rel(sol)} test ${k + 1}`, lang, src: text, std: p.standard ?? 'c17', flags: p.compilerFlags ?? [], stdin: tin ? readFileSync(tin, 'utf8') : '', args: [], files: pfiles, expected: readFileSync(tout, 'utf8'), setup, opts });
    }
  }

  // quiz
  const qs = Array.isArray(t.quiz) ? t.quiz : (err(tw, 'quiz must be an array'), []);
  row.quiz = qs.length;
  if (!between(qs.length, C.quiz)) err(tw, `quiz: ${qs.length} questions, need ${C.quiz[0]}–${C.quiz[1]}`);
  const outQ = qs.filter((q) => q?.type === 'output').length;
  if (outQ < C.outputQuiz) err(tw, `quiz: ${outQ} output questions, need at least ${C.outputQuiz}`);
  const qIds = new Set(); const prompts = new Set(); let figureQ = 0;
  const answerAt = [0, 0, 0, 0, 0, 0];
  for (const [n, q] of qs.entries()) {
    const w = `${tw} quiz[${n}]`;
    if (!/^q-\d+$/.test(q?.id ?? '')) err(w, 'id must be q-1, q-2, …');
    if (qIds.has(q.id)) err(w, `duplicate id ${q.id}`);
    qIds.add(q.id);
    if (!['mcq', 'output'].includes(q.type)) err(w, 'type must be mcq or output');
    if (!['easy', 'medium', 'hard'].includes(q.difficulty)) err(w, 'difficulty must be easy|medium|hard');
    if (!isStr(q.prompt) || q.prompt.length > QUIZ_LIMITS.prompt) err(w, `prompt required, ≤ ${QUIZ_LIMITS.prompt} characters`);
    else {
      const key = q.prompt.toLowerCase().replace(/\s+/g, ' ').trim();
      if (prompts.has(key)) err(w, 'two questions in this topic have the same prompt — say what each one tests');
      prompts.add(key);
      ctx.promptCounts.set(key, (ctx.promptCounts.get(key) ?? 0) + 1);
      texts.push(q.prompt);
    }
    if (!Array.isArray(q.options) || !between(q.options.length, QUIZ_LIMITS.options)) { err(w, 'options: 2–6'); continue; }
    if (q.options.some((o) => typeof o !== 'string' || !o.trim() || o.length > QUIZ_LIMITS.option)) err(w, `each option: non-empty, ≤ ${QUIZ_LIMITS.option} characters`);
    if (new Set(q.options.map((o) => normLoose(String(o)))).size !== q.options.length) err(w, 'options must all be different');
    if (q.options.some((o) => /^(all|none) of the above$/i.test(String(o).trim()))) err(w, 'no "all/none of the above"');
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) { err(w, 'answer must be the index of the correct option'); continue; }
    answerAt[q.answer]++;
    if (!isStr(q.explanation) || q.explanation.length > QUIZ_LIMITS.explanation) err(w, `explanation required, ≤ ${QUIZ_LIMITS.explanation} characters`); else texts.push(q.explanation);
    if (q.code !== undefined && (!isStr(q.code) || q.code.split('\n').length > QUIZ_LIMITS.codeLines)) err(w, `code: a string of ≤ ${QUIZ_LIMITS.codeLines} lines`);
    if (q.figure !== undefined) { const fe = checkFigure(q.figure); if (fe) err(`${w}.figure`, fe); else figureQ++; }
    if (q.type === 'output') {
      const lang = q.language ?? trackLang;
      if (!isStr(q.code)) { err(w, 'output questions need code: a complete program'); continue; }
      if (lang === 'c' && !/\bmain\s*\(/.test(q.code)) { err(w, 'C output questions need a complete program with main'); continue; }
      checkSourceStyle(lang, q.code, `${w}.code`, {});
      if (opts.noRun) continue;
      let actual = null;
      if (lang === 'sql') {
        if (!RT.sql) { if (opts.requireSql) err(w, 'MySQL not reachable'); else out.sqlSkipped++; continue; }
        const setup = (q.setup ?? []).map((f) => (existsSync(join(pkg, f)) ? readFileSync(join(pkg, f), 'utf8') : ''));
        const r = runSql(q.code, setup); if (r.setupError || r.status !== 0) { err(w, `MySQL error:\n${r.setupError ?? r.stderr}`); continue; }
        actual = normLoose(r.stdout);
      } else {
        if (!RT[lang]) { if (!out.missingRt.has(lang)) { out.missingRt.add(lang); err('runtime', `${lang} toolchain not found`); } continue; }
        const b = build(lang, q.code, { std: q.standard ?? 'c17', flags: q.compilerFlags ?? [] });
        if (!b.ok) { err(w, `code does not compile cleanly:\n${b.diagnostics}`); rmSync(b.dir, { recursive: true, force: true }); continue; }
        const r = run(b); rmSync(b.dir, { recursive: true, force: true });
        if (r.status !== 0) { err(w, `code exits with ${r.status ?? r.signal}`); continue; }
        actual = normLoose(r.stdout);
      }
      if (actual !== normLoose(q.options[q.answer])) err(w, `options[${q.answer}] is ${JSON.stringify(q.options[q.answer])} but the program prints ${JSON.stringify(actual)}`);
      const dup = q.options.findIndex((o, k) => k !== q.answer && normLoose(o) === actual);
      if (dup >= 0) err(w, `option ${dup} also matches the real output`);
    }
  }
  const needFig = planned?.visualQuiz ?? 0;
  if (figureQ < needFig) err(tw, `quiz: ${figureQ} questions with a figure, the curriculum asks for at least ${needFig} (read-the-picture questions)`);
  if (qs.length >= 6 && Math.max(...answerAt) > qs.length * 0.5) warn(tw, `quiz answers bunch on one position (${answerAt.slice(0, 4).join('/')}) — vary them`);

  // the rest
  if (!Array.isArray(t.keyPoints) || !between(t.keyPoints.length, C.keyPoints) || t.keyPoints.some((k) => !isBi(k))) err(tw, `keyPoints: ${C.keyPoints[0]}–${C.keyPoints[1]} items, each {en, bn}`);
  else if (t.keyPoints.some((k) => !hasBangla(k.bn))) err(tw, 'keyPoints[].bn must be written in Bangla script');
  if (!Array.isArray(t.examQuestions) || !between(t.examQuestions.length, C.examQuestions)) err(tw, `examQuestions: ${C.examQuestions[0]}–${C.examQuestions[1]}`);
  else for (const [n, q] of t.examQuestions.entries()) {
    const w = `${tw} examQuestions[${n}]`;
    if (!isStr(q.question)) err(w, 'question missing');
    if (!['short', 'long', 'output', 'program', 'design', 'numerical'].includes(q.type)) err(w, 'type must be short|long|output|program|design|numerical');
    if (!isStr(q.answerHtml)) err(w, 'answerHtml missing'); else checkHtml(q.answerHtml, `${w}.answerHtml`);
    if (q.figure !== undefined) { const fe = checkFigure(q.figure); if (fe) err(`${w}.figure`, fe); }
  }

  // writing quality: meta phrases and sentence length; repeated sentences are checked across topics
  const all = texts.join('\n').toLowerCase();
  for (const ph of META_PHRASES) if (all.includes(ph)) err(tw, `student-facing text mentions "${ph}" — write about the subject, not about how the lesson was produced`);
  const sentences = texts.join(' ').split(/(?<=[.!?।])\s+/).map((s) => s.trim()).filter((s) => s.split(/\s+/).length >= 4);
  const avg = sentences.length ? sentences.reduce((n, s) => n + s.split(/\s+/).length, 0) / sentences.length : 0;
  if (avg > 24) warn(tw, `average sentence length ${avg.toFixed(1)} words — aim for under 20`);
  for (const s of new Set(sentences.filter((s) => s.split(/\s+/).length >= 8).map((s) => s.toLowerCase().replace(/[^a-z0-9\u0980-\u09ff ]/g, '').replace(/\s+/g, ' ')))) {
    const list = ctx.sentences.get(s) ?? []; list.push(topicId); ctx.sentences.set(s, list);
  }
}

// ── package ─────────────────────────────────────────────────────────────────
export function checkPackage(pkg, opts = {}) {
  pkg = resolve(pkg);
  const findSpec = () => { let d = pkg; for (let k = 0; k < 4; k++) { d = dirname(d); const f = join(d, 'spec', 'curriculum.json'); if (existsSync(f)) return f; } return join(pkg, '..', 'spec', 'curriculum.json'); };
  const curriculum = readJson(opts.curriculum ?? findSpec(), 'curriculum.json');
  const videosSpec = readJson(opts.videos ?? join(here, '..', 'spec', 'videos.json'), 'videos.json');
  if (!curriculum || !videosSpec) return out;
  const ctx = { topics: new Map(), modules: new Map(), allTopics: new Set(), videos: new Set(videosSpec.videos.map((v) => v.videoId)), language: curriculum.language ?? 'c', sections: curriculum.sections ?? null, sentences: new Map(), promptCounts: new Map() };
  for (const m of curriculum.modules) { ctx.modules.set(m.id, m); for (const t of m.topics) ctx.topics.set(t.id, { ...t, module: m.id }); }
  // cross-track links (topic:ds-stack-array from an algorithms topic) are allowed
  for (const d of readdirSync(join(here, '..'))) { const f = join(here, '..', d, 'spec', 'curriculum.json'); if (existsSync(f)) try { for (const m of JSON.parse(readFileSync(f, 'utf8')).modules) for (const t of m.topics) ctx.allTopics.add(t.id); } catch { /* ignore */ } }
  if (!opts.noRun) detect(opts);

  const mw = 'manifest.json';
  const man = existsSync(join(pkg, mw)) ? readJson(join(pkg, mw), mw) : (err(mw, 'missing'), null);
  if (!man) return out;
  if (!FORMAT_VERSIONS.includes(man.schemaVersion)) err(mw, `schemaVersion must be one of ${FORMAT_VERSIONS.join(', ')}`);
  if (man.packageId !== curriculum.packageId) err(mw, `packageId must be "${curriculum.packageId}"`);
  if (man.schemaVersion === '1.1' && man.track !== curriculum.track) err(mw, `track must be "${curriculum.track}"`);
  if (!/^\d+\.\d+\.\d+$/.test(man.packageVersion ?? '')) err(mw, 'packageVersion must be semver, e.g. 0.3.0');
  if (!isStr(man.generatedAt) || Number.isNaN(Date.parse(man.generatedAt))) err(mw, 'generatedAt must be an ISO date-time');
  if (!isStr(man.compiler) && !isStr(man.toolchain)) err(mw, 'toolchain must record the tools and versions used, e.g. "gcc 14.2, OpenJDK 21, Python 3.12, MySQL 8.4"');
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
      if (!opts.topic || opts.topic === tid) { checkTopic(pkg, cm, tid, ctx, opts); const row = out.rows.at(-1); if (row && row.id === tid) row.errors = out.errors.length - row.start; }
    }
  }
  const topicsDir = join(pkg, 'topics');
  if (existsSync(topicsDir)) for (const m of readdirSync(topicsDir)) {
    if (!statSync(join(topicsDir, m)).isDirectory()) continue;
    for (const tid of readdirSync(join(topicsDir, m))) if (statSync(join(topicsDir, m, tid)).isDirectory() && !listed.has(tid)) err(`topics/${m}/${tid}`, 'folder exists but is not listed in manifest.json');
  }
  if (opts.topic && !listed.has(opts.topic)) err(mw, `topic ${opts.topic} is not listed`);

  // copy-paste across topics
  if (!opts.topic) {
    for (const [s, ids] of ctx.sentences) { const uniq = [...new Set(ids)]; if (uniq.length >= 3) err('writing', `the same sentence appears in ${uniq.length} topics (${uniq.slice(0, 4).join(', ')}${uniq.length > 4 ? ', …' : ''}): "${s.slice(0, 110)}…" — write each topic's text for that topic`); }
    for (const [p, n] of ctx.promptCounts) if (n > 3) err('writing', `quiz prompt used ${n} times across topics: "${p.slice(0, 80)}" — make prompts specific (what should the student notice?)`);
  }
  out.toolchain = Object.entries(RT).map(([k, v]) => `${k}: ${v.version}`).join(' | ') || '(not run)';
  out.delivered = listed.size;
  out.planned = ctx.topics.size;
  out.track = curriculum.track ?? 'c';
  return out;
}

function formatReport(r) {
  const lines = [`Loop & Logic content check — format 1.1 — track ${r.track ?? '?'} — ${new Date().toISOString()}`, `Toolchain: ${r.toolchain ?? '-'}`, `Topics delivered: ${r.delivered ?? 0}/${r.planned ?? '?'}`, ''];
  if (r.rows.length) {
    lines.push('topic'.padEnd(36) + 'words'.padStart(7) + 'ex'.padStart(5) + 'prac'.padStart(6) + 'quiz'.padStart(6) + 'labs'.padStart(6) + 'errors'.padStart(8));
    for (const x of r.rows) lines.push(x.id.padEnd(36) + String(x.words).padStart(7) + String(x.examples).padStart(5) + String(x.practice).padStart(6) + String(x.quiz).padStart(6) + String(x.labs).padStart(6) + String(x.errors).padStart(8));
    lines.push('');
  }
  if (r.sqlSkipped) r.warnings.push(`WARNING sql: ${r.sqlSkipped} SQL program(s) not run — MySQL not reachable here (use --require-sql where MySQL is installed)`);
  lines.push(...r.errors, ...r.warnings, '', `${r.errors.length} error(s), ${r.warnings.length} warning(s)`, r.errors.length ? 'RESULT: NOT READY' : 'RESULT: READY FOR IMPORT');
  return lines.join('\n');
}

export const __test = { build, run, detect: (o = {}) => detect(o), RT };

export function main(a) {
  out = { errors: [], warnings: [], rows: [], missingRt: new Set(), sqlSkipped: 0 };
  const opt = (name) => { const i = a.indexOf(name); return i >= 0 ? a[i + 1] : undefined; };
  const valued = ['--topic', '--cc', '--report', '--curriculum', '--videos', '--lab', '--kind'];
  let r;
  if (opt('--lab')) {
    checkLab(resolve(opt('--lab')), basename(resolve(opt('--lab'))), { kind: opt('--kind') });
    r = { ...out, rows: [], track: 'lab', toolchain: 'node', delivered: 0, planned: 0 };
  } else {
    const pkg = a.find((x, i) => !x.startsWith('--') && !valued.includes(a[i - 1]));
    if (!pkg) { console.error('usage: node content-kit/tools/check.mjs <package-dir> [--topic id] [--no-run] [--sanitize] [--require-sql] [--require-packages] [--report file]\n       node content-kit/tools/check.mjs --lab <lab-dir> --kind <kind>'); return 2; }
    r = checkPackage(pkg, { topic: opt('--topic'), noRun: a.includes('--no-run'), sanitize: a.includes('--sanitize'), requireSql: a.includes('--require-sql'), requirePackages: a.includes('--require-packages'), cc: opt('--cc'), curriculum: opt('--curriculum'), videos: opt('--videos') });
  }
  const text = formatReport(r);
  console.log(text);
  if (opt('--report')) writeFileSync(opt('--report'), text + '\n');
  return r.errors.length ? 1 : 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = main(process.argv.slice(2));
