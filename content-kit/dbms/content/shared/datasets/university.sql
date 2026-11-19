CREATE TABLE departments (
    department_id INT PRIMARY KEY,
    department_code VARCHAR(10) NOT NULL UNIQUE,
    department_name VARCHAR(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE teachers (
    teacher_id INT PRIMARY KEY,
    teacher_name VARCHAR(80) NOT NULL,
    department_id INT NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE students (
    student_id INT PRIMARY KEY,
    student_name VARCHAR(80) NOT NULL,
    department_id INT NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    hometown VARCHAR(60),
    admitted_on DATE NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE courses (
    course_id INT PRIMARY KEY,
    course_code VARCHAR(12) NOT NULL UNIQUE,
    course_title VARCHAR(100) NOT NULL,
    credits DECIMAL(3,1) NOT NULL,
    department_id INT NOT NULL,
    CHECK (credits > 0 AND credits <= 6),
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE sections (
    section_id INT PRIMARY KEY,
    course_id INT NOT NULL,
    teacher_id INT NOT NULL,
    semester VARCHAR(20) NOT NULL,
    section_label VARCHAR(5) NOT NULL,
    capacity INT NOT NULL DEFAULT 40,
    UNIQUE (course_id, semester, section_label),
    CHECK (capacity BETWEEN 1 AND 60),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE enrollments (
    student_id INT NOT NULL,
    section_id INT NOT NULL,
    enrolled_on DATE NOT NULL,
    PRIMARY KEY (student_id, section_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(section_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Teaching scale: A+ 80-100/4.00, A 75-79/3.75, A- 70-74/3.50,
-- B+ 65-69/3.25, B 60-64/3.00, B- 55-59/2.75, C+ 50-54/2.50,
-- C 45-49/2.25, D 40-44/2.00, F 0-39/0.00.
-- grade_point is a course result. CGPA is the credit-weighted mean, not this column alone.
CREATE TABLE results (
    student_id INT NOT NULL,
    section_id INT NOT NULL,
    marks INT NOT NULL,
    grade VARCHAR(2) GENERATED ALWAYS AS (
        CASE WHEN marks >= 80 THEN 'A+' WHEN marks >= 75 THEN 'A'
             WHEN marks >= 70 THEN 'A-' WHEN marks >= 65 THEN 'B+'
             WHEN marks >= 60 THEN 'B' WHEN marks >= 55 THEN 'B-'
             WHEN marks >= 50 THEN 'C+' WHEN marks >= 45 THEN 'C'
             WHEN marks >= 40 THEN 'D' ELSE 'F' END
    ) STORED,
    grade_point DECIMAL(3,2) GENERATED ALWAYS AS (
        CASE WHEN marks >= 80 THEN 4.00 WHEN marks >= 75 THEN 3.75
             WHEN marks >= 70 THEN 3.50 WHEN marks >= 65 THEN 3.25
             WHEN marks >= 60 THEN 3.00 WHEN marks >= 55 THEN 2.75
             WHEN marks >= 50 THEN 2.50 WHEN marks >= 45 THEN 2.25
             WHEN marks >= 40 THEN 2.00 ELSE 0.00 END
    ) STORED,
    PRIMARY KEY (student_id, section_id),
    CHECK (marks BETWEEN 0 AND 100),
    FOREIGN KEY (student_id, section_id) REFERENCES enrollments(student_id, section_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO departments VALUES
    (1, 'CSE', 'Computer Science and Engineering'),
    (2, 'MAT', 'Mathematics'),
    (3, 'EEE', 'Electrical and Electronic Engineering');
INSERT INTO teachers VALUES
    (11, 'Nusrat Jahan', 1, 'nusrat@example.test'),
    (12, 'Arif Hasan', 1, 'arif@example.test'),
    (13, 'Farhana Akter', 2, 'farhana@example.test'),
    (14, 'Sajid Rahman', 3, 'sajid@example.test');
INSERT INTO students VALUES
    (101, 'Ayesha Rahman', 1, 'ayesha@example.test', 'Dhaka', '2025-01-10'),
    (102, 'Tanvir Hasan', 1, 'tanvir@example.test', 'Cumilla', '2025-01-10'),
    (103, 'Nabila Akter', 1, 'nabila@example.test', 'Dhaka', '2025-05-12'),
    (104, 'Rafi Ahmed', 2, 'rafi@example.test', 'Rajshahi', '2025-01-10'),
    (105, 'Meher Sultana', 3, 'meher@example.test', 'Khulna', '2025-05-12'),
    (106, 'Imran Hossain', 1, 'imran@example.test', NULL, '2026-01-11'),
    (107, 'Sadia Islam', 3, 'sadia@example.test', 'Sylhet', '2026-01-11'),
    (108, 'Fahim Chowdhury', 2, 'fahim@example.test', NULL, '2026-01-11');
INSERT INTO courses VALUES
    (21, 'CSE 212', 'Database Management Systems', 3.0, 1),
    (22, 'CSE 213', 'Database Laboratory', 1.0, 1),
    (23, 'MAT 101', 'Calculus I', 3.0, 2),
    (24, 'EEE 101', 'Electrical Circuits', 3.0, 3),
    (25, 'CSE 121', 'Structured Programming', 3.0, 1);
INSERT INTO sections VALUES
    (31, 21, 11, 'Spring 2026', 'A', 40),
    (32, 21, 12, 'Spring 2026', 'B', 40),
    (33, 22, 11, 'Spring 2026', 'A', 30),
    (34, 23, 13, 'Spring 2026', 'A', 50),
    (35, 24, 14, 'Spring 2026', 'A', 40),
    (36, 25, 12, 'Spring 2026', 'A', 40);
INSERT INTO enrollments VALUES
    (101, 31, '2026-01-15'), (101, 33, '2026-01-15'), (101, 34, '2026-01-16'),
    (102, 31, '2026-01-15'), (102, 33, '2026-01-15'), (102, 34, '2026-01-16'),
    (103, 32, '2026-01-15'), (103, 33, '2026-01-15'),
    (104, 34, '2026-01-16'), (105, 35, '2026-01-16'),
    (106, 32, '2026-01-17'), (107, 35, '2026-01-17');
INSERT INTO results (student_id, section_id, marks) VALUES
    (101, 31, 85), (101, 33, 78), (101, 34, 72),
    (102, 31, 65), (102, 33, 80), (102, 34, 39),
    (103, 32, 75), (103, 33, 60), (104, 34, 90),
    (105, 35, 55), (106, 32, 40);
