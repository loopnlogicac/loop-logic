# Algorithms – Bangla edition, part 1 (R6-F)

Package **0.4.1**, schema 1.1. This edition adds the first **28/56 Bangla bodies in curriculum order**, through `algo-knapsack-01`: foundations (5), searching (2), sorting (9), divide-conquer (4), greedy (5), and the first three dynamic-programming topics. The remaining 28 English bodies stay available as the fallback; languages remain `en` and `bn-partial`.

The branch originally included open round-5 PR #37 (`codex/algorithms-batch-4`). That prerequisite has since landed, and current main at 2c1616a is included. This item changes only `content-kit/algorithms/content/`.

Every paragraph is translated, including worked loop/recurrence proofs, lower-bound reasoning, tie rules, arithmetic bounds, greedy exchange proofs, DP state/order/reconstruction and edge cases. Heading IDs, links, example/lab slots and code blocks are preserved. English bodies, examples, practice solutions and `.out` files are unchanged; existing bilingual topic metadata is retained. All review statuses remain draft.

All **15 labs in this half** receive descriptive Bangla titles and summaries. Missing Bangla narration was filled at 46 source sites across their traces. Four English lab titles were made explicitly descriptive (Fibonacci, coin change, 0/1 knapsack and Lomuto quick sort) to meet the round-6 lab-title requirement; lab behavior is unchanged. Existing titles for the other labs already describe the operation. Labs in the second half are unchanged.

Validation:
- Complete checker with `--sanitize`: 56 topics and 32 labs, 0 errors, 0 warnings; see `CHECK_REPORT.txt`.
- `node --test "tests/*.test.ts"`: all 169 current platform tests pass.
- `node --test content-kit/algorithms/content/tests/bangla-edition.test.mjs`: two edition checks pass, covering all 28 bodies and every narrated step sampled across the 15 labs.
- Independent comparison with pre-translation traces on 517 inputs and 13,521 steps: every non-Bangla trace field is identical, and every English note has a Bangla note. Inputs include presets, declared checks and deterministic generated cases.

Reviewer focus: read the Bangla explanations with the English math nearby, especially half-open search bounds, Lomuto versus Hoare recursion, stable record placement, the closest-pair strip argument, unit-duration scheduling assumptions, unordered coin combinations, and descending 0/1 updates. Numeric examples retain their stated C overflow bounds. No application dependencies, migrations or platform files are added.

---

# Algorithms – Batch 4

Package version: **0.4.0**, schema **1.1**, track **algorithms**.

This final batch adds all **13 remaining topics and 4 labs** in `backtracking`, `strings-math`, `complexity` and `practice-exam`. The curriculum is complete: **56/56 topics and 32/32 labs**. New material includes **32 complete C17 examples, 20 code-practice solutions with 68 captured test outputs, 24 worked written exercises, 140 quiz questions (40 compiled output questions), and 95 worked exam/interview questions**. The interview bank contains the required **50 questions with answers**, grouped by technique, in both its body and structured question list.

## Coverage

| Topic | Material and reviewer focus |
| --- | --- |
| `algo-backtracking-intro` | State-space trees, choose/explore/undo, exact-one-count pruning proofs, copied versus shared state, first-answer versus all-answer stopping, empty strings and output-sensitive costs. |
| `algo-n-queens` | Column and both-diagonal safety, row recursion, all-solution counts, saved first witness, independent vector validation, symmetry convention and implementation-specific factorial bounds. Lab: `n-queens`, grid. |
| `algo-subset-sum` | Indexed subsets, include/exclude recursion, nonnegative pruning and signed counterexample, zeros and empty subsets, unsigned masks, downward 0/1 reachability DP and pseudo-polynomial costs. |
| `algo-permutations` | Reversible swaps, depth-local duplicate suppression, sorted used-array lexicographic generation, repeated-copy rule and output-sensitive factorial costs. |
| `algo-graph-coloring` | Fixed-palette exact search, greedy first-fit comparison and path-ordering counterexample, timetable graph, witness/exhaustion proof, degree bound and actual matrix implementation costs. |
| `algo-naive-string-matching` | Every legal alignment, overlapping counts, first occurrence versus nonoverlapping policy, measured comparisons and repeated-prefix worst case. Lab: `naive-matching`, array. |
| `algo-kmp` | Proper borders, prefix construction, multiple fallbacks, overlap-preserving matching, border-chain listing, correctness and amortised linear analysis. Lab: `kmp-prefix`, array. |
| `algo-rabin-karp` | Rolling polynomial update, negative-remainder normalisation, verified hits, actual aa/dx collision, candidate-sensitive and worst-case costs, hash assumptions and arithmetic bounds. |
| `algo-number-theory` | Euclid, extended Euclid/Bézout reconstruction, sieve from p squared, modular arithmetic, inverse existence and normalisation, numeric versus bit-cost qualifications. Lab: `sieve`, array. |
| `algo-p-np` | Decision questions, P/NP, certificates, NP-hard/complete, source-to-target reductions, independent-set/vertex-cover complement example, famous complete problems, pseudo-polynomial DP and the open P-versus-NP question. |
| `algo-exam-questions` | Twelve fully solved questions: bubble passes, complete small knapsack/LCS tables, Dijkstra snapshots, Kruskal decisions, recurrences, colouring bounds and complexity proofs. |
| `algo-problem-solving-strategy` | Output contract, constraint-based method selection, brute reference, sorted two-pointer proof, prefix queries, edge/differential tests, overflow/qsort qualifications and Beecrowd/Codeforces study workflow. |
| `algo-interview-questions` | Fifty short answers grouped into foundations, searching, sorting, divide/conquer, greedy, DP, graphs, backtracking, strings, number theory, complexity and strategy. |

No curriculum point is intentionally omitted, and no extra topic ids are proposed. Titles, summaries, key points and important lab decisions follow `BANGLA_STYLE.md`. Full Bangla bodies remain optional and are not added. Video lists are empty because no catalogue match was verified. Content remains `review.status: draft` for ordinary subject and language review.

## Earlier-title edits

To satisfy the request that **every lab title be a short descriptive phrase**, ten existing labs receive English-title-only changes: `kadane`, `activity-selection`, `binary-search`, `linear-search`, `bubble-sort`, `counting-sort`, `heap-sort`, `insertion-sort`, `merge-sort` and `selection-sort`. Earlier lesson bodies, programs, outputs, lab algorithms and metadata other than those English titles are unchanged. All edits are confined to `content-kit/algorithms/content/`; no curriculum, checker or player code changes.

## Verification

From inside `content-kit/`:

```bash
node tools/check.mjs algorithms/content --sanitize --report algorithms/content/CHECK_REPORT.txt
```

The cumulative check reports **0 errors and 0 warnings**. Real GCC runs produced all **100 new `.out` files** (32 examples plus 68 practice test outputs). All 40 output-quiz programs were compiled and run to select their answers. The required check repeats compilation/output comparisons, runs examples and practice under AddressSanitizer and UndefinedBehaviorSanitizer, and validates all cumulative lab presets, explicit checks and generated inputs.

Additional independent verification:

- **5,892 C executions / 9,468 assertions**, seed 5104: exact binary-string sets; queen counts and first witnesses against whole-column permutations for n=1..8; exhaustive small nonnegative/signed subset counts; distinct/ordered permutation sets; naive/KMP/Rabin–Karp matches against independent substring positions; explicit collision and long repetition cases; prefix lengths against direct border enumeration; sieve flags against trial division; gcd against Python's gcd and Bézout identities; inverse existence/equations; colouring witnesses and triangle counts; two-pointer/brute pair existence against independent distinct-index enumeration.
- **2,084 lab cases / 7,284 assertions**: repeat-call determinism, input immutability, valid shared-player steps, exhaustive short string matches and direct prefix-border references, all supported sieve limits against divisor counts, and all queen sizes against whole-board permutation enumeration. Maximum trace length: **967 steps**, below the 3,000-step limit. The lab checks were repeated after adding the explicit KMP base-case explanation.

Actual tools: GCC 14.2.0 (Debian 14.2.0-19), Node.js v24.22.1 and Python 3.12.14 for temporary authoring/reference scripts. Learner programs are C17, and labs use the required pure deterministic JavaScript. Temporary scripts and binaries remain outside the repository.

## Conventions and review attention

- C strings are nonempty lowercase Latin tokens, at most 24 letters for matching and eight for permutations. Positions are bytes, not Unicode grapheme clusters. The lab form permits empty strings: naive matching explicitly accepts an empty pattern at all n+1 boundaries, while KMP returns an empty prefix table. These documented extensions do not change the C examples' nonempty domain.
- Queen programs accept n=1..8; the lab limits n to five to show every decision within the step budget. Reflections/rotations count separately. Ascending column trials define the first witness. After counting, the lab restores that saved board; unsatisfiable sizes remain empty.
- Subsets distinguish input indices, including duplicate and zero values. The recursive overshoot prune requires nonnegative values; the signed mask version has no such prune. The Boolean DP returns reachability, not every witness.
- Swap-generated permutations are distinct but not generally lexicographic. Sorted used-array output is lexicographic. The factorial quotient program is deliberately fixed to aabb, avoiding unsupported general factorial arithmetic.
- Colouring uses a fixed simple undirected five-exam conflict graph. The exact solver returns one witness, and the triangle program counts labelled assignments. A greedy failure never proves general impossibility.
- Rabin–Karp uses base 26, modulus 101 and a=0. Its small fixed hash deliberately exhibits a collision; character verification preserves correctness. Many true or spurious hits can require quadratic verification work.
- Fixed capacities and integer bounds are explicit. qsort has no C-standard O(n log n) guarantee, which the strategy lesson states. Inverses require modulus at least two. Zero and one are explicit nonprimes.
- Review the border-chain and reduction proofs, pseudo-polynomial explanation, symmetry convention and natural Bangla wording before publication. There are no unresolved checker warnings.

Earlier notes follow as historical records; their scope and counts apply to those deliveries.

---

# Algorithms – Batch 3

Package version: **0.3.0**, schema **1.1**, track **algorithms**.

This delivery adds all **10 topics and 9 labs** in `graph-algorithms`. The cumulative package contains **43 of 56 topics and 28 of 32 labs**. The new material includes **35 complete C17 examples, 20 code-practice solutions with 80 captured test outputs, 23 worked written exercises, and 105 quiz questions, including 30 compiled output questions**. Titles, summaries, key points and key animation decisions use natural Bangla following `BANGLA_STYLE.md`. All new topics remain `review.status: draft` for normal subject and language review.

## Batch 3 coverage

| Topic | Included material and reviewer focus |
| --- | --- |
| `algo-bfs` | FIFO traversal over adjacency lists, mark-before-enqueue, unweighted shortest-layer proof, predecessor recovery and a runnable four-direction grid BFS. Lab: `bfs`, graph. |
| `algo-dfs` | Recursive call stack, discovery/finish timestamps, complete undirected component forest, directed tree/back/forward/cross classification and the reverse-parent-edge exception. Lab: `dfs`, graph. |
| `algo-topological-sort` | Kahn's indegrees and FIFO readiness, full-order/cycle decision, DFS grey-edge rejection and reverse finish order, rank-based verification and blocked downstream tasks. Lab: `topological-sort`, graph. |
| `algo-strongly-connected` | Kosaraju's two complete forests, explicit transpose adjacency lists, decreasing original finish order, component-DAG proof, duplicate-free condensation and a separate two-mutual-pair example. No lab is listed for this topic. |
| `algo-dijkstra` | Relaxation, real lazy binary min-heap, stale records, strict predecessor updates, route reconstruction, nonnegative-weight proof and a directed negative-edge counterexample. Lab: `dijkstra`, graph. |
| `algo-bellman-ford` | Immediate-update edge passes, early fixed-point exit, V−1 proof, reachable negative-cycle detection and forward propagation distinguishing finite, INF and −INF destinations. Lab: `bellman-ford`, graph. |
| `algo-floyd-warshall` | Allowed-intermediate state and recurrence, outer-k/in-place invariant, all-pairs distance matrix, first-hop reconstruction and negative-cycle affected-pair interpretation. Lab: `floyd-warshall`, grid. |
| `algo-prim` | Single-component growth, joining-edge keys versus source distances, real lazy binary min-heap, cut exchange proof, total/count reporting and explicit disconnected-input limitations. Lab: `prim`, graph. |
| `algo-kruskal` | Stable merge sorting of complete edge records, path-compressed union-find with union by size, cycle rejection, cut exchange proof and minimum spanning forest reporting. Lab: `kruskal`, graph. |
| `algo-cycle-bipartite` | Simple-undirected parent checks, directed grey-state DFS, complete-component BFS two-colouring, odd-cycle equivalence, even-cycle distinction and parallel-edge assumptions. Lab: `bipartite-check`, graph. |

Every Batch 3 `covers` point is addressed. The remaining **13 topics and 4 labs** belong to the later modules; no extra topic ids are proposed. Full Bangla lesson bodies are optional and have not been added. Video lists remain empty because no specific catalogue match was verified.

## Curriculum kinds are preserved

The request describes graph labs, but the authoritative curriculum explicitly assigns **`grid` to `floyd-warshall`**. Its distance-matrix states and cell comparisons fit the grid player. That lab keeps `grid`; the other eight new labs keep `graph`. The curriculum lists no SCC lab. **No file in `spec/`, no checker and no player code is changed in Batch 3.** All changes are confined to `content-kit/algorithms/content/`.

## Verification for Batch 3

Run from inside `content-kit/`:

```bash
node tools/check.mjs algorithms/content --sanitize --report algorithms/content/CHECK_REPORT.txt
```

The cumulative report records **0 errors and 0 warnings**. GCC executions produced every new example and practice `.out`; the output-quiz answers were also selected from real executions. The required checker independently repeats compilation/output comparisons, runs examples and practice with AddressSanitizer and UndefinedBehaviorSanitizer, and validates all cumulative lab presets, explicit checks and generated inputs.

Actual tools: GCC 14.2.0 (Debian 14.2.0-19), Node.js v24.22.1 and Python 3.12.14 for temporary authoring/reference scripts. Learner programs use C17. The lab traces are pure deterministic JavaScript, as required by `LAB_FORMAT.md`. Temporary validation scripts and binaries are outside the repository.

Additional independent verification passed **2,864 assertions**:

- **216 lab cases / 648 assertions:** all four scenario selectors and six source choices for each lab, repeated-call determinism, input immutability and valid shared-player operations. The longest trace contained 160 steps. For the source-independent Kahn/Kruskal labs, source values are redundant verification inputs, not extra form controls.
- **2,216 reference assertions, including 240 C executions:** every primary example was compiled once and run for every scenario/source pair. Independent simple-path enumeration verified shortest costs; elementary-cycle enumeration and reachability verified Bellman-Ford's affected set; iterative DFS frames verified timestamps; all vertex permutations checked topological feasibility; mutual reachability checked SCC partitions; spanning-subset enumeration checked minimum forests; exhaustive binary colour assignments checked bipartiteness.
- Those reference assertions include **1,326 nonadjacent-edge pair comparisons** across the graph-lab cases. There were no edge crossings. The common drawing uses manually chosen positions, while the chain/ring preset uses a separate manually chosen perimeter layout. Neither uses automatic layout.

## Conventions and reviewer attention for Batch 3

- Shared undirected vertices are A–F, indexed 0–5. Edges are AB=4, AC=2, BC=1, BD=5, CE=8, DE=2, DF=6 and EF=3. BFS/DFS ignore displayed weights. BFS from A gives layers 0,1,1,2,2,3; Dijkstra gives 0,3,2,8,10,13. Prim and Kruskal both give total weight 13. Neighbours are visited in ascending vertex order.
- Directed topics orient those listed endpoint pairs left to right. Directed Floyd-Warshall therefore gives A's row 0,4,2,9,10,13, which intentionally differs from undirected Dijkstra. Bellman-Ford changes B→C to −3; its cycle preset adds E→B of weight −6. Only B–F become unbounded from A; starting from sink F cannot reach that cycle.
- Scenario 0 is the shared graph, scenario 1 a chain (or a directed ring, or Bellman-Ford's negative-cycle variant), scenario 2 isolates F, and scenario 3 has six vertices with no edges. Graph topology is fixed in the trace, as the format requires. Source-independent labs expose only the graph selector. C examples share a graph/start input convention and explicitly explain when start is ignored.
- The main C graph helper reserves fixed arrays and constructs sorted adjacency lists by searching its small edge list. Lessons distinguish that preparation and reserved capacity from general O(V+E) traversal/list-storage claims. Matrix-based supplementary examples explicitly state their O(V²) scanning costs.
- Dijkstra and Prim C examples use actual lazy binary heaps. Visual priority panels sort their tiny entry lists for readability but use identical removal/tie semantics; their descriptions disclose this difference. Thirty-two heap slots exceed the bound for the fixed at-most-eight-undirected-edge scenarios. General-purpose code needs dynamic capacity or checks.
- Equal tentative paths keep the earlier parent. Heap ties use the smaller vertex index; Kruskal ties retain original edge order through stable merge sort. SCC ids are traversal labels, not canonical group names. A valid mathematical answer may use other equal-cost routes, valid topological orders or component labels.
- Prim reports only the selected start component and explicitly flags fewer than six reached vertices. Kruskal returns the minimum spanning forest over the entire graph. They intentionally answer different scopes on disconnected input. Union-find parent links do not represent graph paths.
- Bellman-Ford prints `INF` for unreachable and `-INF` for negative-cycle-affected destinations. Its affected propagation uses repeated edge scans, preserving O(VE+V) overall. Floyd-Warshall's supplied scenarios have no negative cycle; the lesson explains the additional diagonal/reachability classification needed before extending reconstruction to such inputs.
- The programs use fixed six-node graphs with small weights, making integer bounds, recursion depth, queue lengths and sentinels explicit. Floyd/Dijkstra use −1 only for unreachable output where finite costs are nonnegative; the Floyd lab instead displays `INF` in cells. Empty routes, source-equals-target and isolated-source outcomes are covered.
- Cycle-by-parent-vertex code assumes simple undirected graphs; the lesson explains why multigraphs require parent edge ids. Directed classification's runnable example groups completed forward/cross destinations as `finished`, while the text gives the full interval-based distinction.
- Reviewers should double-check the cut exchanges, Kosaraju finish-time argument, Bellman-Ford affected propagation, outer-k recurrence and Bangla phrasing before publication. These are normal draft-content reviews, not unresolved checker warnings.

Earlier delivery notes follow as historical records; their counts, versions and scope apply to their respective batches.

---

# Algorithms – Batch 2

Package version: **0.2.0**, schema **1.1**, track **algorithms**.

This delivery adds all **17 topics and 10 labs** in `divide-conquer`, `greedy` and `dynamic-programming`. The cumulative package contains **33 of 56 topics and 19 of 32 labs**. Earlier lessons are retained, with a Bangla terminology correction in asymptotic notation for the updated style rules. All new topics remain `review.status: draft` for subject and language review.

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

The independent runs use seeds 28539 (labs) and 20931 (C). They validate algorithmic results beyond the lesson examples; the committed report remains the result of the exact required command. There are no unreviewed checker warnings. After syncing the latest main branch, the package was checked again with its new BANGLA_STYLE.md enforcement. The earlier asymptotic-notation key point now uses কনস্ট্যান্ট, and new coin/Huffman phrasing avoids ambiguous or translated technical terms.

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
