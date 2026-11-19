SELECT product_id FROM products
WHERE price_bdt > ALL (SELECT price_bdt FROM products WHERE category = 'study')
ORDER BY product_id;
START TRANSACTION;
UPDATE products SET category = 'archive' WHERE category = 'study';
SELECT product_id FROM products
WHERE price_bdt > ALL (SELECT price_bdt FROM products WHERE category = 'study')
ORDER BY product_id;
ROLLBACK;
