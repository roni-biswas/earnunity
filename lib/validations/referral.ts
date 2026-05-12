import z from "zod";

// Validation Schema for Referral
export const ReferralZodSchema = z.object({
  referrerId: z.string(), // The person who shared the link
  referredUserId: z.string(), // The new user who joined
  rewardAmount: z.number().default(0),
  status: z.enum(["active", "inactive"]).default("inactive"), // active if the new user completes a task
});

export type ReferralType = z.infer<typeof ReferralZodSchema>;
