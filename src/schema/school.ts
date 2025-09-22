import z from "zod";

// Phone number validation function
const validatePhoneNumber = (value: string) => {
  return /^\+?[0-9]{7,15}$/.test(value);
};

export const schoolProfileSchema = z.object({
  schoolName: z
    .string()
    .min(1, "School name is required")
    .min(2, "School name must be at least 2 characters"),
  institutionType: z.string().min(1, "Institution type is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  zipCode: z.string().min(1, "ZIP/Postal code is required"),
  country: z.string().min(1, "Country is required"),
  contactEmail: z
    .string()
    .min(1, "Contact email is required")
    .email("Please enter a valid email address"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .min(10, "Please enter a valid phone number"),
  website: z.string().optional(),
  socialMedia: z.string().optional(),
  logo: z.any().optional(),
});

const termObject = z
  .object({
    name: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine(
    (term) => {
      const values = [term.startDate, term.endDate];
      const filledCount = values.filter(Boolean).length;
      return filledCount === 0 || filledCount === values.length;
    },
    {
      message: "If you fill one field, all fields are required",
      path: ["startDate"],
    }
  );

export const academicStructureSchema = z.object({
  levelSystem: z.string().min(1, "Academic level system is required"),
  departments: z.array(z.string()).optional(),
  subjects: z.array(z.string()).min(1, "At least one subject is required"),
  academicYearStart: z.string().min(1, "Academic year start date is required"),
  academicYearEnd: z.string().min(1, "Academic year end date is required"),
  termSystem: z.string().min(1, "Term system is required"),
  terms: z.array(termObject).optional(),
  currentTerm: z.string().min(1, "Current term is required"),
});

const gradeObject = z
  .object({
    grade: z.string().optional(),
    minPercentage: z.string().optional(),
    maxPercentage: z.string().optional(),
    remark: z.string().optional(),
  })
  .refine(
    (grade) => {
      const values = [grade.minPercentage, grade.maxPercentage, grade.remark];
      const filledCount = values.filter(Boolean).length;
      return filledCount === 0 || filledCount === values.length;
    },
    {
      message: "If you fill one field, all fields are required",
      path: ["minPercentage"],
    }
  );

export const configurationSchema = z.object({
  gradingSystem: z.string().min(1, "Grading system is required"),
  gradeScale: z.array(gradeObject).optional(),
  passingGrade: z.string().min(1, "Passing grade is required"),
  timezone: z.string().min(1, "Timezone is required"),
});
