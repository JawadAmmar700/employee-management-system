import {
  redirect,
  useActionData,
  useLoaderData,
  type ActionFunction,
} from "react-router";
import EmployeeForm from "~/componets/employee-form";
import { getDB } from "~/db/getDB";
import {
  getEmployeeByEmail,
  getEmployeeById,
  insertEmployee,
  updateEmployee,
} from "~/utils/queries";
import { employeeSchema } from "~/utils/zod";

export async function loader({ request }: { request: { url: string } }) {
  const url = new URL(request.url);
  const employeeId = url.searchParams.get("id");

  if (!employeeId) {
    return { employee: {}, employeeId: "new" };
  }

  try {
    // Use the query function to get the employee by ID
    const employee = await getEmployeeById(employeeId);

    return { employee, employeeId };
  } catch (error) {
    return new Response("This Record is not in the database.", { status: 404 });
  }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const update_employee_id = data.update_employee_id.toString();

  // Validate input using Zod
  const validation_result = employeeSchema.safeParse(data);
  if (!validation_result.success) {
    return { error: validation_result.error.errors[0].message };
  }

  const db = await getDB();

  if (update_employee_id != "new") {
    await updateEmployee({ update_employee_id, ...validation_result.data });
    return redirect("/employees");
  }

  // check if the employee email is already in the database.
  const existingEmployee = await getEmployeeByEmail(
    validation_result.data.email
  );

  if (existingEmployee) {
    return { error: "Employee with this email already exists" };
  }

  try {
    // Insert the employee into the database
    await insertEmployee({ ...validation_result.data });
  } catch (error) {
    return { error: "SomeThing Went Wrong? - Unsuccessful Mutation" };
  }

  return redirect("/employees");
};

interface validationError {
  error: string;
}

export default function NewEmployeePage() {
  const validationError = useActionData<validationError>();
  const { employee, employeeId } = useLoaderData();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Create/Update Employee
      </h1>
      <EmployeeForm employee={employee} employeeId={employeeId} />
      <hr className="my-6" />
      <p className="text-red-500 mt-4 text-center">
        {validationError && validationError.error}
      </p>
    </div>
  );
}
