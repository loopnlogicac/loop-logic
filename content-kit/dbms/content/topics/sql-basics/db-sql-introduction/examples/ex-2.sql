SELECT product_id, price_bdt, CAST('2026-03-01' AS DATE) AS price_on
FROM products WHERE product_id IN (1, 4) ORDER BY product_id;
