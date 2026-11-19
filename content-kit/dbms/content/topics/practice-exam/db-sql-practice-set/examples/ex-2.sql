-- Query 11: Count all students and separately count known hometown values.
SELECT COUNT(*) AS students, COUNT(hometown) AS known_hometowns FROM students;

-- Query 12: Count students per department identifier.
SELECT department_id, COUNT(*) AS students FROM students
GROUP BY department_id ORDER BY department_id;

-- Query 13: Find the minimum, maximum and two-decimal mean of recorded marks.
SELECT MIN(marks) AS minimum_mark, MAX(marks) AS maximum_mark,
ROUND(AVG(marks),2) AS average_mark FROM results;

-- Query 14: List sections with at least three enrollments.
SELECT section_id, COUNT(*) AS enrolled FROM enrollments
GROUP BY section_id HAVING COUNT(*)>=3 ORDER BY section_id;

-- Query 15: Count passes and failures among recorded results using the 40-mark threshold.
SELECT SUM(CASE WHEN marks>=40 THEN 1 ELSE 0 END) AS passes,
SUM(CASE WHEN marks<40 THEN 1 ELSE 0 END) AS failures FROM results;

-- Query 16: Count result rows for each generated grade.
SELECT grade, COUNT(*) AS results_count FROM results GROUP BY grade ORDER BY grade;

-- Query 17: Calculate the total catalogued credits in each department.
SELECT department_id, SUM(credits) AS credits FROM courses
GROUP BY department_id ORDER BY department_id;

-- Query 18: Show each student’s mean recorded marks and exclude means below 70.
SELECT student_id, ROUND(AVG(marks),2) AS mean_marks FROM results
GROUP BY student_id HAVING AVG(marks)>=70 ORDER BY student_id;

-- Query 19: Find the number of distinct students with recorded results.
SELECT COUNT(DISTINCT student_id) AS students_with_results FROM results;

-- Query 20: Find the maximum enrollment date in each section.
SELECT section_id, MAX(enrolled_on) AS latest_date FROM enrollments
GROUP BY section_id ORDER BY section_id;
