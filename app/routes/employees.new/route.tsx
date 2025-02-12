import {
  redirect,
  useActionData,
  useLoaderData,
  type ActionFunction,
} from "react-router";
import EmployeeForm from "~/componets/employee-form";
import {
  getEmployeeByEmail,
  getEmployeeById,
  insertEmployee,
  updateEmployee,
} from "~/utils/queries";
import {
  employeeSchema,
  type EmployeeDetailsType,
  type EmployeeType,
} from "~/utils/zod";

export async function loader({ request }: { request: { url: string } }) {
  const url = new URL(request.url);
  const employeeId = url.searchParams.get("id");

  if (!employeeId) {
    return { employee: {}, employeeId: "new" };
  }
  // Use the query function to get the employee by ID
  const employee = await getEmployeeById(employeeId);
  return { employee, employeeId };
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

  await insertEmployee({ ...validation_result.data });

  return redirect("/employees");
};

interface validationError {
  error: string;
}

interface LoaderData {
  employee: EmployeeType & EmployeeDetailsType;
  employeeId: string;
}

export default function NewEmployeePage() {
  const validationError = useActionData<validationError>();
  const { employee, employeeId } = useLoaderData<LoaderData>();

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
