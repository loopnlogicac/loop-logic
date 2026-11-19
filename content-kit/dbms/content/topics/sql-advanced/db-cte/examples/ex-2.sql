WITH item_totals AS (
    SELECT order_id, SUM(quantity * unit_price_bdt) AS billed_bdt
    FROM order_items GROUP BY order_id
), payment_totals AS (
    SELECT order_id, SUM(amount_bdt) AS paid_bdt FROM payments GROUP BY order_id
)
SELECT o.order_id, i.billed_bdt, COALESCE(p.paid_bdt, 0.00) AS paid_bdt
FROM orders AS o JOIN item_totals AS i ON i.order_id = o.order_id
LEFT JOIN payment_totals AS p ON p.order_id = o.order_id
ORDER BY o.order_id;
