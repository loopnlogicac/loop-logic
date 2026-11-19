# Codex brief, Task 2: seven subjects, labs, and Batch 1 fixes

**Format 1.1 · 19 Nov 2026**

You are continuing the Loop & Logic tutorial content. Task 1 produced C Batch 1 (PR #1). Task 2 extends the work to **seven subjects** and adds **interactive labs** for Data Structures and Algorithms.

`c-tutorial/CODEX_PROMPT.md` (the Task 1 brief) **still applies** in full: originality, HTML rules, depth, accuracy process, definition of done. This brief adds to it. Where they differ, this brief wins.

Read, in this order:
1. this brief;
2. `c-tutorial/CODEX_PROMPT.md`;
3. `LAB_FORMAT.md` (for DS and Algorithms);
4. the sample topic `c-tutorial/sample/c-tutorial/topics/loops/c-for-loop/`;
5. the sample labs `samples/labs/`;
6. the `spec/curriculum.json` of the track you are working on.

---

## 1. Review of C Batch 1: what must change

Batch 1 passed the Task 1 checker: the code is correct, and thank you for the careful verification notes. But a human review found writing problems, and the checker now enforces stricter rules. **Batch 1 fails the new checker with 99 errors.** The fixes below apply to every subject from now on.

### 1.1 Write like a teacher, not like a specification
Your text was accurate but stiff. Students are first-year undergraduates reading in their second language.

| Batch 1 wrote | Write instead |
|---|---|
| "scanf reads formatted input from standard input and stores converted values in supplied destination objects." | "scanf reads what the user types and stores it in your variables. You tell it what kind of value to expect, like `%d` for a whole number." |
| "The key obligations are…" | "To use scanf safely, remember three things:" |
| "Repair the stated cause before running it; it has no expected stdout transcript." | "This program has a mistake on purpose. Read the compiler message, then fix the line it points to." |

- Short sentences, about 20 words or fewer on average. The checker warns above 24.
- Say "you". Explain **why**. Give a picture or analogy before the formal rule.
- Define a term in plain words before the precise wording.

### 1.2 Never talk about how the lesson was produced
Don't mention batches, the checker, output files, "stdout transcripts", "practice scaffolds", "automatic grading", "supplied tests", manifest or topic files, or yourself. The student only sees the lesson. These phrases are now **errors**.

### 1.3 No copy-paste between topics
Batch 1 repeated the same paragraphs in 14–18 topics, for example "Keep the stated input bounds when trying the tasks." and the "Reading the practice scaffold" paragraph. Now, **any sentence of 8+ words that appears in 3 or more topics is an error.** Each topic's text must be written for that topic. If the same background is needed often, link to the topic that teaches it (`topic:c-scanf`).

### 1.4 Quiz prompts must say what they test
"What does this complete program print?" appeared 51 times.

- **Error:** the same prompt used more than 3 times in a package.
- **Error:** two identical prompts in one topic.
- **Write instead:** "After this loop ends, what value does `i` hold?" or "`%c` comes right after `%d`. Which character does it read?"

### 1.5 Fit the counts to the topic
Every Batch 1 topic had exactly 4–5 examples, 5 practice problems and 10 quiz questions. The ranges are minimums and maximums, not targets. Bigger topics (pointers, sorting, joins) deserve more; small ones (comments, escape sequences) can stay near the minimum.

### 1.6 Natural Bangla
Write Bangla the way a Bangladeshi teacher would explain it in class, not word for word. Keep technical terms in English where students use them.

| Avoid | Prefer |
|---|---|
| সঠিক টাইপের গন্তব্য অবজেক্টের ঠিকানা লাগে। | `scanf`-কে ভেরিয়েবলের অ্যাড্রেস (`&x`) দিতে হয়, আর ফরম্যাট টাইপের সঙ্গে মিলতে হয়। |

Every `bn` field must actually be in Bangla script; the checker verifies this.

**From round 3, `BANGLA_STYLE.md` is the rule book for Bangla.** Common English tech words stay English, written in Bangla script (মেশিন লার্নিং, ক্লাউড, ডেটা, ফাংশন, লুপ), never textbook translations (যন্ত্র শিক্ষণ, মেঘ, উপাত্ত, অপেক্ষক, চলক). The checker reports these words as errors, and doubtful ones as warnings.

---

## 2. The kit

| Path | What |
|---|---|
| `tools/check.mjs` | **the checker for every track** (format 1.1; also accepts 1.0 C topics). `c-tutorial/tools/check-tutorial.mjs` now just calls it. |
| `tools/labs.mjs` | lab state model used by the checker and by the site's lab player |
| `LAB_FORMAT.md` | the lab spec: read it before writing any lab |
| `samples/labs/bubble-sort`, `samples/labs/bfs` | two finished labs that pass the checker |
| `spec/videos.json` | all 302 Loop & Logic videos; link a topic only to a video that really teaches it |
| `<track>/spec/curriculum.json` | fixed modules, topic ids, levels, kinds, `covers`, and for DS/Algorithms the `labs` |

### 2.1 Tracks

| Track | Curriculum | Write your package into | Language and checked with | Topics | Labs |
|---|---|---|---|---|---|
| C | `c-tutorial/spec/` | `c-tutorial/c-tutorial/` (continue it) | C17, gcc `-Wall -Wextra -Wpedantic -Werror` | 120 (18 done) | – |
| Data Structures | `data-structures/spec/` | `data-structures/content/` | C17 (same as C) | 47 | 24 |
| Algorithms | `algorithms/spec/` | `algorithms/content/` | C17 | 56 | 32 |
| OOP | `oop-java/spec/` | `oop-java/content/` | Java, `javac --release 17 -Xlint:all -Werror` (JDK 17 or 21) | 41 | – |
| Python | `python/spec/` | `python/content/` | Python 3.12 (works on 3.10+) | 45 | – |
| DBMS | `dbms/spec/` | `dbms/content/` | MySQL 8.0+ (`mysql --table`) | 41 | – |
| Compiler Design | `compiler-design/spec/` | `compiler-design/content/` | Python 3.12 for implementations; C allowed per example | 36 | – |

Each `content/` folder is a package laid out exactly like `c-tutorial/c-tutorial/` (`manifest.json`, `NOTES.md`, `CHECK_REPORT.txt`, `topics/<module>/<topic>/…`). The checker finds the track's curriculum automatically.

```bash
node tools/check.mjs data-structures/content --topic ds-stack-array      # while working
node tools/check.mjs data-structures/content --report data-structures/content/CHECK_REPORT.txt
node tools/check.mjs c-tutorial/c-tutorial --sanitize --report c-tutorial/c-tutorial/CHECK_REPORT.txt
node tools/check.mjs dbms/content --require-sql --report dbms/content/CHECK_REPORT.txt
```

Run every command from inside `content-kit/`.

---

## 3. What format 1.1 adds

**Manifest**
- `"schemaVersion": "1.1"`.
- `"track"`, exactly as in the curriculum.
- `"toolchain"` lists the tools and versions you really used, for example `"gcc 14.2, OpenJDK 21.0.5, Python 3.12.7, MySQL 8.0.40"`. It replaces `compiler`.
- **Version numbers:** each track has its own `packageVersion`, starting at `0.1.0` and going up one minor version per batch. **C continues from 0.1.0 and becomes 0.2.0 with the Batch 1 fixes plus Batch 2.**

**topic.json**
- `"schemaVersion": "1.1"`. Upgrade the Batch 1 C topics when you revise them.
- `kind`: `lesson` | `theory` | `project` | `question-bank`. **The curriculum fixes the kind of each topic**, and it must match.
- **theory topics** (concepts with little runnable code: ER modelling, normalisation, parsing tables, NP-completeness…):
  - required sections, in this order: `introduction`, `worked-examples`, `common-mistakes`, `summary`;
  - `examples` may be 0–8;
  - practice may be `"type": "written"` with a full worked `answerHtml` instead of code and tests;
  - quizzes need no output questions;
  - word targets are the same as for lessons.
- `standards.minimum`:
  - for C: `c89`…`c23` as before;
  - for other tracks: a string such as `"Java 17"`, `"Python 3.10"` or `"MySQL 8.0"`;
  - `standards.notes` explains version differences (for example `match` needs Python 3.10, records need Java 16, `INTERSECT` needs MySQL 8.0.31).
- `labs`: the lab ids for this topic (DS and Algorithms; must equal the curriculum's list). Place each one in the body with `<div data-lab="id"></div>`.
- `examQuestions[].type` adds `design` and `numerical`.

**Examples, practice and output-quiz programs**
- `"language"` defaults to the track language. You may override it per item (`"c"`, `"java"`, `"python"`, `"sql"`).
- File extensions: `.c`, `.java`, `.py`, `.sql`.
- `"runMode": "compile-only"` with an `outputNote` covers programs that cannot run head-less or deterministically: Swing GUIs, thread timing, programs that need the student's own files. They are still compiled.
- `"requires": ["numpy"]` covers Python examples that need packages. Install them in your environment so they really run.

**Java rules**
- One file per program, with a class named `Main` holding `public static void main(String[] args)`. Other classes go in the same file without `public`. No `package` line.
- It must compile with `javac --release 17 -Xlint:all -Werror`: no raw types, no unchecked warnings, no deprecated APIs.
- Read input with `Scanner` (or `BufferedReader` in the fast-input topic). Import the classes you use, not `java.util.*`-style wildcards for AWT/Swing.

**Python rules**
- Runs as `python3 -I -X utf8 file.py` and must parse with `-W error`.
- Idiomatic Python: f-strings, `with` for files, `if __name__ == "__main__":` from the modules topic onward. No `eval(input())` and no `from x import *`.

**SQL (MySQL) rules**
- Each `.sql` example runs in a **fresh, empty database**. First the files in `"setup"` are loaded, as paths relative to the package root, e.g. `"setup": ["shared/datasets/university.sql"]`. Then the example runs with `mysql --table`. The `.out` file is that exact output.
- **Every multi-row SELECT has `ORDER BY`**, so the row order is the same on every server.
- No `NOW()`, `RAND()` or `UUID()` in outputs. Use fixed dates.
- **Datasets** (write them in Batch 1, in `dbms/content/shared/datasets/`):
  - `university.sql`: departments, teachers, students, courses (DIU-style codes like CSE 212, MAT 101), sections, enrollments, results (marks, grade, CGPA scale);
  - `shop.sql`: customers, products, orders, order_items, payments, with amounts in BDT;
  - `library.sql`: books, members, loans.

  Realistic Bangladeshi names, at most 60 rows per table, fixed data, `utf8mb4`. Each file starts by creating its tables, so it can be loaded into an empty database. Reuse these datasets across topics so students get to know them.
- MySQL in your environment:
  - If it isn't installed, run `sudo apt-get update && sudo apt-get install -y mysql-server && sudo service mysql start`, then `sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';"`.
  - Then set `MYSQL_USER=root MYSQL_PWD=root MYSQL_HOST=127.0.0.1`.
  - Run the checker with `--require-sql`. A DBMS batch whose SQL was not run is not accepted.

**HTML additions**
- `<div data-lab="id"></div>`.
- Code classes `language-java`, `language-python`, `language-sql`.
- More entities for maths and logic: `&sigma; &pi; &cup; &cap; &isin; &epsilon; &empty; &forall; &exist; &rArr; &harr; &le; &ge; &ne; &infin; &lfloor; &rfloor;` and others. Any character can also be a numeric entity (`&#8904;` for ⋈).

**Approved reference sites** now also include docs.oracle.com, openjdk.org, dev.java, docs.python.org, peps.python.org, numpy.org, pandas.pydata.org, matplotlib.org, dev.mysql.com, postgresql.org, sqlite.org, ocw.mit.edu and openstax.org.

**New checker errors** (sections 1.2–1.4 and 1.6):
- a sentence of 8+ words in 3+ topics;
- production-process words;
- repeated quiz prompts;
- `bn` fields not written in Bangla.

---

## 4. What each subject should be like

**All subjects**
- Assume the student has done the earlier topics of *this* track, plus our C track where noted.
- Link across tracks with `topic:` links, for example from `algo-dijkstra` to `topic:ds-priority-queue`. Cross-track links are allowed.

**Data Structures (C)**
- **Memory first.** Every structure gets box-and-arrow diagrams (`<pre class="diagram">` or SVG in `assets/`) for each operation, before and after.
- **Code:** complete C programs that compile cleanly and free everything they allocate. Run them with `--sanitize`; leaks are errors.
- **Every operation:** its time and space cost, and its edge cases (empty structure, one element, full).
- **Labs:** every lab listed in the curriculum, following `LAB_FORMAT.md`.
- **Exam questions:** tracing (draw the stack after these operations), address calculation, "write a function that…".
- **Matching:** the lab's pseudocode, the text and the C code use the same names.

**Algorithms (C)**
- Pseudocode first, then a C implementation, then a trace table on a small input (the lab animates the same input), then the complexity analysis with the reasoning shown.
- **Correctness:** an invariant or a proof idea for every main algorithm; greedy topics show the exchange argument or a counterexample.
- **DP topics:** the state, the recurrence, the table-filling order and how to reconstruct the answer, each in its own step.
- **Graph topics:** the same 6–8 vertex example graph across BFS, DFS, Dijkstra, Prim and Kruskal where it fits, so students can compare the algorithms.
- **Exam questions:** "show each pass", "fill the table", "find the MST and its weight".

**OOP (Java)**
- **Readers know C** from our C track. Use "If you know C" callouts where Java differs: references vs pointers, no manual free, `String` vs `char[]`.
- **Design:** UML class diagrams as `<pre class="diagram">` or SVG.
- **Inheritance and polymorphism:** output-tracing questions (which method runs?) — these are the core of DIU OOP exams.
- **Java versions:** mark newer features (`var` 10, switch expressions 14, records and pattern matching 16, sealed classes 17). Swing examples are `compile-only`.

**Python**
- Many readers start programming here, so explain from zero, and add "If you know C" callouts for students coming from our C track.
- Teach idiomatic Python, not C written in Python.
- **Problem solving:** fast input with `sys.stdin`.
- **Data science topics:** `requires` numpy, pandas or matplotlib. A Matplotlib example ends with `plt.savefig("plot.png")` and prints a one-line confirmation, which is its `.out`. Run it yourself, copy the picture it makes into the topic's `assets/` folder, and show it in the lesson with `<img src="assets/…png" alt="…">`.

**DBMS (MySQL)**
- **Theory topics:**
  - worked examples step by step;
  - ER diagrams as clear SVG or `<pre class="diagram">` (Chen notation, as in Bangladeshi university exams);
  - relational algebra with real symbols (σ, π, ⋈, ∪, −, ÷) and the matching SQL;
  - normalisation from a sample unnormalised table, one normal form at a time, with the FDs written out;
  - transactions and concurrency with schedule tables and precedence graphs.
- **SQL topics:** every query runs on the shared datasets and shows its real output.
- **SQL practice set:** 50 queries on `university.sql`.

**Compiler Design**
- **Mostly theory**, with full worked tables as `<table class="ref">`: FIRST/FOLLOW, LL(1), LR(0) items, SLR/LALR tables, DFA transition tables.
- **Python implementations, verified by the checker:** a lexer, a DFA simulator, a FIRST/FOLLOW calculator, a recursive-descent parser, a three-address-code generator, and basic-block detection.
- **Flex and Bison files** are shown as code blocks, not run.
- **Exam questions:** the classic numericals (compute FIRST/FOLLOW, build the LL(1) table and parse a string, NFA→DFA, build the SLR table).

---

## 5. Batches

Each task is one batch of one track, delivered as its own pull request. Several tasks may run in parallel because tracks live in separate folders. **Change only your track's folder.**

| Track | Batch | Modules | Topics / labs |
|---|---|---|---|
| C | 2 | **fix Batch 1 (all 18 topics, sections 1.1–1.6)** + operators, decision-making, loops | 18 revised + 24 new |
| C | 3 / 4 / 5 / 6 / 7 | as in `c-tutorial/CODEX_PROMPT.md` §9 | |
| Data Structures | 1 | foundations, arrays, linked-lists | 14 / 7 labs |
| Data Structures | 2 | stacks, queues | 11 / 6 |
| Data Structures | 3 | trees | 10 / 6 |
| Data Structures | 4 | hashing, graphs, practice-exam | 12 / 5 |
| Algorithms | 1 | foundations, searching, sorting | 16 / 9 |
| Algorithms | 2 | divide-conquer, greedy, dynamic-programming | 17 / 10 |
| Algorithms | 3 | graph-algorithms | 10 / 9 |
| Algorithms | 4 | backtracking, strings-math, complexity, practice-exam | 13 / 4 |
| OOP (Java) | 1 | java-basics, classes-objects | 16 |
| OOP (Java) | 2 | inheritance-polymorphism, design | 11 |
| OOP (Java) | 3 | advanced-java, gui, practice-exam | 14 |
| Python | 1 | basics, control-flow | 13 |
| Python | 2 | data-structures, functions | 13 |
| Python | 3 | oop-files-errors, advanced | 12 |
| Python | 4 | data-science, practice-exam | 7 |
| DBMS | 1 | foundations, er-modelling, relational-model, sql-basics **+ the three datasets** | 15 |
| DBMS | 2 | sql-advanced | 11 |
| DBMS | 3 | normalization, internals, beyond, practice-exam | 15 |
| Compiler Design | 1 | introduction, lexical-analysis | 11 |
| Compiler Design | 2 | syntax-analysis | 10 |
| Compiler Design | 3 | semantic-analysis, intermediate-code, runtime-codegen, practice-exam | 15 |

**Each pull request must:**
- pass `node tools/check.mjs <package>` with **0 errors** (C with `--sanitize`, DBMS with `--require-sql`);
- include `CHECK_REPORT.txt`;
- have an updated `manifest.json` (cumulative topics, new `packageVersion`);
- update `NOTES.md`: the topics in the batch, anything not covered and why, warnings with reasons, and what a reviewer should double-check;
- be titled `<Track> – Batch N`, e.g. `Data Structures – Batch 1`.

---

## 6. Definition of done

**Per topic** (in addition to Task 1's list):
- [ ] Written for a first-year student: short sentences, the why explained, no production talk, no text shared with other topics.
- [ ] Quiz prompts each say what they test.
- [ ] Natural Bangla in `title`, `summary` and `keyPoints` (and `body.bn.html` if you add one).
- [ ] Every program is in the track's language and verified by really running it (SQL on MySQL).
- [ ] Every curriculum `covers` point is covered.

**Per lab:**
- [ ] Follows `LAB_FORMAT.md` and passes the checker on presets, checks and random inputs.
- [ ] Notes explain why each step happens; `bn` notes on the key steps.
- [ ] The pseudocode and names match the lesson and its C example (`codeExample`).
- [ ] Presets cover the typical, best, worst and an edge case.

Quality first. A smaller batch that passes beats a large batch with errors.


> Lab counts in the batch table were corrected on 19 Nov 2026. When the table and `spec/curriculum.json` disagree, the curriculum is right.
