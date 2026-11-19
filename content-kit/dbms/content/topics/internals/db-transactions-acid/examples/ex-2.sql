CREATE TABLE accounts (
    student_id INT PRIMARY KEY,
    balance DECIMAL(10,2) NOT NULL CHECK (balance >= 0),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
) ENGINE=InnoDB;
INSERT INTO accounts VALUES (101, 1000.00), (102, 500.00);
START TRANSACTION;
SELECT student_id, balance FROM accounts WHERE student_id IN (101, 102)
ORDER BY student_id FOR UPDATE;
UPDATE accounts SET balance = balance - 100 WHERE student_id = 101 AND balance >= 100;
SELECT ROW_COUNT() AS debited_accounts;
UPDATE accounts SET balance = balance + 100 WHERE student_id = 102;
SELECT ROW_COUNT() AS credited_accounts;
COMMIT;
SELECT student_id, balance FROM accounts ORDER BY student_id;
SELECT SUM(balance) AS total_bdt FROM accounts;
