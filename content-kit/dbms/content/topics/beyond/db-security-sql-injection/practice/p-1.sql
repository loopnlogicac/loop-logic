PREPARE threshold_query FROM 'SELECT COUNT(*) AS matches FROM results WHERE marks >= ?';
SET @cutoff = 80;
EXECUTE threshold_query USING @cutoff;
SET @cutoff = 101;
EXECUTE threshold_query USING @cutoff;
DEALLOCATE PREPARE threshold_query;
