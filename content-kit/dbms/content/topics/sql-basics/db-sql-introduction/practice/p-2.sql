SELECT product_id, price_bdt FROM products WHERE product_id IN (1, 6) ORDER BY product_id;
SELECT COUNT(*) AS n FROM products WHERE price_bdt < 0;
