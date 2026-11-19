SELECT section_id, COUNT(*) AS passes, ROUND(AVG(marks), 2) AS mean_pass
FROM results WHERE marks >= 40 GROUP BY section_id
HAVING COUNT(*) >= 2 ORDER BY section_id;
