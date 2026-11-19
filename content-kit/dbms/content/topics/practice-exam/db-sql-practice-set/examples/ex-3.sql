-- Query 21: Show every student beside their department code.
SELECT s.student_id, s.student_name, d.department_code FROM students AS s
JOIN departments AS d ON d.department_id=s.department_id ORDER BY s.student_id;

-- Query 22: Show each section’s course code and teacher name.
SELECT se.section_id, c.course_code, t.teacher_name FROM sections AS se
JOIN courses AS c ON c.course_id=se.course_id
JOIN teachers AS t ON t.teacher_id=se.teacher_id ORDER BY se.section_id;

-- Query 23: Count enrollments for every student, including zero.
SELECT s.student_id, COUNT(e.section_id) AS enrollments FROM students AS s
LEFT JOIN enrollments AS e ON e.student_id=s.student_id
GROUP BY s.student_id ORDER BY s.student_id;

-- Query 24: List enrollments still awaiting a result.
SELECT e.student_id, e.section_id FROM enrollments AS e
LEFT JOIN results AS r ON r.student_id=e.student_id AND r.section_id=e.section_id
WHERE r.student_id IS NULL ORDER BY e.student_id, e.section_id;

-- Query 25: Calculate remaining seats for every section.
SELECT se.section_id, se.capacity-COUNT(e.student_id) AS remaining_seats
FROM sections AS se LEFT JOIN enrollments AS e ON e.section_id=se.section_id
GROUP BY se.section_id, se.capacity ORDER BY se.section_id;

-- Query 26: List unique course codes taken by student 101.
SELECT DISTINCT c.course_code FROM enrollments AS e
JOIN sections AS se ON se.section_id=e.section_id
JOIN courses AS c ON c.course_id=se.course_id
WHERE e.student_id=101 ORDER BY c.course_code;

-- Query 27: Count enrollments attached to each teacher, retaining teachers with none.
SELECT t.teacher_id, COUNT(e.student_id) AS enrollments FROM teachers AS t
LEFT JOIN sections AS se ON se.teacher_id=t.teacher_id
LEFT JOIN enrollments AS e ON e.section_id=se.section_id
GROUP BY t.teacher_id ORDER BY t.teacher_id;

-- Query 28: Show recorded marks beside student names and course codes.
SELECT r.student_id, r.section_id, s.student_name, c.course_code, r.marks
FROM results AS r JOIN students AS s ON s.student_id=r.student_id
JOIN sections AS se ON se.section_id=r.section_id
JOIN courses AS c ON c.course_id=se.course_id ORDER BY r.student_id, r.section_id;

-- Query 29: List courses with no enrollments in any of their sections.
SELECT c.course_id, c.course_code FROM courses AS c
WHERE NOT EXISTS (SELECT 1 FROM sections AS se JOIN enrollments AS e
ON e.section_id=se.section_id WHERE se.course_id=c.course_id) ORDER BY c.course_id;

-- Query 30: Find pairs of distinct students sharing the same known hometown, once per pair.
SELECT a.student_id AS first_student, b.student_id AS second_student, a.hometown
FROM students AS a JOIN students AS b ON a.hometown=b.hometown
AND a.student_id<b.student_id ORDER BY a.student_id, b.student_id;
