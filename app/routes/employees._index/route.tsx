import { useLoaderData } from "react-router";
import { getEmployees } from "~/utils/queries";
import type { EmployeeType } from "~/utils/zod";

export async function loader() {
  const employees = await getEmployees();
  return { employees };
}

export default function EmployeesPage() {
  const { employees } = useLoaderData<{ employees: EmployeeType[] }>();
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-20">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Employee List
      </h1>

      <div
        className="overflow-x-auto rounded-lg shadow-md max-h-[333px]"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#4A5568 #E2E8F0" }}
      >
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 border-b sticky top-0">
              <th className="px-6 py-3 text-left text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-gray-700">Full Name</th>
              <th className="px-6 py-3 text-left text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-gray-700">Phone</th>
              <th className="px-6 py-3 text-left text-gray-700">
                Date of Birth
              </th>
              <th className="px-6 py-3 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-indigo-600 hover:text-indigo-800">
                  <a href={`/employees/new?id=${employee.id}`}>{employee.id}</a>
                </td>
                <td className="px-6 py-4">{employee.full_name}</td>
                <td className="px-6 py-4">{employee.email}</td>
                <td className="px-6 py-4">{employee.phone_number || "N/A"}</td>
                <td className="px-6 py-4">{employee.date_of_birth || "N/A"}</td>
                <td className="px-6 py-4">
                  <a
                    href={`/employees/${employee.id}`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    View Details
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
