# Isolated crash experiment

This observation used a separate MySQL 8.4.7 instance on port 3307, with innodb_flush_log_at_trx_commit=1 and sync_binlog=1. The ordinary teaching server on port 3306 remained running.

1. Load university.sql into a new schema. Create InnoDB wallets(student_id INT PRIMARY KEY,balance INT NOT NULL), seeded with (101,1000),(102,500).
2. START TRANSACTION; debit student 101 by 100; credit student 102 by 100; COMMIT and wait for success.
3. Select both rows: 900 and 600.
4. START TRANSACTION; set student 101 balance to 1, and read both rows from that same connection: 1 and 600. Do not commit.
5. Terminate only this isolated server process with SIGKILL. Restart it against the same data directory and wait for readiness.
6. Reconnect and SELECT student_id,balance FROM wallets ORDER BY student_id: 900 and 600.

crash-observation.json records the actual queries and results. The committed transfer survived; the later uncommitted edit did not survive. This experiment observes recovery, not which exact pages happened to require redo or how the engine internally ordered every recovery step. A process crash is not a power-loss or media-failure test. Do not terminate a production server to repeat it.
