-- Query 01: List student identifiers and names in identifier order.
SELECT student_id, student_name FROM students ORDER BY student_id;

-- Query 02: Show the CSE students using department identifier 1.
SELECT student_id, student_name FROM students WHERE department_id=1 ORDER BY student_id;

-- Query 03: Find the students whose hometown is missing.
SELECT student_id, student_name FROM students WHERE hometown IS NULL ORDER BY student_id;

-- Query 04: List known hometowns once each.
SELECT DISTINCT hometown FROM students WHERE hometown IS NOT NULL ORDER BY hometown;

-- Query 05: Find student names beginning with A.
SELECT student_id, student_name FROM students WHERE student_name LIKE 'A%' ORDER BY student_id;

-- Query 06: Show courses worth at least three credits.
SELECT course_code, credits FROM courses WHERE credits>=3 ORDER BY course_code;

-- Query 07: List results from 60 through 79 marks, including both endpoints.
SELECT student_id, section_id, marks FROM results WHERE marks BETWEEN 60 AND 79
ORDER BY student_id, section_id;

-- Query 08: Show the first three admitted students, breaking date ties by identifier.
SELECT student_id, admitted_on FROM students ORDER BY admitted_on, student_id LIMIT 3;

-- Query 09: Display Unknown for a missing hometown.
SELECT student_id, COALESCE(hometown, 'Unknown') AS hometown
FROM students ORDER BY student_id;

-- Query 10: List students admitted during calendar year 2026 using a half-open interval.
SELECT student_id, admitted_on FROM students
WHERE admitted_on>='2026-01-01' AND admitted_on<'2027-01-01' ORDER BY student_id;
