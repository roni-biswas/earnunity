import React from "react";
import { FileText } from "lucide-react";
import { PolicyLayout } from "@/components/dashboard/PolicyLayout";

export default function TermsConditionsPage() {
  return (
    <PolicyLayout
      titleEn="Terms & Conditions"
      titleBn="শর্তাবলী এবং নিয়মাবলী"
      updatedEn="May 20, 2026"
      updatedBn="২০ মে, ২০২৬"
      redirectLink="/dashboard"
      icon={<FileText className="w-6 h-6" />}
      // --- ENGLISH CONTENT ---
      contentEn={
        <>
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Account Terms</h2>
            <p className="text-slate-400">
              Each agent is strictly permitted to operate exactly one account.
              Utilizing VPNs, proxies, bots, or automated scrapers to complete
              micro-tasks will trigger an automatic permanent account ban
              without a payout refund.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">
              2. Task Validations & Earnings
            </h2>
            <p className="text-slate-400">
              All submitted tasks are audited by the system admin panel. False
              submissions or uploading fake proof logs will lead to structural
              penalties and immediate reduction of your net balance ledger.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">
              3. Payout Processing Scope
            </h2>
            <p className="text-slate-400">
              Withdraw requests are processed under manual/automated validation
              workflows. Minimum cashout thresholds must be reached, and
              processing times can take up to 24-72 verification cycles.
            </p>
          </section>
        </>
      }
      // --- BANGLA CONTENT ---
      contentBn={
        <>
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">
              ১. অ্যাকাউন্ট ব্যবহারের নিয়মাবলী
            </h2>
            <p className="text-slate-400">
              একজন ইউজার শুধুমাত্র একটি অ্যাকাউন্ট ব্যবহার করতে পারবেন। কোনো
              প্রকার VPN, প্রক্সি, বট (Bot) বা অটোমেটেড স্ক্রিপ্ট ব্যবহার করে
              কাজ করার চেষ্টা করলে আপনার অ্যাকাউন্টটি স্থায়ীভাবে ব্যান করা হবে
              এবং কোনো পেমেন্ট দেওয়া হবে না।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">
              ২. টাস্ক ভেরিফিকেশন ও আর্নিং
            </h2>
            <p className="text-slate-400">
              আপনার সাবমিট করা প্রতিটি কাজ অ্যাডমিন প্যানেল দ্বারা কঠোরভাবে
              যাচাই করা হয়। ভুয়া বা ফেক স্ক্রিনশট সাবমিট করলে আপনার অ্যাকাউন্ট
              থেকে ব্যালেন্স কেটে নেওয়া হবে বা অ্যাকাউন্ট ব্লক করা হবে।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">
              ৩. উইথড্রাল বা পেমেন্ট শর্ত
            </h2>
            <p className="text-slate-400">
              উইথড্র রিকোয়েস্ট দেওয়ার পর তা সিস্টেম রিভিউতে যায়। সর্বনিম্ন
              ক্যাশআউট ব্যালেন্স পূর্ণ হওয়া সাপেক্ষে ২৪ থেকে ৭২ ঘণ্টার মধ্যে
              আপনার বিকাশ/নগদ অ্যাকাউন্টে টাকা পাঠিয়ে দেওয়া হবে।
            </p>
          </section>
        </>
      }
    />
  );
}
