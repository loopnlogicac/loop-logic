UPDATE payments SET paid_on = '2026-02-02' WHERE payment_id = 303;
SELECT payment_id, paid_on, amount_bdt,
    SUM(amount_bdt) OVER (ORDER BY paid_on) AS peer_total,
    SUM(amount_bdt) OVER (
        ORDER BY paid_on, payment_id ROWS UNBOUNDED PRECEDING
    ) AS row_total
FROM payments ORDER BY paid_on, payment_id;
