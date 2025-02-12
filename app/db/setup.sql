DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS employee_details;  
DROP TABLE IF EXISTS timesheets;


CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT,
    date_of_birth DATE,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT,
    hire_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE employee_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    job_title TEXT NOT NULL,
    department TEXT NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    employment_type TEXT CHECK (employment_type IN ('Full-Time', 'Part-Time', 'Contractor', 'Intern')) NOT NULL,
    office_location TEXT,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);


CREATE TABLE timesheets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    total_hours DECIMAL(5,2) GENERATED ALWAYS AS (ROUND((JULIANDAY(end_time) - JULIANDAY(start_time)) * 24, 2)) STORED,
    work_location TEXT CHECK (work_location IN ('Office', 'Remote', 'Hybrid')) DEFAULT 'Office',
    project_code TEXT,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);
