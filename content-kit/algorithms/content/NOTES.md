# Algorithms – Batch 1

Package version: **0.1.0**, schema **1.1**, track **algorithms**.

This package delivers all 16 topics in `foundations`, `searching` and `sorting`, in curriculum order, together with all nine required labs. It contains 59 complete C examples, 32 code-practice solutions, 38 written exercises, 162 quiz questions (48 executable output questions), bilingual titles/summaries/key points, and worked examination answers. All topics retain `review.status: draft` for editorial review.

## Coverage

| Topic | Curriculum coverage and where to review |
| --- | --- |
| `algo-introduction` | Definition and finite/effective/definite steps; input/output contracts; pseudocode conventions; correctness versus efficiency; university course and examination progression. Fee accumulator invariant and empty-input case. |
| `algo-asymptotic-notation` | Formal O, Ω, Θ, o and ω definitions; quantifiers, witness constants and thresholds; growth ladder and change of logarithm base; matching and strict-bound proofs. |
| `algo-analysing-loops` | Single, nested, dependent, geometric and logarithmic loops; body counts versus condition checks; **25 worked complexity questions** with counts and explanations. |
| `algo-recurrences` | Recurrences from code; substitution with base and induction steps; recursion trees; all three master-theorem cases, polynomial gaps, case-three regularity, common extension and examples outside the theorem. |
| `algo-space-complexity` | Auxiliary versus total/output storage; lifetime and peak use; recursive frames; in-place reversal, copied reversal and compaction invariants. |
| `algo-linear-search` | First-match scan and correctness; best/worst/conditional average cost; reserved-extra-cell sentinel and alternatives; when scanning avoids unnecessary preparation. Lab: `linear-search`. |
| `algo-binary-search` | Iterative and recursive half-open search; shrinking-interval invariant; off-by-one traps; lower/upper bounds and equal ranges; monotone daily-capacity answer search. Lab: `binary-search`. |
| `algo-bubble-sort` | Complete passes, adjacent comparisons and swaps; flag reset and early exit; shrinking suffix, inversion cost and strict-comparison stability. Lab adapted from the provided `bubble-sort` sample. |
| `algo-selection-sort` | Suffix-minimum invariant, fixed comparison count, at most n−1 real swaps, and labelled instability counterexample. Lab: `selection-sort`. |
| `algo-insertion-sort` | Growing sorted prefix; saved key and safe short-circuit guard; nearly ordered inputs and Θ(n+I) inversion-sensitive cost; strict-shift stability. Lab: `insertion-sort`. |
| `algo-merge-sort` | Balanced divide/sort/merge; front selection and tail copying; shared buffer; recurrence and level-cost derivation; labelled stable merge. Lab: `merge-sort`. |
| `algo-quick-sort` | Lomuto and Hoare implementations with distinct recursion contracts; pivot quality, duplicates and worst cases; reproducible randomised-pivot implementation; expected versus worst cost and stack improvement. Lab: `quick-sort` with Lomuto partition. |
| `algo-heap-sort` | Complete-tree array indices; larger-child sift; bottom-up max-heap construction with the linear height-sum argument; repeated extraction, shrinking heap, cost and instability. Lab: `heap-sort` using heap rendering. |
| `algo-counting-sort` | Bounded-domain offset, frequencies and prefix end positions; stable reverse placement with whole labelled records; n/k tradeoff and comparison-model distinction. Lab: `counting-sort`. |
| `algo-radix-sort` | Stable counting passes from LSD; digit extraction and explicit signed-key encoding; digit-pass trace; stability induction; d/b/n time and workspace parameters. |
| `algo-sorting-comparison` | Table of time/space/stability/in-place properties; decision-tree Ω(n log n) lower bound; constraint-based selection; safe `qsort` integer and record comparators and standard-library limitations. |

No Batch 1 curriculum point is intentionally omitted. The remaining 40 topics and their labs belong to later curriculum modules and are not listed in this manifest. No extra topic IDs are proposed.

## Verification

From `content-kit/`:

```bash
node tools/check.mjs algorithms/content --sanitize --report algorithms/content/CHECK_REPORT.txt
```

The checked-in report records **0 errors and 0 warnings**. Every example and practice `.out` was captured from a real GCC run, never entered as an expected answer. Every embedded output-quiz program was compiled and run to obtain its correct option, and the required checker independently ran it again. Examples and practice tests also passed AddressSanitizer and UndefinedBehaviorSanitizer through the required command.

Actual authoring/validation tools: GCC 14.2.0 (Debian 14.2.0-19), Node.js v24.22.1, Python 3.12.14. Python was used only for authoring and collecting real outputs; learner programs are C17. Lab trace functions are pure JavaScript as required by `LAB_FORMAT.md`.

An additional independent reference run passed **50,692 assertions**:

- 469 array cases: every array of length 0–5 over {-1,0,1}, endpoint values, maximum lab-length patterns and 100 deterministically generated arrays.
- 7,973 lab traces, checking input immutability, repeated-call determinism, valid player operations and final results against independent numeric ordering or membership rules.
- 9,861 C executions comparing sort results with the independent reference, checking exact agreement between search traces and C searches, and exercising Hoare and reproducible random-pivot variants. Sorting programs also received 64-element inputs.
- Independent labelled-record expectations checked stable counting, stable merging and explicit `qsort` secondary-key ordering.

The required checker additionally exercises each lab's named presets, explicit final-state checks and its own generated inputs. Reviewer notes are not learner-facing content.

## Conventions and reviewer attention

- Algorithms use zero-based indices. Binary search and merge sort use half-open intervals. The quick-sort routines use closed intervals, with explicitly different Lomuto and Hoare return contracts.
- All sorting labs use the five-key default `[7,3,5,3,1]`; search labs use that input with target 5. Binary search displays a sorted copy. Its C example separately copies and insertion-sorts those values before searching; preparation time and original-index semantics are explicitly separated from the search bound.
- C input examples and solutions intentionally use at most 64 records with keys −99..99. Lab arrays accept 0–12 records. General complexity claims explain how workspace scales beyond these bounded demonstrations.
- Stable counting sort uses 199 slots with offset +99. Radix sort uses the same monotone encoding and three decimal passes. These are bounded signed-key demonstrations, not unrestricted signed-integer encodings.
- The random-pivot program uses a fixed-seed `uint32_t` generator for reproducibility and rejection sampling for bounded index selection. The prose separates this teaching generator from the independent uniform-pivot assumption in expected-time analysis. It does not claim a cryptographic or worst-case guarantee.
- Heap construction is linear, and iterative sift avoids a recursive stack. The comparison table gives a best-case range for heap sort rather than claiming that all-equal input necessarily takes n log n time.
- `qsort` stability and internal complexity are not guaranteed by the C standard. Relational comparators avoid signed-subtraction overflow; a secondary arrival field makes required tie order explicit.
- The full English lessons are provided. Bangla titles, summaries, key points and key animation notes need native-language editorial review; a complete Bangla lesson body is optional and is not included.
- Video lists are intentionally empty rather than attaching an unverified match from the video catalogue. The mathematical proofs and the distinction between general and bounded-demo costs deserve the normal subject review before publication.

There are no remaining checker warnings or known platform-dependent expected outputs. Exact-width `uint32_t` is required only by the reproducible pivot example and is available in the recorded toolchain. Empty array results intentionally produce blank result lines, including at the end of some `.out` files; those real outputs must be preserved. Whitespace validation therefore excludes Git’s `blank-at-eof` rule for these fixtures. No compiler binaries or temporary authoring files are part of this package.
