SELECT loan_id, DATEDIFF('2026-03-01', due_on) AS overdue_days
FROM loans WHERE returned_on IS NULL AND due_on < '2026-03-01' ORDER BY loan_id;
