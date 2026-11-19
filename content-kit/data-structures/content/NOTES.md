# Data Structures — Bangla edition, part 1 (R5-G)

Added full `body.bn.html` lessons for all **14 topics** in `foundations`, `arrays` and `linked-lists`, following `BANGLA_STYLE.md`. The Bangla bodies retain the English section IDs, paragraph coverage, topic links, example/lab placements and code blocks. Diagram narration and the complexity table caption are also translated.

All **seven labs** now have Bangla summaries and narration for every emitted step, including boundary and failure paths. Existing bilingual topic fields were already filled; inherited recursion spellings are aligned to রিকার্শন. There are no figure captions in these topics' JSON that need translation. The package remains `bn-partial` because later modules still lack full Bangla bodies.

English text, example/practice code, quiz code, lab behavior and `.out` files are unchanged. Additional before/after trace comparisons cover **231 preset/check/generated inputs and 3,587 narrated steps** across the seven labs; every non-Bangla trace field is identical and each step has Bangla narration. The required full-package sanitizer check reports **0 errors and 0 warnings**. The earlier Batch 4 notes below describe that delivery before this translation pass.

---

# Data Structures — Batch 4 (final)

Package **0.4.0**, schema **1.1**, completes **47/47 topics and 24/24 labs**. This delivery adds the **12 topics** in `hashing`, `graphs` and `practice-exam`, with their **five curriculum labs**. All topics retain draft editorial status.

New material: **32 complete C17 examples**, **20 executable practice solutions with 44 input cases**, **19 fully answered written exercises**, **132 quiz questions (40 executable output questions)**, and **96 worked exam/interview answers**. The interview bank contains **exactly 50** short questions with answers. Cumulative totals: **147 examples, 182 practice exercises (163 code and 19 written), 353 practice inputs, 507 quiz questions (145 output questions), and 209 exam/interview answers**.

All new example and practice outputs were captured from compiled executions; output quiz answers were also obtained from actual runs. Authoring and supplementary verification scripts remain outside the repository.

## Coverage

| Topic | Coverage and review points |
| --- | --- |
| `ds-hashing-intro` | Direct addressing versus hashing; normalized division; mathematical multiplication hashing and a fixed-width implementation; rolling string hashes; distribution, equality and collisions. |
| `ds-collision-chaining` | Bucket-owned lists; unique-key append, search and pointer-to-pointer deletion; allocation cleanup; load factor, chain concentration and expected/worst costs. |
| `ds-open-addressing` | Linear clustering, quadratic coverage/exhaustion, coprime double-hash steps, bounded probes, tombstone deletion, duplicate checks and safe reuse. |
| `ds-rehashing` | Projected-load threshold, duplicate-before-growth checks, geometric growth, full reinsertion, allocate/build/publish ownership, amortized migration versus expected probes. |
| `ds-graph-terminology` | Vertices/edges, direction/weights, degree sums, paths/cycles/components, complete/bipartite/DAG/tree distinctions and executable two-color checking. |
| `ds-graph-representation` | Matrices, linked and array-backed adjacency, edge lists, zero-weight presence, symmetric insertion, allocation failure and operation/storage trade-offs. |
| `ds-graph-bfs` | Mark-on-enqueue FIFO traversal, distances/parents, BFS tree, minimum-hop proof, route reconstruction and unreachable vertices. |
| `ds-graph-dfs` | Recursive and explicit-frame traversal, discovery/finish timestamps, interval nesting, component forests, stack depth and applications preview. |
| `ds-disjoint-set` | Make-set, find, size-based union, first-root ties, full compression, balanced merges, rank alternative, incremental connectivity and amortized bounds. |
| `ds-exam-questions` | Twelve chapter-based worked questions: addresses, shifts, list deletion, stack/queue/tree/heap/hash traces, BFS, union-find and design. |
| `ds-mini-project-phonebook` | Complete add/search/delete/sort/list/save/load menu; linked ownership, bounded text, duplicate policy, rollback-safe loading and preserved file order. |
| `ds-interview-questions` | Fifty answered questions across arrays, lists, stacks, queues, trees, hashing and graphs, emphasizing assumptions, ownership and workload choices. |

Every curriculum `covers` point is addressed. No required topic or lab remains deferred, and no extra topics are proposed. Optional full Bangla bodies have not been added; `bn-partial` remains accurate. Video arrays are empty because no exact video match was established.

## Bangla and earlier content

Re-read `CODEX_TASK_2.md`, `LAB_FORMAT.md`, `BANGLA_STYLE.md`, the inherited C brief, sample lesson/lab and track curriculum. Titles, summaries, key points, lab titles and key decision notes use natural চলিত Bangla and familiar technical spellings such as হ্যাশ টেবিল, গ্রাফ, অ্যারে, পয়েন্টার, স্ট্যাক, কিউ, ফাংশন, লুপ and ডেটা. Identifiers remain in English where useful.

The existing 35-topic package initially passed with **0 errors and 0 warnings**. No earlier topic required Bangla or other fixes. Earlier topic files remain unchanged.

## Labs and additional verification

Each lab uses its exact curriculum ID/kind, `codeExample: ex-1`, typical/best/worst/boundary presets, at least three checks and explanatory Bangla decisions.

| Lab | Input convention | Sanitized C/lab/reference comparisons |
| --- | --- | ---: |
| `hash-chaining` | 0..12 keys in -99..99, delete and query; seven buckets, unique keys, tail insertion | 160 |
| `hash-open-addressing` | Same key bounds, method 0 linear/1 quadratic/2 double, delete and query; eleven slots | 480 |
| `graph-bfs` | Graph 0..3, source 0..6; ascending neighbors, distance -1 for unreachable | 28 |
| `graph-dfs` | Same graphs/sources; explicit frames, entry/exit clock, zero unreached times | 28 |
| `union-find` | Pair selector 0..4, query 0..6; size balancing and first-root ties | 35 |

These **731 comparisons** use the real lab reducer, deterministic replay, sanitized C executables and independent membership/probe-coverage, distance, recursive-DFS or component references. Every graph/source and union-selector/query combination was checked. Hash cases include empty input, singleton, duplicates, negatives, concentrated collisions, saturation and quadratic exhaustion.

Additional checks:

- **160** sanitized rehashing runs verify distinct-key preservation, the load policy and lookup paths that do not cross empty cells.
- **157** sanitized runs inject failure at successive `malloc` calls in chained tables, growth, linked adjacency and phone-book editing/loading; no address, undefined-behavior or leak diagnostics.
- **17** sanitized phone-book sessions check independent results for duplicates, bounds, invalid/overlong input, EOF, empty/missing files, file order, malformed/duplicate/oversized load rollback and write-open failure.
- The cumulative checker executes examples, practice inputs, output quizzes and lab presets/checks/generated inputs. Its sanitizer pass covers examples and practice.

## Required validation

From `content-kit/`:

```bash
node tools/check.mjs data-structures/content --sanitize --report data-structures/content/CHECK_REPORT.txt
```

The delivered `CHECK_REPORT.txt` records **0 errors and 0 warnings** for all 47 topics and 24 labs. There are no unresolved validation warnings. Toolchain: **gcc 14.2.0, Node.js v24.22.1, Python 3.12.14**. Executable examples, practice solutions and output quizzes use **C17** with `-Wall -Wextra -Wpedantic -Werror`. Lab trace functions use JavaScript as required by lab format 1.1.

## Conventions and human review

- Hash sets ignore duplicate keys. The introduction instead counts repeated input arrivals, including duplicates, for its collision statistic. Chaining appends so lab and C bucket order agree.
- Quadratic `(home+i*i)%11` can exhaust its reachable subset in a nonfull table. Linear and double probing cover all eleven slots; the double step is `1+normalized(key%10)`. Every search has a bounded attempt count.
- Multiplication hashing requires optional exact-width `uint32_t`/`uint64_t`. Numeric string-hash explanations assume ASCII-compatible execution character codes. Encoding and noncryptographic limits are stated.
- Rehashing starts at five cells, grows to `2*m+1` before projected load exceeds 0.6, and accepts twelve keys. General unbounded containers need capacity/byte-size overflow checks. Tombstone cleanup and shrink hysteresis are explained separately from insertion-only code.
- Graphs are simple and undirected unless stated otherwise. Some demonstrations use matrices for construction/validation or rectangular neighbor arrays: their actual storage/setup is O(V squared), even when traversal scans active lists in O(V+E).
- Shared graph zero has edges 0-1,0-2,1-3,1-4,2-4,3-5,4-5 and isolated vertex six. Other traversal choices are a seven-vertex path, seven isolated vertices and K7. Union-find adds a balanced merge order to expose compression.
- DFS event times start at one; zero means unreached. Union-find parents are representative shortcuts, not original graph edges. Nonroot sizes are stale, and compression changes only queried paths.
- The phone book uses invented ASCII names (1..24 letters/digits/underscores), case-sensitive uniqueness, 1..16 phone characters (digits with optional leading plus), and at most 32 contacts. Unicode names and multiword parsing need another policy.
- **Phone-book W replaces `contacts.txt` in the current directory; run in a scratch folder.** Delivered round-trip sessions write before reading. Load is transactional in memory; basic save can truncate an earlier disk file before a later write fails. The lesson explains a stronger temporary-file approach without claiming portable crash durability.
- Phone-book load is O(n squared) because duplicate checks scan earlier temporary records. Both old and new lists coexist until commit. Sorting relinks in O(n squared) time with O(1) auxiliary pointers.
- Review rendered Bangla, diagram alignment, tombstone behavior, DFS return events and the visible phone-book file replacement limitation before publication. Address questions give widths explicitly and do not print real pointer addresses.

Only files within `content-kit/data-structures/content/` change in this delivery.
