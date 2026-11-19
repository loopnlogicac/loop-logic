SET @input = CONCAT(CHAR(39), ' OR 1=1 -- ');
SET @query = CONCAT('SELECT COUNT(*) AS matched FROM students WHERE student_name = ',
    CHAR(39), @input, CHAR(39));
PREPARE unsafe_search FROM @query;
EXECUTE unsafe_search;
DEALLOCATE PREPARE unsafe_search;
