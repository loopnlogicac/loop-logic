# Compiler Design — Batch 1

Package version: **0.1.0**. Schema version: **1.1**.

Delivered in curriculum order:

- `introduction`: `cd-introduction`, `cd-phases`, `cd-tools`.
- `lexical-analysis`: `cd-lexical-analysis`, `cd-regular-expressions`, `cd-finite-automata`,
  `cd-thompson-construction`, `cd-subset-construction`, `cd-dfa-minimization`,
  `cd-lexer-implementation`, `cd-flex`.

All 11 topics cover their curriculum points. Later modules are reserved for subsequent
batches. No extra curriculum topics are proposed. No curriculum files, tools, or other
tracks were changed.

## Content and language choices

Seven theory topics use worked explanations and tables, plus written practice with worked
answers. Four implementation lessons contain 14 complete Python examples and eight code
practice solutions with 20 input cases. Across the package there are 54 practice problems,
121 quiz questions (12 with executed Python code), and 34 exam questions.

English lessons meet their level's word target. Titles, summaries, and key points include
Bangla; full Bangla lesson bodies are not included. Review status remains `draft`.
No videos were linked because the video catalogue does not contain a matching Compiler
Design lesson. References point to official Python, GNU, Flex, and MIT material.

The common classroom language deliberately uses ASCII names and integer tokens.
Its hand-written lexer supports `let`, `print`, arithmetic punctuation, `==`, and `//`
comments. It reports unsupported characters and continues. It counts a tab as one
character column. A digit sequence next to a name, such as `12roll`, becomes two tokens;
rejecting that sequence as a statement belongs to the parser. The regex lesson separately
extends numeric spelling to decimals and exponents, with each extension stated explicitly.

The Flex `.l` description is shown as an escaped code block, as required by the brief.
Its rule-selection tables are manual worked derivations, not claimed Flex executions.
Flex generation and C compilation are not part of the Python implementation verification.
The illustrated target assembly in introductory topics is an imaginary teaching machine.

## Verification

Tools used: Python **3.12.14**, Node.js **v24.22.1**. Python implementations use only the
standard library and are compatible with Python 3.10 onward.

Every example, practice test, and output-quiz program was actually executed with isolated
UTF-8 Python. Source was parsed with warnings treated as errors. Every example and practice
`.out` file was captured from a real run, never entered as an expected result by hand.
The initial capture performed 46 program executions; the package checker independently
repeated the example, practice, and output-quiz checks.

Run from `content-kit/`:

```bash
node tools/check.mjs compiler-design/content --report compiler-design/content/CHECK_REPORT.txt
python3 -I -X utf8 -W error compiler-design/content/shared/verify-models.py
```

The required full check reports **0 errors and 0 warnings**. There are no remaining warning
exceptions. `CHECK_REPORT.txt` contains the actual report.

`shared/verify-models.py` is a reviewer utility, outside the student lessons. It reads the
published HTML tables, rather than keeping a second hand-copied transition model. It checks
all 1,023 words over `{a,b}` with length zero through nine against independent suffix
properties for the Thompson NFA, subset NFA/DFA, and original/minimised DFA. It also checks
every quotient transition against the original table, compares Python simulators with count
and suffix predicates, and tests 200 constructed lexer statements plus five boundary/error
cases. Its captured real output is `shared/verify-models.out`. These finite checks supplement
the invariant and distinguishing-suffix arguments; they are not a general equivalence proof.

## Human review focus

- Bangla terminology and classroom tone, especially automata and generator terminology.
- Thompson state numbering, epsilon edges, and fragment boundaries; the construction keeps
  distinct literal endpoints rather than merging concatenation states.
- Subset tables include all reachable sets; accepting-prefix traces test the complete word.
- Minimisation removes unreachable F before refinement and preserves final status.
- Flex length priority versus Python `re` ordered alternatives, and matched-text lifetime.
- The source-language restrictions, column convention, and distinction between lexical,
  syntactic, and semantic errors.
