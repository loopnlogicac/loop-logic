CREATE TABLE books (
    book_id INT PRIMARY KEY,
    isbn VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(120) NOT NULL,
    author_name VARCHAR(80) NOT NULL,
    shelf_code VARCHAR(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE members (
    member_id INT PRIMARY KEY,
    member_name VARCHAR(80) NOT NULL,
    joined_on DATE NOT NULL,
    email VARCHAR(120) UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- One books row represents one lendable copy in this small teaching library.
-- A production catalogue would separate titles from physical copies.
CREATE TABLE loans (
    loan_id INT PRIMARY KEY,
    book_id INT NOT NULL,
    member_id INT NOT NULL,
    borrowed_on DATE NOT NULL,
    due_on DATE NOT NULL,
    returned_on DATE,
    CHECK (due_on >= borrowed_on),
    CHECK (returned_on IS NULL OR returned_on >= borrowed_on),
    FOREIGN KEY (book_id) REFERENCES books(book_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(member_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO books VALUES
    (1, 'teaching-001', 'Database Workshop', 'Nadia Hasan', 'DB-01'),
    (2, 'teaching-002', 'Algebra for Computing', 'Shafiq Ahmed', 'MA-02'),
    (3, 'teaching-003', 'Stories from the River', 'Mita Rahman', 'BN-01'),
    (4, 'teaching-004', 'Introduction to Circuits', 'Fariha Akter', 'EE-01'),
    (5, 'teaching-005', 'Learning SQL Together', 'Raihan Kabir', 'DB-02');
INSERT INTO members VALUES
    (1, 'Samia Akter', '2025-09-01', 'samia@example.test'),
    (2, 'Adnan Hasan', '2025-09-02', 'adnan@example.test'),
    (3, 'Lamia Sultana', '2026-01-05', NULL),
    (4, 'Rakib Hossain', '2026-01-10', 'rakib@example.test');
INSERT INTO loans VALUES
    (401, 1, 1, '2026-02-01', '2026-02-15', '2026-02-12'),
    (402, 2, 2, '2026-02-05', '2026-02-19', NULL),
    (403, 3, 1, '2026-02-16', '2026-03-02', NULL),
    (404, 1, 3, '2026-02-20', '2026-03-06', NULL),
    (405, 4, 2, '2026-01-10', '2026-01-24', '2026-01-25');
