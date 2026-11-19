SELECT loan_id, DATEDIFF('2026-03-02', due_on) AS days_late FROM loans
WHERE returned_on IS NULL AND due_on <= '2026-03-02' ORDER BY loan_id;
SELECT COUNT(*) AS n FROM loans WHERE returned_on IS NULL AND due_on < '2026-01-01';
