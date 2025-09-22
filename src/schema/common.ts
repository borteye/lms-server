import z from "zod";

export const teacherSingleRegisterSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  contactEmail: z.string().email("Please enter a valid email address"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .min(10, "Please enter a valid phone number"),
  qualifications: z.array(z.string()).optional(),
  department: z.string().optional(),
});

export const studentSingleRegisterSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  contactEmail: z.string().email("Please enter a valid email address"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .min(10, "Please enter a valid phone number"),
  class_id: z.string().optional(),
  stream: z.string().optional(),
});

export const classAssignedSubjectTeacher = z.object({
  class: z.string().min(1, "Class is required"),
  teacher: z.string().optional(),
});

export const createCourseSchema = z.object({
  scope: z.string().min(1, "Scope is required"),
  subject: z.string().min(1, "Subject is required"),
  class: z.string().optional(),
  stream: z.string().optional(),
  teacher: z.string().optional(),
  class_assigned_subject_teacher: z
    .array(classAssignedSubjectTeacher)
    .optional(),
});
