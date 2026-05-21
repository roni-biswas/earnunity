import React from "react";
import { ShieldCheck } from "lucide-react";
import { PolicyLayout } from "@/components/dashboard/PolicyLayout";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how EarnUnity collects, protects, and manages your personal data, wallet transactions, and account details. Read our user data protection guidelines.",

  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy - User Data & Security | EarnUnity",
    description:
      "Your security is our priority. Read the EarnUnity Privacy Policy to understand how we safeguard your information and micro-task data.",
    type: "website",
    url: "https://earnunity.com/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      titleEn="Privacy Policy"
      titleBn="প্রাইভেসি পলিসি"
      updatedEn="May 20, 2026"
      updatedBn="২০ মে, ২০২৬"
      redirectLink="/dashboard"
      icon={<ShieldCheck className="w-6 h-6" />}
      // --- ENGLISH CONTENT ---
      contentEn={
        <>
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">
              1. Information We Collect
            </h2>
            <p className="text-slate-400">
              To provide a secure micro-earning ecosystem, EarnUnity collects
              your name, email address, payment details (bKash/Nagad), and
              device IP configurations for fraud prevention.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">
              2. How We Use Your Data
            </h2>
            <p className="text-slate-400">
              Your information is utilized solely to process verified payouts,
              secure task validations, prevent multi-account cheating, and
              broadcast live system updates via real-time sockets.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">
              3. Data Security & Analytics
            </h2>
            <p className="text-slate-400">
              We encrypt all critical transaction states using MongoDB Atlas
              security layer. EarnUnity never sells or rents user data
              structures to third-party marketing brokers.
            </p>
          </section>
        </>
      }
      // --- BANGLA CONTENT ---
      contentBn={
        <>
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">
              ১. আমরা যে তথ্য সংগ্রহ করি
            </h2>
            <p className="text-slate-400">
              একটি নিরাপদ মাইক্রো-আর্নিং প্ল্যাটফর্ম নিশ্চিত করতে, EarnUnity
              আপনার নাম, ইমেল ঠিকানা, পেমেন্ট বিবরণ (বিকাশ/নগদ) এবং প্রতারণা
              রোধে ডিভাইসের আইপি (IP) অ্যাড্রেস সংগ্রহ করে।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">২. তথ্যের ব্যবহার</h2>
            <p className="text-slate-400">
              আপনার তথ্য শুধুমাত্র সঠিক উপায়ে উইথড্রাল প্রসেস করতে, টাস্কের
              সত্যতা যাচাই করতে, মাল্টিপল অ্যাকাউন্ট খুলে চিটিং করা রোধ করতে এবং
              লাইভ নোটিফিকেশন পাঠানোর কাজে ব্যবহার করা হয়।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">৩. ডাটা নিরাপত্তা</h2>
            <p className="text-slate-400">
              আমরা আপনার সমস্ত ট্রানজেকশন ডাটাবেজে অত্যন্ত নিরাপদে এনক্রিপ্ট করে
              রাখি। EarnUnity কখনো কোনো থার্ড-পার্টি বা বাইরের কোনো এজেন্সির
              কাছে আপনার ব্যক্তিগত তথ্য বিক্রি বা শেয়ার করে না।
            </p>
          </section>
        </>
      }
    />
  );
}
