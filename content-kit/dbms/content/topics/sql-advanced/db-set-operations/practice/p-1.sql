SELECT hometown AS town FROM students WHERE hometown IS NOT NULL
UNION SELECT city FROM customers ORDER BY town;
START TRANSACTION;
UPDATE students SET hometown = NULL;
SELECT hometown AS town FROM students WHERE hometown IS NOT NULL
UNION SELECT city FROM customers ORDER BY town;
ROLLBACK;
