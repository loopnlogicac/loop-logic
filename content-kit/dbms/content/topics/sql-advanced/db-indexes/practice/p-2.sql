CREATE INDEX idx_category_price ON products (category, price_bdt);
SELECT product_id FROM products
WHERE category = 'stationery' AND price_bdt >= 60 ORDER BY product_id;
DROP INDEX idx_category_price ON products;
SELECT product_id FROM products
WHERE category = 'stationery' AND price_bdt >= 60 ORDER BY product_id;
