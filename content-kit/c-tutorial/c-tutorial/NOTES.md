# C 0.3.0 — reviewer notes

This cumulative package contains 60 draft topics: the 42 topics from versions
0.1.0 and 0.2.0, plus all 18 Batch 3 topics in functions and arrays. The manifest
uses schemaVersion 1.1 and packageVersion 0.3.0. No requested topic or curriculum
coverage point is deferred. No additional curriculum IDs are proposed.

## Batch 3 coverage

| Module | Topic | Coverage and review focus |
| --- | --- | --- |
| functions | c-functions-intro | Library versus user-defined functions; body, parameters, result and calls; nested-call messages and a simple call-stack picture. |
| functions | c-function-declaration-definition | Prototypes versus definitions; declaration before use; compatible parameter types; no implicit declarations since C99; shared headers and guards; C17 versus C23 empty parameter lists. |
| functions | c-function-parameters-return | Arguments versus parameters; positional matching; value and void returns; early exits; fractional results; two caller-owned outputs through pointers. |
| functions | c-call-by-value-reference | C always passes values, including pointer values; failed copy-only swap versus working pointer swap; local pointer redirection, null checks, aliasing and a self-swap. |
| functions | c-scope-lifetime | Block, file, function-label and prototype scope; shadowing; declaration points; automatic versus static duration; expired targets and lexical versus call nesting. |
| functions | c-storage-classes | auto, register, local and file static, extern; scope/duration/linkage comparison table; persistent counters; one definition across files; register address restriction under C17. |
| functions | c-recursion | Base and recursive cases; factorial descent/unwinding table; Fibonacci repetition; time versus active depth; stack exhaustion, arithmetic bounds and iteration comparison. |
| functions | c-recursion-problems | Power, digit sum, Euclid GCD, ASCII word reversal, Hanoi peg roles and recurrence, recursive binary search with inclusive endpoints, and recursive row/star patterns. |
| functions | c-variadic-functions | stdarg.h, va_list, va_start, va_arg, va_end and va_copy; counted sum, promoted-double average, independent traversals and a tiny typed printer; printf concepts, count/type/lifetime pitfalls and C23 differences. |
| functions | c-math-library | sqrt, pow, fabs, ceil, floor, round, sin and cos; -lm; negative halfway rounding, radians, finite/domain checks, tolerances and floating accuracy. |
| arrays | c-arrays-intro | Explicit, inferred, partial and designated initialization; zero-based indices, consecutive storage, sizeof element counts, logical empty ranges and undefined out-of-bounds access. |
| arrays | c-array-operations | Checked input and output; sum/average/min/max; reversal; insertion and deletion with directional shifts; bounded frequency counts; second distinct largest and absence flag. |
| arrays | c-2d-arrays | Row/column bounds and row-major diagram; matrix input/output, addition, rectangular multiplication, transpose, separate diagonal sums and diagonal union without a duplicate center. |
| arrays | c-multidimensional-arrays | 3D nested initialization, layer traversal and collapse, row-major offsets, physical versus logical dimensions, storage growth and dense-data use cases. |
| arrays | c-arrays-and-functions | Array-to-pointer conversion and parameter adjustment; separate count, const input access, mutations and caller-owned results; fixed column widths, invalid int** assumptions and result lifetime choices. |
| arrays | c-linear-binary-search | Linear first occurrence, iterative half-open binary search, sortedness precondition, trace and invariant, missing keys, lower bound, duplicate policy and O(n) versus O(log n). |
| arrays | c-sorting-basics | Complete bubble, selection and insertion implementations, each with a separate pass table and invariant; stability example, cost comparison, qsort interface and overflow-safe comparator. |
| arrays | c-variable-length-arrays | Positive bounds checked before declaration; retained extent, runtime sizeof, C17 const-bound nuance, no C17 VLA initializers; C99/C11/C17/C23 support differences, fixed fallbacks, bounded runtime-width matrix and checked malloc/free alternative. |

The new topics include 76 examples, 76 practice solutions, 208 quiz questions
(54 executed output questions), 60 exam questions and bilingual title, summary
and key-point fields. Counts vary with scope: 3–6 examples, 4–5 practice problems,
10–13 quizzes and 3–4 exam questions. Every lesson meets its level's body-word
range. Lesson fragments contain actual subject explanations and code; they do
not describe content-production placeholders or templates. Full Bangla bodies
are not included. Uncertain video matches remain empty.

## Real execution and output provenance

Toolchain: gcc (Debian 14.2.0-19) 14.2.0; Node.js v24.22.1; 64-bit Linux.
Normal programs use C17 with -Wall -Wextra -Wpedantic -Werror -O2. math.h examples
and exercises link with -lm. The inherited C23 binary-literal example retains
its explicit -std=c2x requirement.

The cumulative output-generation pass compiled and ran:

- 227 normal examples, writing their .out files from actual execution;
- 256 practice solutions across 576 input cases, writing every case's .out;
- all 183 output-quiz programs, checking each selected answer against its run;
- the inherited 12 intentional compilation/link failures and 7 warning examples
  for their declared diagnostics, without inventing runnable output for them.

All 803 .out files were regenerated from real runs. This includes the 239 new
files (76 examples and 163 practice cases) and all 564 inherited files. The
inherited pointer-format example captures a new actual address; it remains
explicitly nondeterministic. Earlier topic source and metadata are unchanged.

From inside content-kit/, the required cumulative check was run as:

```sh
node tools/check.mjs c-tutorial/c-tutorial --sanitize --report c-tutorial/c-tutorial/CHECK_REPORT.txt
```

The report records **0 errors and 0 warnings** for all 60 topics. The unchanged
checker compiles and executes the programs, verifies outputs and quizzes, and
repeats normal example and practice runs with AddressSanitizer and UBSan.
The initial 42-topic baseline also passed with 0 errors and 0 warnings.

An additional 1,025 independent checks passed using temporary verification
programs and a seeded Python oracle:

- random lists for all three sorts, duplicate removal and inversion/shift counts;
- second distinct largest, linear/binary search, first occurrence and insertion
  positions, including empty lists, duplicates and absent keys;
- prefix sums and filtering against independent Python calculations;
- matrix addition, transpose, row sums, multiplication and diagonal unions;
- every factorial input 0–20, bounded powers including exponent zero, and GCDs;
- Hanoi plans for 0–5 disks, checking legality, final peg state and move count;
- 12 fixed-fallback example/practice runs compiled with
  -D__STDC_NO_VLA__=1 -Werror=vla, checking that fallback outputs match;
- the actual two-source extern/header arrangement described in the storage
  lesson, compiled and linked together and run to print 60.

The oracle scripts, compilation products and diagnostic logs remain outside the
repository. Only content-kit/c-tutorial/c-tutorial/ changes are included.

## Human review and limits

- Review natural Bangla wording and PPS/SPL exam phrasing before publication.
  All topics remain draft for the platform's editorial process.
- Pointer, character-array and allocation previews are explained locally and
  link to their later lessons. Word reversal deliberately accepts ASCII; byte
  reversal is not presented as a general UTF-8/Bangla operation.
- New arithmetic tasks state bounded domains. The power exercise explicitly
  chooses 0^0 = 1; the GCD exercise explicitly chooses GCD(0,0) = 0.
- Numeric scanf tasks assume representable input text inside their stated
  domains. Conversion counts are not a general parser for oversized integers.
- Runtime array bounds are small on purpose. Automatic VLA declarations have no
  recoverable allocation-failure result. The allocated alternative checks
  failure and releases storage on normal and post-allocation input-error exits.
- The VLA fallback tests simulate the opt-out macro using GCC; they do not claim
  validation on a separate compiler without VLA support. Output quizzes using
  VLAs target the recorded GCC C17 toolchain.
- C17 matrix examples avoid nested const-array qualification conversions that
  differ across standards. Physical row width is explicit even in fixed-capacity
  arrays whose logical used column count is smaller.
- qsort is presented without a promised algorithm, stability or complexity
  guarantee. The elementary-sort table describes the exact shown versions.
- The 0.2.0 installation walkthroughs, platform-dependent integer sizes and
  nondeterministic address example retain their earlier qualifications. No new
  installer, editor or interactive debugger validation is claimed.
- Empty-array print tasks deliberately emit an empty result line after their
  prompt. Their real .out files preserve that trailing blank line.
- No checker warnings remain and no curriculum content is deferred.
