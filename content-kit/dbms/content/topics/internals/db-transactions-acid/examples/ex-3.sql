CREATE TABLE accounts (
    student_id INT PRIMARY KEY,
    balance DECIMAL(10,2) NOT NULL CHECK (balance >= 0),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
) ENGINE=InnoDB;
INSERT INTO accounts VALUES (101, 1000.00), (102, 500.00);
START TRANSACTION;
UPDATE accounts SET balance = balance - 1200
WHERE student_id = 101 AND balance >= 1200;
SELECT ROW_COUNT() AS debited_accounts;
ROLLBACK;
SELECT student_id, balance FROM accounts ORDER BY student_id;
