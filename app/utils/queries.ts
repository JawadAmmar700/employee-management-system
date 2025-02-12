import { getDB } from "~/db/getDB";
import type { EmployeeDetailsType, EmployeeType } from "./zod";

type UpdateEmployeeType = {
  update_employee_id: string;
} & EmployeeType &
  EmployeeDetailsType;

export const updateEmployee = async ({
  update_employee_id,
  full_name,
  email,
  phone_number,
  date_of_birth,
  address,
  state,
  city,
  country,
  zip_code,
  hire_date,
  department,
  employment_type,
  job_title,
  salary,
  office_location,
}: UpdateEmployeeType) => {
  const db = await getDB();
  try {
    await db.run(
      `UPDATE employees
       SET full_name = ?, email = ?, phone_number = ?, date_of_birth = ?, address = ?, state = ?, city = ?, country = ?, zip_code = ?, hire_date = ?
       WHERE id = ?`,
      [
        full_name,
        email,
        phone_number,
        date_of_birth,
        address,
        state,
        city,
        country,
        zip_code,
        hire_date,
        update_employee_id,
      ]
    );

    await db.run(
      `UPDATE employee_details
         SET job_title = ?, department = ?, salary = ?, employment_type = ?, office_location = ?
         WHERE employee_id = ?`,
      [
        job_title,
        department,
        salary,
        employment_type,
        office_location,
        update_employee_id,
      ]
    );
  } catch (error) {
    throw new Error("Unsuccessful Update in employees table");
  }
};

export const getEmployeeByEmail = async (
  email: string
): Promise<EmployeeType | undefined> => {
  const db = await getDB();
  try {
    return await db.get(`SELECT * FROM employees WHERE email = ?`, [email]);
  } catch (error) {
    throw new Error("Error checking existing employee");
  }
};

export const insertEmployee = async ({
  full_name,
  email,
  phone_number,
  date_of_birth,
  address,
  city,
  state,
  zip_code,
  country,
  hire_date,
  department,
  employment_type,
  job_title,
  salary,
  office_location,
}: EmployeeType & EmployeeDetailsType) => {
  const db = await getDB();
  try {
    const result = await db.run(
      `INSERT INTO employees (full_name, email, phone_number, date_of_birth, address, city, state, zip_code, country, hire_date)
       VALUES (?, ?, ?, ?, ? , ? , ? , ? , ? , ?)`,
      [
        full_name,
        email,
        phone_number,
        date_of_birth,
        address,
        city,
        state,
        zip_code,
        country,
        hire_date,
      ]
    );
    const employeeId = result.lastID; // Return the inserted employee's ID

    await db.run(
      `INSERT INTO employee_details (employee_id, job_title, department, salary, employment_type, office_location)
         VALUES (?, ?, ?, ?, ?, ?)`,
      [
        employeeId,
        job_title,
        department,
        salary,
        employment_type,
        office_location,
      ]
    );
  } catch (error) {
    throw new Error("Unsuccessful Insert in employees table");
  }
};

export async function getEmployeeById(
  employeeId: string
): Promise<EmployeeType> {
  const db = await getDB();

  try {
    const employee = await db.all(
      `SELECT * FROM employees 
       JOIN employee_details ON employees.id = employee_details.employee_id 
       WHERE employees.id = ?`,
      [employeeId]
    );

    if (employee.length === 0) {
      throw new Error("Record not found");
    }

    return employee[0];
  } catch (error: any) {
    throw new Error("Error fetching employee record: " + error.message);
  }
}

export const getEmployees = async (): Promise<EmployeeType[]> => {
  const db = await getDB();
  const result = await db.all("SELECT * FROM employees;");
  return result;
};
