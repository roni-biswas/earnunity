"use client";

import React from "react";
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  Wallet,
  Users,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <div className="relative min-h-screen bg-[#020617] overflow-hidden flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      {/* --- Background Ambient Glows --- */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 sm:w-75 h-75 sm:h-75 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-62.5 h-62.5 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center z-10 space-y-8 pt-20 pb-16">
        {/* --- 1. Trust Badge / Live Notification --- */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full animate-fade-in">
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
          <span className="text-[11px] sm:text-xs font-black text-indigo-300 uppercase tracking-widest italic">
            EarnUnity v2.0 is Live • Start Earning Today
          </span>
        </div>

        {/* --- 2. Main Captivating Headline --- */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase italic leading-none">
            Turn Your Free Time <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-violet-400 to-pink-500 drop-shadow-sm">
              Into Real Money
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 font-medium leading-relaxed">
            বাংলাদেশের সবচেয়ে বিশ্বস্ত এবং সহজ মাইক্রো-টাস্কিং প্ল্যাটফর্ম। ছোট
            ছোট সোশ্যাল টাস্ক সম্পূর্ণ করুন, পয়েন্ট আর্ন করুন এবং সরাসরি{" "}
            <span className="text-white font-semibold">বিকাশ বা নগদে</span>{" "}
            ইনস্ট্যান্ট পেমেন্ট বুঝে নিন।
          </p>
        </div>

        {/* --- 3. Call To Action (CTA) Buttons --- */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-300 flex items-center justify-center gap-2 group active:scale-95"
          >
            Create Free Account
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-sm font-black uppercase tracking-widest rounded-2xl transition-all duration-300 flex items-center justify-center"
          >
            How It Works?
          </a>
        </div>

        {/* --- 4. Core Features Quick Badges --- */}
        <div className="pt-6 flex flex-wrap justify-center items-center gap-y-3 gap-x-6 text-xs text-slate-500 font-semibold">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-500" /> No Investment
            Required
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-500" /> 100% Real
            Audited Tasks
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-500" /> VPN Strict
            Anti-Cheat
          </div>
        </div>

        {/* --- 5. Social Proof / Stats Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12 border-t border-slate-900 max-w-3xl mx-auto">
          <div className="p-6 bg-[#0b0f1a]/40 border border-slate-900 rounded-2xl backdrop-blur-md flex flex-col items-center justify-center text-center group hover:border-slate-800/80 transition-colors">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl mb-3">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              ১০,০০০+
            </span>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">
              Active Agents
            </span>
          </div>

          <div className="p-6 bg-[#0b0f1a]/40 border border-slate-900 rounded-2xl backdrop-blur-md flex flex-col items-center justify-center text-center group hover:border-slate-800/80 transition-colors">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl mb-3">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              ৳৫,৫০,০০০+
            </span>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">
              Total Paid Out
            </span>
          </div>

          <div className="p-6 bg-[#0b0f1a]/40 border border-slate-900 rounded-2xl backdrop-blur-md flex flex-col items-center justify-center text-center group hover:border-slate-800/80 transition-colors">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              ১০০%
            </span>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">
              Secure Network
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
