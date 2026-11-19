# DBMS – Batch 1

Package version: **0.1.0**, format 1.1. Review status remains `draft` throughout.

## Delivered scope

All 15 topics in the first four curriculum modules are included, in curriculum order:

- **foundations:** db-introduction, db-architecture, db-data-models.
- **er-modelling:** db-er-model, db-er-diagram-design, db-er-to-relational.
- **relational-model:** db-relational-model, db-relational-algebra, db-relational-calculus.
- **sql-basics:** db-sql-introduction, db-create-tables, db-insert-update-delete, db-select-basics, db-operators-functions, db-aggregate-group-by.

The package includes three reusable datasets, 45 examples (including two deliberate MySQL constraint errors), 67 practice problems, 159 quiz questions, 75 bilingual key points and 45 worked exam answers. Twenty-two practice problems contain executable SQL; 27 quiz questions execute SQL. The 87 `.out` files were captured from MySQL, never composed as expected answers. The six theory topics use written practice; relational calculus also includes two runnable SQL translations.

Titles, summaries and key points have Bangla translations. The full lesson bodies are English; full Bangla bodies are optional and are not included. No videos are linked because no individual video was verified as a precise match. No additional topics are proposed.

All `covers` points for the delivered topics are addressed. The remaining 26 curriculum topics belong to later modules and are outside this delivery. Links to the upcoming joins topic provide continuity; that topic is not included here. The 50-query SQL practice set belongs to the later practice-exam module.

## Dataset contract

Every dataset starts with table creation, uses InnoDB and utf8mb4, and loads into an empty database without creating or selecting a named database. Names and contact details are fictional; `.test` email addresses and `test-` phone/catalogue identifiers are teaching placeholders.

| Dataset | Seed rows by table |
| --- | --- |
| university.sql | departments 3; teachers 4; students 8; courses 5; sections 6; enrollments 12; results 11 |
| shop.sql | customers 5; products 6; orders 5; order_items 8; payments 4 |
| library.sql | books 5; members 4; loans 5 |

No table exceeds 60 rows. Dataset SQL deliberately contains no `CREATE DATABASE`, `USE`, clock-based values or random values. Parent tables precede their dependants.

The university teaching scale is A+ 80–100/4.00, A 75–79/3.75, A− 70–74/3.50, B+ 65–69/3.25, B 60–64/3.00, B− 55–59/2.75, C+ 50–54/2.50, C 45–49/2.25, D 40–44/2.00 and F 0–39/0.00. Generated columns derive grade and grade point from integer marks. This is an explicitly documented teaching policy, not a claim about every institution. The CGPA report weights recorded results by course credits and assumes no repeated-course replacement. Pending results are absent, not zero. Student 108 has no enrollments; student 107 has an enrollment awaiting a result.

Shop amounts are exact decimal BDT. Order-item prices preserve the agreed price even when the catalogue price differs. Orders can have several payments or none; cancellation is not represented by erasing historical amounts. Payments restrict order deletion. Aggregate payment and item totals separately before joining them to avoid multiplying amounts.

The small library treats each book row as one lendable copy. A production design would separate catalogue titles and copies. Date checks and references are enforced; a workflow must additionally prevent overlapping loans of a copy. `isbn` contains fictional teaching identifiers, not issued ISBNs. Reports use explicit dates such as 2026-03-01, so overdue results remain reproducible.

Capacity checks across enrollment rows, team-teaching policy, head-teacher department membership, total participation on a parent side, subtype coverage/disjointness and official retake rules are not falsely claimed to follow from ordinary foreign keys. The lessons identify where business or additional database logic is needed.

## Verification

The toolchain was **MySQL Community Server 8.4.7**, **mysql client 8.4.7** and **Node.js v24.22.1**. The content baseline is MySQL 8.0.16 because that version enforces CHECK constraints. The set-operation lesson explains the MySQL 8.0.31 boundary for INTERSECT and EXCEPT and uses compatible EXISTS/NOT EXISTS alternatives.

The environment did not provide `sudo`, an installed MySQL service or the cloud system-package helper. Consequently the requested apt/service command could not run here. An official Oracle MySQL 8.4.7 Linux binary was installed under `/tmp/dbms-mysql`, with its runtime dependency extracted locally. A genuine MySQL server ran on 127.0.0.1:3306 using the requested root/root credentials. No MariaDB or simulated SQL engine was substituted. No environment binaries or temporary authoring scripts are included in this package.

All 45 examples were executed, including confirmation of the two intended rejections. Both tests of each of the 22 SQL practice solutions were run separately against freshly loaded databases. All 27 output questions and their table-formatted correct options were generated from real executions. That is 116 example, practice-test and output-question executions before the independent checker executions. Setup data was loaded again for each run. All multi-row displayed SELECT results have ORDER BY, with tie breakers where needed.

The supplied SQL practice runner does not pass test stdin into SQL and uses a practice-level setup list. Each solution therefore contains both an ordinary scenario and a boundary scenario: missing matches, NULLs, zero values, empty requirements or rollback restoration. Each of its two tests independently repeats the complete scenario script in a new database. The repeated test outputs are intentional; no claim is made that ignored stdin selects different fixtures.

Additional MySQL checks verified all seed row counts, utf8mb4 on every table, twelve integrity rejections and all twenty endpoints of the documented grade intervals. The rejection checks covered marks outside 0–100, results without enrollment, duplicate enrollment, restricted parent deletion, negative price, zero item quantity, zero payment, invalid loan dates and deletion of a referenced book. Every temporary verification database was dropped after use.

Run from `content-kit/` with the MySQL client on PATH:

```bash
export MYSQL_USER=root MYSQL_PWD=root MYSQL_HOST=127.0.0.1
node tools/check.mjs dbms/content --require-sql --report dbms/content/CHECK_REPORT.txt
```

`CHECK_REPORT.txt` records **0 errors, 0 warnings**, all SQL executed, and all 15 lesson bodies within their level's word target. No checker or curriculum changes were needed.

## Review focus

- Confirm the university assumptions, Chen notation conventions and Bangla phrasing against local classroom usage.
- Check the distinction between candidate-key guarantees and accidental uniqueness in a small sample.
- Check division's candidate range when requirements are empty, and calculus's vacuous truth for a student without enrollments.
- Retain the explicit NULL, duplicate, credit-weight and transaction-boundary explanations when editing examples.
- Review future integrations for table-name case, collation, permissions and official grading/retake policy. The schema is a teaching model rather than a complete university, inventory or circulation system.
