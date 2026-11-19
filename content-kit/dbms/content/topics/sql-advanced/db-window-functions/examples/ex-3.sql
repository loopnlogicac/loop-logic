SELECT payment_id, paid_on, amount_bdt,
    SUM(amount_bdt) OVER (
        ORDER BY paid_on, payment_id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_bdt
FROM payments ORDER BY paid_on, payment_id;
