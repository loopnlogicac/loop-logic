PREPARE student_lookup FROM
    'SELECT student_id, student_name FROM students WHERE student_id = ? ORDER BY student_id';
SET @id = 101;
EXECUTE student_lookup USING @id;
SET @id = 999;
EXECUTE student_lookup USING @id;
DEALLOCATE PREPARE student_lookup;
