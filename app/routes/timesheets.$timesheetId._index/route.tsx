import { data, useLoaderData } from "react-router";
import { getDB } from "~/db/getDB";
import { format } from "date-fns";
import type { TimeSheetType } from "~/utils/zod";

type ParamsType = {
  timesheetId: string;
};

export async function loader({ params }: { params: ParamsType }): Promise<{
  timesheet: TimeSheetType;
}> {
  const db = await getDB();
  const timesheet = await db.get(
    `SELECT * FROM timesheets WHERE timesheets.id = ?`,
    [params.timesheetId]
  );
  if (!timesheet) {
    throw new Error("Timesheet not found");
  }
  return { timesheet };
}

export default function TimesheetPage() {
  const { timesheet } = useLoaderData<{ timesheet: TimeSheetType }>();

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Timesheet Details
      </h2>

      <div className="space-y-3 text-gray-700">
        <p>
          <span className="font-medium">Employee ID:</span>{" "}
          {timesheet.employee_id}
        </p>
        <p>
          <span className="font-medium">Work Location:</span>{" "}
          {timesheet.work_location}
        </p>
        <p>
          <span className="font-medium">Project Code:</span>{" "}
          {timesheet.project_code}
        </p>
        <p>
          <span className="font-medium">Start Time:</span>{" "}
          {format(new Date(timesheet.start_time), "PPpp")}
        </p>
        <p>
          <span className="font-medium">End Time:</span>{" "}
          {format(new Date(timesheet.end_time), "PPpp")}
        </p>
      </div>

      <div className="flex gap-4 mt-6">
        <a
          href={`/timesheets/new?id=${timesheet.id}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Edit Timesheet
        </a>
        <a
          href={`/employees/${timesheet.employee_id}`}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          View Employee
        </a>
      </div>

      <div className="mt-6 flex justify-between text-blue-500">
        <a href="/timesheets" className="hover:underline">
          Back to Timesheets
        </a>
        <a href="/timesheets/new" className="hover:underline">
          New Timesheet
        </a>
      </div>
    </div>
  );
}
