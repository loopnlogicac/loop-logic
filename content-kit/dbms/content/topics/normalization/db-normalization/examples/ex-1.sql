CREATE TABLE flat_registration AS
SELECT e.student_id, e.section_id, s.student_name, d.department_name
FROM enrollments AS e
JOIN students AS s ON s.student_id = e.student_id
JOIN departments AS d ON d.department_id = s.department_id;
UPDATE flat_registration SET department_name = 'CSE renamed'
WHERE student_id = 101 AND section_id = 31;
SELECT student_id, section_id, department_name
FROM flat_registration WHERE student_id = 101 ORDER BY section_id;
