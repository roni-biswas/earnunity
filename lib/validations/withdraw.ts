import z from "zod";

// Your original Zod Validation Schema
export const WithdrawZodSchema = z.object({
  userId: z.string(),
  amount: z.number().min(100, "Minimum withdraw amount is 100"),
  method: z.enum(["bKash", "Nagad", "Rocket"]),
  accountNumber: z.string().min(11).max(15),
  status: z.enum(["pending", "completed", "rejected"]).default("pending"),
});

// Schema for the Frontend Form (omitting userId and status as they are handled by backend)
export const WithdrawFormSchema = WithdrawZodSchema.omit({
  userId: true,
  status: true,
});

export type WithdrawType = z.infer<typeof WithdrawZodSchema>;
export type WithdrawFormValues = z.infer<typeof WithdrawFormSchema>;
