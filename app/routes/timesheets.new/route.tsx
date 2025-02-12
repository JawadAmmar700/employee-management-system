import { useLoaderData, redirect, useActionData } from "react-router";
import { getDB } from "~/db/getDB";
import type { ActionFunction } from "react-router";
import TimesheetForm from "~/componets/timesheet-form";
import {
  timeSheetSchema,
  type EmployeeType,
  type TimeSheetType,
} from "~/utils/zod";
import { insertTimesheet, updateTimesheet } from "~/utils/queries";

export async function loader({ request }: { request: { url: string } }) {
  const url = new URL(request.url);
  const timeSheetId = url.searchParams.get("id");
  const db = await getDB();
  const employees: EmployeeType[] = await db.all(
    "SELECT id, full_name FROM employees"
  );

  if (!timeSheetId) {
    return { employees, timeSheet: {}, timeSheetId: "new" };
  }

  const timeSheet: TimeSheetType[] = await db.all(
    `SELECT * FROM timesheets 
     WHERE timesheets.id = ?`,
    [timeSheetId]
  );

  if (!timeSheet) {
    throw new Error("TimeSheet Not Found");
  }

  return { employees, timeSheet: timeSheet[0], timeSheetId };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const rawData = Object.fromEntries(formData);

  const data = {
    employee_id: Number(rawData.employee_id),
    start_time: rawData.start_time?.toString().replace("T", " "),
    end_time: rawData.end_time?.toString().replace("T", " "),
    work_location: rawData.work_location?.toString(),
    project_code: rawData.project_code?.toString(),
  };

  const update_timesheet_id = rawData.update_timesheet_id.toString();

  // Validate input using Zod
  const validation_result = timeSheetSchema.safeParse(data);
  if (!validation_result.success) {
    return { error: validation_result.error.errors[0].message };
  }

  if (update_timesheet_id != "new") {
    await updateTimesheet({ update_timesheet_id, ...data });
    return redirect("/timesheets");
  }

  await insertTimesheet(data);

  return redirect("/timesheets");
};

interface validationError {
  error: string;
}

interface LoaderData {
  employees: EmployeeType[];
  timeSheet: TimeSheetType;
  timeSheetId: string;
}
export default function NewTimesheetPage() {
  const validationError = useActionData<validationError>();
  const { employees, timeSheet, timeSheetId } = useLoaderData<LoaderData>();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Create/Update Timesheet
        </h1>
        {timeSheetId !== "new" && (
          <a
            href={`/employees/new?id=${timeSheet.employee_id}`}
            className="hover:text-blue-500"
          >
            View Employee
          </a>
        )}
      </div>

      <TimesheetForm
        employees={employees}
        timeSheetId={timeSheetId}
        timeSheet={timeSheet}
      />
      <hr className="my-6" />
      <p className="text-red-500 mt-4 text-center">
        {validationError && validationError.error}
      </p>
    </div>
  );
}
