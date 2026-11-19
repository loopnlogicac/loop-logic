# Data Structures — Batch 2

Package **0.2.0**, schema **1.1**, continues the existing 14 topics with all 11 topics in `stacks` and `queues`. The cumulative manifest contains **25 of 47 topics** and **13 labs**. All topics retain draft editorial status.

The new material contains **35 complete C17 examples**, **44 executable practice solutions with 98 test inputs**, **116 quiz questions including 33 executable output questions**, and **33 worked exam questions**. Cumulative totals are 82 examples, 103 practice solutions, 271 quiz questions, 75 output questions, 78 exam questions and 303 generated `.out` files. Every output file was captured by executing its program; no output is inferred from reading source.

English bodies meet the full level targets: the two beginner lessons exceed 900 words and the nine intermediate lessons exceed 1,200 words. Titles, summaries and five key points per topic have Bangla text. Lab titles and important decision notes include Bangla. Full Bangla lesson bodies remain deferred; `bn-partial` describes this accurately. Video arrays remain empty because no uncertain match was included.

## Curriculum and lab count

The initial checkout of `CODEX_TASK_2.md` said this delivery had seven labs, while `data-structures/spec/curriculum.json` listed six for these modules. The user explicitly confirmed using the six curriculum-listed labs. All six are implemented with their exact ids and kinds; no curriculum or checker file was changed and no extra lab was invented. Main subsequently received a separate correction to the batch tables, confirming six labs and that the curriculum is authoritative.

| Topic | Curriculum coverage and review guide |
| --- | --- |
| ds-stack-array | Signed top index; push, pop, peek, isEmpty and isFull; preserved state on overflow/underflow; before/after diagrams. `stack-array` links to ex-1 and uses the same capacity-four command convention. |
| ds-stack-linked-list | Head insertion/removal, allocation failure, cleanup, no fixed capacity, and array/linked comparison. Programs release nodes on normal and failed-input paths. |
| ds-balanced-parentheses | Three bracket families, nesting invariant, mismatch positions, oldest unmatched opener at end, and linear time/space. `bracket-matching` and ex-1 share 1-based diagnostics. |
| ds-infix-postfix | Precedence, left/right associativity, complete shunting-yard conversion, syntax rejection, exam conversion tables, and prefix through ordered postfix fragments. `infix-to-postfix` links to ex-1. |
| ds-postfix-evaluation | Space-separated signed multi-digit integers, operand order, prefix evaluation, shape checks and bounded arithmetic. `postfix-eval` links to ex-1. |
| ds-recursion-and-stack | Activation records and continuations, recursive/explicit factorial, and phased explicit-stack Hanoi. Includes a move/depth derivation and executable practice for summation and move counts. |
| ds-queue-array | Enqueue/dequeue, front and next-write rear conventions, endpoint inspection, wasted prefix, reset/compaction alternatives and address calculation. `queue-basic` models the same linear write boundary as ex-1. |
| ds-circular-queue | Modulo front/rear updates, counted and reserved-gap full/empty rules, physical versus logical order, full cycles and failed requests. `circular-queue` is an array lab with cursor arrows, linked to ex-1. |
| ds-queue-linked-list | Saved front/rear, tail append, head removal, singleton endpoint repair, cleanup and refill after complete drain. |
| ds-deque | Four endpoint operations, safe backward wrap, circular-array and complete doubly linked implementations, plus input/output restrictions. Practice programs enforce both restrictions. |
| ds-priority-queue | ADT and tie policy; complete unsorted-array, sorted-array and binary-heap programs; update costs, workload choices, scheduler starvation/aging and Dijkstra preview. |

All requested `covers` points are addressed. The remaining 22 topics belong to later modules. No additional topics are proposed.

## Verification

From `content-kit/`:

```bash
node tools/check.mjs data-structures/content --sanitize --report data-structures/content/CHECK_REPORT.txt
```

The included report records **0 errors and 0 warnings** across the cumulative package. GCC 14.2.0 compiled all examples and practice solutions with `-std=c17 -Wall -Wextra -Wpedantic -Werror -O2`. The check executes every example, all 221 cumulative practice test inputs, all 75 output quizzes, and every lab's presets, declared checks and generated inputs. Its sanitizer pass runs examples and practice tests with AddressSanitizer, UndefinedBehaviorSanitizer and leak detection.

A separate comparison run also uses sanitized C executables and the actual lab state reducer. It checks lab/C agreement, independent reference results, all supported Hanoi sizes, stable priority ordering across all three implementations, and an additional sanitizer run for every cumulative output-quiz program. All **2,320 lab/C comparisons** passed:

| Lab | Comparison cases |
| --- | ---: |
| stack-array | 180 |
| bracket-matching | 1,567 |
| infix-to-postfix | 93 |
| postfix-eval | 119 |
| queue-basic | 180 |
| circular-queue | 181 |

The bracket cases include every string of length zero through four over all six bracket symbols. Expression cases cover every pair of the five conversion operators with ungrouped, left-grouped and right-grouped forms; an independent recursive parser checks postfix structure. An independent recursive postfix reader checks evaluation results and rejection behavior. Queue/stack streams include every allowed command count, empty/full states, duplicates and wraparound.

All **75 cumulative output quizzes** also passed a separate sanitizer build/run with leak detection and halt-on-error enabled. The three priority-queue programs matched an independent stable ordering on **85 workloads** (255 executions). Hanoi replay passed for **all nine supported disk counts, 0..8**, checking move totals, source tops, legal destinations and the final target pile. Temporary verification scripts and executables are not part of this delivery.

## Conventions and reviewer attention

- The linear queue deliberately never resets its cursors in ex-1. Its queue lab shows live FIFO values, while `front` and `rear` variables expose the physical write limit. It may reject an enqueue with fewer than four live entries. The practice reset variant resets only after complete draining.
- The circular queue uses all four cells and count; rear is the next write position. Cleared spare cells display zero, but occupancy depends on indices/count. The reserved-gap exercise allows three live entries in four physical cells and retains count for inspection.
- Command streams reserve zero for removal and, in the stack interface, 100 for peek. The underlying helpers can still store either integer. The lessons distinguish command encoding from payload restrictions.
- Bracket diagnostics report the first invalid closer immediately, or the oldest opener remaining at end. Non-bracket characters still contribute to positions. This is a bracket-only scan, not a lexer for quotes and comments.
- Infix input is limited to 24 characters, uppercase single-letter operands, binary `+ - * / ^`, spaces and parentheses. The infix lab's form alphabet offers A/B/C. `^` denotes right-associative exponentiation in this expression grammar, while C17 itself uses it for XOR. Unary operators and implicit multiplication are rejected.
- Prefix is built from validated postfix fragments. Shunting-yard stack work is linear, but repeated string copies in the instructional prefix implementation can be quadratic. The lesson explicitly separates these costs.
- Evaluator input has 1..12 tokens, literals -99..99 and intermediate magnitude at most 10,000. Division truncates toward zero and zero divisors are rejected before division. Bounded long intermediates keep arithmetic safe even with the minimum standard long range. The JavaScript lab normalizes zero results, including negative-zero arithmetic, to C integer zero.
- Linked structures publish nodes only after successful allocation and initialization. Removing the final queue/deque node clears both endpoints. Allocation-failure recovery is reviewed in source; allocator failure is not artificially injected.
- Hanoi supports 0..8 disks, includes zero-disk frames, and uses O(n) live frames for O(2^n) actions. Factorial uses long for inputs 0..10. Call-frame drawings are conceptual, not assumptions about machine frame layout.
- Priority examples use smaller keys first and FIFO arrival ties. The max-priority practice reverses the primary comparison only. Heap layout is not globally sorted. Allocation costs are distinguished from constant pointer/link work.
- Address questions supply byte widths. No output relies on runtime pointer addresses, struct padding or a guaranteed four-byte int.
- Review natural Bangla terminology and rendered diagram alignment before publication. No known validation warnings remain.

The earlier foundations, arrays and linked-lists content remains intact. Its original ownership, bounded-vector, cycle restoration, list-merge and polynomial conventions remain as described in those lessons; this delivery changes only cumulative package metadata, these notes, the report and the two new module directories.
