import { PolicyLayout } from "@/components/dashboard/PolicyLayout";
import { Scale } from "lucide-react";

export default function TermsConditionsPage() {
  return (
    <main className="bg-[#020617] min-h-screen text-slate-200 py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full space-y-10">
        {/* Render the core layout directly without any external cards/borders */}
        <PolicyLayout
          titleEn="Terms & Conditions"
          titleBn="টার্মস অ্যান্ড কন্ডিশনস"
          updatedEn="May 20, 2026"
          updatedBn="২০ মে, ২০২৬"
          redirectLink="/"
          icon={<Scale className="w-6 h-6 text-indigo-400" />}
          // --- ENGLISH CONTENT ---
          contentEn={
            <div className="space-y-6 text-sm sm:text-base text-slate-400 font-medium leading-relaxed mt-6">
              <section className="space-y-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  1. Account Eligibility
                </h2>
                <p>
                  By registering on EarnUnity, you agree that you are accessing
                  the platform as an authorized individual agent. Each user is
                  strictly permitted to maintain only one active profile linked
                  to a single device and IP address.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  2. Task Authenticity & Fraud Prevention
                </h2>
                <p>
                  All submitted task proofs, including screenshots and
                  interaction data, must be authentic. Any use of virtual
                  private networks (VPNs), proxies, automated bots, or submitted
                  fake proofs will result in immediate permanent ban and
                  forfeiture of pending balances.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  3. Payout Processing
                </h2>
                <p>
                  The minimum withdrawal limit is 100 BDT. Earnings are subject
                  to audit by the admin panel and are processed via local mobile
                  financial channels (bKash/Nagad) within 24 to 72 hours under
                  valid operational protocols.
                </p>
              </section>
            </div>
          }
          // --- BANGLA CONTENT ---
          contentBn={
            <div className="space-y-6 text-xs sm:text-sm text-slate-400 font-medium leading-relaxed mt-6">
              <section className="space-y-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  ১. অ্যাকাউন্ট তৈরি ও যোগ্যতা
                </h2>
                <p>
                  EarnUnity-তে রেজিস্ট্রেশন করার মাধ্যমে আপনি সম্মত হচ্ছেন যে
                  আপনি একজন স্বতন্ত্র এজেন্ট হিসেবে প্ল্যাটফর্মটি ব্যবহার করছেন।
                  একজন ব্যবহারকারী কঠোরভাবে শুধুমাত্র একটি ডিভাইস এবং একটি
                  নির্দিষ্ট আইপি (IP) থেকে একটি অ্যাকাউন্ট পরিচালনা করতে পারবেন।
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  ২. টাস্কের সত্যতা ও প্রতারণা প্রতিরোধ
                </h2>
                <p>
                  দাখিলকৃত সমস্ত কাজের প্রমাণ বা স্ক্রিনশট অবশ্যই শতভাগ সত্য হতে
                  হবে। যেকোনো প্রকার ভিপিএন (VPN), প্রক্সি, অটোমেটেড বট বা ভুয়া
                  প্রুফ সাবমিট করলে আপনার অ্যাকাউন্টটি স্থায়ীভাবে ব্লক করা হবে
                  এবং অর্জিত সমস্ত ব্যালেন্স বাতিল বলে গণ্য হবে।
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  ৩. পেমেন্ট বা উইথড্রাল নীতি
                </h2>
                <p>
                  আমাদের প্ল্যাটফর্মের সর্বনিম্ন উইথড্রাল লিমিট হলো ১০০ টাকা।
                  সমস্ত পেমেন্ট রিকোয়েস্ট অ্যাডমিন প্যানেল দ্বারা সম্পূর্ণ
                  ম্যানুয়ালি যাচাই করার পর ২৪ থেকে ৭২ ঘণ্টার মধ্যে আপনার
                  নির্দিষ্ট বিকাশ বা নগদ নম্বরে পাঠিয়ে দেওয়া হবে।
                </p>
              </section>
            </div>
          }
        />
      </div>
    </main>
  );
}
