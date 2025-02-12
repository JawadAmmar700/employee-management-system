import { useLoaderData } from "react-router";
import { getDB } from "~/db/getDB";
import type { EmployeeDetailsType, EmployeeType } from "~/utils/zod";

type ParamsType = {
  employeeId: string;
};

interface LoaderData {
  employee: EmployeeType & EmployeeDetailsType;
}

export async function loader({ params }: { params: ParamsType }) {
  const db = await getDB();
  const employee = await db.get(
    `SELECT * FROM employees e JOIN employee_details ed ON e.id = ed.employee_id WHERE e.id = ?`,
    [params.employeeId]
  );

  return { employee };
}

export default function EmployeePage() {
  const { employee } = useLoaderData<LoaderData>();

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-10">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        Employee Details
      </h1>

      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-800">
            Employee #{employee.id}
          </h2>
          <a
            href={`/employees/new?id=${employee.id}`}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            Edit Employee
          </a>
        </div>

        <div className="space-y-6">
          <div className="border-b border-gray-300 pb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Personal Information
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <strong className="text-gray-700">Full Name:</strong>{" "}
                {employee.full_name}
              </li>
              <li>
                <strong className="text-gray-700">Email:</strong>{" "}
                {employee.email}
              </li>
              <li>
                <strong className="text-gray-700">Phone Number:</strong>{" "}
                {employee.phone_number || "Not provided"}
              </li>
              <li>
                <strong className="text-gray-700">Date of Birth:</strong>{" "}
                {employee.date_of_birth || "Not provided"}
              </li>
            </ul>
          </div>

          <div className="border-b border-gray-300 pb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Professional Information
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <strong className="text-gray-700">Job Title:</strong>{" "}
                {employee.job_title}
              </li>
              <li>
                <strong className="text-gray-700">Department:</strong>{" "}
                {employee.department}
              </li>
              <li>
                <strong className="text-gray-700">Salary:</strong> $
                {employee.salary.toFixed(2)}
              </li>
              <li>
                <strong className="text-gray-700">Employment Type:</strong>{" "}
                {employee.employment_type}
              </li>
              <li>
                <strong className="text-gray-700">Office Location:</strong>{" "}
                {employee.office_location || "Not provided"}
              </li>
            </ul>
          </div>

          <div className="border-b border-gray-300 pb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Address Information
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <strong className="text-gray-700">Address:</strong>{" "}
                {employee.address || "Not provided"}
              </li>
              <li>
                <strong className="text-gray-700">City:</strong>{" "}
                {employee.city || "Not provided"}
              </li>
              <li>
                <strong className="text-gray-700">State:</strong>{" "}
                {employee.state || "Not provided"}
              </li>
              <li>
                <strong className="text-gray-700">Zip Code:</strong>{" "}
                {employee.zip_code || "Not provided"}
              </li>
              <li>
                <strong className="text-gray-700">Country:</strong>{" "}
                {employee.country || "Not provided"}
              </li>
            </ul>
          </div>

          <div className="pb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Employment Details
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <strong className="text-gray-700">Hire Date:</strong>{" "}
                {employee.hire_date}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
