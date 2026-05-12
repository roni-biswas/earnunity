import z from "zod";

// Validation Schema for Transaction
export const TransactionZodSchema = z.object({
  userId: z.string(),
  amount: z.number(),
  type: z.enum(["income", "expense"]), // income for earnings, expense for withdraw
  category: z.enum(["task", "referral", "withdraw", "bonus"]),
  description: z.string(), // e.g., "Earned from Task #102"
  balanceAfter: z.number(), // Stores the user's balance after this transaction for audit
});

export type TransactionType = z.infer<typeof TransactionZodSchema>;
