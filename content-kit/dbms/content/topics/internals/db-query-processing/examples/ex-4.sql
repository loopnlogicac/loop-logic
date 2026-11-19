CREATE INDEX ix_student_hometown ON students(hometown);
EXPLAIN SELECT hometown, student_id FROM students
WHERE hometown = 'Dhaka' ORDER BY student_id;
SELECT hometown, student_id FROM students
WHERE hometown = 'Dhaka' ORDER BY student_id;
