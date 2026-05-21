import { PolicyLayout } from "@/components/dashboard/PolicyLayout";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-[#020617] min-h-screen text-slate-200 py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full space-y-10">
        {/* Render the core layout directly without any external cards/borders */}
        <PolicyLayout
          titleEn="Privacy Policy"
          titleBn="প্রাইভেসি পলিসি"
          updatedEn="May 20, 2026"
          updatedBn="২০ মে, ২০২৬"
          redirectLink="/"
          icon={<ShieldCheck className="w-6 h-6 text-indigo-400" />}
          // --- ENGLISH CONTENT ---
          contentEn={
            <div className="space-y-6 text-sm sm:text-base text-slate-400 font-medium leading-relaxed mt-6">
              <section className="space-y-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  1. Information We Collect
                </h2>
                <p>
                  To provide a secure micro-earning ecosystem, EarnUnity
                  collects your name, email address, payment details
                  (bKash/Nagad), and device IP configurations for fraud
                  prevention.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  2. How We Use Your Data
                </h2>
                <p>
                  Your information is utilized solely to process verified
                  payouts, secure task validations, prevent multi-account
                  cheating, and broadcast live system updates via real-time
                  sockets.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  3. Data Security & Analytics
                </h2>
                <p>
                  We encrypt all critical transaction states using MongoDB Atlas
                  security layer. EarnUnity never sells or rents user data
                  structures to third-party marketing brokers.
                </p>
              </section>
            </div>
          }
          // --- BANGLA CONTENT ---
          contentBn={
            <div className="space-y-6 text-xs sm:text-sm text-slate-400 font-medium leading-relaxed mt-6">
              <section className="space-y-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  ১. আমরা যে তথ্য সংগ্রহ করি
                </h2>
                <p>
                  একটি নিরাপদ মাইক্রো-আর্নিং প্ল্যাটফর্ম নিশ্চিত করতে, EarnUnity
                  আপনার নাম, ইমেল ঠিকানা, পেমেন্ট বিবরণ (বিকাশ/নগদ) এবং প্রতারণা
                  রোধে ডিভাইসের আইপি (IP) অ্যাড্রেস সংগ্রহ করে।
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  ২. তথ্যের ব্যবহার
                </h2>
                <p>
                  আপনার তথ্য শুধুমাত্র সঠিক উপায়ে উইথড্রাল প্রসেস করতে, টাস্কের
                  সত্যতা যাচাই করতে, মাল্টিপল অ্যাকাউন্ট খুলে চিটিং করা রোধ করতে
                  এবং লাইভ নোটিফিকেশন পাঠানোর কাজে ব্যবহার করা হয়।
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  ৩. ডাটা নিরাপত্তা
                </h2>
                <p>
                  আমরা আপনার সমস্ত ট্রানজেকশন ডাটাবেজে অত্যন্ত নিরাপদে এনক্রিপ্ট
                  করে রাখি। EarnUnity কখনো কোনো থার্ড-পার্টি বা বাইরের কোনো
                  এজেন্সির কাছে আপনার ব্যক্তিগত তথ্য বিক্রি বা শেয়ার করে না।
                </p>
              </section>
            </div>
          }
        />
      </div>
    </main>
  );
}
