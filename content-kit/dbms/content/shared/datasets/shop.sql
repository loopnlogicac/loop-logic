CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    customer_name VARCHAR(80) NOT NULL,
    city VARCHAR(60) NOT NULL,
    phone VARCHAR(20) UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    category VARCHAR(40) NOT NULL,
    price_bdt DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    CHECK (price_bdt >= 0),
    CHECK (stock >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT NOT NULL,
    ordered_on DATE NOT NULL,
    status VARCHAR(12) NOT NULL DEFAULT 'pending',
    CHECK (status IN ('pending', 'paid', 'cancelled')),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE order_items (
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price_bdt DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (order_id, product_id),
    CHECK (quantity > 0),
    CHECK (unit_price_bdt >= 0),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE payments (
    payment_id INT PRIMARY KEY,
    order_id INT NOT NULL,
    paid_on DATE NOT NULL,
    amount_bdt DECIMAL(10,2) NOT NULL,
    method VARCHAR(20) NOT NULL,
    CHECK (amount_bdt > 0),
    CHECK (method IN ('cash', 'mobile', 'card')),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Fictional people; NULL phones mean unknown. Money is always in BDT.
INSERT INTO customers VALUES
    (1, 'Rumana Akter', 'Dhaka', 'test-001'),
    (2, 'Mahmud Hasan', 'Chattogram', 'test-002'),
    (3, 'Tania Sultana', 'Dhaka', NULL),
    (4, 'Rashed Karim', 'Khulna', 'test-004'),
    (5, 'Shila Rahman', 'Sylhet', NULL);
INSERT INTO products VALUES
    (1, 'Exercise book', 'stationery', 60.00, 100),
    (2, 'Ballpoint pen', 'stationery', 15.00, 200),
    (3, 'Geometry box', 'stationery', 180.00, 25),
    (4, 'Desk lamp', 'study', 850.00, 0),
    (5, 'Backpack', 'study', 1200.00, 12),
    (6, 'Bookmark', 'stationery', 0.00, 30);
INSERT INTO orders VALUES
    (201, 1, '2026-02-01', 'paid'),
    (202, 2, '2026-02-02', 'paid'),
    (203, 1, '2026-02-10', 'pending'),
    (204, 3, '2026-02-10', 'cancelled'),
    (205, 4, '2026-03-01', 'pending');
INSERT INTO order_items VALUES
    (201, 1, 2, 60.00), (201, 2, 4, 15.00),
    (202, 3, 1, 180.00), (202, 5, 1, 1200.00),
    (203, 4, 1, 800.00), (204, 2, 2, 15.00),
    (205, 1, 1, 60.00), (205, 6, 1, 0.00);
INSERT INTO payments VALUES
    (301, 201, '2026-02-01', 180.00, 'cash'),
    (302, 202, '2026-02-02', 1000.00, 'mobile'),
    (303, 202, '2026-02-03', 380.00, 'card'),
    (304, 205, '2026-03-01', 20.00, 'cash');
