CREATE TABLE attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    attended_on DATE NOT NULL,
    present TINYINT NOT NULL DEFAULT 1,
    UNIQUE (student_id, attended_on),
    CHECK (present IN (0, 1)),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);
INSERT INTO attendance (student_id, attended_on) VALUES (101, '2026-02-01');
SELECT attendance_id, student_id, present FROM attendance ORDER BY attendance_id;
