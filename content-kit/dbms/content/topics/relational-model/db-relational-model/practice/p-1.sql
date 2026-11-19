CREATE TABLE mentoring (
    student_id INT PRIMARY KEY,
    teacher_id INT,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE SET NULL
);
INSERT INTO mentoring VALUES (104, 13);
START TRANSACTION;
DELETE FROM sections WHERE section_id = 34;
DELETE FROM teachers WHERE teacher_id = 13;
SELECT student_id, teacher_id FROM mentoring ORDER BY student_id;
ROLLBACK;
SELECT student_id, teacher_id FROM mentoring ORDER BY student_id;
