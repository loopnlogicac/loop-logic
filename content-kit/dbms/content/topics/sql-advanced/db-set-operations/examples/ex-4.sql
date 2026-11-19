SELECT hometown FROM students WHERE student_id IN (101, 106, 108)
INTERSECT SELECT hometown FROM students WHERE student_id IN (103, 106)
ORDER BY hometown;
SELECT department_id FROM students
INTERSECT ALL SELECT department_id FROM teachers ORDER BY department_id;
