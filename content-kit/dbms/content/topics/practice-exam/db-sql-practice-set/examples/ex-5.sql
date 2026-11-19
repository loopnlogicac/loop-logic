-- Query 41: Rank students by mark within each section, preserving equal-mark ranks.
SELECT student_id, section_id, marks,
RANK() OVER (PARTITION BY section_id ORDER BY marks DESC) AS mark_rank
FROM results ORDER BY section_id, mark_rank, student_id;

-- Query 42: Number results within each student by descending mark with a section-id tie-breaker.
SELECT student_id, section_id, marks,
ROW_NUMBER() OVER (PARTITION BY student_id ORDER BY marks DESC, section_id) AS position
FROM results ORDER BY student_id, position;

-- Query 43: Show each result and its difference from its section mean to two decimals.
SELECT student_id, section_id, marks,
ROUND(marks-AVG(marks) OVER (PARTITION BY section_id),2) AS above_mean
FROM results ORDER BY section_id, student_id;

-- Query 44: Use a CTE to list section counts of at least three.
WITH counts AS (SELECT section_id, COUNT(*) AS enrolled FROM enrollments GROUP BY section_id)
SELECT section_id, enrolled FROM counts WHERE enrolled>=3 ORDER BY section_id;

-- Query 45: Find each enrolled student’s latest registration, breaking date ties by the larger
-- section id.
WITH numbered AS (SELECT student_id, section_id, enrolled_on, ROW_NUMBER() OVER (
PARTITION BY student_id ORDER BY enrolled_on DESC, section_id DESC) AS position
FROM enrollments) SELECT student_id, section_id, enrolled_on FROM numbered
WHERE position=1 ORDER BY student_id;

-- Query 46: Show the two highest recorded marks per section, including ties at dense rank two.
WITH ranked AS (SELECT student_id, section_id, marks, DENSE_RANK() OVER (
PARTITION BY section_id ORDER BY marks DESC) AS mark_rank FROM results)
SELECT student_id, section_id, marks, mark_rank FROM ranked WHERE mark_rank<=2
ORDER BY section_id, mark_rank, student_id;

-- Query 47: Show a running count of admitted students in date-and-id order.
SELECT student_id, admitted_on, COUNT(*) OVER (ORDER BY admitted_on, student_id
ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS admitted_so_far
FROM students ORDER BY admitted_on, student_id;

-- Query 48: Compare each section’s enrollment count with the mean count across all sections,
-- including empty ones.
WITH counts AS (SELECT se.section_id, COUNT(e.student_id) AS enrolled FROM sections AS se
LEFT JOIN enrollments AS e ON e.section_id=se.section_id GROUP BY se.section_id)
SELECT section_id, enrolled, ROUND(AVG(enrolled) OVER (),2) AS mean_section_count
FROM counts ORDER BY section_id;

-- Query 49: Calculate credit-weighted grade points for each student with a recorded result.
SELECT r.student_id, ROUND(SUM(r.grade_point*c.credits)/SUM(c.credits),2) AS weighted_gp
FROM results AS r JOIN sections AS se ON se.section_id=r.section_id
JOIN courses AS c ON c.course_id=se.course_id GROUP BY r.student_id ORDER BY r.student_id;

-- Query 50: List students who take every catalogued CSE course, including a CSE course with no
-- enrollments.
SELECT s.student_id FROM students AS s WHERE NOT EXISTS (
SELECT 1 FROM courses AS c WHERE c.department_id=1 AND NOT EXISTS (
SELECT 1 FROM enrollments AS e JOIN sections AS se ON se.section_id=e.section_id
WHERE e.student_id=s.student_id AND se.course_id=c.course_id)) ORDER BY s.student_id;
