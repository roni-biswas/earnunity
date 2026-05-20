"use client";

import React, { useState } from "react";
import {
  Plus,
  Minus,
  ArrowRight,
  Globe,
  Share2,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

// FAQ Data Structure
const faqs = [
  {
    question: "এখানে কাজ শুরু করতে কি কোনো টাকা ইনভেস্ট করতে হবে?",
    answer:
      "না, EarnUnity সম্পূর্ণ ফ্রি একটি প্ল্যাটফর্ম। এখানে কাজ শুরু করার জন্য আপনাকে কোনো টাকা বা অ্যাক্টিভেশন ফি দিতে হবে না। আপনি সরাসরি অ্যাকাউন্ট খুলে টাস্ক কমপ্লিট করে আয় করা শুরু করতে পারেন।",
  },
  {
    question: "আমি কি একই মোবাইল থেকে একাধিক অ্যাকাউন্ট চালাতে পারব?",
    answer:
      "না, এটি আমাদের কঠোর নিয়মের পরিপন্থী। একটি মোবাইল বা একই আইপি (IP) অ্যাড্রেস থেকে একটির বেশি অ্যাকাউন্ট ব্যবহার করলে আপনার সবকটি অ্যাকাউন্ট স্থায়ীভাবে ব্যান করা হবে।",
  },
  {
    question: "ন্যূনতম কত টাকা হলে উইথড্র দেওয়া যাবে?",
    answer:
      "আপনার অ্যাকাউন্টে সর্বনিম্ন ১০০ টাকা জমা হলেই আপনি বিকাশ বা নগদের মাধ্যমে ক্যাশআউট রিকোয়েস্ট পাঠাতে পারবেন।",
  },
  {
    question: "আমি কি ভিপিএন (VPN) ব্যবহার করে কাজ করতে পারব?",
    answer:
      "না, ভিপিএন বা কোনো প্রকার প্রক্সি ব্যবহার করে টাস্ক কমপ্লিট করলে সিস্টেম তা স্বয়ংক্রিয়ভাবে ডিটেক্ট করবে এবং আপনার আর্নিং বাতিলসহ অ্যাকাউন্ট ব্লক করে দেওয়া হতে পারে।",
  },
  {
    question: "পেমেন্ট পেতে কতক্ষণ সময় লাগে?",
    answer:
      "উইথড্র রিকোয়েস্ট দেওয়ার পর অ্যাডমিন আপনার কাজের প্রুফগুলো যাচাই করবে। সাধারণত ২৪ থেকে ৭২ ঘণ্টার মধ্যে আপনার পেমেন্ট সাকসেসফুলি পাঠিয়ে দেওয়া হয়।",
  },
];

export function LandingFooter() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <footer className="bg-[#020617] border-t border-slate-900 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* ===================================================================
            SECTION 3: DYNAMIC FAQ (Accordion)
            =================================================================== */}
        <div className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black uppercase italic text-white tracking-tight">
              Common <span className="text-indigo-500">Questions</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto">
              আপনার মনে থাকা সাধারণ প্রশ্নগুলোর উত্তর এখানে দেখে নিন।
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#0b0f1a]/40 border border-slate-900 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-900/20 transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-200">
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <Minus className="w-4 h-4 text-indigo-500 shrink-0" />
                  ) : (
                    <Plus className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                </button>

                {openIndex === index && (
                  <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-300">
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800 pt-4">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ===================================================================
            SECTION 4: FINAL CALL TO ACTION (CTA)
            =================================================================== */}
        <div className="relative group">
          <div className="absolute inset-0 bg-linear-to-r from-indigo-600/20 to-violet-600/20 blur-3xl opacity-50 pointer-events-none" />
          <div className="relative p-10 sm:p-16 bg-[#0b0f1a]/60 border border-indigo-500/20 rounded-[2.5rem] text-center space-y-8 backdrop-blur-xl">
            <h2 className="text-3xl sm:text-5xl font-black text-white italic uppercase tracking-tight">
              Ready to <span className="text-indigo-500">Earn?</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              হাজারো এজেন্টদের সাথে আজই যোগ দিন এবং আপনার পার্ট-টাইম ইনকাম শুরু
              করুন। কোনো অভিজ্ঞতা বা ইনভেস্টমেন্টের প্রয়োজন নেই।
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-600/20 transition-all duration-300 active:scale-95 group"
            >
              Get Started Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ===================================================================
            SECTION 5: FOOTER NAVIGATION & BRANDING
            =================================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pb-16 border-b border-slate-900/60">
          {/* Brand Info */}
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black">E</span>
              </div>
              <span className="text-xl font-black text-white italic tracking-tighter">
                EarnUnity
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs font-medium">
              EarnUnity বাংলাদেশের প্রথম সারির একটি মাইক্রো-আর্নিং নেটওয়ার্ক, যা
              ইউজারদের জন্য সহজ ও নিরাপদ আয়ের মাধ্যম হিসেবে কাজ করে।
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 text-slate-600">
              <Globe className="w-4 h-4 hover:text-indigo-500 cursor-pointer transition-colors" />
              <Share2 className="w-4 h-4 hover:text-indigo-500 cursor-pointer transition-colors" />
              <MessageSquare className="w-4 h-4 hover:text-indigo-500 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-black uppercase text-indigo-500 tracking-[0.2em]">
              Platform
            </h4>
            <ul className="space-y-2 text-xs font-bold text-slate-400">
              <li className="hover:text-white transition-colors">
                <Link href="/dashboard">Dashboard</Link>
              </li>
              <li className="hover:text-white transition-colors">
                <Link href="/leaderboard">Leaderboard</Link>
              </li>
              <li className="hover:text-white transition-colors">
                <Link href="/tasks">All Tasks</Link>
              </li>
              <li className="hover:text-white transition-colors">
                <Link href="/referrals">Referral Program</Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-black uppercase text-indigo-500 tracking-[0.2em]">
              Legal
            </h4>
            <ul className="space-y-2 text-xs font-bold text-slate-400">
              <li className="hover:text-white transition-colors">
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>
              <li className="hover:text-white transition-colors">
                <Link href="/terms-conditions">Terms & Conditions</Link>
              </li>
              <li className="hover:text-white transition-colors">
                <Link href="/payout-policy">Payout Policy</Link>
              </li>
              <li className="hover:text-white transition-colors">
                <Link href="/support">Help Center</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
            © {new Date().getFullYear()} EarnUnity Network • Empowering Micro
            Agents
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
