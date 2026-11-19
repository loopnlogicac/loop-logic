SELECT o.order_id, COALESCE(p.paid_bdt, 0.00) AS paid_bdt
FROM orders AS o
LEFT JOIN (
    SELECT order_id, SUM(amount_bdt) AS paid_bdt FROM payments GROUP BY order_id
) AS p ON p.order_id = o.order_id
ORDER BY o.order_id;
