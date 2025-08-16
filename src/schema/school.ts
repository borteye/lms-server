import * as yup from "yup";

// Phone number validation function
const validatePhoneNumber = (value: string) => {
  return /^\+?[0-9]{7,15}$/.test(value);
};

const gradeSchema = yup.object().shape({
  min: yup.string().required("Min is required").min(1, "Min is required"),
  max: yup.string().required("Max is required").min(1, "Max is required"),
  grade: yup.string().required("Grade is required").min(1, "Grade is required"),
  remark: yup
    .string()
    .required("Remark is required")
    .min(1, "Remark is required"),
});

export const createSchoolSchema = yup.object().shape({
  schoolName: yup
    .string()
    .min(2, "School name must be at least 2 characters")
    .required("School name is required"),
  schoolEmail: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  schoolPhoneNumber: yup
    .string()
    .required("Phone number is required")
    .test("is-valid-phone", "Invalid phone number format", validatePhoneNumber),

  // From formTwoSchema
  schoolType: yup
    .string()
    .oneOf(["junior high", "senior high"], "Invalid school type")
    .required("School type is required"),
  country: yup.string().required("Country is required"),
  timezone: yup.string().required("Timezone is required"),

  // From formThreeSchema
  academicYear: yup
    .string()
    .required("Academic year is required")
    .matches(/^\d{4}\/\d{4}$/, "Academic year must be in the format YYYY/YYYY"),
  academicStartDate: yup.string().required("Start date is required"),
  academicEndDate: yup.string().required("End date is required"),
  numberOfTermsOrSemesters: yup
    .string()
    .required("Number of terms/semesters must be at least 1"),
  currentTermOrSemester: yup.string().required("Current term is required"),

  // Array of grading objects
  gradingSystem: yup.array().of(gradeSchema).optional(),

  // Cloudinary image URL
  schoolLogo: yup
    .string()
    .url("Invalid logo URL")
    .required("School logo is required"),
});
