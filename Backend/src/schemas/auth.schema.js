import { z } from "zod";

const nameField = z
  .string({ required_error: "Name is required" })
  .min(2, "Name must be at least 2 characters")
  .max(60, "Name must be under 60 characters")
  .transform((val) => val.trim());

const emailField = z
  .string({ required_error: "Email is required" })
  .email("Invalid email address")
  .transform((val) => val.toLowerCase().trim());

const passwordField = z
  .string({ required_error: "Password is required" })
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password too long");

export const signupSchema = z.object({
  name: nameField,
  email: emailField,
  password: passwordField,
  role: z.enum(["student", "faculty", "admin"], {
    required_error: "Role is required",
    invalid_type_error: "Role must be student, faculty, or admin",
  }),
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Password is required"),
});

export const otpSchema = z.object({
  email: emailField,
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must be 6 digits"),
});
