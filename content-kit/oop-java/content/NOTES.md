# OOP (Java) — Batch 3, final delivery

Package version: 0.3.0. Format: 1.1. Track: oop-java.

The cumulative package delivers all 41 curriculum topics. This delivery adds all 14 topics in advanced-java, gui and practice-exam, while retaining the earlier 27 topics. The manifest follows the complete curriculum order, including advanced-java before design. No curriculum points or scheduled topics are omitted.

## Added coverage and review focus

| Topic | Coverage and reviewer focus |
| --- | --- |
| oop-exceptions | try/catch/finally, checked and unchecked families, throw versus throws, a custom checked exception with serialVersionUID, automatic resource closure and suppressed failures. |
| oop-generics | Generic classes and methods, Number bounds, invariance, producer/consumer wildcards, capture, erasure and runtime restrictions. |
| oop-collections | ArrayList/LinkedList, HashSet/TreeSet, HashMap/TreeMap, iteration, duplicate policies, implementation costs, mutable keys and ordered display. |
| oop-comparable-comparator | Natural order, external lambda comparators, safe numeric comparisons, descending marks with ascending roll ties, stability and comparison contracts. |
| oop-inner-classes | Static nested and inner classes, enclosing instances, local capture, anonymous objects, this versus Outer.this, scope and lifetime choices. |
| oop-lambdas-streams | Functional interfaces, lambdas and method references, lazy filter/map pipelines, reduce/collect, primitive sums, empty results and mutable versus unmodifiable lists. |
| oop-enums-records | Enum fields/methods and switching, exact valueOf names, explicit persistence codes, Java 16 records, compact validation and defensive copies. |
| oop-file-io | UTF-8 text round trips, BufferedReader/BufferedWriter and Files, IOException handling, temporary-file cleanup, line formats and full-load validation. |
| oop-multithreading | Runnable/Thread, start versus run, join/sleep, interruption, synchronized shared state, lost-update traces and Java 17 executor/future lifecycle. |
| oop-swing-basics | JFrame/JPanel/JLabel/JButton/JTextField, nested layout managers, pack, EDT construction/updates, background-work guidance and accessible form labels. |
| oop-event-handling | ActionListener classes and lambdas, a bounded integer calculator, parsing failures, duplicate registration and model-view separation. |
| oop-exam-questions | Twelve worked midterm/final questions, five complete inheritance/polymorphism traces, code plans and contract-based design answers. |
| oop-mini-project-library | Complete line-oriented menu, LibraryItem inheritance and Loanable interface, TreeMap inventory, explicit UTF-8 save/load, validated replacement and failed-load preservation. |
| oop-interview-questions | Exactly fifty short questions with answers on the pillars, Java-specific rules and design, plus five follow-up executable traces. |

## Bangla revision

- Re-read BANGLA_STYLE.md and used natural চলিত Bangla in all new titles, summaries and key points. Common technical terms use Bangla script; code identifiers remain in English.
- Fixed the previous final-keyword warning by rewriting the inherited-final-method explanation with ইনহেরিট্যান্স. The package uses ক্লাস and অবজেক্ট consistently.
- Updated earlier summaries and instructional key points to use the guide's তুমি address, including করো, বোঝো, দাও and চিনে নাও. No earlier English lesson bodies or Java programs were changed.
- Full lesson bodies remain English, with bilingual metadata and key points. No full Bangla bodies or video mappings were added.

## Verification for version 0.3.0

- Actual tools: Eclipse Temurin OpenJDK 17.0.21.1+2, javac 17.0.21.1 and Node.js v24.22.1. The JDK and authoring/audit utilities live under /tmp, outside the repository.
- Independently compiled every one of the cumulative 380 program entries using `javac --release 17 -encoding UTF-8 -Xlint:all -Werror`, with no lint exclusions or warning suppressions. Each program was copied to an isolated Main.java before compilation. This independently checks the serial warning that the kit runner disables internally.
- New content has 51 examples, 23 executable practice solutions and 44 output-quiz programs: 118 program entries. Six Swing examples are compile-only and each has a specific outputNote. All other entries were executed, including deterministic thread programs that join workers or await futures before reporting results.
- All 45 new runnable example outputs and all 53 new practice outputs were generated from real runs. Correct output-quiz options also came from execution. A separate calculation audit checked all 53 practice cases against their stated numeric, collection and menu-state rules.
- The new topics contain 47 practice problems, 156 quiz questions and 98 worked exam/interview answers. The cumulative package contains 162 practice problems, 455 quiz questions and 180 worked exam/interview answers.
- The exact full command was run from content-kit with the temporary JDK on PATH: `node tools/check.mjs oop-java/content --report oop-java/content/CHECK_REPORT.txt`. The saved report covers 41/41 topics with 0 errors and 0 warnings.
- New lesson bodies meet their intermediate or advanced word targets. The package has no HTML, repeated-sentence, repeated-prompt, Bangla-script or Bangla-style findings. Every new reference URL returned HTTP 200.
- The name-model fixture gui/oop-swing-basics/practice/p-1.t2.in intentionally has surrounding spaces, including trailing spaces, to verify trimming. This is input data, not source formatting.
- A file audit found no unreferenced or missing sources, inputs or outputs, and no CRLF files. All complete programs have one Main entry point, with supporting types in the same file. No new package declarations or wildcard imports were added.

## Boundaries and reviewer checks

- GUI examples are compiled only, as required. Their outputNote fields describe desktop controls, interactions, resizing and validation to inspect. A human reviewer should perform these visual checks on a graphical desktop; no successful window run is claimed here. Console practices and output quizzes exercise plain models rather than constructing Swing windows.
- Thread examples are bounded and deterministic at their reporting boundary. No exercise depends on an unsynchronized race failing on demand. Java 17 ExecutorService uses explicit shutdown; virtual threads and newer closeable-executor syntax are not used.
- File examples own and remove their temporary files. The library application deliberately keeps library.tsv after Save, resolves it against the working directory, and accepts an optional path argument. It does not automatically save or load. Menu instructions specify line consumption, numeric bounds, title restrictions and incomplete-command behaviour.
- The library writes a temporary sibling file before replacement but does not claim a guaranteed atomic move or crash durability. It is a single-user, in-memory learning application; multi-process coordination, authentication, lending limits and databases need separate designs.
- Library loading validates every row, status and unique id before committing the new inventory. An executed duplicate-id example proves that failure preserves the old library. Practice sessions cover missing storage, empty saved snapshots, duplicate adds, missing ids, repeated borrowing and restoring saved loan state.
- The small Student examples demonstrate roll-based natural ordering for list sorting and require unique rolls within their input. They retain identity-based equals; the lesson explicitly warns that their natural order is not consistent with equals for separate objects sharing a roll. Do not reuse this teaching type as a TreeSet key without defining the intended equality policy.
- Human reviewers should check wildcard read/write explanations, comparator tie directions, inner-object retention, record shallow immutability, resource suppression, interruption/visibility claims and natural Bangla phrasing. Review status remains draft for editorial review.
- Remaining warnings: none. Omitted curriculum points: none. Suggested additional topic IDs: none.

---

The records below preserve the earlier deliveries. Their tool versions, counts and future-topic statements apply to those earlier package versions.

# Batch 2 record — version 0.2.0

Package version: 0.2.0. Format: 1.1. Track: oop-java.

The cumulative package now delivers 27 of 41 topics. This addition contains all eight inheritance-polymorphism topics and all three design topics, in curriculum order. The previous 16 topics remain included. Every covers point in the two new modules is addressed. The remaining 14 topics are the scheduled advanced-java, gui and practice-exam modules; none of their content is claimed here.

## New coverage

| Topic | Coverage and reviewer focus |
| --- | --- |
| oop-inheritance | extends and behavioural is-a, superclass constructor and method calls, single/multilevel/hierarchical shapes, one class superclass, Java 17 constructor ordering and sealed-class release note. |
| oop-method-overriding | Signature/access/return/exception rules, @Override, explicit super calls, covariant reference returns, static hiding, package-private cross-package caveat, comparison with overloading. |
| oop-polymorphism | Dynamic dispatch, signature selection before runtime overriding, upcast identity, guarded downcasts, ClassCastException versus null, Java 16 instanceof patterns, null overload ambiguity, fields versus methods. |
| oop-abstract-classes | Abstract methods, partial stateful implementation, concrete completion, constructors, final template workflow with hooks, side effects and constructor-dispatch hazards. |
| oop-interfaces | Multiple capabilities, public implementations, default conflicts and class precedence, static helper ownership, functional-interface preview, class/interface comparison, Java 8/9 release notes. |
| oop-final-keyword | Variables/methods/classes, blank final assignment, effectively final capture, lambda preview, constant variables, immutable values and defensive array copies. |
| oop-object-class | toString, equals(Object), hashCode contracts, exact getClass versus instanceof, full immutable equality implementation, a real String hash collision, mutable-key and inheritance hazards. |
| oop-composition | has-a versus is-a, delegation, policy replacement, separate and shared components, encapsulation, broad Java composition versus exclusive UML composition. |
| oop-uml-class-diagrams | Required theory structure, attributes/operations/visibility, association, shared aggregation, composition, inheritance/realization, both multiplicity ends, code translation and constraint enforcement. |
| oop-solid-principles | All five principles with concrete flawed and repaired code, precondition/postcondition substitution reasoning, injection versus inversion, UML dependency direction, exam/interview reasoning and abstraction costs. |
| oop-design-patterns | Singleton, simple Factory and Factory Method distinction, Strategy, Observer; each problem/solution/consequence; library examples; class-loader scope, synchronous ordering, unsubscribe/failure/reentrancy policies. |

## Verification for version 0.2.0

- Actual tools: Eclipse Temurin OpenJDK 21.0.13.1+2, javac 21.0.13.1 and Node.js v24.22.1. The JDK was installed in a temporary directory, outside the repository.
- All 92 newly authored complete programs compiled separately with `javac --release 17 -encoding UTF-8 -Xlint:all -Werror`: 41 examples, 20 code-practice solutions and 31 embedded output-quiz programs. Each was copied to an isolated Main.java and executed as Main.
- A separate cumulative pass compiled all 262 program entries with `javac --release 17 -encoding UTF-8 -Xlint:all -Werror`, with zero failures and no lint exclusions. This confirms the requested flags independently of the kit checker, which internally adds `-Xlint:-serial`.
- Every new example output and all 54 code-practice outputs were generated from actual runs. The output-quiz correct options also came from actual runs.
- A separate calculation audit checked all 54 practice results against the problem statements, including zero/empty input, thresholds, upper bounds, independently owned components, no-event observer state, odd-price integer division and hash collisions.
- The new topics contain 46 practice problems: 20 executable and 26 written with worked answers. The UML theory topic has four written design exercises. Other topics combine two code exercises with design/contract exercises; SOLID and patterns have five practices each.
- There are 114 new quiz questions, including 31 independently executable output traces. Correct answer positions vary. The cumulative package contains 299 quiz questions and 262 complete program entries.
- The content check was run from content-kit using `node tools/check.mjs oop-java/content --report oop-java/content/CHECK_REPORT.txt`, with the temporary JDK bin directory on PATH. The report covers all 27 topics and records 0 errors and 0 warnings.
- All new lessons meet their curriculum word ranges. The final format/writing check reports no repeated-sentence, repeated-prompt, Bangla-script, section-order or HTML errors.
- An asset audit confirmed every new source/input/output file is referenced, uses LF, and follows the one-file Main rule. No package declarations, wildcard imports, warning suppressions, dependency requirements or compile-only skips were added.
- Reference URLs are approved Oracle Java 17 API/JLS pages and dev.java learning pages. Their HTTP responses were checked. Language claims can be checked against the cited JLS sections and Object API contracts.

## Deliberate boundaries and reviewer checks

- Text and code are original. Full lesson bodies are English; all new titles, summaries and key points have Bangla translations. Full Bangla bodies and video links were not added.
- Design diagrams use pre.diagram text notation with explicit keys for hollow triangles and diamonds. Human review should confirm diagram readability, both multiplicity ends and natural Bangla phrasing.
- Theory uses written exercises where model reasoning is the goal. Code-practice problems state precise bounded input/output formats and include edge cases. General malformed-input recovery is left to the scheduled exceptions lesson.
- Supporting classes stay in the same file without public. Each complete program has class Main and public static void main(String[] args). Prose fragments illustrate members or declarations rather than claiming to be separate runnable programs.
- The final-keyword lesson briefly defines lambdas and IntUnaryOperator to show effective-final capture, linking its prerequisite functional-interface preview. Full lambda and stream teaching remains in advanced-java.
- SOLID deliberately includes flawed designs that compile cleanly. The invalid read-only write operation is shown but never invoked. Its behavioural contract violation is explained directly, and repaired capability code runs normally.
- Value examples assume documented non-null constructor strings. Course is final, so instanceof-based equality cannot become asymmetric through a subclass. Equal hash results are explicitly distinguished from equality, including Aa/BB collisions.
- Observer examples are intentionally bounded and synchronous. Their current registration limits, ordering and no-registration-change assumption are stated. Unsubscription, callback failures, retention and reentrant events are discussed as policies required in a larger implementation.
- Singleton guarantees are limited to access through one loaded class. The prose does not claim mutable-state thread safety, one instance across JVMs, or immunity to reflection/serialization. Factory-style creation is distinguished from the full Factory Method pattern.
- Human reviewers should double-check the Java 17 superclass-constructor rule, two-stage overload/override traces, protected/package access caveats, equals/hashCode semantics, exclusive ownership versus garbage collection, and the behavioural examples for LSP.
- Remaining warnings: none. Omitted new-module curriculum points: none. Suggested additional topic IDs: none. Review status remains draft for editorial review.

---

The following record preserves the prior delivery's coverage and verification history. Its version-specific counts and future-topic statements describe version 0.1.0.

# Batch 1 record — version 0.1.0

Package version: 0.1.0. Format: 1.1. Track: oop-java.

This package delivers all 16 topics from java-basics and classes-objects, in curriculum order. The remaining 25 topics belong to later batches. No curriculum point from these two modules was omitted. Full English lessons are included; titles, summaries and key points also have Bangla translations. Full Bangla lesson bodies are not included.

## Contents and coverage

| Topic | Coverage and reviewer focus |
| --- | --- |
| oop-introduction | Procedural and object-oriented thinking; class, object, identity, state and behaviour; four-pillar comparison; Java's role. This is the curriculum's theory topic, with four worked written exercises. |
| oop-java-setup | JDK/JRE/JVM, installing a suitable JDK, PATH and terminal compilation, bytecode portability, IntelliJ IDEA/VS Code/NetBeans configuration. |
| oop-java-syntax-types | All primitive types, C comparisons, boolean conditions, casts, overflow, final, Java 10 local var inference. |
| oop-java-control-flow | if, switch statements and expressions, for/while/do-while, enhanced for, yield, labelled break, empty ranges. |
| oop-java-methods | Static declaration/calls, primitive and reference value passing, overload selection, recursive factorial and digit sum with bounds. |
| oop-java-arrays | Array objects, length and defaults, rectangular and jagged allocation, Arrays.toString/sort, checked bounds and ArrayIndexOutOfBoundsException. |
| oop-java-strings | Immutable strings, methods and half-open substrings, identity versus equals, interning, StringBuilder, UTF-16 and ASCII-only reversal limits. |
| oop-java-input-output | Scanner tokens/lines and newline handling, printf/String.format with fixed locale, EOF loops, BufferedReader and parsing. |
| oop-classes-objects | Fields and instance methods, new, independent instances and aliases, Student UML and memory diagrams. |
| oop-constructors | Compiler-provided default versus explicit no-argument constructors, parameterised overloads, this and this(...), initialization traces and Java 17 ordering. |
| oop-access-modifiers | All four access levels, visibility table, private top-level nest access, protected subclass receiver restriction, private field rationale. |
| oop-encapsulation | Validated getters/setters, invariant preservation, meaningful domain operations, immutable classes, information hiding and defensive copies. |
| oop-static-members | Static fields/methods/blocks, instance-versus-static table, creation counter versus live-object count, utility class construction, constant-inlining exception. |
| oop-object-references | Aliasing diagrams, null and NullPointerException, identity versus class-defined equals, mutation versus parameter reassignment, shallow copies and reachability. |
| oop-packages | Package declarations and source/output folder layout, normal/fully-qualified/static imports, classpath roots, compile/run commands and name conflicts. |
| oop-wrapper-classes | Eight wrapper pairs, boxing/unboxing, null extraction, guaranteed small constant boxing identity, larger-value caching limits, parseInt/valueOf and parsing failures. |

## Verification

- Actual toolchain: Eclipse Temurin OpenJDK 21.0.13.1+2, javac 21.0.13.1, Node.js v24.22.1 (see manifest and report for recorded versions).
- All 170 distinct complete programs were compiled separately using `javac --release 17 -encoding UTF-8 -Xlint:all -Werror`, without suppressing any lint category. Each source was copied into an isolated temporary directory as Main.java and launched as Main.
- The programs comprise 64 examples, 61 code-practice reference solutions and 45 embedded output-quiz programs. The eight written practice problems have worked answers.
- Every example and practice .out was written from its actual process output. The 61 solutions were run on all 134 practice inputs, including empty/zero cases, thresholds, rejected changes, full capacity, and maximum stated factorial and square values.
- Output quiz answer text came from real runs. All options and the final checker replay were checked against those results.
- Every source is a single file containing class Main and the traditional public static void main(String[] args). Supporting top-level classes are not public. There are no package declarations, wildcard imports, external dependencies, runtime-only skips, intentional compiler failures or nondeterministic output examples.
- Run from content-kit with the JDK bin directory on PATH: `node tools/check.mjs oop-java/content --report oop-java/content/CHECK_REPORT.txt`.
- CHECK_REPORT.txt records the final full compile/run check. Remaining warnings: none.
- The final set has 185 quiz questions. A separate asset audit confirmed all 461 source/input/output assets are referenced and use LF line endings.
- Temporary compiler fixtures verified the written named-package output layout and qualified launch command, and confirmed that cross-package protected access accepts a Child receiver but rejects an arbitrary Parent receiver. These fixtures are not part of the content package.
- Two data lines intentionally contain trailing whitespace: the empty-course output preserves the space after `Course:`, and the buffered-input test includes a spaces-only line. These are real output and meaningful blank-input data; do not trim them as source formatting.
- All 15 distinct reference URLs were reachable when reviewed. They point to approved Java learning, API or language-specification documentation.

## Review boundaries and deliberate choices

- The one-file Java rule and the packages curriculum are reconciled by teaching project package declarations as short non-runnable fragments, source/output diagrams, terminal commands and a worked written exercise. Runnable demonstrations stay in the unnamed package and use real library imports. Cross-package protected rules are taught through the visibility table and prose, since a single unnamed-package file cannot establish a cross-package access context.
- All complete programs compile cleanly. Compiler and runtime mistakes are explained in prose instead of shipping intentionally failing programs. Bounds and null examples demonstrate safe guards. The text names the exceptions that an unguarded access would raise.
- Introductory fields are deliberately visible to make object state and aliases concrete. The following access and encapsulation lessons replace that approach with private fields and controlled operations.
- The input exercises use bounded, documented input. General recovery from malformed tokens and I/O failures is deferred to the exception topic; the BufferedReader introduction explains its throws IOException preview.
- A few early exercises need Scanner or simple arrays before their dedicated lesson. Their body text defines the necessary operation briefly and links forward. Constructor traces explain the superclass concept and link to inheritance before using that vocabulary.
- Wrapper output never assumes that Integer values outside the required cache range have distinct identity. UTF-16 lengths are not described as counts of user-perceived characters. Numeric formatting exercises use fixed locales, and integer calculations have explicit bounds.
- Future features are signposted where relevant: var (10), switch expressions (14), records (16). Inheritance, polymorphism, full equals/hashCode implementation, pattern matching and sealed classes are later curriculum topics, rather than extra material added here.
- No video links were selected. No additional topic IDs, labs, datasets, assets or full Bangla bodies were invented.
- Human review should check teaching clarity and natural Bangla, the protected receiver explanation, the constructor order trace, the written package-layout commands, and the precise scope of wrapper caching guarantees. Review status remains draft for editorial review.

Suggested extra topics: none for this delivery; later curriculum topics already cover the follow-on concepts.
