# Algorithms – Batch 2

Package version: **0.2.0**, schema **1.1**, track **algorithms**.

This delivery adds all **17 topics and 10 labs** in `divide-conquer`, `greedy` and `dynamic-programming`. The cumulative package contains **33 of 56 topics and 19 of 32 labs**. Earlier lessons are retained. All new topics remain `review.status: draft` for subject and language review.

Batch 2 contains **58 complete C17 examples, 34 code-practice solutions with 68 captured test outputs, 41 worked written exercises, and 175 quiz questions, including 51 compiled output questions**. Titles, summaries and key points are bilingual. Full Bangla lesson bodies are optional and are not included.

## Batch 2 coverage

| Topic | Included material and reviewer focus |
| --- | --- |
| `algo-divide-and-conquer` | Divide/conquer/combine contracts, half-open recursive sum and maximum, empty/singleton cases, induction, binary-search/merge-sort/quick-sort recurrence comparison and sequential peak stack. |
| `algo-maximum-subarray` | Quadratic interval enumeration, left/right/crossing recursion and Kadane; nonempty negative-only answers, interval recovery and tie rules; `kadane` array lab. |
| `algo-fast-exponentiation` | One-call recursive squaring, iterative product invariant, modular exponentiation, exponent-zero/modulus-one cases, multiplication overflow bounds and fixed-width versus bit-cost analysis. |
| `algo-closest-pair` | Exhaustive pair reference, initial x order, recursive y-order contract, shared merge buffer, saved split coordinate, seven-successor strip packing, coincident records and squared-distance arithmetic. |
| `algo-greedy-method` | Greedy-choice property versus optimal substructure, feasible exchanges, shortest-task completion-time exchange, proved 1/5/10 change and the 1/3/4 counterexample at six. |
| `algo-activity-selection` | Finish-order record sorting, half-open compatibility, original IDs, exchange/staying-ahead reasoning and scan costs; `activity-selection` array lab. |
| `algo-fractional-knapsack` | Exact ratio comparison by integer cross products, partial selection, equal-weight exchange, marginal capacity value and a concrete 0/1 failure of ratio-first. |
| `algo-huffman-coding` | Real binary min-heap, deterministic merge ties, prefix-tree construction, codebook, complete FACE encoding/decoding program, malformed/truncated stream handling, sibling exchange/contraction and weighted cost; `huffman-tree` tree lab. |
| `algo-job-sequencing` | Optional unit jobs, profit sorting, latest allowed free slot, capped deadlines, deadline-prefix feasibility/exchange, nonpositive profits and quadratic slot-search analysis. |
| `algo-dp-introduction` | Fibonacci naive recursion, memoisation, tabulation and rolling values; distinct states, cache sentinel, dependency order, stack cost and why a scalar answer needs no choice recovery; `fibonacci-dp` grid lab. |
| `algo-coin-change` | Minimum counts versus unordered combinations, unreachable states, both loop-order meanings, saved-coin recovery and pseudo-polynomial bounds; `coin-change-dp` grid lab. |
| `algo-knapsack-01` | Item-prefix/capacity state, both previous-row branches, selected-item recovery, downward compact capacities and the reuse counterexample; `knapsack-dp` grid lab. |
| `algo-lcs` | Prefix-pair recurrence, arrows, up-on-tie recovery of BCBA, empty/repeated inputs, subsequence versus substring, deletion identity and space/reconstruction tradeoff; `lcs-dp` grid lab. |
| `algo-edit-distance` | Unit insertion/deletion/replacement costs, nonzero boundaries, direction meanings, forward recovered alignment, weighted variants and differences from deletion-only LCS; `edit-distance-dp` grid lab. |
| `algo-matrix-chain` | Dimension boundaries, interval recurrence, increasing-length evaluation, split recovery, scalar-count objective, equal-cost splits and cubic candidate count; `matrix-chain-dp` grid lab. |
| `algo-lis` | Quadratic ending states, predecessors, strict versus nondecreasing comparisons, binary-search smallest tails, actual tail indices and why tails alone are not a witness; `lis-dp` grid lab. |
| `algo-rod-cutting` | First-piece recurrence, full-material sale, uncut candidate, negative prices, bottom-up evaluation, recovered cuts, tie conventions and cut-fee variants. |

No point in these 17 topics' `covers` lists is intentionally omitted. The remaining 23 topics and 13 labs belong to later modules. No extra topic IDs are proposed.

## Grid-kind correction authorised by the user

The original curriculum listed `fibonacci-dp` and `lis-dp` as `array`, conflicting with the request that DP tables use `grid`. The user explicitly approved correcting those two kind values in `algorithms/spec/curriculum.json`. Those **two scalar replacements are the only changes outside `algorithms/content/`**. All seven Batch 2 DP labs now use grids; the other new kinds are two arrays and one tree. No checker or player code was changed.

## Batch 2 verification

Run from `content-kit/`:

```bash
node tools/check.mjs algorithms/content --sanitize --report algorithms/content/CHECK_REPORT.txt
```

The cumulative report records **0 errors and 0 warnings**. Real GCC executions produced every new example and practice `.out` file. All 51 new output-quiz programs were also compiled and executed to select their correct options. The required command repeats compilation/output comparisons and runs examples and practice cases with AddressSanitizer and UndefinedBehaviorSanitizer. It exercises all lab presets, explicit checks and generated inputs with the shared player model.

Actual tools: GCC 14.2.0 (Debian 14.2.0-19), Node.js v24.22.1 and Python 3.12.14. Learner programs use C17; JavaScript lab traces follow the required pure trace interface. Temporary authoring and independent validation programs are not included in the package.

Additional independent checks passed **40,563 assertions**:

- **4,038 lab cases / 26,196 assertions:** repeat-call determinism, valid player operations, exhaustive subset references for strict LIS/LCS and equipment/meeting choices, breadth-first exact payments, separate recursive edit/matrix references, exhaustive tree-partition Huffman costs, and validation of recovered sequences, alignments, payments and matrix plans.
- **4,402 C executions / 14,367 assertions:** exhaustive short ternary arrays and seeded bounded inputs; comparison of all three maximum-subarray methods; recursive/iterative/modular power against exact integer arithmetic; closest pair against all pairs; meeting/job/knapsack choices against subset enumeration; fractional value against exact rational vertices; Fibonacci variants; minimum/combination payments; LCS and edit recovery; matrix split plans; quadratic/fast LIS witnesses; full-material rod plans; and Huffman prefix validity and optimal bit cost.

The independent runs use seeds 28539 (labs) and 20931 (C). They validate algorithmic results beyond the lesson examples; the committed report remains the result of the exact required command. There are no unreviewed checker warnings.

## Conventions and reviewer attention for Batch 2

- Default lab inputs match the corresponding first C examples. The LCS trace table also uses ABCBDAB / BDCABA. Additional presets cover simple, difficult and boundary cases within each lab's input domain.
- Maximum subarray is nonempty. Rod cutting sells all material, even at negative prices. Knapsack means at most the given capacity. Coin change means an exact amount with unlimited positive distinct denominations; its lab normalises duplicate denominations.
- Full DP evaluation, recurrence, state and reconstruction are explained separately. Fibonacci returns a scalar, with no optimisation witness. Grid answer sequences and edit/matrix plans use side lists, respecting the player's short variable-value limit. Knapsack take dependencies point to the actual reduced-capacity cell, not a misleading one-column diagonal.
- Each algorithm states tie rules. Quadratic LIS returns 1,2,5 on its default input; fast LIS returns 1,2,4. Both are valid. LCS moves up on unequal-letter ties. Edit recovery prefers diagonal, deletion, then insertion. Matrix-chain keeps the smallest tied split; rod cutting keeps the smallest first piece on a revenue tie.
- Huffman leaf IDs precede internal IDs, equal heap weights use increasing IDs, and first/second minima become left/right children. The one-symbol convention uses code 0, costing one bit per occurrence. Multi-symbol merge sums exclude codebook overhead. The complete codec uses a fixed small FACE message, so its concatenation buffer is proven sufficient for that demonstration.
- Edit output describes paid operations in forward alignment order, without mutable text positions. Applying an indexed edit script requires the cursor/match information explained in the lesson. The model operates on uppercase Latin bytes, not Unicode grapheme clusters.
- The closest-pair recursion is O(n log n) once initially ordered by x and retains y order by merging. The examples use standard `qsort` for preparation; C does not guarantee that library routine's complexity. The text explicitly qualifies sorting assumptions for closest pair and greedy routines.
- Fixed arrays and integer sentinels are justified by each exercise's input limits. Matrix-chain allows dimensions 1..100; modular products use modulus at most 10^9. The lessons distinguish bounded demonstrations, general asymptotic bounds and arbitrary-precision arithmetic costs.
- Bangla wording and all proof arguments, especially strip packing, deadline-prefix exchange and Huffman contraction, deserve normal specialist review before publication. Video lists remain empty because no specific catalogue match was verified.
- Empty answers deliberately produce empty result lines in some captured outputs. Preserve these fixtures. Whitespace validation excludes captured `.out` fixtures: empty results can end in a blank line or a label's separating space, exactly as the C program printed them. No binaries or temporary authoring artifacts are included.

---

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
