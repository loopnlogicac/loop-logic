# Compiler Design — Batch 2

Package version: **0.2.0**. Schema version: **1.1**. Cumulative delivery: **21/36 topics**.

## Delivered scope

Batch 1 remains in curriculum order: `introduction` (three topics) and
`lexical-analysis` (eight topics). Its lesson files and implementations are unchanged.

Batch 2 adds the complete `syntax-analysis` module:

1. `cd-context-free-grammars`
2. `cd-left-recursion-factoring`
3. `cd-first-follow`
4. `cd-ll1-parsing`
5. `cd-recursive-descent`
6. `cd-shift-reduce`
7. `cd-lr0-slr`
8. `cd-clr-lalr`
9. `cd-operator-precedence`
10. `cd-bison`

All listed curriculum coverage points are addressed. The remaining 15 topics belong to
Batch 3 and are outside this delivery. No extra curriculum topics are proposed. All
changes are within `content-kit/compiler-design/content/`.

The ten new topics contain **18 runnable Python examples**, **49 practice problems**
(eight code problems with 36 input cases, plus 41 written problems with worked answers),
**107 quiz questions** (12 executed output questions), and **30 exam questions**. The four
implementation lessons and six theory topics follow their required section structures.
Every new body meets its intermediate or advanced word target. Titles, summaries, and key
points include Bangla. Full Bangla bodies are not included. Review status remains `draft`.
No matching Compiler Design video is present in the catalogue, so video lists remain empty.

## Worked content and implementation choices

- CFG: complete leftmost/rightmost derivations, a parse tree, ambiguous groupings,
  precedence versus associativity, and an epsilon-list derivation.
- Transformations: immediate recursion, ordered substitution for an indirect cycle,
  multiple bases/suffixes, repeated factoring, empty remainders, and language-preservation
  reasoning. Nullable-prefix cycles and recursion without a base are explicitly qualified.
- FIRST/FOLLOW: complete expression and nullable-prefix tables, fixed-point rounds through
  a cycle, and occurrence-by-occurrence FOLLOW contributions. Empty tuples represent epsilon.
- LL(1): the full expression table, selection explanations, complete accepted/rejected
  traces, and both FIRST/FIRST and FIRST/FOLLOW conflicts. Collisions retain all candidates.
- Recursive descent: a complete ASCII-integer scanner and expression/term/factor parser,
  left-fold subtraction, semicolon statements, and panic-mode recovery. Syntax failures
  discard the damaged statement; lexical failures occur before statement recovery.
- Shift-reduce: handles, reversed rightmost derivation, symbol and state stack traces,
  and runnable shift/reduce and reduce/reduce conflict detection.
- LR(0)/SLR: closure growth, every canonical item, every nonempty transition, complete
  ACTION/GOTO cells, accepted traces, and an epsilon/zero-pop example. A five-state grammar
  demonstrates an LR(0) reduce/reduce conflict resolved by SLR; a two-level expression
  grammar demonstrates an LR(0) shift/reduce conflict resolved by SLR.
- CLR/LALR: all ten CLR and seven merged LALR states for the two-group grammar, complete
  tables and traces, an explicit merge map, and a CLR-but-not-LALR counterexample. Its
  two new reduce/reduce cells are retained and explained.
- Operator precedence: FIRSTVT/LASTVT, every terminal relation, complete expression and
  parenthesis traces, and a runnable relation builder/recogniser. Its normalised N marker
  and omitted unit reductions apply only to the stated expression grammar.
- Bison: complete calculator `.y` and Flex `.l` listings, semantic-value handoff, declared
  precedence decisions, a manual value trace, build commands, and semicolon recovery.
  Listings use GNU Bison extensions and the ordinary non-reentrant C interface.

Python examples and practice solutions are standalone and use only the standard library.
The shared `parsing-models.py` and `precedence-model.py` expose the algorithms for additional
review; examples do not depend on importing those files. State discovery uses sorted
outgoing symbols. Set displays are sorted. The generic implementations assume well-formed
finite classroom grammars, with dictionary keys defining nonterminals and `$` reserved for
the parser. They retain table conflicts and refuse conflicted grammars during recognition.

The expression languages deliberately omit unary signs, division, identifiers with values,
and assignments. Numeric recursive descent uses Python integers; deeply nested expressions
can reach Python's recursion limit. Practice limits nesting below 100. Scanner columns count
characters, including tabs as one character. The smaller LL(1) and precedence recognisers
consume token kinds such as `id`, rather than the source scanner's numeric tokens.

## Verification

Tools actually used: **Python 3.12.14**, **Node.js v24.22.1**. Python implementations also
use syntax available in Python 3.10. New example, practice, and output-quiz output capture
performed **66 executions**: 18 examples, 36 practice cases, and 12 quiz programs. Every
`.out` file was captured from a real isolated UTF-8 run with warnings treated as errors.
The full checker independently reruns all cumulative examples, practice tests, and output
quizzes. It reports **0 errors and 0 warnings**; there are no warning exceptions.

Run these commands from `content-kit/`:

```bash
node tools/check.mjs compiler-design/content --report compiler-design/content/CHECK_REPORT.txt
python3 -I -X utf8 -W error compiler-design/content/shared/verify-parsing.py
python3 -I -X utf8 -W error compiler-design/content/shared/verify-models.py
```

`shared/verify-parsing.py` reads the published HTML tables. Its actual captured result is
`shared/verify-parsing.out`. It verifies the expression FIRST/FOLLOW values, nullable
occurrences, and cyclic propagation against independently stated expected sets. It compares
all **19,531** expression token streams of length zero through six against an independent
operand/operator and parenthesis oracle, the Python LL(1) recogniser, the published LL(1)
table, and the operator-precedence recogniser. It checks every displayed precedence cell.

For LR parsing, all **1,023** c/d words of length zero through nine are checked against the
independent two-group language condition in LR(0), SLR, CLR, LALR, and both published
CLR/LALR tables. The second published SLR expression table agrees with an independent
syntax oracle on **3,280** token streams. Further checks cover the five-state SLR table,
CLR/LALR conflict creation, nullable LR(1) lookahead propagation, and epsilon reductions.
Recursive descent is checked
against **1,625** independently calculated numeric cases, 14 malformed expressions, and
statement-recovery boundaries. All 26 new standalone Python source files parse cleanly.
Finite checks supplement the derivation and invariant explanations; they are not general
proofs of parser correctness for all grammars.

The unchanged Batch 1 `shared/verify-models.py` also passes: 1,023 automata words, quotient
transitions, simulator predicates, and 200 constructed lexer statements plus boundary cases.
Its existing captured output remains applicable.

Flex and Bison generation are **not claimed as executed**. As required by the brief, their
sources are presented as code listings, with manually derived tables and traces. Python
programs are the verified implementations. The Bison calculator uses double values, so its
text limits arithmetic to small finite values and notes floating-point rounding.

## Human review focus

- Bangla terminology and clarity for first-year students.
- Preservation of subtraction association after grammar rewriting.
- FOLLOW inheritance through nullable suffixes and repeated nonterminal occurrences.
- Stack orientation, reverse pushing, reduction lengths, zero-pop epsilon reductions,
  and complete input consumption.
- LR(1) closure's FIRST(suffix + parent lookahead), exact core equality, and the two
  reductions introduced by the CLR-to-LALR counterexample.
- FIRSTVT versus FIRST, terminal-boundary searches, and the expression-only N shortcut.
- GNU Bison/Flex interface names, precedence declaration order, semantic-value positions,
  and the distinction between syntax recovery and a completely error-free parse.
