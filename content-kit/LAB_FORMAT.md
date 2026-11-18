# Lab format 1.1: interactive visualisers and simulators

A **lab** is a step-by-step animation of an algorithm or data-structure operation that students can play, pause, step back through, and re-run on **their own input**. Loop & Logic draws it with one shared lab player. You only write **data and a pure trace function**, never drawing code, HTML or CSS.

The checker (`tools/check.mjs`) runs every lab with its presets, its checks and 25 random inputs, using the same state model as the site's player. A lab that passes the checker plays correctly on the site.

```
topics/<module>/<topic>/labs/<lab-id>/
├── lab.json     # metadata, pseudocode, input form, presets, checks
└── trace.js     # function trace(input) → { init, steps }
```

In the topic, place the lab once in `body.en.html` with `<div data-lab="<lab-id>"></div>` (usually in or right after "How it works"), and list it in `topic.json` → `"labs": ["<lab-id>"]`. The lab ids and kinds for each topic are fixed in `spec/curriculum.json` (`topics[].labs`).

Working samples: `samples/labs/bubble-sort` (array) and `samples/labs/bfs` (graph).

```bash
node tools/check.mjs --lab samples/labs/bubble-sort --kind array
```

---

## 1. `lab.json`

| Field | Rule |
|---|---|
| `schemaVersion` | `"1.1"` |
| `id` | the folder name; must match the curriculum |
| `kind` | `array`, `heap`, `linked-list`, `stack`, `queue`, `tree`, `graph`, `grid` or `hash-table`; must match the curriculum |
| `title` | `{ "en", "bn" }` |
| `summary` | `{ "en" }`: one sentence, ≤ 220 characters, saying what the student will see |
| `pseudocode` | 3–30 lines, each ≤ 80 characters. Steps point at these lines with `line` (1-based) so the player highlights them. Use the same pseudocode style as the lesson. |
| `inputs` | the form the student fills in (see 1.1). `[]` means presets only. |
| `presets` | 2–8 `{ "name", "input" }`. The first one loads by default; name them meaningfully ("Marks of 6 students", "Already sorted"). |
| `checks` | at least 3 `{ "input", "expect" }`, including edge cases (smallest input, duplicates, already-sorted, unreachable node…). `expect` is a partial final state (see section 3). |
| `complexity` | `{ "time", "space" }`: short strings |
| `codeExample` | optional: the id of the topic example (`"ex-2"`) that implements the same algorithm in the track's language, so students can jump from the animation to real code |

### 1.1 Inputs

```json
"inputs": [
  { "name": "values", "label": "Numbers to sort", "type": "int-array", "minLength": 1, "maxLength": 12, "min": -99, "max": 99 },
  { "name": "target", "label": "Value to find",   "type": "int", "min": -99, "max": 99 },
  { "name": "text",   "label": "Text",            "type": "string", "maxLength": 16, "alphabet": "ab" }
]
```

`int-array` allows at most 16 values; `string` at most 24 characters, with an optional `alphabet`. The input passed to `trace` is an object keyed by `name`: `{ "values": [...], "target": 7 }`.

Graphs, trees and other structured inputs are **not** typed by students. Build them inside `trace.js`, and use an `int` input to let the student choose the start vertex, the key to insert, and so on (see the BFS sample). Several fixed graphs can be offered as presets by an `int` input such as `"graph"` (0, 1, 2).

---

## 2. `trace.js`

```js
function trace(input) {
  // compute the algorithm on `input` and record what happens
  return { init: { /* starting state for this kind */ }, steps: [ /* step objects */ ] };
}
```

- **Pure and deterministic.** No `Math.random`, `Date`, `require`/`import`, timers, `fetch`, DOM or global objects. The same input must always produce the same steps. It runs in a sandbox with `Math` (without `random`), `JSON`, `Array`, `Object`, `Map`, `Set`, `Number`, `String`, `Boolean`, `parseInt` and `parseFloat`.
- 1–3,000 steps. The **last step must be `{ "op": "done", … }`**.
- Implement the real algorithm. The trace must reach the same final answer as the topic's code example for the same input. `checks` prove it.

### 2.1 Fields on every step

| Field | Rule |
|---|---|
| `op` | one of the ops for the lab's kind (below), or `note` (narration only) or `done` (last step) |
| `note` | **required**: `{ "en": "…", "bn": "…" }`. `en` is 1–160 characters; `bn` is optional but wanted on the key steps. Explain **why**, not only what: "85 is bigger, so swap them", not "swap". |
| `line` | optional: the pseudocode line (1-based) that this step executes |
| `vars` | optional: up to 10 simple values shown in a variables panel, e.g. `{ "i": 2, "j": 3, "swaps": 4 }`. Values merge into the panel. |

**Tones** used by `mark`, `visit`, `edge` and `range`:
`active compare sorted found pivot min max discarded window visited current frontier done path considered tree rejected relaxed error`

### 2.2 Common ops (all kinds except where noted)

| op | fields | effect |
|---|---|---|
| `mark` | `targets: [...]`, `tone` | colour items (indices, node ids; grid uses `[r, c]` pairs) |
| `unmark` | `targets: [...]` | remove colour |
| `clear-marks` | | remove all colours |
| `pointer` | `name`, `target` (or `null` to remove) | a labelled arrow such as `i`, `j`, `low`, `mid`, `high`, `cur`, `head`, `top` |
| `list` | `name`, `items: [...]` (≤ 64) | a side panel showing a named list, such as `queue`, `stack`, `order`, `pq` or `output`. It replaces the panel's contents. |

---

## 3. Kinds: starting state, ops and checkable final state

### `array` (also `heap`, which is drawn as an array and as a tree at the same time)
- **init:** `{ "array": [values ≤ 64] }`
- **ops:**
  - `compare {i, j}`
  - `swap {i, j}`
  - `set {i, value}`
  - `insert {i, value}`, which shifts the elements right
  - `remove {i}`, which shifts them left
  - `range {from, to, tone}` to shade a sub-array (a search window, the left and right halves in merge sort)
  - `clear-ranges`
- **final state you can `expect`:** `array`, `marks`, `pointers`, `vars`, `lists`

### `linked-list`
- **init:** `{ "nodes": [{id, value}], "next": {id: id|null}, "prev": {…}, "head": id|null, "tail": id|null }`. Ids are short strings or integers.
- **ops:**
  - `create {id, value}`
  - `link {from, to|null, field: "next"|"prev"}`
  - `set-head {id|null}`, `set-tail {id|null}`
  - `set-value {id, value}`
  - `visit {id}`
  - `delete {id}`, which fails if any pointer, the head or the tail still refers to the node, so unlink it first, as in real C
- **final:** `values` (the values from head along `next`), `head`, `tail`, `next`, `prev`, `nodes`

### `stack`
- **init:** `{ "items": [bottom … top], "capacity": n (optional, ≤ 32) }`
- **ops:** `push {value}`, `pop`, `peek`
  - Pushing onto a full stack or popping an empty one is an error. Show overflow or underflow with a `note` step instead.
- **final:** `items`

### `queue`
- **init:** `{ "items": [front … rear], "capacity": n (optional) }`
- **ops:** `enqueue {value}`, `dequeue`, `enqueue-front {value}`, `dequeue-rear` (the last two for a deque), `peek`
- **final:** `items`
- A **circular queue** with front/rear indices is an `array` lab with `pointer` ops for `front` and `rear` (that's how it's listed in the curriculum).

### `tree` (binary trees, BST, AVL, expression and Huffman trees, tries)
- **init:** `{ "nodes": [{id, value}], "left": {}, "right": {}, "root": id|null }`
  - For tries and other multi-way trees, add `"multiway": true` and use `children`.
- **ops:**
  - `create {id, value}`
  - `set-child {parent, side: "left"|"right", child|null}`
  - `add-child {parent, child}` (multi-way only)
  - `set-root {id|null}`
  - `set-value {id, value}`
  - `visit {id}`
  - `compare {id, value}`
  - `delete {id}`, which must be unlinked first
- **Rotations:** write them as the real sequence of `set-child` and `set-root` steps, one note per pointer change, so students see each link move.
- **final:** `inorder` (values), `height`, `size`, `root`, `left`, `right`

### `graph`
- **init:** `{ "nodes": [{id, label ≤ 8 chars, x: 0–100, y: 0–100}], "edges": [{id, from, to, weight?}], "directed": bool }`
  - At most 26 nodes and 60 edges. Lay nodes out by hand so edges don't cross where avoidable.
- **ops:**
  - `visit {id, tone}`
  - `edge {id, tone}`: `considered`, `tree`, `relaxed`, `rejected` or `path`
  - `label {id, text}`: a badge on the node, for distances or discovery/finish times (`null` removes it)
  - `compare {a, b}`
  - `list {name, items}` for the queue, stack, priority queue or visit order
- **final:** `labels`, `nodeTones`, `edgeTones`, `lists`

### `grid` (DP tables, Floyd-Warshall, N-Queens boards, matrices)
- **init:** `{ "rows", "cols" (each ≤ 24), "cells": [[…]] (optional, default all null), "rowLabels": [...], "colLabels": [...] }`
- **ops:**
  - `set {r, c, value}`
  - `compare {a: [r, c], b: [r, c]}`
  - `arrow {r, c, dir: "up"|"left"|"diag"|null}`, the LCS-style arrows used to rebuild the answer
  - `mark {targets: [[r, c], …], tone}`, and `pointer {name, target: [r, c]}`
- **final:** `cells`, `arrows`, `marks`, `vars`

### `hash-table`
- **init:** `{ "size": 2–31, "method": "chaining"|"linear"|"quadratic"|"double", "buckets": optional }`
- **ops:**
  - `hash {key, index, formula}`, with the formula shown as text, e.g. `"47 mod 11 = 3"`
  - `probe {index}`
  - `insert {index, key}`. With open addressing, inserting into an occupied slot is an error, so `probe` first.
  - `remove {index, key}`. Open addressing leaves a tombstone, shown as `†`.
- **final:** `buckets`

---

## 4. What makes a good lab

- **It teaches.** Every step's note says why that step happens. A student who only reads the notes should understand the algorithm.
- **It matches the lesson:** the same pseudocode, variable names and conventions as the topic text and the C code example.
- **Presets show the interesting cases:** typical input, best case, worst case, and an edge case. For example: already sorted, reverse sorted, duplicates, a target that isn't found, a disconnected graph.
- **Sensible length:** aim for 20–200 steps on the presets. Group trivial moves into one step when it helps, but never skip a decision the algorithm makes.
- **Bangla:** the title is required; add `note.bn` to the key steps (compare, swap, the decision, the final result).
