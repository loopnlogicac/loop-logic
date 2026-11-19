CREATE TABLE student_cards (
    card_id INT PRIMARY KEY,
    student_id INT NOT NULL UNIQUE,
    issued_on DATE NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);
INSERT INTO student_cards VALUES (501, 101, '2026-01-18');
SELECT card_id, student_id, issued_on FROM student_cards ORDER BY card_id;
