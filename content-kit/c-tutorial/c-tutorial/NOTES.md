# C 0.6.0 — round 6 reviewer notes

All 120 curriculum topics are now delivered as drafts. This batch adds the 23
remaining topics after round 5: file-handling (6), advanced (8), data-structures
(3), and practice-exam (6). Version 0.6.0 follows the later-batch numbering rule.
The branch includes round-5 C PR #39 through main; earlier 97 topics are unchanged.

## Coverage

- File streams, open modes, text and binary transfer, portable text bookmarks,
  defined fixed-width binary offsets, EOF/matching/I/O failure and cleanup.
- argc/argv, complete strtol validation, guarded signed accumulation, actual
  source/header modules and Makefile, const/volatile, undefined behavior,
  standard-library utilities, explicit error contracts, C99/C11/C17/C23 and style.
- Linked-list head/tail/position insertion, deletion/search/printing/freeing with
  diagrams; array and linked stacks, bracket matching; circular and linked FIFO
  queues, wraparound, singleton reset and a round-robin simulation.
- 32 worked output traces; 25 complete first-year exam programs with sample
  inputs/results and marking guidance; 50 answered interview questions.
- Student-record CRUD with checked file replacement; a fictional whole-taka
  account with replayed accepted history; two-player tic-tac-toe with all eight
  win lines, draw detection and turn-preserving validation.
- Unsigned bit operations are reinforced in qualifiers, output traces and
  interview questions; the earlier operators lesson remains unchanged.

New material includes 126 complete examples, 76 practice items (149 executable
input cases), 254 quiz items (83 compiled output questions), 123 bilingual key
points and 169 worked exam answers. Every output file was captured from an
actual execution. Titles, summaries and key points have Bangla text; full Bangla
bodies are optional and not added here. No unverified videos were attached.

## Curriculum metadata repair

The C brief explicitly designates the last six topics as three projects and
three question banks. The C curriculum omitted their `kind` fields, so the
checker defaulted them to lessons and rejected the intended counts. The only
change outside the package is adding those six kind values in
`c-tutorial/spec/curriculum.json`. IDs, order, level and coverage are unchanged.
No checker rules were weakened or bypassed.

## Validation

Toolchain: Node 24.22.1, GCC 14.2.0, Linux. Run from content-kit:

```sh
node tools/check.mjs c-tutorial/c-tutorial --sanitize --report c-tutorial/c-tutorial/CHECK_REPORT.txt
node --test c-tutorial/c-tutorial/tests/*.test.mjs
```

The full report checks all 120 topics, compiling/running examples, practice
cases and output questions, with sanitizer execution on ordinary example and
practice paths. Intentional warning, compile-error and undefined-behavior
examples are labelled; undefined programs have no invented numeric output.
The seven added tests independently cover cross-process record persistence,
corrupt-file preservation, rejected edits, record capacity, overlong input,
account replay/balance/history limits, all eight game wins and a draw, a
1,000-operation FIFO oracle, argument-validation failures and a real Makefile.

From the repository root, `node --test "tests/*.test.ts"` passes all 169 current
platform tests, including the original suite. No application dependency,
platform route, migration or secret is added by this content PR.

## Review limits

GCC 14.2 supports the demonstrated C23 keywords/literals in -std=c2x mode but
not #embed. The standards lesson explains #embed and its build-time purpose
without claiming a runnable supported example. Host-varying diagnostics stay
on standard error; rand demonstrations compare seeded repeatability rather
than asserting a portable numeric generator sequence.

File projects require local execution in a disposable directory with an
explicit starting data file. They use Linux replacement semantics, one writer
and fixed temporary names. They are not crash-durable databases, concurrent
services, authenticated student systems or real banking software. Raw-structure
binary examples are explicitly local round trips, distinct from the defined
portable field encoding. Human review and publication approval remain pending.

---

# C 0.5.0 — reviewer notes

This cumulative package contains 97 draft topics: the unchanged 77 topics from
Batches 1–4 and all 20 Batch 5 topics. The manifest advances packageVersion from
0.4.0 to 0.5.0 and adds dynamic-memory, structures, and preprocessor in curriculum
order. Only this package folder changes. No requested coverage point is deferred,
and no extra curriculum IDs are proposed.

## Batch 5 coverage

| Module | Topic | Coverage and review focus |
| --- | --- | --- |
| dynamic-memory | c-dynamic-memory-intro | Automatic versus allocated duration, common stack/heap implementation picture, run-time sizes, stdlib.h interfaces, owners and borrowers, returned allocations, empty collections. |
| dynamic-memory | c-malloc-calloc | sizeof target expressions, NULL checks, allocation-product overflow guards, malloc/calloc comparison, integer zero initialization versus pointer/floating representations. |
| dynamic-memory | c-realloc-free | Temporary-pointer pattern, preserved prefix, new-tail initialization, length versus capacity, aliases invalidated on success, positive-size failure, explicit free for zero capacity, double-free prevention. |
| dynamic-memory | c-memory-leaks | Lost ownership versus dangling access, two-resource cleanup, early returns, borrowed searches, ASan/LeakSanitizer and Valgrind workflows and limits. |
| dynamic-memory | c-dynamic-arrays | Dynamic vectors, contiguous rectangular indexing, separately allocated rows, jagged lengths, dimension/product validation, partial-row cleanup and reverse ownership order. |
| structures | c-structures | Definition versus object, dot access, positional/designated initialization, student records, omitted members, embedded-array value copying and field equality. |
| structures | c-nested-structures | Embedded Date and Result groups, nested member chains, nested initializers, subrecord replacement, chronology and application validity. |
| structures | c-array-of-structures | Filling records, logical count, search and missing results, whole-record sorting, stable ties, in-place filtering, complexity and empty input. |
| structures | c-structures-and-pointers | Arrow versus dereference/dot, allocated records and record arrays, interior borrowers, shallow pointer-member copies, deep-copy responsibilities. |
| structures | c-structures-and-functions | Value versus pointer parameters, const views, safe record-value returns, in-place updates, borrowed selection results and invalid local-address returns. |
| structures | c-typedef | Scalar/structure/callback aliases, unchanged compatibility and formatting, complete pointer aliases, top-level const and ownership cautions. |
| structures | c-unions | Shared storage, size guarantees, structure/union comparison, explicit tags, matching payload reads, numeric conversion versus representation reinterpretation. |
| structures | c-enums | Explicit and automatic enumerators, switch cases, sparse codes, validation, enum versus macro constants and C17 representation limits. |
| structures | c-bit-fields | Widths and unsigned ranges, flag packing, promotion-aware printing, non-addressable fields, input temporaries, zero-width separators and layout/hardware/concurrency limits. |
| structures | c-structure-padding | Alignment rationale, sizeof/offsetof/_Alignof, measured reorderings, array stride, padding-insensitive equality and explicit serialization. |
| preprocessor | c-preprocessor-intro | Translation timing, directive reference, token replacement, inclusion versus linking, gcc -E/-P inspection and runtime/build-time distinction. |
| preprocessor | c-macros | Object/function-like macros, inner/outer parentheses, defined bad-grouping comparison, repeated-evaluation UB explained without execution, #/##, two-level expansion and inline functions. |
| preprocessor | c-conditional-compilation | Full #if family, existence versus value, defaults and -D overrides, debug/release builds, platform conventions and configuration consistency. |
| preprocessor | c-header-files-guards | Angle/quoted includes, a real reusable header, repeated inclusion, self-contained dependencies, portable guards versus pragma once and translation-unit/linkage boundaries. |
| preprocessor | c-predefined-macros | __FILE__, __LINE__, __DATE__, __TIME__, __STDC_VERSION__, call-site diagnostics, #line, build stamps versus execution time and optional-feature checks. |

Every new lesson includes English text, bilingual title/summary/key points,
worked programs, reference solutions, quizzes, and worked exam answers. All
required and recommended lesson sections are present. Every lesson meets its
level's body-word target without repeated cross-topic teaching paragraphs.
Full Bangla bodies are optional and are not included in this batch. Bangla
metadata follows BANGLA_STYLE.md. Video lists remain empty rather than attaching
an unverified teaching match. All review statuses remain draft.

New content totals:

- 67 complete examples, with 3–5 examples per topic;
- 80 programming practice solutions and 166 input/output cases;
- 200 quiz questions, including 60 compiled and executed output questions;
- 104 bilingual key points and 60 worked exam questions;
- 147 C source files and 233 .out files generated from real executions;
- one reusable project header, examples/lab-record.h in c-header-files-guards.

## Execution and validation

Toolchain: gcc (Debian 14.2.0-19) 14.2.0; Node.js v24.22.1; 64-bit Linux.
All new source files and output-quiz programs compile and run as C17 with
-Wall -Wextra -Wpedantic -Werror -O2. The standards.minimum metadata identifies
C99 syntax where used and C11 for the alignment lesson. Earlier explicitly
selected language-version examples are preserved unchanged.

All 233 new .out files were captured from actual program stdout: 67 example
runs and 166 practice runs. The 60 output-quiz answers and worked output exam
answers were likewise derived from compiled executions. No new program executes
undefined behavior; unsafe fragments are explained as mistakes in the lesson.
Platform-varying examples retain actual output and explicit outputNote fields.

The unchanged 77-topic baseline passed with 0 errors and 0 warnings. The entire
97-topic cumulative package then passed the required command from content-kit/:

```sh
node tools/check.mjs c-tutorial/c-tutorial --sanitize --report c-tutorial/c-tutorial/CHECK_REPORT.txt
```

CHECK_REPORT.txt records **0 errors and 0 warnings**. The check compiles and runs
examples, reference solutions and output quizzes, and additionally runs example
and practice paths with AddressSanitizer, UBSan and leak detection.

Additional verification completed outside the repository:

- 671 independent expected-result comparisons across 17 reference solutions:
  randomized vector reversal, maxima, append and prefix retention; every stream
  length 0–30; integer histograms; every 1–5 by 1–5 rectangle; every square
  diagonal size 1–5; random jagged rows; stable record sorting/filtering including
  duplicate keys; chronological dates; tagged sums; all 32 valid packed flag
  combinations; bounded inline side effects; every stage/action combination;
  and randomized record-winner selection.
- Four source/build checks: gcc -E token replacement, both debug flag values,
  and the real-header mode of c-header-files-guards/examples/ex-3.c. The latter
  uses -DUSE_LAB_HEADER and includes lab-record.h twice, with identical output
  to the self-contained example. The debug variants retain the same core result.
- 59 injected allocation-failure paths across 38 allocation-using programs.
  A temporary linker wrapper rejected each allocation in turn, including realloc
  and partial-row construction. Every forced failure returned the intended error
  status with no AddressSanitizer, UBSan or leak report. The original contents
  were not changed to add test hooks.

The authoring utilities, oracle, allocation wrapper, executables and intermediate
preprocessor output are outside the repository. Valgrind commands are taught but
no Valgrind execution is claimed; the actual memory checks used GCC sanitizers.

## Human review and limits

- Review natural Bangla and PPS/SPL exam wording before publication.
- Structure size/alignment examples show real GCC/Linux measurements. Spread is
  12 bytes, Grouped is 8, offsets are 0/4/8, and int/record alignments are 4 here.
  These are labeled target observations, not universal C17 sizes. Portable quiz
  questions test guaranteed relationships instead of hard-coded offsets.
- The byte-count practice uses sizeof(int), so its numeric output is platform
  dependent. Its largest fixture is SIZE_MAX for the verified 64-bit target.
  All numeric input fixtures assume representable values within stated domains;
  scanf conversion counts do not safely parse arbitrarily large numeric strings.
- Platform detection uses implementation conventions. __DATE__/__TIME__ describe
  actual translation context, not current time or a guaranteed UTC stamp. Their
  recorded output can change on rebuild. #line supplies deliberate stable source
  locations in diagnostic examples.
- calloc zero bits guarantee integer zero here, not a universal null-pointer or
  floating-zero representation. malloc/realloc storage is initialized before
  value reads; general byte products and bounded exercise counts are distinguished.
- Positive-size realloc failure preserves the old block. Success invalidates old
  aliases even if an address appears unchanged. Zero-size realloc is avoided;
  its C17/C23 differences are explained. Clearing an owner does not clear borrowers.
- Flat matrices and int ** row tables have different representations. Row-table
  cleanup releases completed rows before the table. The examples avoid requiring
  variable-length-array support, which can be optional in C17 implementations.
- Union programs read the intended stored member under explicit tags. They do not
  use representation punning as numeric conversion. Pointer-containing copies
  remain shallow and require a separate ownership contract.
- Bit-field ordering, units and padding are implementation choices. The examples
  use explicit unsigned ranges and promotion-aware printing. External formats use
  explained shifts/masks and need separate byte serialization; no hardware layout
  or atomic-access guarantee is implied.
- Include guards operate per translation unit and do not solve duplicate external
  definitions. The real header uses a deliberately static inline helper. Its
  search path is verified with GCC; pragma once is described as a common extension.
- There are no remaining warnings, missing requested topics, or deferred coverage
  points. No earlier topic file was modified.
