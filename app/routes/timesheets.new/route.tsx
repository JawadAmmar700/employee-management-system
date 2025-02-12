import { useLoaderData, Form, redirect, useActionData } from "react-router";
import { getDB } from "~/db/getDB";

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
  return { employees, timeSheet: timeSheet[0], timeSheetId };
}

import type { ActionFunction } from "react-router";
import TimesheetForm from "~/componets/timesheet-form";
import {
  timeSheetSchema,
  type EmployeeType,
  type TimeSheetType,
} from "~/utils/zod";

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
    console.log(validation_result.error.errors);
    return { error: validation_result.error.errors[0].message };
  }

  const db = await getDB();

  if (update_timesheet_id != "new") {
    //TODO update Time Sheet
    await db.run(
      `UPDATE timesheets 
       SET employee_id = ?, start_time = ?, end_time = ?, work_location = ?, project_code = ?
       WHERE timesheets.id = ?`,
      [
        data.employee_id,
        data.start_time,
        data.end_time,
        data.work_location,
        data.project_code,
        update_timesheet_id,
      ]
    );
    return redirect("/timesheets");
  }

  try {
    //TODO Insert the time sheet into the database
    await db.run(
      "INSERT INTO timesheets (employee_id, start_time, end_time, work_location, project_code) VALUES (?, ?, ?, ?, ?)",
      [
        data.employee_id,
        data.start_time,
        data.end_time,
        data.work_location,
        data.project_code,
      ]
    );
  } catch (error) {
    return { error: "SomeThing Went Wrong? - Unsuccessful Mutation" };
  }

  return redirect("/timesheets");
};

interface validationError {
  error: string;
}

export default function NewTimesheetPage() {
  const validationError = useActionData<validationError>();
  const { employees, timeSheet, timeSheetId } = useLoaderData();
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Create/Update Timesheet
      </h1>

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
