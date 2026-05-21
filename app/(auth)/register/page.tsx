"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/lib/validations/auth";
import { getUniqueDeviceId } from "@/lib/utils/device";
import { toast } from "sonner";
import { User, Mail, Lock, Gift, ArrowRight } from "lucide-react";
import z from "zod";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
  });

  // Handle URL Referral Code and Device ID on Mount
  useEffect(() => {
    // 1. Get dynamic device ID
    const id = getUniqueDeviceId();
    setValue("deviceId", id);

    // 2. Extract "ref" from URL (e.g., ?ref=ronnie425)
    const refCode = searchParams.get("ref");
    if (refCode) {
      setValue("referralCode", refCode);
      toast.success(`Referral code "${refCode}" applied!`, {
        description: "Bonus milestone will sync upon active task completions.",
      });
    }
  }, [setValue, searchParams]);

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
        router.push("/login");
      }
    } catch (error: unknown) {
      console.error("REGISTRATION_SUBMIT_ERROR:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Check if a referral code came from the URL to lock the input field
  const hasUrlRefCode = !!searchParams.get("ref");

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Soft Neon Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full bg-[#0b0f1a]/60 border border-slate-900 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl relative z-10">
        {/* Header Section */}
        <div className="border-b border-slate-900 p-6 text-center">
          <h1 className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-linear-to-r from-white via-slate-200 to-indigo-400 uppercase italic">
            EarnUnity
          </h1>
          <p className="text-slate-400 text-xs font-semibold mt-1 tracking-wide uppercase">
            Start your journey to financial freedom
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-500 w-4 h-4" />
              <input
                {...register("name")}
                className={`w-full pl-10 pr-4 py-2 bg-[#020617]/40 border rounded-lg outline-none text-sm text-slate-200 transition ${
                  errors.name
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-slate-900 focus:border-indigo-500"
                }`}
                placeholder="John Doe"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-400 font-medium">
                {errors.name.message as string}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-500 w-4 h-4" />
              <input
                {...register("email")}
                className={`w-full pl-10 pr-4 py-2 bg-[#020617]/40 border rounded-lg outline-none text-sm text-slate-200 transition ${
                  errors.email
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-slate-900 focus:border-indigo-500"
                }`}
                placeholder="example@gmail.com"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-400 font-medium">
                {errors.email.message as string}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-500 w-4 h-4" />
              <input
                {...register("password")}
                type="password"
                className={`w-full pl-10 pr-4 py-2 bg-[#020617]/40 border rounded-lg outline-none text-sm text-slate-200 transition ${
                  errors.password
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-slate-900 focus:border-indigo-500"
                }`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-400 font-medium">
                {errors.password.message as string}
              </p>
            )}
          </div>

          {/* Referral Code Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400">
              Referral Code {hasUrlRefCode ? "(Applied)" : "(Optional)"}
            </label>
            <div className="relative">
              <Gift
                className={`absolute left-3 top-3 w-4 h-4 ${hasUrlRefCode ? "text-emerald-400" : "text-slate-500"}`}
              />
              <input
                {...register("referralCode")}
                readOnly={hasUrlRefCode}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg outline-none text-sm transition ${
                  hasUrlRefCode
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400 font-bold cursor-not-allowed select-none"
                    : "bg-[#020617]/40 border-slate-900 text-slate-200 focus:border-indigo-500"
                }`}
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
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-indigo-600/10 mt-2"
          >
            {isSubmitting ? "Creating Account..." : "Get Started"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Form Footer */}
        <div className="p-4 bg-[#020617]/40 text-center border-t border-slate-900">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-indigo-400 font-black cursor-pointer hover:text-indigo-300 transition-colors"
            >
              Login Now
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
