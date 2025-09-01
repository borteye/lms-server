import z from "zod";

export const adminRegisterSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email address"),
    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .min(10, "Please enter a valid phone number"),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "Passwords do not match",
  });
