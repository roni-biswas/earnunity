import LoginFormClient from "@/components/auth/LoginFormClient";
import { Metadata } from "next";
import { Suspense } from "react";

// SEO Metadata for the Login Page
export const metadata: Metadata = {
  title: "Login",
  description:
    "Log in to your EarnUnity account to manage your micro-tasks, view approvals, and track your daily earnings seamlessly.",
  openGraph: {
    title: "Login | EarnUnity - Access Your Dashboard",
    description:
      "Access your secure EarnUnity dashboard and start earning rewards today.",
  },
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#020617] flex items-center justify-center text-xs font-black uppercase tracking-widest text-slate-500 animate-pulse">
          Loading Secure Gateway...
        </div>
      }
    >
      <LoginFormClient />
    </Suspense>
  );
}
