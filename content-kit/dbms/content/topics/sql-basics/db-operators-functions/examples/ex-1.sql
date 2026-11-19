SELECT student_id, student_name, hometown FROM students
WHERE student_name LIKE 'A%' OR hometown IN ('Khulna', 'Sylhet') ORDER BY student_id;
