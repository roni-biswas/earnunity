import z from "zod";

// Zod Validation Schema for withdraw
export const WithdrawZodSchema = z.object({
  userId: z.string(),
  amount: z.number().min(20, "Minimum withdraw amount is 20"), // Example limit
  method: z.enum(["bKash", "Nagad", "Rocket"]),
  accountNumber: z.string().min(11).max(15),
  status: z.enum(["pending", "completed", "rejected"]).default("pending"),
});

export type WithdrawType = z.infer<typeof WithdrawZodSchema>;
