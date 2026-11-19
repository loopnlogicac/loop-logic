# Python – Batch 2 review notes

Package version: **0.2.0**. Format: **1.1**. Track: **python**.

Batch 2 adds all 13 topics in `data-structures` and `functions`. The manifest is
cumulative: it retains the 13 Batch 1 topics in `basics` and `control-flow`, for
**26 of 45** curriculum topics. The remaining 19 topics belong to Batches 3 and 4.
No curriculum point in this batch is intentionally omitted. No additional topics
are proposed. All repository changes are inside `content-kit/python/content/`.

## Teaching decisions

- English lessons assume only earlier Python topics. Each new lesson includes an
  “If you know C” callout explaining a useful difference. Titles, summaries and
  key points contain Bangla. Full Bangla bodies remain outside this delivery;
  the manifest continues to record `bn-partial`.
- Definitions and real calculations replace abstract stand-in code. Small previews
  of dictionaries, generators, decorators and files are explained where used and
  link to their dedicated lessons. No student-facing production commentary is added.
- Example, practice and quiz counts vary with scope. Every new lesson meets its
  body-depth target and contains at least three runnable output questions.
- Aliasing, nested mutable values and shallow copying are demonstrated explicitly.
  A tuple's immutability is distinguished from deep immutability and hashability.
- Set output is sorted when displayed. Dictionary insertion order is distinguished
  from an explicitly sorted report. Anagram examples preserve letter multiplicity.
- String algorithms state their normalization policy. Practice tasks specify ASCII
  or English inputs where that controls exact behavior. Unicode case folding is
  not presented as complete Unicode normalization or grapheme segmentation.
- The shared mutable-default example deliberately demonstrates defined but usually
  unwanted behavior, then supplies the `None`-based alternative. No failing program
  or nondeterministic output is used.
- Recursion includes termination arguments, stack traces, bounded input domains,
  cache memory costs and iterative alternatives. `lru_cache` is introduced through
  a short decorator preview linked to the later decorators topic.
- Main guards are used in all executable examples, practice solutions and output
  quizzes from `py-modules-packages` onward, including the neighboring billing
  module. Earlier lessons retain the ordinary script style used before that topic.
- All programs use the standard library. pip/venv commands are instructional shell
  commands; running this package requires no third-party installations. Videos
  remain empty rather than linking a video without a verified topic match.

## Curriculum coverage guide

| Topic | Coverage and reviewer entry points |
| --- | --- |
| `py-lists` | Creation, indexing and clipping slices; append/insert/pop/remove/sort; alias versus outer copy; independently created nested rows and shared inner rows. |
| `py-list-comprehensions` | Basic transformation, trailing filters and conditional expressions; nested loop order, flattening and transposition; independent rows, result-size costs and readability limits. |
| `py-tuples` | Fixed slots versus mutable contained values; packing, exact and starred unpacking; singleton commas; hashable coordinate keys and the dictionary preview. |
| `py-sets` | Uniqueness and hashability; union, intersection, directional and symmetric differences; subset/proper subset/disjointness; frozenset teams, updates and membership costs. |
| `py-dictionaries` | Key-value lookup and replacement; get/items/keys/values and live views; comprehensions; frequency counting and grouping repeated values; insertion order and missing-key policies. |
| `py-strings-advanced` | split/join/strip/replace/find; width, alignment, precision and percentage formatting; normalization, palindrome, anagram and word-count algorithms. |
| `py-functions` | def, parameter/argument distinction, return and docstrings; multiple results packed into tuples; implicit/bare return of None and caller-side handling. |
| `py-function-arguments` | Positional and keyword binding; definition-time defaults and mutable-default repair; *args/**kwargs collection and call expansion; keyword-only parameters. |
| `py-scope-lambda` | LEGB, shadowing and local-binding errors; global/nonlocal; closures, single-expression lambdas and loop late binding with default capture. |
| `py-recursion` | Base cases and shrinking measures; descent/unwinding; recursion limits and absence of tail-call elimination; functools.lru_cache, cache bounds, clearing and purity concerns. |
| `py-higher-order-functions` | Function values and callable contracts; map/filter iterator consumption; sorted key functions and stability; factories returning configured closures. |
| `py-modules-packages` | Explicit import forms and namespaces; real two-file billing example; main guard and import initialization; conventional packages, relative imports and -m; venv and interpreter-specific pip use. |
| `py-standard-library` | math, local random.Random, fixed dates/aware datetimes; Counter/defaultdict/deque; chain/product/combinations/count/islice; os.listdir and pathlib, including a temporary filesystem example. |

## Verification

Actual execution toolchain: **Python 3.12.14**, **Node.js v24.22.1**.
The checker also detects GCC; this package contains Python programs only.

All 62 new examples and all 134 new practice execution cases were run using
`python3 -I -X utf8 -W error`. Every `.out` file was captured from execution.
The 40 new output-quiz programs were separately run to populate their correct
answers. The full checker independently parses and executes the cumulative
package, including Batch 1. It also checks repeated prose, quiz prompts, Bangla,
HTML, curriculum metadata and counts.

All 121 new Python files, including `billing.py`, parse with Python 3.10 grammar.
The 40 new output-quiz programs were checked against that grammar as well.
Runtime verification uses Python 3.12.14; no claim of execution on a 3.10 runtime
is made. Import smoke checks confirm that the guarded source files do not print
or request input when loaded under a non-main name. Short Python examples in the
new exam answers are also executed independently.

Run from `content-kit/`:

```bash
node tools/check.mjs python/content --report python/content/CHECK_REPORT.txt
```

Final result: **0 errors, 0 warnings** across all **26** delivered topics. The
initial depth warnings were resolved by adding subject-specific explanations.
The committed `CHECK_REPORT.txt` records the final full run.

| Content | Batch 2 | Cumulative |
| --- | ---: | ---: |
| Topics | 13 | 26 |
| Examples | 62 | 112 |
| Practice exercises | 58 code | 104 code + 8 written |
| Practice execution cases | 134 | 248 |
| Quiz questions | 145 | 279 |
| Output quiz questions | 40 | 80 |
| Exam questions | 39 | 81 |
| Python source files | 121 | 217 |

Practice cases include empty inputs and rows, missing members and keys, repeated
rolls and words, singleton tuples and lists, equal-key sorting, no recursion
steps, zero factorial/power/staircase inputs, absent binary-search targets,
leap-year and year-boundary arithmetic, empty queues and files without suffixes.
Statements define valid input domains; solutions assume syntactically valid input
within those domains rather than adding unrelated interactive validation.

## Environment and reviewer attention

- Review English teaching flow and Bangla wording for the intended audience. Topic
  status stays `draft` until human content review.
- `py-modules-packages/examples/billing.py` is a real companion module, listed as
  `workdirFiles` for ex-4. That example sets `tryNow: false` because it needs both
  files. Isolated Python omits the script folder from sys.path, so the example
  explicitly exposes its known source directory before importing billing. The
  lesson distinguishes this from normal sibling imports. The other module example
  uses runpy to demonstrate the guard; it does not claim runpy is import caching.
- The filesystem example creates and removes a temporary folder, closes the file
  with `with`, and prints only stable names/content. It needs no existing user file.
- Fixed calendar inputs avoid current-clock and locale variation. A fixed UTC+06:00
  offset is distinguished from a historical regional timezone rule.
- Random output uses a local seeded generator and random(), with repeatability and
  display rounding explained. It does not rely on set order or shuffle order.
- Float formatting is not presented as decimal-exact arithmetic. isqrt handles
  exact integer boundaries, while isclose handles approximate float comparison.
- Installation/activation commands depend on shell and OS packaging. The lesson
  includes direct environment-interpreter invocation when activation is unavailable.
- Cache hit/miss counts are for a fresh cache and the exact demonstrated call order.
  Memoisation does not remove recursion depth or big-integer arithmetic costs.
- Batch 1 lesson source remains unchanged. Its original theory/written exercises
  and earlier main-guard teaching boundary are retained in the cumulative package.

- Some `.in` and `.out` fixtures intentionally contain trailing spaces or final
  blank lines. They exercise whitespace normalization, empty rows, empty separators
  and blank queue reports. Preserve those bytes; whitespace-only diff diagnostics
  for these data fixtures are expected. Source, HTML, JSON and notes pass the
  whitespace diff check.
