SELECT student_id, section_id, marks FROM results
WHERE marks > (SELECT AVG(marks) FROM results)
ORDER BY student_id, section_id;
