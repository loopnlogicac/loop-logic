SELECT product_id, price_bdt FROM products
WHERE price_bdt > ANY
    (SELECT price_bdt FROM products WHERE category = 'study')
ORDER BY product_id;
SELECT product_id, price_bdt FROM products
WHERE price_bdt > ALL
    (SELECT price_bdt FROM products WHERE category = 'study')
ORDER BY product_id;
