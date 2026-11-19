# Python – Batch 3 review notes

Package version: **0.3.0**. Schema: **1.1**. Track: **python**.

This delivery adds all **12** topics in `oop-files-errors` and `advanced`.
The manifest retains the earlier 26 topics, bringing the package to **38 of 45**
curriculum topics. The seven `data-science` and `practice-exam` topics belong to
Batch 4. No Batch 3 coverage point is intentionally omitted, and no extra topic
is proposed. Repository changes are confined to `content-kit/python/content/`.

## Coverage and teaching choices

| Topic | Coverage and review entry points |
| --- | --- |
| `py-classes-objects` | `class`, `__init__`, `self`, bound methods; instance versus class attributes; shadowing, aliases and shared mutable class lists. |
| `py-inheritance-polymorphism` | Subclasses, parent initialization through `super()`, overriding, MRO-aware lookup; duck typing and compatible contracts; composition versus inheritance. |
| `py-dunder-methods` | `__str__` versus `__repr__`, container display, `__len__` and truthiness; non-mutating addition, `NotImplemented`, equality and ordering; hashing constraints. |
| `py-dataclasses` | `@dataclass`, generated methods, defaults and `field(default_factory=list)`; ordering, `__post_init__`, frozen assignment versus nested mutation, and `replace`. |
| `py-exceptions` | `try`/`except`/`else`/`finally`; normal completion versus early exits; raising, custom categories, built-in failures, chaining and cleanup. |
| `py-file-handling` | Open modes, explicit UTF-8 and `with`; line iteration, blank lines versus EOF, pathlib; quoted CSV and JSON round trips plus domain validation. |
| `py-iterators-generators` | `iter`, `next`, `__iter__`, `__next__`, exhaustion; `yield`, generator expressions, lazy timing, one-pass consumption and bounded infinite sources. |
| `py-decorators` | Functions wrapping functions, argument forwarding and return values; `functools.wraps`, factories, stacking order, closure state and exceptional exits. |
| `py-context-managers` | `with`, entered values, `__enter__`/`__exit__`, propagation versus suppression, entry failure and reverse exit order; `contextlib.contextmanager` with `try/finally`. |
| `py-type-hints` | Parameter, return and variable annotations; `list[int]`, `dict[str, int]`, `Optional`/union forms and narrowing; mypy workflow versus runtime validation. |
| `py-regex` | `search`, `match`, `fullmatch`, `findall`, `sub`; raw strings, ASCII/Unicode policy, repetition, numbered/named groups, noncapturing groups and literal escaping. |
| `py-testing` | Plain `assert` and optimization; independent fixtures, known-answer and boundary cases, `unittest` assertions and expected errors; pytest collection and parameterization introduction. |

Lessons explain the idea before the rule, use local academic examples, and include
an “If you know C” callout. Advanced lessons meet the higher depth target. Counts
vary with topic scope. Each new lesson includes three executable output quizzes;
all examples, reference solutions and output quizzes use a main guard.

Bangla titles, summaries and key points follow `BANGLA_STYLE.md`: everyday চলিত
Bangla, তুমি where addressing the reader, common technical terms in Bangla script,
and code identifiers in English. Full Bangla bodies remain optional and are not
included; the manifest continues to declare `bn-partial`.

The earlier `py-if-statements` key point now says to reject invalid values before
deciding which group a value belongs to. This removes the ambiguous “শ্রেণি” wording
flagged by the new style check. The earlier recursion key point now uses the
consistent spelling “মেমরি”. Earlier English lessons and executable files are
unchanged.

## Execution and verification

Runtime: **Python 3.12.14**, **Node.js v24.22.1**. Every new `.out` was captured
from an actual run with `python3 -I -X utf8 -W error` in a fresh temporary working
directory. Quiz answers were populated from execution, then independently checked
by the package checker. There are no skipped, nondeterministic or compile-only
examples and no required third-party runtime dependencies.

Run from `content-kit/`:

```bash
node tools/check.mjs python/content --report python/content/CHECK_REPORT.txt
```

Final cumulative result: **0 errors, 0 warnings**, **38/45 topics**. The committed
report records the full execution run, including earlier topics. Initial HTML
nesting and depth issues were corrected; no warnings remain to waive.

Additional checks:

- All **108** new Python source files and **36** output-quiz programs parse with
  Python 3.10 grammar. The **15** Python fragments in new bodies and exam answers
  also parse and remain within the 15-line fragment limit. Runtime testing uses
  3.12.14, not a separate 3.10 interpreter.
- All new source files load under a non-main name without printing or reading input.
  Python source lines stay within 100 characters.
- In a separate temporary environment, **pytest 9.2.0** collected and passed all
  three test functions in `py-testing/examples/ex-5.py`.
- **mypy 2.4.1 --strict** accepted typing examples ex-1, ex-2 and ex-4. It reported
  exactly the intended incompatible `str` argument in ex-3. That example is
  deliberately runnable: it demonstrates that runtime execution does not enforce
  the annotation. Typing-lesson entry points are annotated so mypy checks their
  bodies without needing `--check-untyped-defs`.
- unittest examples assert successful runner results. The reporting exercise
  `py-testing/practice/p-3.py` also deliberately handles a failing assertion and
  prints `FAIL`; it demonstrates a recorded failure rather than an uncaught error.

| Content | Batch 3 | Cumulative |
| --- | ---: | ---: |
| Topics | 12 | 38 |
| Examples | 56 | 168 |
| Code practice exercises | 52 | 156 |
| Written practice exercises | 0 | 8 |
| Practice execution cases | 124 | 372 |
| Quiz questions | 130 | 409 |
| Output quiz questions | 36 | 116 |
| Exam questions | 36 | 117 |
| Python source files | 108 | 325 |

Cases include empty collections and streams, zero marks, exact cutoffs, unsupported
operators, invalid lengths, frozen assignment and nested mutation, insufficient
funds with unchanged state, missing optional results, malformed JSON, boolean marks,
quoted CSV commas/quotes, regex boundaries and exceptional cleanup paths.

## Reviewer attention and limits

- Review the English teaching sequence and natural Bangla wording. All topics stay
  `draft` pending human content review. Videos remain empty because no topic match
  has been verified.
- File programs create and remove their own temporary directories, close writers
  before reading, and display no machine-specific paths. They need no existing
  files. Closing is distinguished from durability, rollback and atomic updates.
- `frozen=True` is shallow; equality, ordering and hashing remain distinct rules.
  `NotImplemented` is returned to operator dispatch, never used as a boolean.
- Inheritance examples use single inheritance. Multiple-inheritance cooperation,
  async protocols and exception groups are outside this introductory coverage.
- Context-manager suppression is intentional only where demonstrated. Cleanup-only
  managers propagate failures, and generator managers restore state in `finally`.
  No global-state concurrency guarantee is claimed.
- The regex record-extraction practice explains its lookarounds in the hint and
  specifies whitespace token boundaries. Numeric domain validation follows matching.
  Regex syntax does not establish calendar validity or offered-course membership.
- pytest and mypy are optional development tools. Their installation commands are
  instructional; normal package checking needs only Python's standard library.
  Tool-specific diagnostics and variable test timings are not stored as outputs.
- Empty-input fixtures intentionally contain blank lines. The regex whitespace
  practice also preserves a trailing space in `p-3.t3.in` to test a trailing
  underscore. Preserve those data bytes; whitespace diagnostics for these fixtures
  are intentional. Source, HTML, JSON and notes must remain whitespace-clean.
