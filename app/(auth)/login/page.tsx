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
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-indigo-600 p-8 text-white text-center">
          <h1 className="text-3xl font-bold italic tracking-tighter">
            EarnUnity
          </h1>
          <p className="text-indigo-100 mt-2">
            Log in to manage your tasks and earnings
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
              <input
                {...register("email")}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                placeholder="example@gmail.com"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 font-medium">
                {errors.email.message as string}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
              <input
                {...register("password")}
                type="password"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 font-medium">
                {errors.password.message as string}
              </p>
            )}
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
          >
            {isSubmitting ? "Authenticating..." : "Login to Account"}
            <LogIn className="w-5 h-5" />
          </button>
        </form>

        <div className="p-6 bg-slate-50 text-center border-t border-slate-100">
          <p className="text-slate-600 text-sm">
            Don&apos;t have an account?{" "}
            <span
              onClick={() => router.push("/register")}
              className="text-indigo-600 font-bold cursor-pointer hover:underline"
            >
              Register Now
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
