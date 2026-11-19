# Data Structures — Batch 3

Package **0.3.0**, schema **1.1**, adds all **10 topics** in `trees` and the **six labs** specified by the curriculum. The cumulative package now contains **35 of 47 topics** and **19 labs**. Every topic retains draft editorial status.

Batch 3 contains **33 complete C17 examples**, **40 executable practice solutions with 88 test inputs**, **104 quiz questions including 30 executable output questions**, and **35 worked exam questions**. Cumulative totals are **115 examples, 143 practice solutions, 309 practice inputs, 375 quiz questions, 105 output questions and 113 exam questions**. Every new example and practice `.out` was captured from an actual execution; the checker compiles and compares the stored results again.

## Coverage

| Topic | Coverage and review points |
| --- | --- |
| `ds-tree-terminology` | Root, parent, child, leaf, sibling, ancestor, descendant, depth, height and degree; full, complete, perfect and skewed shapes; edges, level capacities, perfect counts, full-tree leaf counts and height bounds. |
| `ds-binary-tree` | Zero-based child/parent formulas, one-based comparison, array address calculation, sparse occupancy and orphan rejection, linked records, complete-tree input construction, partial-allocation cleanup and storage tradeoffs. |
| `ds-tree-traversals` | Recursive preorder/inorder/postorder, queue level order, explicit-stack inorder and distinct-key reconstruction from preorder plus inorder. Includes invalid reconstruction, visit-order diagrams and separate height/width space costs. |
| `ds-binary-search-tree` | Whole-subtree ordering, unique-key policy, complete recursive and iterative search/insertion, minimum, maximum, strict successor, range pruning and the cost of skewed shapes. |
| `ds-bst-deletion` | Leaf, one-child and two-child cases; successor replacement; root and parent-link repair; successor with a surviving right child; record lifetimes and single-node versus whole-subtree release. |
| `ds-avl-tree` | Cached node heights, balance factors, all four LL/RR/LR/RL cases, saved middle subtrees, returned-root repair, insertion, duplicate/failure handling and the minimum-node height recurrence. |
| `ds-heap` | Complete array shape, max-heap build/insert/remove, sift-up/down, linear bottom-up construction with a trace and geometric-sum explanation, plus a complete min-heap build/insert/remove example. |
| `ds-expression-tree` | Postfix subtree-stack construction, right-before-left popping, recursive evaluation, fully parenthesized infix, prefix, invalid forests, bounded arithmetic and cleanup. |
| `ds-b-tree-intro` | Page fan-out, explicit order/minimum-degree definitions, occupancy and root exceptions, complete degree-two insertion with splits, B-tree versus B+ record/separator rules and a prepared B+ leaf-chain range scan. |
| `ds-trie` | Explicitly initialized 26-child nodes, unique-word insertion, exact search versus prefix paths, cached prefix counts, alphabetic autocomplete, longest stored prefix, failure cleanup and encoding limits. |

All requested curriculum points are covered. The remaining **12 topics** belong to hashing, graphs and practice/exam material in Batch 4. No extra topics or labs are proposed. Full Bangla lesson bodies remain deferred; `bn-partial` remains accurate. Video lists are empty rather than asserting uncertain matches.

## Bangla review

Re-read `BANGLA_STYLE.md` before authoring. New titles, summaries, key points, lab titles and important lab decisions use natural চলিত Bangla, তুমি-style directions and familiar technical spellings such as ট্রি, ডেটা, অ্যারে, পয়েন্টার, স্ট্যাক, কিউ and ফাংশন. Code identifiers remain in English where useful.

The initial sanitized check of the existing 25 topics reported **0 errors and 0 warnings**, including no Bangla warnings. Consequently, no earlier lesson required a warning fix. The final cumulative check also reports **0 errors and 0 warnings**. Earlier topic files remain unchanged.

## Labs and C agreement

Every lab uses its exact curriculum id and kind, includes typical and boundary presets, at least three declared checks, explanatory Bangla decision notes, and `codeExample: "ex-1"`.

| Lab | Input convention | Additional sanitized C/lab/reference comparisons |
| --- | --- | ---: |
| `tree-traversals` | Complete-tree level-order values; mode 0 pre, 1 in, 2 post, 3 level | 191 |
| `bst-insert-search` | Insertion-order values; query key; equal keys ignored | 188 |
| `bst-delete` | Insertion-order values; deletion key | 217 |
| `avl-insert` | Insertion-order values; all pointer changes shown during rotations | 311 |
| `heap-operations` | Build input, insert key, optionally remove maximum | 188 |
| `trie-insert` | Initial dictionary car/cat/do; optional 0..6-letter lowercase word | 189 |

These **1,284 comparisons** use the actual lab state reducer and sanitized C example executables. They include deterministic replay, independent expected answers, connected-tree checks and exact C/lab BST and AVL shape comparisons. AVL checks include every permutation of five distinct keys and balance checks after every insertion prefix. Deletion cases include root removal, direct/deep successors, successor child promotion, absent keys, duplicates, singleton and empty trees.

Additional verification:

- **250** sanitized B-tree runs independently check page occupancy, sorted page keys, ancestor bounds, equal leaf depth and final distinct-key sets.
- **85** sanitized min-heap runs check build, insertion and optional delete-min against an independent multiset and parent-order checks.
- **1,152** runs inject failure at successive allocation positions across the new example/practice programs; cleanup paths produce no sanitizer diagnostics.
- **268** invalid-input runs check rejection and cleanup paths without sanitizer diagnostics.
- All **30 new output quizzes** also pass a separate sanitizer build/run and match their correct options.

Temporary verification programs and authoring scripts live outside the repository and are not delivered.

## Required verification

Run from `content-kit/`:

```bash
node tools/check.mjs data-structures/content --sanitize --report data-structures/content/CHECK_REPORT.txt
```

`CHECK_REPORT.txt` records **0 errors and 0 warnings** for the cumulative 35-topic package. GCC 14.2.0 builds C17 with `-Wall -Wextra -Wpedantic -Werror`. The checker runs examples, every practice input, output quizzes, and lab presets/checks/generated inputs; its sanitizer pass exercises examples and practice with address, undefined-behavior and leak checks. The recorded toolchain is GCC 14.2.0, Node.js v24.22.1 and Python 3.12.14.

## Conventions and human review

- Terminology, ordinary BST measurements and B-tree page height count **edges**; empty binary height is -1. AVL caches and the shared lab player's binary `height` count **nodes**; empty height is 0. Lessons state these conventions explicitly. Trie results use the word list and count, rather than the binary-only derived height field.
- Binary-tree/traversal inputs describe a **complete positional tree** and preserve duplicate values. BST/AVL/B-tree inputs instead describe **insertion order** with set semantics. Heaps retain duplicate entries.
- A BST successor means the smallest stored key strictly greater than the query, including when the query is absent. Two-child deletion copies a key and frees the old successor record; outside pointers are not promised stable key identity.
- AVL insertion is implemented; AVL deletion is deferred. Rotations allocate nothing, preserve the middle subtree and update the former root before the new root.
- Heap capacity is sixteen cells for at most twelve initial entries and one insertion. Max-heap ties choose the left child and do not swap equals. C's inactive array tail is not part of the heap displayed by the lab.
- Expression input is at most fifteen symbols including spaces, single digits and binary `+ - *`. This bound keeps signed-long arithmetic safe. Empty/malformed expressions are rejected. This is not a general C expression parser.
- B-tree order means maximum children; code uses minimum degree two (maximum four children). Thirty-two arena records suffice for twelve insertions. B+ range scanning uses a prepared layout; B+ insertion, page I/O, borrowing/merging and storage-failure recovery are explicitly deferred.
- Trie words use validated lowercase English letters, length 1..6, with distinct counts. Lab/example one accepts an empty line as **no insertion**, rather than an empty stored word. A terminal node can have children. Node initialization uses a C initializer, not assumptions about zero-byte null pointers. UTF-8 Bangla needs a different character mapping.
- Allocation-failure behavior is exercised by temporary linker wrappers. Linked records are freed on success, rejected input and allocation failure. Example source listings include only the helpers they actually use.
- Address questions supply widths explicitly; no result depends on real pointer addresses, structure padding or a universal byte width for int.
- Before publication, review Bangla phrasing, diagram alignment, rotation animations, and the B-tree/B+ distinction in the rendered lesson player. There are no known validation warnings.

Only files within `content-kit/data-structures/content/` change in this delivery.
