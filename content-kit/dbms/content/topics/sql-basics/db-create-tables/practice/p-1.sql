CREATE TABLE contributions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    amount_bdt DECIMAL(8,2) NOT NULL DEFAULT 0,
    CHECK (amount_bdt >= 0),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);
INSERT INTO contributions (student_id) VALUES (101);
INSERT INTO contributions (student_id, amount_bdt) VALUES (102, 50);
SELECT id, amount_bdt FROM contributions ORDER BY id;
SELECT COUNT(*) AS n FROM contributions WHERE amount_bdt < 0;
