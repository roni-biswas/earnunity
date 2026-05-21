"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, Lock, LogIn } from "lucide-react";
import { LoginSchema } from "@/lib/validations/auth";

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Welcome back to EarnUnity!");
      router.push("/dashboard");
      router.refresh();
    }
  };

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
            Log in to manage your tasks and earnings
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
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

          {/* Submit Button */}
          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-indigo-600/10 mt-2"
          >
            {isSubmitting ? "Authenticating..." : "Login to Account"}
            <LogIn className="w-4 h-4" />
          </button>
        </form>

        {/* Form Footer */}
        <div className="p-4 bg-[#020617]/40 text-center border-t border-slate-900">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">
            Don&apos;t have an account?{" "}
            <span
              onClick={() => router.push("/register")}
              className="text-indigo-400 font-black cursor-pointer hover:text-indigo-300 transition-colors"
            >
              Register Now
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
