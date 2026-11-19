SELECT a.student_id AS first_student, b.student_id AS second_student
FROM students AS a
JOIN students AS b ON b.department_id = a.department_id AND a.student_id < b.student_id
WHERE a.department_id = 2
ORDER BY first_student, second_student;
SELECT d.department_code, c.course_code
FROM departments AS d CROSS JOIN courses AS c
WHERE d.department_id = 2 AND c.course_id IN (21, 23)
ORDER BY d.department_code, c.course_code;
