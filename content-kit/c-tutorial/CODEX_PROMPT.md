# Codex brief: complete C programming tutorial for Loop & Logic

**Format version 1.0 · Kit date 19 Nov 2026**

You are writing the complete C programming tutorial for **Loop & Logic**, an adaptive learning platform for Bangladeshi university students (first-year CSE/EEE at DIU and similar). The tutorial must be as structured and practical as the best tutorial sites (GeeksforGeeks, TutorialsPoint, Programiz), but **original**, **compiler-verified**, and in the exact file format below so the platform can import it without manual work.

The platform will:
- render each topic as a page with section navigation;
- show every example with **Copy**, **Try now** (opens an online compiler) and its real output;
- run each topic's quiz with server-side grading;
- feed the text to an AI tutor that answers only from reviewed content.

So accuracy and structure matter more than length.

---

## 0. What you have in this kit

| Path | What it is |
|---|---|
| `CODEX_PROMPT.md` | this brief (the source of truth) |
| `spec/curriculum.json` | **all 16 modules and 120 topics** with fixed ids, order, level and the points each topic must cover |
| `spec/videos.json` | the 49 Loop & Logic YouTube videos you may link to (by `videoId`) |
| `tools/check-tutorial.mjs` | the checker. Zero dependencies, Node 18+, uses gcc/clang. **The platform runs this same script; a package with any ERROR is rejected.** |
| `sample/c-tutorial/` | one finished topic (`c-for-loop`) that passes the checker. **Copy its structure, depth and tone.** |

Read the sample topic completely before writing anything.

---

## 1. Your deliverable

Deliver a folder named `c-tutorial/` in this exact layout. Everything is UTF-8, LF line endings, and file names are lowercase kebab-case.

```
c-tutorial/
├── manifest.json
├── NOTES.md                  # your notes for the reviewers (see §9)
├── CHECK_REPORT.txt          # output of the checker for this delivery (0 errors)
└── topics/
    └── <module-id>/
        └── <topic-id>/
            ├── topic.json            # metadata, examples, practice, quiz, key points, exam questions
            ├── body.en.html          # the lesson text (HTML fragment, strict subset)
            ├── body.bn.html          # OPTIONAL full Bangla version (same structure)
            ├── examples/
            │   ├── ex-1.c            # complete, compilable program
            │   ├── ex-1.in           # stdin, only if the program reads input
            │   └── ex-1.out          # EXACT stdout produced by really running it
            ├── practice/
            │   ├── p-1.c             # reference solution
            │   ├── p-1.t1.in  p-1.t1.out
            │   └── p-1.t2.in  p-1.t2.out   (≥ 2 tests per problem)
            └── assets/               # OPTIONAL diagrams: *.svg (preferred), *.png, *.webp
```

- `<module-id>` and `<topic-id>` come **only** from `spec/curriculum.json`. Do not rename, merge, split or invent topics. If you think a topic is missing, propose it in `NOTES.md`.
- Every topic folder must be listed in `manifest.json`, and every listed topic must exist.

### 1.1 `manifest.json`

```json
{
  "schemaVersion": "1.0",
  "packageId": "c-programming-tutorial",
  "packageVersion": "0.1.0",
  "generatedAt": "2026-11-20T10:00:00Z",
  "generatedBy": "codex",
  "compiler": "gcc 13.3.0",
  "cStandardBaseline": "c17",
  "languages": ["en", "bn-partial"],
  "modules": [
    { "id": "getting-started", "topics": ["c-introduction", "c-setup"] }
  ]
}
```

- **`modules`:** list the modules and topics **delivered so far**, in curriculum order (cumulative: each batch contains everything from earlier batches too).
- **`packageVersion`:** semver. Bump the minor version per batch (0.1.0, 0.2.0, …) and the patch version for fixes. Use 1.0.0 when all 120 topics are done.
- **`compiler`:** the compiler and version you actually used.

---

## 2. `topic.json` (exact fields)

Use `sample/c-tutorial/topics/loops/c-for-loop/topic.json` as the template.

| Field | Type / rule |
|---|---|
| `schemaVersion` | `"1.0"` |
| `id`, `module`, `order` | exactly as in the curriculum |
| `kind` | `"lesson"` (default), `"project"` (mini projects), `"question-bank"` (output prediction, exam programs, interview questions) |
| `title`, `summary` | `{ "en": "…", "bn": "…" }`. Summary ≤ 220 characters, one sentence. Bangla must be natural Bangla, technical words may stay in English. |
| `level` | `beginner` \| `intermediate` \| `advanced` (as in the curriculum) |
| `estMinutes` | realistic reading + trying time, 5–120 |
| `prerequisites`, `related` | arrays of curriculum topic ids (may be empty) |
| `keywords` | 3–15 search words students would type |
| `standards` | `{ "minimum": "c89\|c99\|c11\|c17\|c23", "notes": ["short notes on version differences"] }` |
| `videos` | `[{ "videoId": "…", "note": "…" }]`. Only ids from `spec/videos.json`, and only when the video really teaches this topic (match by title). Empty is fine. |
| `sections` | `[{ "id", "title" }]`. Must equal the `<h2 id>`s of `body.en.html`, in order. |
| `examples` | see §4 |
| `practice` | see §5 |
| `quiz` | see §6 |
| `keyPoints` | 5–10 items, each `{ "en", "bn" }`, one sentence each |
| `examQuestions` | 3–8 items `{ "type": "short\|long\|output\|program", "question", "marks", "answerHtml" }` written like Bangladeshi university mid/final questions (PPS, SPL, Structured Programming) |
| `references` | `[{ "title", "url" }]`. Only these sites: en.cppreference.com, open-std.org, gcc.gnu.org, gnu.org, man7.org, clang.llvm.org, valgrind.org |
| `review` | `{ "status": "draft", "author": "codex", "checkedBy": null }`. Always `draft`; Loop & Logic reviewers change it. |

---

## 3. `body.en.html`: the lesson text

### 3.1 Required structure (kind `lesson`)

Each section starts with `<h2 id="…">`. Use these ids, in this order, keeping the ones that apply:

| id | Required? | Content |
|---|---|---|
| `introduction` | **required** | what it is, why it matters, a real-life picture, where it fits; first paragraph uses `class="lead"` |
| `syntax` | recommended | general form in a code block + a table explaining each part |
| `how-it-works` | recommended | step-by-step explanation, a trace table, a flowchart (`<pre class="diagram">`) or memory diagram |
| `examples` | **required** | `<h3>` + one or two lead sentences + `<div data-example="ex-N"></div>` for each example, basic → advanced |
| `variations` / `comparison` / `edge-cases` / `real-world-use` | optional | as the topic needs |
| `common-mistakes` | **required** | each mistake as an `<h3>`: what goes wrong, why, how to fix. Use a `demonstrates` example where the compiler shows the problem. |
| `best-practices` | recommended | a short `<ul>` |
| `version-notes` | recommended | a `<div class="callout version">` explaining C89/C99/C11/C17/C23 differences for this topic (say "no changes" if none) |
| `summary` | **required** | one short paragraph and a `topic:` link to the next topic |

`project` and `question-bank` topics may use their own section ids, but must still start with `introduction`.

### 3.2 Allowed HTML (anything else is an error)

- **Tags:** `h2 h3 h4 p br hr ul ol li strong em code pre kbd dfn abbr sup sub table thead tbody tr th td caption blockquote a figure figcaption img div`
- **Attributes:** `h2/h3/h4 id` (kebab-case; every h2 needs one) · `ol start` · `a href` · `img src alt width height` · `abbr title` · `th scope colspan rowspan` · `td colspan rowspan`
- **Classes, exactly:**
  - `p.lead`, `p.callout-title`
  - `pre.diagram`, `pre.output`
  - `code.language-c`, `code.language-bash`, `code.language-text`
  - `table.ref`
  - `div.callout note|tip|warning|danger|version|exam`
- **Example placeholder:** `<div data-example="ex-1"></div>`, empty, each example placed exactly once.
- **Links:** `topic:<topic-id>` for other topics, `#section-id` inside the page, or `https://` to the approved sites only.
- **Images:** `assets/<name>.svg|png|webp`, with meaningful `alt` text. SVGs must have no scripts and no external links.
- **Not allowed:**
  - `<html>`, `<head>`, `<body>`, `<script>`, `<style>`, `<iframe>`
  - `style=""` and `on*=""` attributes
  - HTML comments
- **Escape C code:** write `#include &lt;stdio.h&gt;`, `a &lt; b`, `&amp;x`. A raw `<` or `&` is an error.
- **Code blocks** in the text (`<pre><code class="language-c">`) are for short fragments, at most 15 lines. Anything runnable must be an example.

### 3.3 Depth targets (words of body text, excluding code)

| Level | Words | Examples | Practice | Quiz (output questions) | Key points | Exam questions |
|---|---|---|---|---|---|---|
| beginner | 900–1,800 | 3–8 | 4–8 | 10–20 (≥ 3) | 5–10 | 3–8 |
| intermediate | 1,200–2,400 | 3–8 | 4–8 | 10–20 (≥ 3) | 5–10 | 3–8 |
| advanced | 1,500–3,000 | 3–8 | 4–8 | 10–20 (≥ 3) | 5–10 | 3–8 |
| project | any | 1–8 | 2–6 | 8–20 | 4–10 | 2–8 |
| question-bank | any | 0–40 | 0–20 | 15–20 (≥ 5) | 3–10 | 10–60 |

Cover **every point listed under `covers`** for the topic in `spec/curriculum.json`. If a point needs more than the word budget, the budget yields to the point. Never pad to reach a count.

### 3.4 Writing style

- **Audience:** a first-year student who has seen the earlier topics, and nothing later. Do not use a concept before its topic unless you explain it in one line and link it (`topic:`).
- **Language:** plain English (B1–B2 level). Short sentences, paragraphs of at most 4 sentences. Define a term the first time with `<dfn>`. Say "you". Avoid "simply", "obviously", "just".
- **Pattern:** for every concept, give the idea, then code, then output, then an explanation of the output. Show, don't only tell.
- **Local context:** use local, neutral examples (marks, CGPA, taka, cricket scores, roll numbers, DIU-style grading), with no politics, religion or brands.
- **Self-contained sections:** each section must make sense on its own. The AI tutor quotes sections separately, so start sections by naming the subject ("A pointer stores…"), not "It…".
- **Accuracy:** be exact about undefined, unspecified and implementation-defined behavior. When sizes or results depend on the platform, say so ("on a typical 64-bit system with GCC, `int` is 4 bytes").
- **Bangla:** `title`, `summary` and `keyPoints` must be bilingual. A full `body.bn.html` is optional. If you write one, it must have the same h2 ids and example placeholders.

---

## 4. Examples

```json
{
  "id": "ex-2",
  "title": "Sum of the numbers from 1 to n",
  "level": "basic|intermediate|advanced",
  "file": "examples/ex-2.c",
  "stdin": "examples/ex-2.in",
  "output": "examples/ex-2.out",
  "tryNow": true,
  "explanationHtml": "<p>…</p>",
  "standard": "c17",
  "compilerFlags": ["-lm"],
  "args": ["data.txt"],
  "workdirFiles": ["examples/data.txt"],
  "exitCode": 0,
  "demonstrates": "compile-error|warning|undefined-behavior|runtime-error",
  "deterministic": false,
  "outputNote": "why output varies"
}
```

**Optional fields:**
- `stdin`: only when the program reads input.
- `standard`: defaults to `c17`. Use `c23` only for C23-only features; it is compiled with `-std=c2x`.
- `compilerFlags`: for example `-lm` for math.h.
- `args`: command-line arguments, for argv topics.
- `workdirFiles`: files copied next to the program before it runs, for file-handling topics.
- `exitCode`: defaults to 0.
- `demonstrates`: only for "mistake" examples.
- `deterministic`: `false` only for genuinely varying output (rand, time, addresses), together with `outputNote`.

**Code rules (the checker enforces these):**
1. Every example is a **complete program** that compiles with `gcc -std=c17 -Wall -Wextra -Wpedantic -Werror -O2` with **zero warnings**. Use the `standard` given in the example.
2. **The `.out` file is the real stdout from running the program.** Never write expected output by hand. Generate it:
   `gcc -std=c17 -Wall -Wextra -Wpedantic -Werror -O2 ex-2.c -o ex-2 && ./ex-2 < ex-2.in > ex-2.out`
3. Output must be deterministic. Don't print addresses, `sizeof` results that differ by platform without noting it, uninitialized values, or rand() without a fixed seed.
4. Style:
   - 4 spaces, no tabs; braces on every block; lines ≤ 100 characters; meaningful names.
   - Write `int main(void)` and `return 0;`.
   - Use `%zu` for `sizeof`.
   - Check the `scanf` return value from the `c-scanf` topic onward.
5. **Never in normal examples:** `gets`, `conio.h`, `getch`, `clrscr`, `void main`, `fflush(stdin)`. These may appear only in a `demonstrates` example that explains why they are wrong.
6. Mistake examples:
   - `compile-error`: must fail to compile.
   - `warning`: must compile, but produce a warning under `-Wall -Wextra -Wpedantic`.
   - `undefined-behavior`: compiled without `-Werror` and not run. The explanation must say clearly that the result is undefined.
   - `runtime-error`: must compile cleanly and then crash or exit non-zero.
7. Programs that read input print a short prompt. The platform shows the input separately, so the `.out` file will show prompts without the typed input; that is expected.
8. `tryNow: false` for programs that need files, command-line arguments or several source files.
9. Comments inside code: helpful at beginner level, explaining *why* rather than restating the code.

---

## 5. Practice problems

```json
{
  "id": "p-1",
  "difficulty": "easy|medium|hard",
  "title": "…",
  "statementHtml": "<p>Read n and …</p>",
  "hints": ["first hint", "second hint"],
  "solution": "practice/p-1.c",
  "tests": [
    { "stdin": "practice/p-1.t1.in", "output": "practice/p-1.t1.out" },
    { "stdin": "practice/p-1.t2.in", "output": "practice/p-1.t2.out" }
  ]
}
```

- Mix the difficulties: about 2 easy, 2 medium and 1–2 hard.
- Each problem has at least 2 tests, including an edge case (0, 1, negative, largest allowed).
- State the exact input and output format in `statementHtml`. Output files are produced by running the solution.
- Problems should be in the spirit of Beecrowd, Codeforces Div. 3 A/B and university lab tasks, but written originally.

---

## 6. Quiz (graded on the server)

```json
{
  "id": "q-1",
  "type": "mcq|output",
  "difficulty": "easy|medium|hard",
  "prompt": "≤ 1000 characters",
  "code": "optional; required for type output: a complete program ≤ 40 lines",
  "options": ["2 to 6 options, each ≤ 300 characters, all different"],
  "answer": 2,
  "explanation": "≤ 1500 characters: why the answer is right and why the tempting wrong one is wrong"
}
```

- Write 10–20 questions per lesson: concept, syntax, tracing, mistakes, version facts.
- **At least 3 must be `type: "output"`.** The checker compiles and runs `code` and fails if `options[answer]` is not exactly the program's output. Trailing spaces are ignored. Multi-line output is written with `\n` in the option.
- Make distractors plausible (common misconceptions, off-by-one), never silly.
- **Vary the position of the correct answer.** Don't put most answers in the same slot.
- No "all of the above" or "none of the above".

---

## 7. Accuracy process (do this for every topic)

1. Write the code first. Compile with `-Werror` and run. Generate the `.out` files from the real runs.
2. Write the text around the verified code.
3. For pointer, memory and string topics, also build with `-fsanitize=address,undefined` and run (the checker's `--sanitize` flag does this). Normal examples must be clean.
4. Run the checker:
   ```bash
   node tools/check-tutorial.mjs c-tutorial --topic c-pointers-intro      # while working on one topic
   node tools/check-tutorial.mjs c-tutorial --sanitize --report c-tutorial/CHECK_REPORT.txt   # before delivering
   ```
5. Fix every ERROR. Read every WARNING; fix it or explain it in `NOTES.md`.
6. Re-read the topic as a student. Is every term defined before it is used? Does every example's explanation match its real output?

---

## 8. Originality and sources

- **Write everything yourself.** Do not copy or closely paraphrase text, examples, tables or images from GeeksforGeeks, TutorialsPoint, Programiz, W3Schools, javatpoint, books or any other source. Copy the *kind* of structure (syntax, then example, then output, then explanation), not the words.
- Facts about the language must agree with the C standard. When in doubt, check en.cppreference.com and cite it in `references`.
- Do not include personal data, real people's names (other than Dennis Ritchie and other historical figures in the introduction), logos or trademarks beyond plain mentions (GCC, Code::Blocks, VS Code).

---

## 9. Delivery in batches

Deliver in this order. Each batch is a zip of the **whole** cumulative `c-tutorial/` folder:

| Batch | Modules | Topics |
|---|---|---|
| 1 | getting-started, basics | 18 |
| 2 | operators, decision-making, loops | 24 |
| 3 | functions, arrays | 18 |
| 4 | strings, pointers | 17 |
| 5 | dynamic-memory, structures, preprocessor | 20 |
| 6 | file-handling, advanced, data-structures | 17 |
| 7 | practice-exam | 6 |

Name the zip `c-tutorial-v<packageVersion>.zip`. Each batch must:
- pass the checker with **0 errors** (include `CHECK_REPORT.txt`);
- update `manifest.json` (packageVersion, generatedAt, modules);
- update `NOTES.md` with:
  - the topics in this batch;
  - any curriculum point you could not cover, and why;
  - suggested extra topics;
  - remaining warnings, with reasons;
  - anything a human reviewer should double-check, such as platform-dependent outputs.

---

## 10. Definition of done (per topic)

- [ ] Covers every `covers` point in the curriculum.
- [ ] Required sections present; text within the depth target; reads naturally for a first-year student.
- [ ] Every example compiles without warnings, and its `.out` came from a real run.
- [ ] Practice: solutions pass all tests, and edge cases are included.
- [ ] Quiz: 10+ questions, 3+ verified output questions, answer positions varied, an explanation for every question.
- [ ] Bilingual `title`, `summary` and `keyPoints`.
- [ ] `videos` linked only where a listed video really teaches the topic.
- [ ] The checker reports 0 errors for the topic.

Start with Batch 1. Before writing a topic, re-read its `covers` list and the sample topic. Quality and correctness come first; a smaller batch that passes beats a large batch with errors.
