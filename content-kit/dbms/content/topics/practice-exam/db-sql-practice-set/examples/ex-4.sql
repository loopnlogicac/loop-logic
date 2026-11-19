-- Query 31: Find results strictly above the overall mean mark.
SELECT student_id, section_id, marks FROM results
WHERE marks>(SELECT AVG(marks) FROM results) ORDER BY student_id, section_id;

-- Query 32: Find results above the mean within their own section.
SELECT r.student_id, r.section_id, r.marks FROM results AS r
WHERE r.marks>(SELECT AVG(x.marks) FROM results AS x WHERE x.section_id=r.section_id)
ORDER BY r.section_id, r.student_id;

-- Query 33: List students with no enrollments using NOT EXISTS.
SELECT s.student_id, s.student_name FROM students AS s
WHERE NOT EXISTS (SELECT 1 FROM enrollments AS e WHERE e.student_id=s.student_id)
ORDER BY s.student_id;

-- Query 34: List courses with at least one mark of 80 or above.
SELECT c.course_id, c.course_code FROM courses AS c WHERE EXISTS (
SELECT 1 FROM sections AS se JOIN results AS r ON r.section_id=se.section_id
WHERE se.course_id=c.course_id AND r.marks>=80) ORDER BY c.course_id;

-- Query 35: Return all highest-mark ties in each section.
SELECT r.student_id, r.section_id, r.marks FROM results AS r
WHERE r.marks=(SELECT MAX(x.marks) FROM results AS x WHERE x.section_id=r.section_id)
ORDER BY r.section_id, r.student_id;

-- Query 36: List departments with more students than teachers without joining raw child rows.
SELECT d.department_id FROM departments AS d
WHERE (SELECT COUNT(*) FROM students AS s WHERE s.department_id=d.department_id)
> (SELECT COUNT(*) FROM teachers AS t WHERE t.department_id=d.department_id)
ORDER BY d.department_id;

-- Query 37: Find students taking both course 21 and course 22, using two EXISTS conditions.
SELECT s.student_id FROM students AS s WHERE EXISTS (SELECT 1 FROM enrollments AS e
JOIN sections AS se ON se.section_id=e.section_id
WHERE e.student_id=s.student_id AND se.course_id=21)
AND EXISTS (SELECT 1 FROM enrollments AS e JOIN sections AS se ON se.section_id=e.section_id
WHERE e.student_id=s.student_id AND se.course_id=22) ORDER BY s.student_id;

-- Query 38: Find students taking every course taken by student 102.
SELECT s.student_id FROM students AS s WHERE NOT EXISTS (
SELECT 1 FROM enrollments AS target JOIN sections AS ts ON ts.section_id=target.section_id
WHERE target.student_id=102 AND NOT EXISTS (SELECT 1 FROM enrollments AS own
JOIN sections AS os ON os.section_id=own.section_id
WHERE own.student_id=s.student_id AND os.course_id=ts.course_id)) ORDER BY s.student_id;

-- Query 39: Find students with at least one enrollment whose every enrollment has a passing result.
SELECT s.student_id FROM students AS s
WHERE EXISTS (SELECT 1 FROM enrollments AS e WHERE e.student_id=s.student_id)
AND NOT EXISTS (SELECT 1 FROM enrollments AS e LEFT JOIN results AS r
ON r.student_id=e.student_id AND r.section_id=e.section_id
WHERE e.student_id=s.student_id AND (r.marks IS NULL OR r.marks<40))
ORDER BY s.student_id;

-- Query 40: Return student identifiers in department 1 or with a recorded mark of at least 80,
-- once each.
SELECT student_id FROM students WHERE department_id=1
UNION SELECT student_id FROM results WHERE marks>=80 ORDER BY student_id;
