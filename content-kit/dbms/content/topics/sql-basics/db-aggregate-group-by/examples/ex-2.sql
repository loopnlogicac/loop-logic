SELECT COUNT(*) AS results, SUM(marks) AS total, ROUND(AVG(marks), 2) AS mean_mark,
    MIN(marks) AS lowest, MAX(marks) AS highest FROM results;
