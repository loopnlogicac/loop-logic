SELECT order_id, SUM(amount_bdt) AS received_bdt FROM payments
GROUP BY order_id ORDER BY order_id;
SELECT COUNT(*) AS n, COALESCE(SUM(amount_bdt), 0.00) AS received_bdt
FROM payments WHERE order_id = 203;
