# Compiler Design — Bangla edition, part 1

Package **0.3.1**, schema **1.1**, cumulative delivery **36/36 topics**.
Review status remains `draft` for all topics.

## Bangla edition, part 1

Full `body.bn.html` lessons now accompany all **11 topics** in `introduction` and
`lexical-analysis`: `cd-introduction`, `cd-phases`, `cd-tools`, `cd-lexical-analysis`,
`cd-regular-expressions`, `cd-finite-automata`, `cd-thompson-construction`,
`cd-subset-construction`, `cd-dfa-minimization`, `cd-lexer-implementation`, and `cd-flex`.

The lessons follow `BANGLA_STYLE.md` and Task 2 section 1.6: everyday Bangla, তুমি
for the reader, and consistent common terms such as কম্পাইলার, টোকেন, লেক্সার,
অটোমাটা, and ইনস্ট্রাকশন. Worked tables, traces, explanations, cautions, and links
are included throughout. Code, regular expressions, grammar symbols, state labels,
and diagrams retain their English notation. Every HTML tag and attribute matches
the corresponding English lesson, including the same ordered `<h2>` IDs and example
placeholders. All inline code and complete `<pre>` blocks match exactly.

English lessons, metadata text, examples, practice, quizzes, and their expected
outputs are unchanged. The remaining 25 topics keep their earlier partial Bangla
coverage, so the manifest still lists `bn-partial`.

Validation from `content-kit/`:

```bash
node tools/check.mjs compiler-design/content --report compiler-design/content/CHECK_REPORT.txt
```

Result: **0 errors, 0 warnings; READY FOR IMPORT** across all 36 topics, using
Node.js **v24.22.1** and Python **3.12.14**. An additional comparison of all 11
language pairs verified identical HTML structure, attributes, section order, code,
diagrams, and placeholders. Human review should focus on natural Bangla phrasing
and the meaning of the automata constructions, lexical boundaries, and Flex rules.

## Earlier Batch 3 delivery

## Delivered scope

The earlier 21 topics remain in curriculum order. This batch completes all remaining
modules and their 15 topics:

- `semantic-analysis`: `cd-syntax-directed-translation`, `cd-type-checking`, `cd-symbol-table`.
- `intermediate-code`: `cd-three-address-code`, `cd-syntax-trees-dag`,
  `cd-control-flow-translation`.
- `runtime-codegen`: `cd-runtime-environment`, `cd-basic-blocks`, `cd-code-optimization`,
  `cd-data-flow-analysis`, `cd-code-generation`, `cd-peephole-optimization`.
- `practice-exam`: `cd-exam-questions`, `cd-mini-project-calculator`,
  `cd-interview-questions`.

All curriculum coverage points are addressed. There are no deferred topics or proposed
extra topics. Changes are confined to `content-kit/compiler-design/content/`.

The new material contains **17 runnable Python examples**, **60 practice problems**
(9 code problems with 45 input cases, plus 51 written problems with worked answers),
**162 quiz questions** (22 executed output questions), and **88 exam questions**.
The interview question bank contains exactly **40 short questions with answers**, both
in its body and in its exam-question records. The numerical exam bank includes complete
FIRST/FOLLOW, LL(1), LR(0)/SLR, epsilon-NFA/DFA, TAC and branch tables and parse traces.
Every new lesson/theory body meets its level's word target. Counts vary with topic kind.

Bangla titles, summaries and key points follow `BANGLA_STYLE.md`. Four earlier topics had
new style warnings: `cd-introduction` and `cd-tools` used নির্দেশনা for instruction;
`cd-context-free-grammars` and `cd-ll1-parsing` used প্রতীক for symbol. Those uses now read
ইনস্ট্রাকশন and সিম্বল. Earlier English bodies and programs are unchanged. Full Bangla
bodies were not added in Batch 3. The video catalogue has no matching Compiler
Design videos, so video lists are empty.

## Worked content and boundaries

- Attribute rules cover synthesised/inherited information, S/L attribution, a complete
  annotated parse tree, dependency schedules, later-sibling restrictions and cycles.
- The type checker uses an explicitly defined source language with `int`, `real`, `bool`
  and structural array types. Boolean literals are kept separate from Python integers.
  It checks numeric expressions, comparisons, index types and assignment conversions.
  Function signatures and constant/runtime bounds are taught with worked tables; the
  small executable model does not implement function calls or runtime bounds checking.
- Nested dictionaries implement lexical block scopes, shadowing, same-scope duplicate
  rejection and global-scope protection. Entries use per-scope slots, not machine byte
  addresses. Runtime closures and separate function-defining environments are explained
  rather than implemented by the block-scope demonstration.
- TAC generation walks an AST in postorder and reserves all referenced source names
  before allocating temporaries. Quadruples, triples, indirect triples, unary operations,
  repeated expressions and stable references are worked explicitly. The generator does
  not perform common-subexpression elimination.
- DAG/value-number tables track operand versions across assignment and discuss aliases,
  calls, volatile reads, liveness and arithmetic restrictions.
- Backpatching tables show true/false/next lists, short-circuit AND/OR/NOT, a complete
  if-else, a while loop and sequential continuation. Instruction indices are zero-based.
- Basic blocks retain unreachable instructions during initial partitioning. Targets and
  instructions after `if`, `goto` and `return` become leaders. Conditional successors are
  deduplicated; unconditional jumps and returns do not gain invented fallthrough edges.
  Branch targets must name existing instructions; an explicit return can represent exit.
- Optimisation tables distinguish folding from propagation, sharing from dead results,
  safe hoisting from speculative traps, and induction strength reduction from guaranteed
  machine speedups. Peephole rewrites preserve relevant memory, aliases, flags and labels.
- Data-flow tables contain every GEN/KILL and USE/DEF set, every synchronous round through
  stability, and forward/backward equations. A diamond and a self-loop show joins and
  back-edge propagation. Boundary conditions and the imprecision of may analysis are explicit.
- Code generation uses a stated two-register, mathematical-integer teaching target.
  Tables cover instruction selection, descriptors, interference and a real spill.
  Memory-operand arithmetic is a property of this target, not a claim about every ISA.
- The calculator combines a positioned lexer, recursive-descent parser, AST, evaluator
  and TAC generator. It requires complete input consumption and demonstrates lexical,
  syntax and unknown-name errors. Extension guidance covers division, assignments and
  typed conversions without claiming those features are already implemented.

The arithmetic language supports ASCII integer literals and identifiers, whitespace,
parentheses, unary minus, addition, subtraction and multiplication. Python integers avoid
machine overflow in the executable arithmetic examples. Practical inputs are bounded in
each problem; recursive traversal is not intended for arbitrarily deep inputs. Tabs count
as one source character for columns. Calculator identifiers need explicit value bindings.
TAC expression outputs are intermediate code, not native executable machine code.

The four new `shared/*-model.py` files expose the same standard-library implementations
embedded in standalone examples and solutions. No lesson depends on importing a shared
file. The verifier checks that all 26 new standalone programs retain their model prefix,
so the checked algorithm and displayed program cannot silently diverge.

## Verification

Tools actually used: **Python 3.12.14**, **Node.js v24.22.1**. Implementations use syntax
available in Python 3.10 and later. The **84 new executions** used to capture and verify
outputs comprise 17 examples, 45 practice inputs and 22 output-quiz programs. All `.out`
files were captured from real isolated UTF-8 executions with warnings treated as errors.
The full checker independently reruns every cumulative example, practice test and output
quiz. Final result: **0 errors, 0 warnings; READY FOR IMPORT**. No warning exceptions.

Run from `content-kit/`:

```bash
node tools/check.mjs compiler-design/content --report compiler-design/content/CHECK_REPORT.txt
python3 -I -X utf8 -W error compiler-design/content/shared/verify-batch3.py
python3 -I -X utf8 -W error compiler-design/content/shared/verify-parsing.py
python3 -I -X utf8 -W error compiler-design/content/shared/verify-models.py
```

`shared/verify-batch3.out` captures the successful new verification. It checks:

- **3,618** expression/environment combinations against an independently parsed Python
  AST oracle and an independent TAC interpreter; annotation values, temporary freshness,
  invalid expressions, unknown names and source positions are also checked.
- Scalar typing/conversion matrices, Boolean separation, array-index types and structural
  array equality; **2,000** scope operations against a separate reference environment.
- **10,552** exhaustive instruction lists of length one through four, verifying partition
  membership, leaders, single-entry/straight-line interiors and exact successors, plus
  empty input and invalid operations/targets.
- Every published diamond/loop data-flow iteration cell and local set using a generic
  synchronous solver, including both entry and exit stability.
- Published backpatching code on **1,296** if-else cases and **81** while cases; the published
  target instruction and spill tables on **1,354** arithmetic input combinations.
- Exam FIRST/FOLLOW sets, complete LR item sets and transitions, and **511** token words
  against the published LL(1), SLR and DFA tables and independent language predicates.
- Syntax and model consistency for all **26** new standalone Python programs.

Earlier automata/lexer and parsing checks also pass. The parsing verifier's version
guard now accepts cumulative versions at or above 0.2.0; its algorithm checks are unchanged.
Their existing capture files remain applicable. Flex/Bison generation from earlier topics is
not claimed as executed; those sources remain explanatory listings as required by the
brief. Finite verification supplements the explanations and invariants; it is not a proof
for every possible program, grammar, target machine or arithmetic semantics.

## Human review focus

- Natural Bangla terminology, including the four earlier warning repairs.
- Inherited-attribute dependencies and the distinction between S-attributed and L-attributed rules.
- Source type rules versus Python's own Boolean/integer behaviour, and type checks versus bounds checks.
- Temporary freshness, subtraction association and stable triple references.
- Pending jump lists, short-circuit paths and zero-iteration loop safety.
- Data-flow boundaries, local USE/DEF order and simultaneous iteration conventions.
- Value liveness, descriptor validity, target operand forms and spill preservation.
- Alias, flag, volatile and floating-point preconditions on optimisation examples.
