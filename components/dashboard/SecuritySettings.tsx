"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema, PasswordFormValues } from "@/types/settings";
import { toast } from "sonner";
import { KeyRound, Loader2 } from "lucide-react";

export default function SecuritySettings() {
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormValues) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      toast.success("Password changed successfully");
      reset();
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-slate-900/40 border border-slate-800 rounded-[2rem] p-6 shadow-xl text-white"
    >
      <div>
        <h3 className="text-lg font-black uppercase tracking-tight italic">
          Update Password
        </h3>
        <p className="text-xs text-slate-400">
          Ensure your account is using a secure password.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Current Password
          </label>
          <input
            {...register("currentPassword")}
            type="password"
            className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-sm font-medium focus:outline-hidden focus:border-indigo-500 transition-colors"
            placeholder="••••••••"
          />
          {errors.currentPassword && (
            <p className="text-xs text-rose-500 font-bold">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            New Password
          </label>
          <input
            {...register("newPassword")}
            type="password"
            className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-sm font-medium focus:outline-hidden focus:border-indigo-500 transition-colors"
            placeholder="Minimum 6 characters"
          />
          {errors.newPassword && (
            <p className="text-xs text-rose-500 font-bold">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Confirm New Password
          </label>
          <input
            {...register("confirmPassword")}
            type="password"
            className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-sm font-medium focus:outline-hidden focus:border-indigo-500 transition-colors"
            placeholder="Repeat new password"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-rose-500 font-bold">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white hover:bg-slate-100 text-slate-900 font-black text-xs py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <KeyRound className="w-4 h-4" /> CHANGE PASSWORD
          </>
        )}
      </button>
    </form>
  );
}
