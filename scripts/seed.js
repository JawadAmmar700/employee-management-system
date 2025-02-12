import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfigPath = path.join(__dirname, "../database.yaml");
const dbConfig = yaml.load(fs.readFileSync(dbConfigPath, "utf8"));

const { sqlite_path: sqlitePath } = dbConfig;

const db = new sqlite3.Database(sqlitePath);

const employees = [
  {
    id: 1,
    full_name: "John Doe",
    email: "john.doe@example.com",
    phone_number: "123-456-7890",
    date_of_birth: "1985-07-15",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zip_code: "10001",
    country: "USA",
    hire_date: "2020-06-01",
    status: "Active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    full_name: "Jane Smith",
    email: "jane.smith@example.com",
    phone_number: "987-654-3210",
    date_of_birth: "1990-03-22",
    address: "456 Elm St",
    city: "San Francisco",
    state: "CA",
    zip_code: "94103",
    country: "USA",
    hire_date: "2018-09-15",
    status: "Active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const employeeDetails = [
  {
    id: 1,
    employee_id: 1,
    job_title: "Software Engineer",
    department: "Engineering",
    salary: 80000.0,
    employment_type: "Full-Time",
    office_location: "New York Office",
  },
  {
    id: 2,
    employee_id: 2,
    job_title: "Product Manager",
    department: "Product",
    salary: 95000.0,
    employment_type: "Full-Time",
    office_location: "San Francisco Office",
  },
];

const timesheets = [
  {
    id: 1,
    employee_id: 1,
    start_time: "2025-02-09 09:00",
    end_time: "2025-02-12 17:00",
    work_location: "Office",
    project_code: "PROJ001",
  },
  {
    id: 2,
    employee_id: 2,
    start_time: "2025-02-12 10:00",
    end_time: "2025-02-16 18:00",
    work_location: "Remote",
    project_code: "PROJ002",
  },
];

const insertData = (table, data) => {
  const columns = Object.keys(data[0]).join(", ");
  const placeholders = Object.keys(data[0])
    .map(() => "?")
    .join(", ");

  const insertStmt = db.prepare(
    `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`
  );

  data.forEach((row) => {
    insertStmt.run(Object.values(row));
  });

  insertStmt.finalize();
};

db.serialize(() => {
  insertData("employees", employees);
  insertData("employee_details", employeeDetails);
  insertData("timesheets", timesheets);
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Database seeded successfully.");
  }
});
