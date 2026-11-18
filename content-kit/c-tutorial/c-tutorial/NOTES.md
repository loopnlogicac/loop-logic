# C 0.2.0 — reviewer notes

All 42 topics use schemaVersion 1.1 and remain draft for editorial review.
The cumulative package contains all 18 revised Batch 1 topics and all 24 topics
from the operators, decision-making and loops modules. No requested topic or
curriculum coverage point is deferred. No additional topic IDs are proposed.

## Batch 1 revision

Batch 1 was imported from origin/codex/c-tutorial-batch-1 because main did not
contain the package. All 18 lessons now have student-oriented openings, shorter
paragraphs, topic-specific exercise guidance and specific output-quiz prompts.
Repeated cross-topic paragraphs and references to lesson production were removed.
The scanf explanation and several Bangla summaries/key points were rewritten.
Small topics now have four focused practice tasks; larger topics retain five.
The compiler-verified Batch 1 programs are retained, and every normal output was
regenerated during this delivery.

## Added topics and coverage

| Module | Topics | Coverage emphasis |
| --- | --- | --- |
| operators | c-operators-overview, c-arithmetic-operators, c-increment-decrement, c-relational-operators, c-logical-operators | Category table; unary/binary/ternary operands; expressions and statements; negative division/remainder and fmod; prefix/postfix sequencing; comparisons and tolerances; truth tables and short-circuit guards. |
| operators | c-bitwise-operators, c-assignment-operators, c-conditional-operator, c-comma-sizeof-operators, c-operator-precedence | Binary diagrams and flag masks; set/clear/toggle/check, parity and XOR swap; all compound assignments; chained assignment; maximum of three; comma versus separators; array sizes and VLA caveats; full C17 precedence table and grouping versus evaluation order. |
| decision-making | c-if-statement, c-if-else, c-else-if-ladder, c-nested-if | Flow diagrams, scalar truth, braces, dangling else, pass/fail and parity; complete classroom grade scale and boundary cases; maximum/ties, Gregorian leap-year exceptions and flattened conditions. |
| decision-making | c-switch, c-goto | Integer constant cases, default, grouped labels and fall-through; calculator/menu choices; nearest-break targets; labels, jump limits and one cleanup path for partial resource acquisition. |
| loops | c-loops-overview, c-while-loop, c-do-while-loop, c-for-loop | Entry/exit tests; counted and sentinel repetition; digit sum/reversal; bounded menus and validation; initialization/condition/update flowchart; C99 header declarations, paired counters and omitted parts. |
| loops | c-nested-loops, c-break-continue | Row/column traversal, multiplication grids and n*m/triangular work counts; continuation targets for each loop form; nested exits using a flag and a named label. |
| loops | c-pattern-programs | Eight complete examples: growing/inverted stars, numbers, alphabet lookup, pyramid, diamond, Floyd triangle and Pascal triangle. Row formulas, spacing, center duplication and bounded coefficient arithmetic. |
| loops | c-loop-problems | Factorial, Fibonacci, prime check/range, Euclid GCD/LCM, palindrome, general digit-count Armstrong and perfect numbers; invariants, zero cases, arithmetic bounds and square-root prime testing. |

The for-loop reference lesson was adapted from the kit's first-party sample.
Its misleading empty-body quiz prompt was corrected. Input and arithmetic bounds
were added, array indexing was briefly introduced, and its outputs were rerun.
The other new lessons and exercises were written for this delivery.

## Verification and output provenance

Toolchain: gcc (Debian 14.2.0-19) 14.2.0, Node.js v24.22.1, 64-bit Linux.
C17 is the normal baseline. The inherited, explicitly labeled C23 binary-literal
example uses -std=c2x as specified in the kit.

Package totals: 170 examples, 180 practice solutions, 430 quiz questions and
168 exam questions. Example counts range from 3 to 8, practice counts from 4 to 5,
and quiz counts from 10 to 13 according to topic scope. Every lesson meets its
level's body-word range and includes at least three executed output questions.

The output-generation pass performed these real builds and runs:

- 151 normal example runs wrote their .out files.
- 413 practice-case runs wrote their .out files.
- 129 output-quiz programs ran, and their answers matched the produced text.
- 12 intentional compile/link failures were confirmed.
- 7 intentional warning examples compiled for diagnostics and were not executed.

All 564 .out files therefore come from actual runs, including the inherited
examples and practice tasks. Unsafe or intentionally unbuildable examples have
no invented result files and retain their demonstrates metadata.

From content-kit/, the final command was:

```sh
node tools/check.mjs c-tutorial/c-tutorial --sanitize --report c-tutorial/c-tutorial/CHECK_REPORT.txt
```

CHECK_REPORT.txt records **0 errors and 0 warnings**, with all 42 topics present.
The unchanged checker compiles normal code using -std=c17 -Wall -Wextra
-Wpedantic -Werror -O2 and repeats normal example/practice runs with AddressSanitizer
and UBSan. Output quizzes are also compiled and run by the checker.

An additional 442 comparisons passed against independent Python calculations
for nine reference solutions: all factorial inputs 0–20; Fibonacci lengths 0–60
using a fast-doubling oracle; prime intervals; GCD/LCM including 100 seeded random
pairs; zero and known multi-digit Armstrong cases; all marks 0–100; Gregorian
century boundaries; pyramids and Pascal coefficients through height ten.
Those temporary verification scripts and executables stay outside the repository.
Only content-kit/c-tutorial/c-tutorial/ is changed.

## Human review and limits

- Review the natural Bangla wording and PPS/SPL exam phrasing before publication.
  Bilingual metadata is complete; a full Bangla lesson body is not included.
- The DIU-style grade scale is explicitly a classroom model. Confirm the actual
  department policy before presenting it as an official grading policy.
- Earlier installation and gdb walkthroughs are explanatory instructions. This
  Linux session compiled and executed the C programs; it did not run Windows,
  macOS or editor installers, or an interactive gdb session.
- Typical sizes, limits, decimal floating output and character encodings are
  labeled for the GCC/Linux host. The UINT_MAX input 4294967295 assumes its
  32-bit unsigned int. Exact-width types are optional on other implementations.
- The pointer-format example is explicitly nondeterministic. Its .out contains
  one captured address; the checker does not require the same address next time.
  Tabs and output padding are preserved as emitted, including trailing spaces
  where the associated task explicitly calls for them.
- Numeric scanf tasks assume representable input text within their stated
  domains. Conversion counts alone are not a general parser for arbitrary huge
  numeric strings. Later line-input/conversion lessons provide that extension.
- Early uses of input guards, helpers, pointers and arrays include short
  explanations and curriculum links. Links to later modules are intentional.
- The cleanup example releases both allocations and safely handles NULL. Its
  practice model exercises all three acquisition paths without depending on
  nondeterministic allocation failure.
- No checker warnings remain. Reference links use approved hosts. Uncertain
  video matches were left empty rather than assigned unrelated videos.
