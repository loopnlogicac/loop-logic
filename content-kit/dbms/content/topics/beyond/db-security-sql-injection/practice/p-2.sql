PREPARE name_query FROM 'SELECT COUNT(*) AS matches FROM students WHERE student_name = ?';
SET @name = 'Ayesha Rahman';
EXECUTE name_query USING @name;
SET @name = CONCAT(CHAR(39), ' OR 1=1 -- ');
EXECUTE name_query USING @name;
DEALLOCATE PREPARE name_query;
