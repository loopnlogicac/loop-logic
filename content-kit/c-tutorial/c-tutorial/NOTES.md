# Batch 1 review notes

Package version: 0.1.0. All content remains draft for Loop & Logic review.

## Delivered topics

The manifest follows curriculum order and includes only these two complete modules:

- getting-started: c-introduction, c-setup, c-first-program, c-program-structure,
  c-compilation-process, c-comments, c-errors-debugging-basics.
- basics: c-tokens-keywords, c-identifiers, c-variables, c-data-types,
  c-type-modifiers, c-constants-literals, c-printf, c-scanf,
  c-format-specifiers, c-escape-sequences, c-type-conversion.

There are 18 English lessons, with natural Bangla titles, summaries and five key
points per lesson. A full Bangla body is not included. Every lesson has five
practice problems (two easy, two medium, one hard), ten quiz questions including
three output questions, and four exam questions with answers and marking guidance.

## Verification and output provenance

Verification used gcc (Debian 14.2.0-19) 14.2.0 on 64-bit Linux and Node 24.22.1.
The baseline is C17. The explicitly marked C23 binary-literal example uses
`-std=c2x`, as required by the unchanged checker.

All 63 normal examples and all 90 practice reference solutions compiled with
`-Wall -Wextra -Wpedantic -Werror -O2`. Every one of the 248 `.out` files was
written from the program's actual stdout; none was authored as an expected result.
Practice solutions were run on all 185 supplied tests. All 54 output quiz programs
were compiled and run, and their correct options were checked against real output.

The other 18 examples are deliberate diagnostics: 12 must fail the build and six
must compile with warnings. They are labeled with `demonstrates` and have no
invented stdout files. Warning examples with unsafe calls are not executed.
The unresolved-definition example fails at linking, explicitly explained in its
lesson; the format's `compile-error` category covers this unsuccessful build.
The wrong-formula debugging example is defined arithmetic and is safely executed.

From `content-kit/c-tutorial/`, the required final command is:

```sh
node tools/check-tutorial.mjs c-tutorial --sanitize --report c-tutorial/CHECK_REPORT.txt
```

`CHECK_REPORT.txt` is the real report: 0 errors, 0 warnings. The check recompiles
and runs normal examples and practice tests with AddressSanitizer and UBSan,
in addition to the normal builds; it also verifies all output quiz answers.
The checker and all original kit files are unchanged. Executables, authoring
scripts and intermediate build files were kept outside the repository.

## Curriculum coverage

No requested curriculum point was omitted. The body sections and examples cover:

| Topic | Coverage for reviewers |
| --- | --- |
| c-introduction | Current systems/embedded/compiler uses; Ritchie, UNIX and K&R; C89/C90 through C23; learning value, speed and memory obligations. |
| c-setup | MinGW-w64, Ubuntu and macOS tools; Code::Blocks and VS Code; terminal builds and launch paths; online compilers and limits; version and C17 selection. |
| c-first-program | Header, main, printf and success return; source-to-run workflow; semicolon, quotes and case errors. |
| c-program-structure | Documentation, directives, file scope, main and helpers; declaration order; statements, braces and whitespace; complete annotated seats example. |
| c-compilation-process | Four stages and -E/-S/-c commands; objects versus executables; compile/link/runtime and logic failures; warning options. |
| c-comments | Both comment forms, useful reasons and contracts, disabling code, nesting traps and documentation conventions. |
| c-errors-debugging-basics | Syntax, semantic/constraint, runtime and logic errors; diagnostic locations; printf traces; gdb break/run/next/print; wrong-output checklist. |
| c-tokens-keywords | Six teaching groups with formal punctuator caveat; all 44 C17 keywords and C23 additions; keyword versus identifier and macro. |
| c-identifiers | Portable spelling subset, case sensitivity, leading-underscore reservations, snake_case and legality table. |
| c-variables | Declaration/definition/initialization, multiple declarators, indeterminate locals, automatic versus static duration and stack caveat, C89/C99 declaration placement. |
| c-data-types | char/int/float/double/_Bool/bool; typical sizes and ranges; sizeof/%zu; range versus precision; binary decimal approximation. |
| c-type-modifiers | Signed/unsigned and width families; limits.h/float.h; unsigned wrap versus signed-overflow UB; stdint.h availability and inttypes.h formats. |
| c-constants-literals | const/macro/enum distinction; decimal/octal/hex/C23 binary; suffixes; character versus terminated string literals. |
| c-printf | Typed conversions and return count; width/precision/flags; percent/newlines; puts/putchar and their contracts. |
| c-scanf | Addresses and destination types; float/double/character/word input; whitespace, assignment counts, bounded strings and fflush(stdin) portability. |
| c-format-specifiers | Input/output tables, required integer/floating/text/pointer/base/size groups, extra length families, mismatch risks and group examples. |
| c-escape-sequences | All requested escapes, octal/hex consumption, null versus digit, special-character output and terminal rendering caveats. |
| c-type-conversion | Promotions, rank/signedness/representability rules, casts, integer/floating division, truncation and lost information. |

## Pedagogy and input domains

Early practice tasks use a small checked-input scaffold to permit distinct test
inputs and boundaries before the full scanf lesson. The lessons define its
address, condition and arithmetic notation and link the later curriculum topics.
Helpers, arrays, pointers and other forward references receive short explanations
and curriculum links. The fixed-width byte task explains its combined condition.
Difficulty labels are relative to the material available at this point.

Input domains in statements are deliberate preconditions. Programs do not all
implement full domain validation. The scanf lesson includes malformed tokens and
partial assignments, explaining why a successful assignment count does not make
arbitrarily large numeric text safe. Later line-based parsing belongs in the
existing string-input and error-handling curriculum.

Tests include zero, negative readings, equal limits, maximum word width, unsigned
wrap, partial input, failed matching and fractional results where relevant.

## Human review and implementation facts

- Check the Bangla wording and PPS/SPL marking expectations before publication.
- The Windows, macOS, Code::Blocks and VS Code instructions are editorial setup
  guidance. This Linux session verified GCC builds; it did not run those operating
  systems' installers. The gdb walkthrough is documented but gdb is not installed
  in this verification environment, so the interactive walkthrough was not run.
- Sizes, limits and the exact 0.1 + 0.2 display describe this GCC/64-bit Linux
  implementation with eight-bit bytes and common binary floating representation.
  They are labeled as observed or typical, not universal language guarantees.
- The UINT_MAX practice fixture `4294967295` targets this host's 32-bit unsigned
  int. Regenerate that fixture if verifying on a different-width target.
- Exact-width typedefs are optional. This host provides uint8_t and int32_t.
- Octal/hex character-value output assumes the recorded ASCII-compatible host.
  Tabs remain actual tab characters in output files; visual tab stops vary.
- The pointer example's `.out` is one actual captured address. It is marked
  `deterministic: false` with an output note; addresses and %p spelling vary.
  No fixed address appears as a quiz answer.
- C23 feature availability depends on compiler support. Only the binary-literal
  example requires C23 mode; C17 remains the normal build baseline.
- Video links use only clearly matching titles in the supplied video catalog.
  Unclear matches were left empty. External references use approved hosts.
- Links to later curriculum topics are intentional and may not resolve in a
  Batch-1-only viewer until the later batches are imported.

## Remaining warnings and suggestions

No checker warnings remain. No extra topic IDs are proposed; the existing
curriculum already provides places for deeper memory, conversion and input work.
The cumulative archive is named `c-tutorial-v0.1.0.zip` and is generated outside
the repository so that this change adds only the requested `c-tutorial/` folder.
