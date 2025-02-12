import { Form } from "react-router";
import type { EmployeeType, TimeSheetType } from "~/utils/zod";

interface TimeSheetFormProps {
  employees: EmployeeType[];
  timeSheet: TimeSheetType;
  timeSheetId: string;
}

const TimesheetForm = ({
  employees,
  timeSheet,
  timeSheetId,
}: TimeSheetFormProps) => {
  return (
    <Form method="post" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            TimeSheet ID
          </label>
          <input
            name="timesheet_id"
            type="text"
            defaultValue={timeSheetId}
            disabled
            className="mt-2 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            name="update_timesheet_id"
            type="text"
            defaultValue={timeSheetId}
            hidden
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Employee
          </label>
          <select
            name="employee_id"
            defaultValue={timeSheet.employee_id}
            required
            className="mt-2 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option value={employee.id} key={employee.id}>
                {employee.id} - {employee.full_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Work Location
          </label>
          <select
            name="work_location"
            defaultValue={timeSheet.work_location}
            required
            className="mt-2 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Work Location</option>
            <option value="Office">Office</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Project Code
          </label>
          <input
            name="project_code"
            type="text"
            defaultValue={timeSheet.project_code}
            required
            className="mt-2 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Time
          </label>
          <input
            name="start_time"
            type="datetime-local"
            defaultValue={
              timeSheet.start_time ? timeSheet.start_time.substring(0, 16) : ""
            }
            className="mt-2 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Time
          </label>
          <input
            name="end_time"
            type="datetime-local"
            defaultValue={
              timeSheet.end_time ? timeSheet.end_time.substring(0, 16) : ""
            }
            className="mt-2 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Total Hours
          </label>
          <input
            name="total_hours"
            type="text"
            defaultValue={timeSheet.total_hours}
            disabled
            className="mt-2 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="mt-4 bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {timeSheetId == "new" ? "Create Employee" : "Update Employee"}
        </button>
      </div>
    </Form>
  );
};

export default TimesheetForm;
