import { optional, z } from "zod";

export const employeeSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z
    .string()
    .email("Invalid email format")
    .refine(
      (val) =>
        /[a-zA-Z]/.test(val) &&
        /\d/.test(val) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(val),
      {
        message: "Email must contain letters, numbers, and special characters",
      }
    ),
  phone_number: z
    .string()
    .optional()
    .refine((val) => val && /^[\d\-\+\(\)\s]+$/.test(val), {
      message: "Phone number is invalid",
    }),
  date_of_birth: z
    .string()
    .optional()
    .refine((val) => val && /^\d{4}-\d{2}-\d{2}$/.test(val), {
      message: "Date of birth must be in YYYY-MM-DD format",
    }),
  hire_date: z
    .string()
    .min(10, "Hire date must be in YYYY-MM-DD format")
    .refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
      message: "Hire date must be in YYYY-MM-DD format",
    }),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .refine((val) => val !== undefined, {
      message: "Address is required if provided",
    }),
  city: z
    .string()
    .min(2, "City name is required")
    .refine((val) => val !== undefined, {
      message: "City is required if provided",
    }),
  state: z
    .string()
    .min(2, "State name is required")
    .refine((val) => val !== undefined, {
      message: "State is required if provided",
    }),
  zip_code: z.string().optional(),
  country: z
    .string()
    .min(2, "Country name is required")
    .refine((val) => val !== undefined, {
      message: "Country is required if provided",
    }),
  job_title: z.string().min(2, "Job title is required"),
  department: z.string().min(2, "Department is required"),
  salary: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().min(0, "Salary must be a positive number")
  ),
  employment_type: z.enum(["Full-Time", "Part-Time", "Contractor", "Intern"], {
    message: "Employment type is required",
  }),
  office_location: z.string().optional(),
});

export type FormType = z.infer<typeof employeeSchema>;

export type EmployeeType = {
  id?: string;
  full_name: string;
  email: string;
  address: string;
  state: string;
  city: string;
  country: string;
  phone_number?: string | undefined;
  zip_code?: string | undefined;
  hire_date: string;
  date_of_birth?: string | undefined;
  created_at?: string | undefined;
  updated_at?: string | undefined;
};

export type EmployeeDetailsType = {
  job_title: string;
  salary: number;
  department: string;
  employment_type: "Full-Time" | "Part-Time" | "Contractor" | "Intern";
  office_location?: string | undefined;
};

export const timeSheetSchema = z
  .object({
    employee_id: z
      .number()
      .int("Employee ID must be an integer")
      .positive("Employee ID must be a positive number"),
    start_time: z
      .string()
      .refine(
        (val) => !isNaN(Date.parse(val)),
        "Start time must be a valid datetime in ISO 8601 format (e.g., 2023-02-15T09:00:00)"
      ),
    end_time: z
      .string()
      .refine(
        (val) => !isNaN(Date.parse(val)),
        "End time must be a valid datetime in ISO 8601 format (e.g., 2023-02-15T17:00:00)"
      ),
    work_location: z
      .enum(["Office", "Remote", "Hybrid"], {
        message: "Invalid work location",
      })
      .default("Office"),
    project_code: z
      .string()
      .max(50, "Project code must not exceed 50 characters"),
  })
  .refine((data) => Date.parse(data.start_time) < Date.parse(data.end_time), {
    message: "Start time must be before end time",
    path: ["start_time"],
  })
  .refine((data) => Date.parse(data.end_time) > Date.parse(data.start_time), {
    message: "End time must be after start time",
    path: ["end_time"],
  });

export type TimeSheetType = { id: string; total_hours: string } & z.infer<
  typeof timeSheetSchema
>;
