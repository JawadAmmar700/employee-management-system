import { useState } from "react";
import { useLoaderData } from "react-router";
import { getEmployees } from "~/utils/queries";
import type { EmployeeType } from "~/utils/zod";

export async function loader() {
  const employees = await getEmployees();
  return { employees };
}

export default function EmployeesPage() {
  const { employees } = useLoaderData<{ employees: EmployeeType[] }>();

  const [search, setSearch] = useState<string>("");
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<string>("desc");

  // Filter employees based on search input
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.full_name.toLowerCase().includes(search.toLowerCase()) ||
      employee.email.toLowerCase().includes(search.toLowerCase())
  );

  // Sorting logic
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    let employeeA = a[sortField as keyof EmployeeType]!;
    let employeeB = b[sortField as keyof EmployeeType]!;

    // Handle date fields
    if (sortField === "created_at" || sortField === "date_of_birth") {
      employeeA = new Date(employeeA).getTime().toString();
      employeeB = new Date(employeeB).getTime().toString();
    } else {
      // Handle string sorting (`full_name`)
      employeeA = employeeA.toLowerCase();
      employeeB = employeeB.toLowerCase();
    }

    return sortOrder === "asc"
      ? employeeA > employeeB
        ? 1
        : -1
      : employeeA < employeeB
      ? 1
      : -1;
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Employee List
      </h1>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        {/* Search Input */}
        <div className="w-full md:w-2/3">
          <label
            htmlFor="search"
            className="block text-gray-700 font-medium mb-1"
          >
            Search by Name or Email:
          </label>
          <input
            id="search"
            type="text"
            placeholder="Enter name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Sorting Dropdown */}
        <div className="w-full md:w-1/3">
          <label
            htmlFor="sortField"
            className="block text-gray-700 font-medium mb-1"
          >
            Sort by:
          </label>
          <select
            id="sortField"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="created_at">Created At</option>
            <option value="full_name">Full Name</option>
            <option value="date_of_birth">Date of Birth</option>
          </select>
        </div>
        {/* Sorting Order Dropdown */}
        <div className="w-full md:w-1/3">
          <label
            htmlFor="sortOrder"
            className="block text-gray-700 font-medium mb-1"
          >
            Order:
          </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

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
            {sortedEmployees.length > 0 ? (
              sortedEmployees.map((employee) => (
                <tr key={employee.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-indigo-600 hover:text-indigo-800">
                    <a href={`/employees/new?id=${employee.id}`}>
                      {employee.id}
                    </a>
                  </td>
                  <td className="px-6 py-4">{employee.full_name}</td>
                  <td className="px-6 py-4">{employee.email}</td>
                  <td className="px-6 py-4">
                    {employee.phone_number || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {employee.date_of_birth || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`/employees/${employee.id}`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                      View Details
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
