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
import { Camera, Send, Loader2, Info } from "lucide-react";

interface Props {
  jobId: string;
}

export default function SubmissionForm({ jobId }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(SubmissionFormSchema),
    defaultValues: { jobId },
  });

  // Handle Image Preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: SubmissionFormData) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Uploading proof...");

    try {
      // 1. Upload Image
      const formData = new FormData();
      formData.append("file", data.proofImage[0]);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.success)
        throw new Error("Image upload failed");

      toast.loading("Verifying submission...", { id: toastId });

      // 2. Submit Data to API
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: jobId,
          proofText: data.proofText,
          proofImage: uploadData.imageUrl,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Mission submitted successfully!", { id: toastId });
        reset();
        setPreview(null);
        router.refresh();
      } else {
        toast.error(result.message || "Submission failed", { id: toastId });
      }
    } catch (error) {
      toast.error("Something went wrong!", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800"
    >
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
          <Info className="w-4 h-4 text-indigo-400" />
        </div>
        <h3 className="text-lg font-bold text-white italic">Submit Proof</h3>
      </div>

      <input type="hidden" {...register("jobId")} />

      {/* Proof Text Field */}
      <div className="space-y-3">
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
          Proof Details (Text)
        </label>
        <textarea
          {...register("proofText")}
          rows={3}
          className={`w-full p-4 bg-slate-800/50 border rounded-2xl outline-none transition-all text-slate-200 placeholder:text-slate-600 ${
            errors.proofText
              ? "border-rose-500/50"
              : "border-slate-800 focus:border-indigo-500/50"
          }`}
          placeholder="Enter your username or transaction ID..."
        />
        {errors.proofText && (
          <p className="text-[10px] text-rose-500 font-black uppercase tracking-tight italic">
            {errors.proofText.message}
          </p>
        )}
      </div>

      {/* Proof Image Upload */}
      <div className="space-y-3">
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
          Proof Image (Screenshot)
        </label>

        <div
          className={`relative border-2 border-dashed rounded-2xl p-6 transition-all group flex flex-col items-center justify-center gap-2 ${
            preview
              ? "border-emerald-500/30 bg-emerald-500/5"
              : "border-slate-800 hover:border-indigo-500/30 bg-slate-800/30"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            {...register("proofImage")}
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />

          {preview ? (
            <div className="text-center space-y-2">
              <p className="text-[10px] font-black text-emerald-500 uppercase">
                Image Selected ✓
              </p>
              <img
                src={preview}
                alt="preview"
                className="w-20 h-20 object-cover rounded-lg border border-emerald-500/20 mx-auto"
              />
            </div>
          ) : (
            <>
              <Camera className="w-8 h-8 text-slate-600 group-hover:text-indigo-400 transition-colors" />
              <div className="text-center">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                  Click to upload screenshot
                </p>
                <p className="text-[9px] text-slate-600 mt-1 uppercase">
                  Max Size: 5MB
                </p>
              </div>
            </>
          )}
        </div>
        {errors.proofImage && (
          <p className="text-[10px] text-rose-500 font-black uppercase tracking-tight italic">
            Image is required
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        disabled={isSubmitting}
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-600/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Submit Mission
            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}
