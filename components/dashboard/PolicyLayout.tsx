"use client";

import React, { useState } from "react";
import { Languages, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PolicyLayoutProps {
  titleEn: string;
  titleBn: string;
  updatedEn: string;
  updatedBn: string;
  icon: React.ReactNode;
  contentEn: React.ReactNode;
  contentBn: React.ReactNode;
}

export function PolicyLayout({
  titleEn,
  titleBn,
  updatedEn,
  updatedBn,
  icon,
  contentEn,
  contentBn,
}: PolicyLayoutProps) {
  const [lang, setLang] = useState<"en" | "bn">("en");

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 py-6">
      <div className="space-y-8">
        {/* --- Top Navigation & Language Switcher --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors self-start"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          {/* Language Toggle Button */}
          <button
            onClick={() => setLang(lang === "en" ? "bn" : "en")}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all duration-200 self-start sm:self-center shadow-md active:scale-95"
          >
            <Languages className="w-4 h-4 text-indigo-500" />
            <span>Read in: {lang === "en" ? "বাংলা" : "English"}</span>
          </button>
        </div>

        {/* --- Header Section --- */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600/10 border border-indigo-500/20 text-indigo-500 rounded-2xl shrink-0">
              {icon}
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white italic">
              {lang === "en" ? titleEn : titleBn}
            </h1>
          </div>
          <p className="text-xs text-slate-500 pl-14">
            {lang === "en"
              ? `Last Updated: ${updatedEn}`
              : `সর্বশেষ আপডেট: ${updatedBn}`}
          </p>
        </div>

        {/* --- Main Dynamic Content Body --- */}
        <div className="bg-[#0b0f1a]/40 border border-slate-900 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-md prose prose-invert max-w-none text-sm md:text-base leading-relaxed space-y-6">
          {lang === "en" ? contentEn : contentBn}
        </div>

        {/* --- Footer Note --- */}
        <div className="text-center text-xs text-slate-600 pt-4">
          © {new Date().getFullYear()} EarnUnity. All rights reserved.
        </div>
      </div>
    </div>
  );
}
