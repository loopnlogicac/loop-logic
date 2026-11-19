# C 0.4.0 — reviewer notes

This cumulative package contains 77 draft topics: the 60 previously delivered
C topics plus all 17 Batch 4 topics in strings and pointers. The manifest keeps
schemaVersion 1.1, advances packageVersion to 0.4.0, and lists all nine delivered
modules in curriculum order. No requested topic or coverage point is deferred.
No additional curriculum IDs are proposed.

## Batch 4 coverage

| Module | Topic | Coverage and review focus |
| --- | --- | --- |
| strings | c-strings-intro | Character arrays, null termination, literal versus writable copy, DIU storage diagram, empty strings, length versus capacity and byte versus visible-character counts. |
| strings | c-string-input-output | Bounded scanf %s, whole-line fgets, return checks, newline removal, oversized-line rejection and draining, puts/printf, fixed format strings and C11 removal of gets. |
| strings | c-string-functions | strlen, strcpy, strncpy, strcat, strcmp, strchr and strstr; reference table, capacity calculations, strncpy padding/termination, non-overlap rules and borrowed search results. |
| strings | c-string-manipulation | Hand-written length, copy, append, comparison and reverse; palindrome pairs, word-state and vowel counts, upper/lowercase conversion, empty-string safety and loop reasoning. |
| strings | c-array-of-strings | Fixed-width char rows versus literal-pointer tables, bounded row input, text comparison, character-copy swaps versus address swaps, sorting names, logical used rows and representation diagrams. |
| strings | c-character-functions | isalpha, isdigit, isspace, isupper, toupper and tolower; unsigned-char argument domain, normalized predicates, EOF handling, initial C locale, category counts and whitespace normalization. |
| pointers | c-pointers-intro | Addresses, &, pointer declarations, dereference, aliases, pointer redirection, NULL initialization and real %p output with void * conversions; illustrative-address memory diagram. |
| pointers | c-pointer-arithmetic | Type-scaled steps, ptrdiff_t and %td, same-array differences and ordering, one-past markers, half-open ranges and backward traversal without before-begin pointers. |
| pointers | c-pointers-and-arrays | Array conversion, a[i] versus *(a+i), pointer traversal, sizeof distinctions, actual-array counts, parameter adjustment, interior views and pointer-to-array types. |
| pointers | c-pointers-and-strings | char[] versus literal views, literal-write UB, suffix aliases, string functions through pointers, capacity/lifetime contracts and read-only parsing. |
| pointers | c-pointers-and-functions | C passes pointer values by value; swap, min/max outputs, output aliasing, live caller-array search returns, invalid automatic-local returns and shared static results. |
| pointers | c-pointer-to-pointer | Two indirection levels, changing caller pointers, real row-pointer tables versus fixed matrices, independently allocated rows, partial-failure cleanup and allocation ownership. |
| pointers | c-function-pointers | Declaration/call forms, compatible dispatch tables, calculator operations, unary callbacks, qsort and overflow-safe comparison; incompatible-call UB and object/function pointer distinctions. |
| pointers | c-void-null-pointers | Generic object addresses, C implicit conversion rules, actual target type/alignment/lifetime, NULL states and checks, empty-string distinction and C23 nullptr/nullptr_t note. |
| pointers | c-dangling-wild-pointers | Uninitialized pointer reads, block and allocated lifetimes, dangling aliases after free, owner versus borrower, safe scalar copies, caller-owned outputs and sanitizer tools. |
| pointers | c-const-pointers | Pointer to const, const pointer and both; outward/right-to-left declaration reading, const-correct inputs, mutable aliases, top-level parameter qualification and unsafe nested qualification conversion. |
| pointers | c-array-of-pointers | Address-entry arrays versus pointer-to-array, row strides, literal and numeric jagged rows, separate row lengths, initialization, aliases and table/target lifetimes. |

Every new topic includes bilingual title, summary and key points, an English
lesson, a syntax fragment/table, worked programs, practice solutions, quizzes
and worked exam answers. Every pointer topic has a `<pre class="diagram">`
memory diagram and at least one intentional common-mistake example with its
`demonstrates` field set. All review statuses remain draft.

New content totals:

- 78 examples: 62 normal programs and 16 intentional mistakes;
- 68 programming practice solutions with 138 input/output cases;
- 175 quiz questions, including 51 compiled and executed output questions;
- 92 bilingual key points and 54 worked exam questions.

Example counts vary from 3 to 6, quizzes from 10 to 12, key points from 5 to 6,
and exam questions from 3 to 4 according to the topic. All 17 lessons meet their
level's body-word target. Full Bangla lesson bodies are optional and are not
included. Bangla metadata follows BANGLA_STYLE.md, including পয়েন্টার,
অ্যাড্রেস, স্ট্রিং, ভেরিয়েবল and ফাংশন. Video lists remain empty because a
precise teaching match was not established; no speculative video is attached.

## Execution and validation

Toolchain: gcc (Debian 14.2.0-19) 14.2.0; Node.js v24.22.1; 64-bit Linux.
Normal new programs compile as C17 with -Wall -Wextra -Wpedantic -Werror -O2.
Their C99 loop declarations are reflected in standards.minimum.

All 200 new .out files were generated by compiling and running the actual
programs: 62 example runs and 138 practice cases. All 51 new output-quiz
answers were also derived from and checked against real executions. Intentional
compile failures and undefined-behavior examples have no invented output.
The checker verifies their declared demonstration mode; undefined-behavior
programs are compiled leniently and deliberately not executed.

The unchanged 60-topic baseline passed with 0 errors and 0 warnings before this
work. The complete 77-topic package was then checked from inside content-kit/:

```sh
node tools/check.mjs c-tutorial/c-tutorial --sanitize --report c-tutorial/c-tutorial/CHECK_REPORT.txt
```

The final report records **0 errors and 0 warnings**. The checker compiles and
executes normal examples, practice cases and output quizzes, and additionally
runs normal example/practice paths with AddressSanitizer and UBSan. Earlier
topic files are unchanged; their existing examples and tests remain part of
the cumulative validation.

An independent Python oracle also passed 873 cases across 13 new reference
solutions, including:

- ASCII reversal, exact palindromes and word counts for empty, maximum-length,
  mixed-whitespace and seeded random lines;
- whitespace normalization and digit masking;
- overlapping substring matches and missing/empty separator suffixes;
- every valid half-open slice of the five-element pointer-arithmetic array,
  including empty and reverse traversals;
- every 1–4 by 1–4 allocated matrix dimension;
- randomized min/max, qsort results and both callback transformations.

The oracle compared outputs against independent Python calculations. Its
scripts, compiler products and authoring utilities remain outside the repository.
Only content-kit/c-tutorial/c-tutorial/ files are changed.

## Human review and limits

- Review the natural Bangla and PPS/SPL question wording before publication.
- The address example is explicitly nondeterministic: its .out records a real
  run, while locations and %p representation vary. Diagram addresses are
  illustrative. The sizeof example is also marked implementation-dependent;
  it makes no universal claim about pointer or int widths.
- String manipulation and text practice deliberately use ASCII byte domains.
  UTF-8/Bangla visible-character counts, reversal and dictionary collation need
  a different text-aware design. ctype examples use the initial C locale and
  unsigned-char conversions; no Unicode classification is claimed.
- Numeric scanf exercises assume representable input inside their stated
  domains. Conversion counts do not constitute a parser for oversized numbers.
  Token widths protect storage; line examples separately explain truncation,
  remaining input, EOF and newline policies.
- Dynamic allocation in the double-pointer and lifetime lessons is a bounded
  preview. Allocation results and partial-row cleanup are handled, but the
  successful executions do not force allocator failure. General-size overflow
  checks and fuller allocation interfaces belong to the next module.
- NULL checks represent an agreed absence state; they do not validate a stale
  address. Clearing an owner does not clear aliases. Const views do not extend
  lifetime or freeze mutable targets reached through other valid access paths.
- qsort has no promised algorithm or stability guarantee. Comparators preserve
  negative/zero/positive ordering without signed subtraction overflow. Function
  pointers retain compatible signatures and are not treated as void pointers.
- C23 nullptr and its type are explanatory notes; no new C23 execution is claimed.
  The package retains the inherited explicitly selected C23 example unchanged.
- Whitespace-sensitive .in fixtures deliberately include tabs and trailing
  spaces for classification, trimming and normalization. Several .out fixtures
  end with an empty result line after their prompt. Preserve those bytes; git
  whitespace diagnostics on these fixtures describe intentional test data.
- No warnings remain, and every requested curriculum coverage point is covered.
