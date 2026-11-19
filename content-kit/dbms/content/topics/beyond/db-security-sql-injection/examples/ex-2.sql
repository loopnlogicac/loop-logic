SET @input = CONCAT(CHAR(39), ' OR 1=1 -- ');
PREPARE safe_search FROM
    'SELECT COUNT(*) AS matched FROM students WHERE student_name = ?';
EXECUTE safe_search USING @input;
DEALLOCATE PREPARE safe_search;
