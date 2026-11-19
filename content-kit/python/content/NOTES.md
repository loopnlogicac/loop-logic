# Python – Batch 1 review notes

Package version: **0.1.0**. Format: **1.1**. Track: **python**.

This delivery contains all 13 topics in `basics` and `control-flow`, in curriculum order.
The remaining 32 topics belong to later batches. No point in this batch's `covers`
lists is intentionally omitted. No extra topics are proposed.

## Scope and teaching decisions

- English lesson bodies explain programming from zero. Each body contains a specific
  “If you know C” callout. Titles, summaries and key points include natural Bangla.
  Full Bangla lesson bodies are not included; the manifest records `bn-partial`.
- `py-introduction` retains the curriculum's `theory` kind. Its four worked written
  exercises and ten concept questions avoid requiring syntax not yet taught.
- Setup and first-program lessons each have two runnable text exercises and two
  written debugging/environment exercises. Their brief `input()` previews link to
  the full input/output lesson. Remaining lessons use runnable practice throughout.
- Imported standard-library tools, tuples, lists, f-strings and early decisions are
  explained when first previewed and linked to the appropriate deeper topic.
- All programs use the standard library only. They do not need pip installations.
- Videos are intentionally empty: no video is linked merely because it mentions Python.
- Example programs that read input include prompts. Practice solutions follow their
  stated output formats and omit interactive prompts.
- There are no compile-only or nondeterministic examples, suppressed warnings,
  intentionally failing programs, network calls or dependencies on user files.
- The main guard is not introduced early: the curriculum teaches it in
  `py-modules-packages` in Batch 2. Batch 1 programs are ordinary top-level scripts.

## Coverage guide

| Topic | Curriculum coverage and where to look |
| --- | --- |
| `py-introduction` | Uses and limitations in worked scenarios; source → bytecode → interpreter diagram; typical compiled C workflow; Python 2 end of life, Python 3 and major/minor/patch versions; C comparison table. |
| `py-setup` | Windows/macOS/Linux installation guidance; executable names and PATH; terminal versus REPL; saved `.py` files; VS Code interpreter selection; Jupyter kernel and cell order; pip paragraph and managed-environment guidance. |
| `py-first-program` | `print`, arguments, literal text and comments; indentation and blocks using an explained `if True` preview; running saved files; SyntaxError, NameError and reading error locations. |
| `py-variables-types` | Dynamic typing and rebinding; int/float/bool/str/None; `type()` and readable type names; identity comparison with `id()`; naming rules, snake_case and built-in shadowing; object binding diagram. |
| `py-numbers-math` | `/`, `//`, `%`, `**`, precedence and signed examples; quotient–remainder relation; growing integers and practical resource limits; float approximation, nearest-even rounding and display; `math.isqrt`, `sqrt`, `ceil`, `floor`, `isclose`. |
| `py-strings-basics` | Quotes, escapes, concatenation/repetition; positive/negative indexing and start/stop/step slicing; clipping versus IndexError; immutability; `len`, `strip`, `upper`, `lower`, `replace`, `startswith`; Unicode code points versus visible letters. |
| `py-input-output` | `input()` returns str and removes a newline; int/float conversion and ValueError; prompts, blank input and EOF; `print` sep/end; f-strings, width, alignment, precision and percentage formatting. |
| `py-operators` | Comparison chaining and middle evaluation; and/or/not precedence and operand return; short-circuit guards; equality versus identity and `is None`; substring membership; common incomplete-comparison mistake. |
| `py-if-statements` | Branch syntax and indentation; first-match execution trace; truthiness; nested conditions and else ownership; conditional expressions; domain validation and threshold ordering. |
| `py-match-case` | Python 3.10 requirement; literal, wildcard, OR and capture patterns; tuple shape matching and guards; guard failure and no fall-through; unreachable cases and capture-name pitfalls; when if/elif is clearer. |
| `py-while-loop` | Counter and sentinel loops with traces; initial false condition; explicit progress; sentinel exclusion; while-else with/without break; while True and a reachable exit; continue's skipped-update risk. |
| `py-for-loop` | Direct sequence iteration; all range argument forms and direction; compact range representation; enumerate and pair unpacking; zip truncation and strict mode; for-else and empty input; break/continue and nested-loop behavior. |
| `py-loop-problems` | Primality proof and inclusive square-root boundary; factorial invariant and empty product; Fibonacci simultaneous updates; Euclid invariant and trace; digit sums/counts with signs and zero; star and nested digit patterns; C comparisons and realistic complexity. |

## Verification

Actual authoring toolchain: **Python 3.12.14**, **Node.js v24.22.1**.
The checker also detects GCC in the environment, but this package contains only Python.

Every example was executed as isolated UTF-8 Python code. Every practice solution
was run for each recorded input. All `.out` files were written from captured real
execution output, never from manually typed expected results. Output quiz programs
were separately executed and their selected answers compared with their results.
All executions also used `-W error`. The package checker independently parses code
with warnings as errors and reruns the examples, practice cases and output quizzes.

Run from `content-kit/`:

```bash
node tools/check.mjs python/content --report python/content/CHECK_REPORT.txt
```

The delivery contains 50 examples, 54 practice exercises (46 code and 8 written),
114 practice execution cases, 134 quiz questions (40 output questions) and 42 exam
questions. All 96 Python files and all output-quiz programs also parse using
Python 3.10 grammar; runtime verification uses Python 3.12.14.

The committed `CHECK_REPORT.txt` is the final result. All 13 topics must report
zero errors; the final delivery also has zero warnings.

Cases include immediate sentinels, empty strings, empty ranges, exact threshold
endpoints, invalid marks, negative arithmetic, singleton strings, unequal zip
lengths, factorial zero, Fibonacci zero, perfect-square composites, zero GCD
operands and signed digit input. Practice statements define the accepted domain;
reference solutions assume syntactically valid input in that domain.

## Reviewer attention

- Check the English teaching flow and the Bangla wording for the intended audience.
- The demonstrated marks labels are examples, not an institution's official grade scale.
- Installation screens and supported Python release lists change over time. The text
  deliberately targets 3.12 without claiming it is the newest release.
- `id()` values are never printed; only stable identity comparisons are shown.
- Float examples distinguish stored approximations from formatted text. Rounding uses
  nearest even for exact ties, and the discussion notes inexact decimal inputs.
- Unicode lengths count code points, not grapheme clusters, encoded bytes or columns.
- `match` captures are distinguished from literal-value tests; bindings are not
  presented as case-local, and guards are not presented as type validation.
- Loop `else` includes initially empty iteration and is bypassed by `break`.
- Big integers avoid fixed-width overflow, but not resource or decimal-conversion limits.
- Topic review status remains `draft` until human content review, as required.
