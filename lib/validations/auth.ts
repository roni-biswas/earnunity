import { z } from "zod";

// register schema
export const RegisterSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  deviceId: z.string().min(1, "Device ID is required for security"),
  referralCode: z.string().optional(),
});

// Login Schema
export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required to login"),
});
