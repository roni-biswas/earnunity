import z from "zod";

export const JobSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  instructions: z.string().min(20, "Instructions are required for users"),
  reward: z.coerce.number().min(1, "Reward must be at least 1 Taka"),
  totalVacancies: z.coerce.number().min(1, "At least 1 vacancy required"),
  category: z.enum(["YouTube", "Facebook", "App", "Survey", "Other"]),
  externalLink: z
    .string()
    .url("Valid URL is required")
    .optional()
    .or(z.literal("")),
});
