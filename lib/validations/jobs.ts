import * as z from "zod";

export const JobFormSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.enum(["YouTube", "Facebook", "App", "Survey", "Other"]),
  reward: z.number().min(0.01, "Reward must be greater than 0"),
  totalVacancies: z.number().min(1, "At least 1 vacancy required"),
  instructions: z.string().min(10, "Instructions are required"),
  externalLink: z.string().url("Invalid URL").or(z.literal("")).optional(),
  proofType: z.enum(["Screenshot", "Username", "TransactionID"]),
});

export type JobFormData = z.infer<typeof JobFormSchema>;
