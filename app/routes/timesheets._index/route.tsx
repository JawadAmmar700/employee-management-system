import { useState } from "react";
import { useLoaderData } from "react-router";
import CalendarApp from "~/componets/schedule";
import { getDB } from "~/db/getDB";
import type { TimeSheetType } from "~/utils/zod";

export async function loader() {
  const db = await getDB();
  const timesheetsAndEmployees = await db.all(
    "SELECT timesheets.*, employees.full_name, employees.id AS employee_id FROM timesheets JOIN employees ON timesheets.employee_id = employees.id"
  );

  return { timesheetsAndEmployees };
}

export default function TimesheetsPage() {
  const { timesheetsAndEmployees } = useLoaderData();
  const [view, setView] = useState<"table" | "calendar">("table");
  return (
    <div className="mt-10">
      <div className="flex space-x-4 ml-10">
        <button
          onClick={() => setView("table")}
          className={`px-4 py-2 rounded-lg focus:outline-none ${
            view === "table"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-indigo-500 hover:text-white"
          }`}
        >
          Table View
        </button>
        <button
          onClick={() => setView("calendar")}
          className={`px-4 py-2 rounded-lg focus:outline-none ${
            view === "calendar"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-indigo-500 hover:text-white"
          }`}
        >
          Calendar View
        </button>
      </div>
      {/* Replace `true` by a variable that is changed when the view buttons are clicked */}
      {view == "table" ? (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-20">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Time Sheet List
          </h1>

          <div
            className="overflow-x-auto rounded-lg shadow-md max-h-[333px]"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#4A5568 #E2E8F0",
            }}
          >
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 border-b sticky top-0">
                  <th className="px-6 py-3 text-left text-gray-700">ID</th>
                  <th className="px-6 py-3 text-left text-gray-700">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700">
                    Start Time
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700">
                    End Time
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {timesheetsAndEmployees.map((timesheet: any) => (
                  <tr key={timesheet.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-indigo-600 hover:text-indigo-800">
                      <a href={`/timesheets/new?id=${timesheet.id}`}>
                        {timesheet.id}
                      </a>
                    </td>
                    <td className="px-6 py-4">{timesheet.full_name}</td>
                    <td className="px-6 py-4">{timesheet.start_time}</td>
                    <td className="px-6 py-4">{timesheet.end_time || "N/A"}</td>

                    <td className="px-6 py-4">
                      <a
                        href={`/timesheets/${timesheet.id}`}
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
      ) : (
        <div>
          <CalendarApp timesheets={timesheetsAndEmployees} />
        </div>
      )}
    </div>
  );
}
