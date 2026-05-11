"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { JobFormData, JobFormSchema } from "@/lib/validations/jobs";

export default function CreateJobPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(JobFormSchema),
    defaultValues: { category: "Other", proofType: "Screenshot" },
  });

  const onSubmit = async (data: JobFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Job published successfully!");
        router.push("/admin/jobs");
        router.refresh();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Error creating job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/jobs"
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Post a New Job</h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-2xl border shadow-sm"
      >
        {/* Title */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-semibold">Job Title</label>
          <input
            {...register("title")}
            className="w-full p-3 border rounded-xl outline-none focus:border-blue-500"
            placeholder="e.g. Subscribe to my YouTube Channel"
          />
          {errors.title && (
            <p className="text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Category</label>
          <select
            {...register("category")}
            className="w-full p-3 border rounded-xl outline-none focus:border-blue-500 bg-white"
          >
            <option value="YouTube">YouTube</option>
            <option value="Facebook">Facebook</option>
            <option value="App">App Review</option>
            <option value="Survey">Survey</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Reward */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Reward ($)</label>
          <input
            type="number"
            step="0.01"
            {...register("reward")}
            className="w-full p-3 border rounded-xl outline-none focus:border-blue-500"
            placeholder="0.50"
          />
          {errors.reward && (
            <p className="text-xs text-red-500">{errors.reward.message}</p>
          )}
        </div>

        {/* Vacancies */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Total Vacancies</label>
          <input
            type="number"
            {...register("totalVacancies")}
            className="w-full p-3 border rounded-xl outline-none focus:border-blue-500"
            placeholder="100"
          />
          {errors.totalVacancies && (
            <p className="text-xs text-red-500">
              {errors.totalVacancies.message}
            </p>
          )}
        </div>

        {/* Proof Type */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Required Proof</label>
          <select
            {...register("proofType")}
            className="w-full p-3 border rounded-xl outline-none focus:border-blue-500 bg-white"
          >
            <option value="Screenshot">Screenshot</option>
            <option value="Username">Username</option>
            <option value="TransactionID">Transaction ID</option>
          </select>
        </div>

        {/* External Link */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-semibold">
            Target Link (Optional)
          </label>
          <input
            {...register("externalLink")}
            className="w-full p-3 border rounded-xl outline-none focus:border-blue-500"
            placeholder="https://youtube.com/..."
          />
        </div>

        {/* Instructions */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-semibold">
            Step-by-Step Instructions
          </label>
          <textarea
            {...register("instructions")}
            rows={4}
            className="w-full p-3 border rounded-xl outline-none focus:border-blue-500"
            placeholder="1. Go to link... 2. Watch 2 mins... 3. Subscribe..."
          />
          {errors.instructions && (
            <p className="text-xs text-red-500">
              {errors.instructions.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-semibold">Job Description</label>
          <textarea
            {...register("description")}
            rows={3}
            className="w-full p-3 border rounded-xl outline-none focus:border-blue-500"
            placeholder="Briefly explain the job..."
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="md:col-span-2 pt-4">
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={20} />
            )}
            {loading ? "Publishing..." : "Publish Job"}
          </button>
        </div>
      </form>
    </div>
  );
}
