import { z } from "zod";

export const SubmissionFormSchema = z.object({
  proofText: z
    .string()
    .min(10, "Please provide more details about your work (min 10 characters)")
    .max(500, "Proof text is too long"),
  proofImage: z
    .any()
    .refine((files) => files?.length > 0, "Proof screenshot is required")
    .refine(
      (files) => files?.[0]?.size <= 5 * 1024 * 1024,
      "Max file size is 5MB",
    )
    .refine(
      (files) =>
        ["image/jpeg", "image/png", "image/webp"].includes(files?.[0]?.type),
      "Only .jpg, .png, and .webp formats are supported",
    ),
});

export type SubmissionFormData = z.infer<typeof SubmissionFormSchema>;
