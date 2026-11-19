CREATE INDEX idx_stock ON products (stock);
DROP INDEX idx_stock ON products;
SELECT product_id, stock FROM products WHERE stock = 0 ORDER BY product_id;
