"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SubmissionFormSchema,
  SubmissionFormData,
} from "@/lib/validations/submission";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Camera, Send, Loader2 } from "lucide-react";

interface Props {
  jobId: string;
}

export default function SubmissionForm({ jobId }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(SubmissionFormSchema),
  });

  const onSubmit = async (data: SubmissionFormData) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Uploading proof and submitting...");

    try {
      // 1. Upload image to our professional Cloudinary API
      const formData = new FormData();
      formData.append("file", data.proofImage[0]);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadData.success) throw new Error("Image upload failed");

      // 2. Submit the final data to Submissions API
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          proofText: data.proofText,
          proofImage: uploadData.imageUrl, // URL from Cloudinary
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Work submitted successfully!", { id: toastId });
        router.push("/dashboard/tasks");
        router.refresh();
      } else {
        toast.error(result.message || "Submission failed", { id: toastId });
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Something went wrong. Please try again.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
    >
      <div className="border-l-4 border-blue-600 pl-4">
        <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">
          Submit Your Work
        </h3>
        <p className="text-sm text-slate-500">
          Provide accurate proof to get paid.
        </p>
      </div>

      {/* Proof Text Field */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Work Description / Proof Text
        </label>
        <textarea
          {...register("proofText")}
          rows={4}
          className={`w-full p-4 bg-slate-50 border rounded-xl outline-none transition ${
            errors.proofText
              ? "border-red-500"
              : "border-slate-200 focus:border-blue-600"
          }`}
          placeholder="Enter your username, transaction ID, or details as requested..."
        />
        {errors.proofText && (
          <p className="text-xs text-red-500 font-medium">
            {errors.proofText.message}
          </p>
        )}
      </div>

      {/* Proof Image Upload */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Camera className="w-4 h-4 text-blue-600" /> Upload Screenshot (Proof)
        </label>
        <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-blue-400 transition bg-slate-50">
          <input
            type="file"
            accept="image/*"
            {...register("proofImage")}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="text-center">
            <p className="text-sm text-slate-600 font-medium">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-slate-400 mt-1">
              PNG, JPG or WEBP (Max 5MB)
            </p>
          </div>
        </div>
        {errors.proofImage && (
          <p className="text-xs text-red-500 font-medium">
            {errors.proofImage.message as string}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        disabled={isSubmitting}
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing Submission...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Submit Work for Review
          </>
        )}
      </button>
    </form>
  );
}
