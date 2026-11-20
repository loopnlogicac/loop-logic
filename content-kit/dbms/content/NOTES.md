# DBMS – Bangla edition, part 2 (R6-E)

Package version **0.3.1** completes **41/41 Bangla lesson bodies**. This branch originally started from main plus PR #32 (`codex/dbms-bangla-part-1`). That prerequisite is now merged; current main (2c1616a) is also included. Its nine earlier Bangla bodies are retained. This item adds the remaining 32 bodies across SQL basics/advanced, normalization, internals, beyond and practice-exam.

The complete teaching text is translated, including the fifty SQL tasks, twelve worked exam answers, fifty interview explanations and the university registration project. Code, SQL identifiers, English bodies, examples, shared datasets and captured outputs are unchanged. Heading IDs, topic links, example slots, code blocks and paragraph coverage are checked against each English body. Existing bilingual topic metadata is retained. Review status remains draft for language/subject review.

Validation for this edition: the complete checker runs against a real MySQL Community Server 8.4.7 with `--require-sql`; all 41 topics pass with 0 errors and 0 warnings. All 169 current platform tests pass with `node --test "tests/*.test.ts"`. No application dependencies, migrations or platform files are changed.

```bash
# From content-kit/, with mysql on PATH and local MYSQL_HOST/PORT/USER configured:
node tools/check.mjs dbms/content --require-sql --report dbms/content/CHECK_REPORT.txt
# From repository root:
node --test "tests/*.test.ts"
```

The local validation server listens only on 127.0.0.1:33307. Its temporary binaries, data and configuration are outside the repository. The historical batch notes below describe earlier authoring environments, not the current server.

---

# DBMS – Batch 3

Package version: **0.3.0**, format 1.1. This is the final delivery: **41/41 curriculum topics**, in the fixed curriculum order. Every review status remains `draft` for subject and language review.

## Delivered scope

Batch 3 adds the final **15 topics**:

| Module | Topic | Coverage and review focus |
| --- | --- | --- |
| normalization | db-functional-dependencies | FD meaning; Armstrong’s axioms; closures; complete candidate-key reasoning; singleton minimal/canonical cover reduction and equivalence |
| normalization | db-normalization | Repeating course groups; anomalies; full 1NF→2NF→3NF registration decomposition; keys, FDs, losslessness and local enforcement; SQL anomaly and repair |
| normalization | db-bcnf-4nf | Overlapping keys; 3NF exception versus BCNF; recursive BCNF splits; lost FD enforcement; independent MVD combinations, 4NF decomposition and an invalid-independence counterexample |
| normalization | db-decomposition | Binary intersection test; lossy witness; projected implied FDs; preservation closure; multiway chase; 3NF synthesis with the necessary key component |
| internals | db-transactions-acid | Bank transfers; transaction states; invariant checks; atomicity versus correct logic; durability settings; unknown commit outcomes and idempotency |
| internals | db-concurrency-control | Schedules; precedence and wait-for graphs; recoverability; basic/strict/rigorous 2PL; deadlocks and timeouts; MySQL isolation, MVCC and locking reads |
| internals | db-recovery | Failure classes; WAL; undo/redo; steal/no-force reasoning; conceptual log trace; actual process-crash observation; fuzzy checkpoints; backup, binary logs, RPO/RTO and committed mistakes |
| internals | db-storage-indexing | Heap/sorted files; primary/secondary/clustered terminology; B+ tree traversal, splits, fanout and worked page counts; InnoDB row identity and coverage; hashing and range limits |
| internals | db-query-processing | Parsing, name resolution, legal rewrites, cost estimates and execution; selectivity and stale estimates; traditional/tree EXPLAIN; coverage, date ranges and actual answer checks |
| beyond | db-security-sql-injection | Unsafe read-only search versus bound values; repeated PREPARE execution; trusted dynamic identifiers; list parameters; second-order injection; authority, authorisation, secrets and backups |
| beyond | db-nosql-intro | Document, key-value, wide-column and graph models; aggregate/partition boundaries; CAP’s partition case and linearizability; eventual convergence and model-selection tradeoffs |
| practice-exam | db-sql-practice-set | **50 difficulty-graded university queries**, each with worked SQL and captured output; five groups of ten from projection through division, windows and weighted grade reports |
| practice-exam | db-exam-questions | **12 fully worked exam answers** covering Chen design, weak entities, algebra and SQL, normalization, decomposition, graphs, recovery and secure access |
| practice-exam | db-mini-project-university | University requirements→Chen relationships→tables; existing keys/checks/FKs; report view; transaction-owning capacity procedure; result audit triggers; integrity, concurrency and restricted-account checks |
| practice-exam | db-interview-questions | **50 short questions with answers**, grouped by design, SQL, dependencies, transactions and operations; additional output and concept quiz |

The earlier 26 topics remain included. Their Bangla transaction spelling was standardised in two metadata files. All Bangla uses **ডেটাবেস, টেবিল, ট্রানজ্যাকশন, নরমালাইজেশন** consistently. Bilingual titles, summaries and key points are provided; full lesson bodies are English. Optional complete Bangla bodies and unverified video links are not included.

Normalisation is taught through worked theory and complete decompositions. Metadata retains the curriculum’s fixed kinds: three normalization topics are `theory`; `db-normalization` is the required `lesson` with its runnable anomaly/repair examples. No curriculum or checker override was introduced.

Batch 3 adds **21 executable examples, 58 practice problems, 165 quiz questions, 74 bilingual key points and 106 worked exam answers**. Ten practice problems execute SQL, and 48 have written answers. Twenty-five new output questions execute SQL. Larger topics have additional written problems or quiz questions; the question banks have their own prescribed counts.

Cumulative totals: **117 examples, 171 practice problems, 443 quiz questions, 208 bilingual key points and 186 exam answers**. There are 54 executable SQL practice problems, 85 executable output questions and 223 captured `.out` files.

All 41 curriculum topics and their `covers` requirements are addressed. The fifty-query set is carried as five executable answer groups because the fixed lesson format allows at most eight examples. Each group contains ten numbered questions and corresponding SQL answers; result tables follow query order. The interview bank’s fifty items are both visible in the body and represented individually in `examQuestions`.

## Datasets and assumptions

The original **university.sql, shop.sql and library.sql are unchanged**. Each loads into an empty schema, uses InnoDB and utf8mb4, and contains at most 60 seed rows per table. All new runnable lessons load their declared university setup. Bank accounts, flat anomaly tables, indexes and prepared statements are local to their example schemas.

The university dataset has three departments, four teachers, eight students, five courses, six sections, twelve enrollments and eleven results. Student 108 has no enrollment, student 107 has a pending result, and section 36 has no enrollment. Missing results are not zero marks. The result key uses both student_id and section_id. Credit-weighted reports use recorded results only and assume no repeated-course replacement; a production CGPA policy must define retakes separately.

The simplified SC normalisation example explicitly permits one result per student-course pair; it is not substituted for the shared schema’s richer section-based event identity. BCNF instructor dependencies and 4NF language/hobby independence are stated assumptions. Their counterexamples show when the corresponding splits would be inappropriate.

The mini project adds only `project/extension.sql` within its topic, loaded after the unchanged university dataset. It supplies result_audit, section_overview, register_student and two triggers. The procedure owns its transaction and must be called without an existing caller transaction. Every enrollment insertion and administrative capacity reduction must follow a compatible section-lock protocol. Restrict direct DML so the application cannot bypass it. The fixed registration date is a teaching choice.

The project audit is transactional history of inserts and real marks updates, not authenticated or tamper-proof security evidence. It omits human identity/timestamps, disappears on rollback, and does not claim to capture foreign-key cascades, failed attempts or administrator tampering. Payment, timetable, prerequisites, repeated-attempt policy and production identity integration are outside this bounded project and are identified in its text.

## MySQL environment

Actual toolchain: **MySQL Community Server 8.4.7**, **mysql client 8.4.7**, **Node.js v24.22.1**. The requested sudo/apt/service/ALTER USER command was attempted first, but `sudo` is absent. As in earlier batches, the official Oracle MySQL 8.4.7 Linux binary was unpacked under `/tmp/dbms-mysql`; its libaio dependency was extracted under `/tmp/dbms-deps`. A real server runs on 127.0.0.1:3306 with the requested root/root credentials. MariaDB and simulated query output were not used. No binaries or temporary authoring drivers are committed.

Shared CHECK constraints require MySQL 8.0.16. The query-processing lesson uses FORMAT=TREE (8.0.16) for the joined plan and explains EXPLAIN ANALYZE’s 8.0.18 boundary. The prior native set-operation topic retains its MySQL 8.0.31 minimum. Version-sensitive plan estimates are observations from 8.4.7, not portable performance guarantees.

From `content-kit/`:

```bash
export PATH=/tmp/dbms-mysql/bin:$PATH
export MYSQL_USER=root MYSQL_PWD=root MYSQL_HOST=127.0.0.1
node tools/check.mjs dbms/content --require-sql --report dbms/content/CHECK_REPORT.txt
```

## Verification evidence

Every new example, both independent fresh-schema runs of every new SQL practice solution and every new output quiz was executed before the package checker: **66 new registered SQL executions**. The fifty practice-set queries all ran as part of their five answer groups. Inline SQL exam outputs were also captured from actual runs. The 41 new `.out` files and all correct output options come from `mysql --table`.

Each executable item loads its declared setup into a new empty schema. Every displayed multi-row SELECT has a final ORDER BY, including tie-breakers where needed. No result depends on NOW(), RAND() or UUID(). Traditional joined EXPLAIN includes a connection-specific schema name in `ref`, so that example uses the actual tree format instead of editing or normalising its output.

The SQL practice runner supports practice-level setup and does not use test stdin as a fixture. Each new solution therefore includes an ordinary and a boundary/state-transition scenario in the same SQL script. Its two tests repeat that whole script in separate fresh schemas. The division exercise explicitly demonstrates both a nonempty and an empty required set; the report exercise demonstrates all-empty child relations. Identical output pairs are intentional, not claims of distinct stdin fixtures.

Additional observations are committed with the corresponding lessons:

- `topics/internals/db-concurrency-control/sessions/observed-sessions.json` and `sessions/README.md`: **44 real two-connection command events**. REPEATABLE READ observed 1000 after another connection committed 900; READ COMMITTED observed 900; READ UNCOMMITTED observed an uncommitted 900 that was rolled back. FOR UPDATE blocked an incompatible writer and produced 1205. An observed lock-wait edge was used to construct a two-row deadlock, producing 1213. The transcript preserves command issue order; send A’s second deadlock UPDATE asynchronously as described. Victim selection can differ.
- `topics/internals/db-recovery/sessions/crash-observation.json` and `sessions/README.md`: a **separate port-3307 MySQL instance** was terminated with SIGKILL after an acknowledged 900/600 transfer and a later uncommitted edit to 1/600. Reconnecting after restart observed **900/600**. This demonstrates process-crash behaviour, not power-loss/media resilience or an exact internal redo-page trace. The ordinary port-3306 server was unaffected, and the isolated instance was shut down after validation.
- `topics/practice-exam/db-mini-project-university/project/acceptance-observations.json`: six expected routine/integrity rejections (duplicate, missing student/section, low/high marks and result without enrollment); two callers competing for one seat with **exactly one commit**, one full-section rejection and final count one; four access tests through a real temporary registrar account. The account could execute the definer routine and read the report, but could neither insert enrollments directly nor read student email. Temporary accounts and schemas were removed.

`CHECK_REPORT.txt` contains the final cumulative required run against MySQL: **0 errors, 0 warnings, SQL executed**. All 41 topic bodies meet their applicable word targets. No checker, curriculum, build or application files were changed; every repository change is within `content-kit/dbms/content/`.

## Reviewer focus and limits

- Read Bangla aloud for classroom tone and consistent technical spelling. All review statuses intentionally remain draft.
- Check key enumeration, the canonical-cover convention, the formal 3NF prime-attribute exception, the 4NF independence assumption and each losslessness/preservation argument separately.
- Review the chase symbol merges and the synthesis example where adding a key relation restores the lost association.
- Keep precedence graphs, wait-for graphs and recoverability commit ordering distinct. InnoDB MVCC is not presented as literal shared-lock-only textbook 2PL.
- Check snapshot creation, locking-read visibility, unique equality versus range locking and the different 1205/1213 rollback boundaries. The supplementary experiments exercise the documented cases, not every isolation anomaly.
- EXPLAIN fields and costs can change with statistics or versions. The tiny dataset is suitable for correctness and plan reading, not benchmarking.
- Confirm query-set row identities, empty-set division, tied ranks and recorded-only weighted grades. Query 50 correctly returns no students because CSE 121 has no enrollments.
- The capacity routine requires one controlled write protocol and a clear transaction owner. Keep those caller and authority contracts if adapting it.
- The SQL injection examples are isolated read-only teaching searches. Production applications need a connector’s binding API, separate authentication/authorisation, secret handling and tested backups. No deployment or external NoSQL service is included.
- CAP uses distributed linearizability and partition-time availability, distinct from ACID’s invariant consistency. Wide-column and analytical columnar storage are also distinguished.
- Earlier Batch 1/2 integrity, grading and privilege checks remain documented in their merged history; unchanged datasets and executable earlier topics are included in the final cumulative checker run.
