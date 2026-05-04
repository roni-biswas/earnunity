"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  PlusCircle,
  DollarSign,
  Users,
  Link as LinkIcon,
  FileText,
} from "lucide-react";
import { JobSchema } from "@/lib/validations/jobs";

export default function CreateJobPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(JobSchema),
    defaultValues: {
      category: "YouTube",
      title: "",
      description: "",
      instructions: "",
      externalLink: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof JobSchema>) => {
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Job published successfully!");
        reset();
      } else {
        toast.error(result.message || "Failed to publish job");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-600 p-2.5 rounded-xl shadow-indigo-100 shadow-lg">
          <PlusCircle className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Post a New Job
          </h1>
          <p className="text-slate-500 text-sm">
            Create a task for EarnUnity workers.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50"
      >
        {/* Job Title */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-sm font-bold text-slate-700 ml-1">
            Job Title
          </label>
          <input
            {...register("title")}
            className={`w-full p-3.5 bg-slate-50 border rounded-2xl outline-none transition-all ${
              errors.title
                ? "border-red-400 focus:border-red-500 bg-red-50/30"
                : "border-slate-200 focus:border-indigo-500"
            }`}
            placeholder="e.g. Watch my YouTube video and subscribe"
          />
          {errors.title && (
            <p className="text-[11px] font-semibold text-red-500 ml-2">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-700 ml-1">
            Category
          </label>
          <select
            {...register("category")}
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 appearance-none cursor-pointer"
          >
            <option value="YouTube">YouTube</option>
            <option value="Facebook">Facebook</option>
            <option value="App">App Download</option>
            <option value="Survey">Survey</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Reward */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-700 ml-1">
            Reward (৳)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="number"
              step="0.01"
              {...register("reward")}
              className={`w-full pl-11 p-3.5 bg-slate-50 border rounded-2xl outline-none transition-all ${
                errors.reward
                  ? "border-red-400 focus:border-red-500 bg-red-50/30"
                  : "border-slate-200 focus:border-indigo-500"
              }`}
              placeholder="0.00"
            />
          </div>
          {errors.reward && (
            <p className="text-[11px] font-semibold text-red-500 ml-2">
              {errors.reward.message}
            </p>
          )}
        </div>

        {/* Vacancies */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-700 ml-1">
            Total Vacancies
          </label>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="number"
              {...register("totalVacancies")}
              className={`w-full pl-11 p-3.5 bg-slate-50 border rounded-2xl outline-none transition-all ${
                errors.totalVacancies
                  ? "border-red-400 focus:border-red-500 bg-red-50/30"
                  : "border-slate-200 focus:border-indigo-500"
              }`}
              placeholder="100"
            />
          </div>
          {errors.totalVacancies && (
            <p className="text-[11px] font-semibold text-red-500 ml-2">
              {errors.totalVacancies.message}
            </p>
          )}
        </div>

        {/* External Link */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-700 ml-1">
            External Link (Optional)
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              {...register("externalLink")}
              className={`w-full pl-11 p-3.5 bg-slate-50 border rounded-2xl outline-none transition-all ${
                errors.externalLink
                  ? "border-red-400 focus:border-red-500 bg-red-50/30"
                  : "border-slate-200 focus:border-indigo-500"
              }`}
              placeholder="https://youtube.com/..."
            />
          </div>
          {errors.externalLink && (
            <p className="text-[11px] font-semibold text-red-500 ml-2">
              {errors.externalLink.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-sm font-bold text-slate-700 ml-1">
            Job Description
          </label>
          <textarea
            {...register("description")}
            rows={2}
            className={`w-full p-4 bg-slate-50 border rounded-2xl outline-none transition-all resize-none ${
              errors.description
                ? "border-red-400 focus:border-red-500 bg-red-50/30"
                : "border-slate-200 focus:border-indigo-500"
            }`}
            placeholder="Describe the job in a few sentences..."
          />
          {errors.description && (
            <p className="text-[11px] font-semibold text-red-500 ml-2">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Instructions */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-1">
            <FileText className="w-4 h-4 text-indigo-500" /> Work Instructions
          </label>
          <textarea
            {...register("instructions")}
            rows={4}
            className={`w-full p-4 bg-slate-50 border rounded-2xl outline-none transition-all resize-none ${
              errors.instructions
                ? "border-red-400 focus:border-red-500 bg-red-50/30"
                : "border-slate-200 focus:border-indigo-500"
            }`}
            placeholder="Step 1: Click the link&#10;Step 2: Watch for 2 minutes&#10;Step 3: Submit screenshot"
          />
          {errors.instructions && (
            <p className="text-[11px] font-semibold text-red-500 ml-2">
              {errors.instructions.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          disabled={isSubmitting}
          type="submit"
          className="md:col-span-2 mt-2 bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Publishing Job..." : "Post Job Now"}
        </button>
      </form>
    </div>
  );
}
