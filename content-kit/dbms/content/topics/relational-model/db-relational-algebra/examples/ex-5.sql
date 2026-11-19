SELECT student_id, section_id, marks
FROM enrollments NATURAL JOIN results
WHERE student_id = 101 ORDER BY student_id, section_id;
