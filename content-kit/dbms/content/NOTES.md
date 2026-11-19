# DBMS – Batch 2

Package version: **0.2.0**, format 1.1. All topic review statuses remain `draft`.

## Delivered scope

This cumulative package contains **26 of 41 curriculum topics**. Batch 2 adds all 11 topics in `sql-advanced`, in curriculum order:

| Topic | Coverage and review focus |
| --- | --- |
| db-joins | INNER, LEFT, RIGHT, CROSS and self joins; full outer join emulation; ON versus WHERE; three-table relationships; composite keys and multiplied child totals |
| db-subqueries | Scalar, row and derived-table queries; IN, ANY, ALL, EXISTS; correlation; joins versus membership; NULL and empty-set rules |
| db-set-operations | UNION/ALL, native INTERSECT/EXCEPT and their ALL forms; precedence, duplicate multiplicity, NULL matching, pre-8.0.31 EXISTS alternatives |
| db-views | CREATE VIEW; update and insert restrictions; CHECK OPTION; live results; INVOKER/DEFINER security and alternate base-table access |
| db-indexes | B-tree lookup; composite leftmost prefixes; CREATE/DROP INDEX; traditional EXPLAIN; covering access; selectivity, scans and write costs |
| db-window-functions | ROW_NUMBER, RANK, DENSE_RANK; partitions and ties; explicit ROWS running sums; default RANGE peers; outer filtering |
| db-cte | WITH stages; independent payment/item totals; recursive mentoring hierarchy; anchor, rounds, depth, path width and cycle handling |
| db-stored-procedures | DELIMITER; IN/OUT/INOUT; local variables; IF, WHILE and SIGNAL; stored functions; execution authority and transaction ownership |
| db-triggers | All six BEFORE/AFTER INSERT/UPDATE/DELETE combinations; OLD/NEW; real-change auditing; rollback; cascade and TRUNCATE audit gaps |
| db-transactions-sql | InnoDB; START TRANSACTION, COMMIT, ROLLBACK, SAVEPOINT and RELEASE; autocommit; affected rows, statement failures and implicit DDL commits |
| db-users-privileges | CREATE USER; table/column GRANT and REVOKE; account cleanup; host identity; least privilege; view access, roles and additive grants |

The original 15 topics remain in `foundations`, `er-modelling`, `relational-model` and `sql-basics`. Earlier Bangla metadata was standardized to **ডেটাবেস**. New Bangla titles, summaries and key points follow `BANGLA_STYLE.md`, using natural classroom language and terms such as টেবিল, কোয়েরি, ফাংশন and ভেরিয়েবল. Full lesson bodies are English; optional full Bangla bodies are not included.

Batch 2 adds **51 executable examples, 46 practice problems, 119 quiz questions, 59 bilingual key points and 35 worked exam answers**. Twenty-two practice problems contain executable SQL; 24 have written worked answers. Thirty-three quiz questions execute SQL. Example counts vary from three to seven; larger topics receive additional practice or quiz questions. Every body has a syntax form, a topic-specific trace/reference table, mistake subheadings and links to related learning.

Cumulative totals are **96 examples, 113 practice problems, 278 quiz questions, 134 bilingual key points and 80 worked exam answers**. The SQL practice count is 44, and 60 output questions execute SQL.

All curriculum `covers` points for this delivery are addressed. The remaining 15 topics in `normalization`, `internals`, `beyond` and `practice-exam` are outside Batch 2. The 50-query university practice set belongs to that later scope. No additional topics are proposed. Videos remain unlinked because individual videos were not verified as precise topic matches.

## Shared datasets and assumptions

The three Batch 1 datasets are reused **without changes**. Each begins with table creation, uses InnoDB and utf8mb4, and loads into an empty database without CREATE DATABASE or USE. Every table has at most 60 seed rows.

| Dataset | Seed rows by table |
| --- | --- |
| university.sql | departments 3; teachers 4; students 8; courses 5; sections 6; enrollments 12; results 11 |
| shop.sql | customers 5; products 6; orders 5; order_items 8; payments 4 |
| library.sql | books 5; members 4; loans 5 |

Names and contacts are fictional. `.test` addresses and `test-` identifiers are teaching placeholders. Student 108 has no enrollment; student 107 has an enrollment awaiting a result. Pending marks are absent rather than zero. Result identity uses both student_id and section_id.

The university grading policy is A+ 80–100/4.00, A 75–79/3.75, A− 70–74/3.50, B+ 65–69/3.25, B 60–64/3.00, B− 55–59/2.75, C+ 50–54/2.50, C 45–49/2.25, D 40–44/2.00 and F 0–39/0.00. Generated columns derive grades from integer marks. This is a teaching policy, not an institutional guarantee. The earlier CGPA report weights recorded grades by credits and assumes no repeated-course replacement.

Shop money uses exact decimal BDT. Item prices preserve agreed prices, and orders can have several payments or none. Item totals and payment totals must be aggregated independently before joining. The library treats one book row as one lendable copy; a production catalogue would separate titles and copies. Overdue reports use fixed dates.

The recursive CTE examples locally add `teacher_links`, referencing the shared teachers. The original dataset does not claim to contain a mentoring hierarchy. Trigger audit/event tables and routine/view/index definitions are also created locally in their fresh exercise databases. Tie examples modify only that example's isolated data. None of these changes edits a shared dataset.

## MySQL environment and verification

The actual toolchain is **MySQL Community Server 8.4.7**, **mysql client 8.4.7**, and **Node.js v24.22.1**. The dataset baseline is MySQL 8.0.16 for enforced CHECK constraints. The native set-operation topic declares **MySQL 8.0.31**, explains that boundary, and supplies older-compatible DISTINCT/EXISTS alternatives. EXPLAIN ANALYZE is discussed with its 8.0.18 boundary; the executed plan example uses traditional EXPLAIN.

The exact requested apt/service command was attempted, but this environment has no `sudo` command. As documented for Batch 1, an official Oracle MySQL 8.4.7 Linux binary was installed under `/tmp/dbms-mysql`; its libaio dependency was extracted locally. A real MySQL server runs on 127.0.0.1:3306 with the requested root/root credentials. MariaDB and simulated SQL execution were not substituted. No binaries or temporary authoring/verification scripts are included in the package.

All 51 new examples, both runs of each of the 22 new SQL practice solutions, and all 33 new output questions were executed before the independent checker. That is **128 new SQL executions**. The 95 new `.out` files and 33 correct output options were captured from `mysql --table`, not hand-authored. Each execution recreated an empty database and loaded its declared shared setup. All displayed multi-row SELECT results have a final ORDER BY; window order and final display order are explained separately. No output uses NOW(), RAND() or UUID().

The supplied SQL practice runner uses a practice-level setup and does not feed test stdin into SQL. Each SQL solution therefore performs an ordinary scenario plus a boundary or state-transition scenario in the same script. Its two tests independently repeat that whole script in separate fresh databases. Identical output pairs are intentional; they are not claims of distinct stdin-driven fixtures. Examples include empty relations, absent keys, leaf hierarchies, threshold marks, no-op updates, rollback restoration and privilege removal.

Additional verification used a **separate connection as a temporary reader account**, rather than only inspecting grants as root. It confirmed an allowed definer-view read, denied direct base-table read, denied view update, and denied view access after REVOKE and reconnect. Independent MySQL rejection checks confirmed CHECK OPTION rejection (1369) and scalar-subquery cardinality rejection (1242). All temporary verification accounts and schemas were removed.

Batch 1's existing examples, practice and output quizzes are included in the cumulative checker run. Its previously documented integrity and grading-boundary checks remain relevant to the unchanged datasets.

Run from `content-kit/`:

```bash
export PATH=/tmp/dbms-mysql/bin:$PATH
export MYSQL_USER=root MYSQL_PWD=root MYSQL_HOST=127.0.0.1
node tools/check.mjs dbms/content --require-sql --report dbms/content/CHECK_REPORT.txt
```

`CHECK_REPORT.txt` records the final full run: **0 errors, 0 warnings**, SQL executed, and all 26 bodies within their level's word target. No checker or curriculum files were changed. All repository changes are confined to `content-kit/dbms/content/`.

## Reviewer notes and limits

- Read the Bangla aloud for local classroom tone and consistent technical spelling.
- Check preserved-side join logic, composite-key correlations, empty-set quantifiers and NULL-safe set rewrites.
- Review the ranking tie policy, explicit ROWS frames, recursive cycle detection and the deliberately bounded hierarchy/path width.
- Traditional EXPLAIN output was captured on 8.4.7. Plan fields and estimates can differ on another version or distribution; this tiny primary-key example is not a benchmark.
- Function creation may require administrative authority under binary-logging policy. DETERMINISTIC/NO SQL are truthful for pass_label, not boilerplate for arbitrary routines.
- InnoDB trigger logs share the caller's transaction. They do not capture rolled-back attempts, child foreign-key cascades or TRUNCATE as row deletes. They are not presented as tamper-proof auditing.
- Privilege exercises require account-management authority and use the temporary `llk_b2_reader`@`localhost` account. Run the package checker serially on an isolated teaching server. The scripts drop this account after use; an interrupted run may require removing that temporary account before retrying.
- The local demonstration password and administrator-owned definer view are exercise conveniences. Deployment guidance calls for protected credentials, narrowly privileged owners, review of broader/role grants, and actual target-account tests.
- Savepoints do not create nested transactions. DDL implicit commits, affected-row checks and application error handling must remain explicit when examples are adapted.
