INSERT INTO customers (customer_id, customer_name, city) VALUES (6, 'Sumaiya Alam', 'Barishal');
INSERT INTO customers (customer_id, customer_name, city) VALUES
    (7, 'Hasib Ahmed', 'Dhaka'), (8, 'Nafisa Karim', 'Cumilla');
SELECT customer_id, customer_name, phone FROM customers
WHERE customer_id >= 6 ORDER BY customer_id;
