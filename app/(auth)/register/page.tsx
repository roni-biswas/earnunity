import RegisterFormClient from "@/components/auth/RegisterFormClient";
import { Metadata } from "next";
import { Suspense } from "react";

// SEO Metadata for the Registration Page
export const metadata: Metadata = {
  title: "Create an Account",
  description:
    "Join EarnUnity today to start completing tasks, earning rewards, and achieving financial freedom.",
  openGraph: {
    title: "Register | EarnUnity - Join the Community",
    description:
      "Create your free account on EarnUnity and access premium micro-tasks instantly.",
  },
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#020617] flex items-center justify-center text-xs font-black uppercase tracking-widest text-slate-500 animate-pulse">
          Loading Secure System...
        </div>
      }
    >
      <RegisterFormClient />
    </Suspense>
  );
}
