"use client";

import React from "react";
import { UserPlus, CheckSquare, Coins, CheckCircle2 } from "lucide-react";

// Mock Data for Live Payouts (Later you can fetch this from your MongoDB withdrawal ledger)
const recentPayouts = [
  {
    id: 1,
    user: "Roni***",
    method: "bKash",
    amount: "৳৫২০",
    time: "2 mins ago",
    status: "Success",
  },
  {
    id: 2,
    user: "Sabbir***",
    method: "Nagad",
    amount: "৳৩৫০",
    time: "12 mins ago",
    status: "Success",
  },
  {
    id: 3,
    user: "Mim***",
    method: "bKash",
    amount: "৳৭৮০",
    time: "28 mins ago",
    status: "Success",
  },
  {
    id: 4,
    user: "Anik***",
    method: "Nagad",
    amount: "৳১৫০",
    time: "45 mins ago",
    status: "Success",
  },
  {
    id: 5,
    user: "Fahim***",
    method: "bKash",
    amount: "৳৪০০",
    time: "1 hour ago",
    status: "Success",
  },
];

export function LandingFeatures() {
  return (
    <section className="bg-[#020617] text-slate-200 py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-900/60 relative">
      {/* Soft Ambient Light Blur */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-87.5 h-87.5 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-24">
        {/* ===================================================================
            SECTION 1: HOW IT WORKS
            =================================================================== */}
        <div id="how-it-works" className="space-y-12 scroll-mt-24">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black uppercase italic text-white tracking-tight">
              How <span className="text-indigo-500">EarnUnity</span> Works?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto">
              কোনো জটিলতা ছাড়াই মাত্র ৩টি সিম্পল স্টেপে আপনার আর্নিং জার্নি শুরু
              করুন।
            </p>
          </div>

          {/* 3-Step Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 bg-[#0b0f1a]/40 border border-slate-900 rounded-2xl relative group hover:border-slate-800 transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center font-bold mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <UserPlus className="w-5 h-5" />
              </div>
              <span className="absolute top-4 right-6 text-4xl font-black text-slate-900 select-none">
                01
              </span>
              <h3 className="text-base font-bold text-white mb-2 uppercase">
                Create Profile
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                ১ মিনিটে সম্পূর্ণ ফ্রিতে একটি সিকিউর অ্যাকাউন্ট তৈরি করুন। কোনো
                প্রকার হিডেন বা অ্যাক্টিভেশন চার্জ নেই।
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-[#0b0f1a]/40 border border-slate-900 rounded-2xl relative group hover:border-slate-800 transition-all duration-300">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center font-bold mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <CheckSquare className="w-5 h-5" />
              </div>
              <span className="absolute top-4 right-6 text-4xl font-black text-slate-900 select-none">
                02
              </span>
              <h3 className="text-base font-bold text-white mb-2 uppercase">
                Complete Tasks
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                ড্যাশবোর্ডে থাকা সহজ সোশ্যাল মিডিয়া ও মাইক্রো-টাস্কগুলো
                সঠিকভাবে সম্পন্ন করে প্রুফ বা স্ক্রিনশট সাবমিট করুন।
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-[#0b0f1a]/40 border border-slate-900 rounded-2xl relative group hover:border-slate-800 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center font-bold mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Coins className="w-5 h-5" />
              </div>
              <span className="absolute top-4 right-6 text-4xl font-black text-slate-900 select-none">
                03
              </span>
              <h3 className="text-base font-bold text-white mb-2 uppercase">
                Instant Withdraw
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                আপনার টাস্ক অ্যাডমিন দ্বারা ভেরিফাই হওয়ার সাথে সাথেই ব্যালেন্স
                সরাসরি বিকাশ বা রকেট/নগদে ক্যাশআউট করে নিন।
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================================
            SECTION 2: LIVE PAYOUT TRACKER
            =================================================================== */}
        <div className="space-y-8 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />{" "}
                Real-time System Audit
              </div>
              <h2 className="text-xl sm:text-3xl font-black uppercase italic text-white tracking-tight">
                Live Payout Ledger 💰
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                আমাদের এজেন্টরা সফলভাবে যে পেমেন্টগুলো উইথড্র করছে তার লাইভ
                আপডেট ট্র্যাকার।
              </p>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-500 font-bold border-l-2 sm:border-l-0 sm:border-r-2 border-indigo-600 pl-3 sm:pl-0 sm:pr-3 py-1">
              ১০০% অটোমেটেড ও ম্যানুয়াল <br /> ভেরিফাইড ট্রানজেকশন
            </div>
          </div>

          {/* Glassmorphic Table Container */}
          <div className="bg-[#0b0f1a]/30 border border-slate-900/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-900/20 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                    <th className="py-4 px-6">Agent Username</th>
                    <th className="py-4 px-6">Payment Method</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6">Time Elapsed</th>
                    <th className="py-4 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/40 text-xs sm:text-sm">
                  {recentPayouts.map((payout) => (
                    <tr
                      key={payout.id}
                      className="hover:bg-slate-900/20 transition-colors group"
                    >
                      {/* User Column */}
                      <td className="py-4 px-6 font-bold text-slate-300 italic group-hover:text-white transition-colors">
                        {payout.user}
                      </td>

                      {/* Method Column */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 font-bold uppercase text-[10px] px-2.5 py-1 rounded-lg ${
                            payout.method === "bKash"
                              ? "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                              : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                          }`}
                        >
                          {payout.method}
                        </span>
                      </td>

                      {/* Amount Column */}
                      <td className="py-4 px-6 font-black text-slate-200">
                        {payout.amount}
                      </td>

                      {/* Time Column */}
                      <td className="py-4 px-6 text-slate-500 font-medium">
                        {payout.time}
                      </td>

                      {/* Status Column */}
                      <td className="py-4 px-6 text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-400 uppercase tracking-wide bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3 shrink-0" />{" "}
                          {payout.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
