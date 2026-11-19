# Python – Batch 4 review notes

Package version: **0.4.0**. Schema: **1.1**. Track: **python**.

This final batch adds the seven `data-science` and `practice-exam` topics.
The cumulative manifest now contains **all 45 curriculum topics**, retaining the
38 earlier topics. No curriculum coverage point is intentionally omitted, and
no extra topic is proposed. Repository changes stay within
`content-kit/python/content/`.

## Coverage

| Topic | Coverage and reviewer entry points |
| --- | --- |
| `py-numpy-basics` | Arrays versus lists; numerical dtypes, vectorized arithmetic, shapes, axes, indexing, masks, broadcasting, row centering, slice views and independent copies. |
| `py-pandas-basics` | Series and DataFrame, label alignment, `loc`/`iloc`, an actual temporary UTF-8 CSV, leading-zero identifiers, filtering, `groupby`, `describe` and missing-value policies. |
| `py-matplotlib-basics` | Line, bar and scatter plots; labels, titles, units, scale choices, Figure/Axes, headless rendering, saved PNGs and cleanup. All three example images are embedded in the lesson. |
| `py-problem-solving` | **20 original solved problems**: 1–8 are runnable examples, 9–16 are practice problems with full solutions and fixtures, and 17–20 have complete programs in exam answers. Covers buffered `sys.stdin`, idioms, invariants and costs. |
| `py-exam-questions` | Output tracing and code writing with worked answers; aliases, copying, generator consumption, dictionary replacement, rebinding, `finally`, contracts and boundary-test design. |
| `py-mini-project-expense-tracker` | Full menu CLI, functions and dictionaries, exact integer paisa, JSON persistence and validation, CSV export, category summaries, restart behavior and failed-save handling. |
| `py-interview-questions` | **50 numbered short questions with answers**, plus 15 quiz questions, covering objects, collections, functions, iteration, design, files, testing and practical library choices. |

All topic kinds, levels and ordering match the curriculum. Counts vary with
scope. Every new runnable program and output quiz has a main guard. Bangla
titles, summaries and key points follow `BANGLA_STYLE.md`: everyday চলিত Bangla,
common technical terms in Bangla script, and code identifiers in English.
Full Bangla bodies remain optional; the manifest declares `bn-partial`.
Videos are empty because no matching video was independently verified.

## Execution and verification

Environment: **Python 3.12.14**, **Node.js v24.22.1**, **NumPy 2.3.5**,
**pandas 2.2.3**, **Matplotlib 3.10.8**. These packages were already installed;
no dependency installation or repository configuration change was needed.
All examples, practices and output quizzes that import a numerical or plotting
package declare it in `requires`.

Every new `.out` was captured from an actual isolated execution using
`python3 -I -X utf8 -W error`. Practice outputs were also checked against
hand-calculated answers. Output-quiz choices were checked against real execution.
Numerical summaries use explicit decimal formatting; integer results remain
integers. No new program is skipped, compile-only or nondeterministic.

From inside `content-kit/`, run:

```bash
export MPLCONFIGDIR=/tmp/python-b4-mpl
export XDG_CACHE_HOME=/tmp/python-b4-cache
node tools/check.mjs python/content --require-packages --report python/content/CHECK_REPORT.txt
```

The temporary cache paths are needed in this environment because the default
home configuration directories are read-only. They do not change the examples
or their output. The checker sets the Agg plotting backend itself; plotting
programs also select it explicitly before importing pyplot.

Final result: **0 errors, 0 warnings**, **45/45 topics**. The report includes
execution of the cumulative package. The initial NumPy depth warning was fixed
by expanding the broadcasting explanation; no warning is waived.

Additional verification:

- All **44** new source files, **24** output quizzes and **15** Python HTML
  fragments parse with Python 3.10 grammar. Runtime execution uses Python
  3.12.14; no separate 3.10 interpreter was used. New source lines stay within
  100 characters, and importing each new source under a non-main name neither
  reads input nor prints.
- Every one of the 20 contest-style solutions was executed on normal and edge
  cases. The four programs in exam answers were run separately because the
  package checker does not execute code embedded in `answerHtml`. The two
  code-writing programs in the exam bank were also run with ordinary and empty
  inputs. Each embedded Python fragment stays within 15 lines.
- Tracker checks cover exact decimal parsing and bounds; missing storage;
  additions across separate processes; exact 30.25 BDT after restart; comma
  quoting in parsed CSV fields; invalid amounts; unfinished input at EOF;
  malformed JSON, wrong containers, boolean amounts and extra keys. Corrupt
  storage remains unchanged. A controlled replacement failure preserves the
  previous file, leaves the live total unchanged, removes the temporary file
  and never prints `Added`.
- Plot checks inspect actual line coordinates, bar heights and zero baseline,
  scatter pairs, labels and titles. Practice plots include one zero observation
  and all-zero bars. All three saved example PNGs are **720 × 480** and were
  visually inspected for readable labels, visible points and unclipped content.

| Content | Batch 4 | Cumulative |
| --- | ---: | ---: |
| Topics | 7 | 45 |
| Examples | 24 | 192 |
| Code practice exercises | 20 | 176 |
| Written practice exercises | 4 | 12 |
| Practice execution cases | 48 | 420 |
| Quiz questions | 85 | 494 |
| Output quiz questions | 24 | 140 |
| Exam questions | 78 | 195 |
| Python source files | 44 | 369 |

## Reviewer attention and limits

- All topics remain `draft` for human review. Review teaching clarity, natural
  Bangla, the 20 numbered problem contracts and the 50 interview answers.
- The declared Python 3.10 baseline describes syntax and standard-library APIs.
  NumPy 2.3.5 itself needs Python 3.11 or newer; students on Python 3.10 must
  install an older compatible release. The lessons explain that package support
  depends on the selected release. Matplotlib `bar_label` needs 3.4 or later.
- NumPy fixed-width integer behavior differs from Python `int`. Basic slicing
  shares storage; boolean indexing gathers copies. Broadcasting examples explain
  why `(n, 1)` differs from `(n,)` before subtraction.
- pandas sample standard deviation uses `ddof=1`, while ordinary NumPy `std`
  defaults to `ddof=0`. Missing marks are reported separately from known zeros.
  Leading-zero rolls stay strings. No chained assignment is used.
- The tracker is a small, single-user local project. It excludes refunds and
  accepts at most two decimal places per positive expense. Replacement through
  a neighboring temporary file reduces partial-write risk but does not provide
  concurrent-writer locking, database transactions or crash-durability guarantees.
  CSV export is a direct, repeatable write and may be partial on failure.
- Plot files use fixed data and explicit labels. Rendering bytes can vary with
  fonts or library versions; only the printed save confirmation is compared.
  Scatter association is explicitly distinguished from causation.
- Contest inputs follow their stated valid-input contracts. Whole-file token
  reading is taught with its memory cost. Prime recognition handles zero, one,
  two and perfect squares explicitly in its execution checks.
- Earlier practice fixtures intentionally include blank lines and one regex
  trailing-space case. Preserve those data bytes. Earlier content and source
  files were not changed in this batch.
