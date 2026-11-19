SELECT student_id, UPPER(student_name) AS name_upper,
    CHAR_LENGTH(student_name) AS letters, CONCAT('Roll ', student_id) AS label
FROM students WHERE student_id <= 102 ORDER BY student_id;
