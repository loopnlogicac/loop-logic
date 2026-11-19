SELECT order_id, payment_id,
    SUM(amount_bdt) OVER (PARTITION BY order_id ORDER BY paid_on, payment_id
        ROWS UNBOUNDED PRECEDING) AS running_bdt
FROM payments ORDER BY order_id, paid_on, payment_id;
INSERT INTO payments VALUES (305, 203, '2026-03-02', 10.00, 'cash');
SELECT order_id, payment_id,
    SUM(amount_bdt) OVER (PARTITION BY order_id ORDER BY paid_on, payment_id
        ROWS UNBOUNDED PRECEDING) AS running_bdt
FROM payments ORDER BY order_id, paid_on, payment_id;
