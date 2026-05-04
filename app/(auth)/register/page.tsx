"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/lib/validations/auth";
import { getUniqueDeviceId } from "@/lib/utils/device";
import { toast } from "sonner";
import { User, Mail, Lock, Gift, ArrowRight } from "lucide-react";
import z from "zod";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
  });

  useEffect(() => {
    const id = getUniqueDeviceId();
    setValue("deviceId", id);
  }, [setValue]);

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        toast.error(result.message);
      } else {
        toast.success("Account created successfully!");
        // Redirect logic will go here
        router.push("/login");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-indigo-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold tracking-tight">EarnUnity</h1>
          <p className="text-blue-100 text-sm">
            Start your journey to financial freedom
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Name Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
              <input
                {...register("name")}
                className={`w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-lg outline-none transition ${
                  errors.name
                    ? "border-red-500"
                    : "border-slate-200 focus:border-blue-500"
                }`}
                placeholder="John Doe"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500">
                {errors.name.message as string}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
              <input
                {...register("email")}
                className={`w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-lg outline-none transition ${
                  errors.email
                    ? "border-red-500"
                    : "border-slate-200 focus:border-blue-500"
                }`}
                placeholder="example@gmail.com"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500">
                {errors.email.message as string}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
              <input
                {...register("password")}
                type="password"
                className={`w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-lg outline-none transition ${
                  errors.password
                    ? "border-red-500"
                    : "border-slate-200 focus:border-blue-500"
                }`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">
                {errors.password.message as string}
              </p>
            )}
          </div>

          {/* Referral Code Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Referral Code (Optional)
            </label>
            <div className="relative">
              <Gift className="absolute left-3 top-3 text-emerald-500 w-4 h-4" />
              <input
                {...register("referralCode")}
                className="w-full pl-10 pr-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg outline-none"
                placeholder="CODE123"
              />
            </div>
          </div>

          {/* Hidden Device ID Field */}
          <input type="hidden" {...register("deviceId")} />

          {/* Submit Button */}
          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? "Creating Account..." : "Get Started"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
          <p className="text-slate-600 text-sm">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-indigo-600 font-bold cursor-pointer hover:underline"
            >
              Login Now
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
