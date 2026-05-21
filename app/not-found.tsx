import React from "react";
import { AlertCircle, ArrowLeft, Home, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* --- Background Ambient Glows --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-70 sm:w-112.5 h-70 sm:h-112.5 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-8 z-10">
        {/* --- Neon Error Badge --- */}
        <div className="inline-flex items-center justify-center p-4 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-3xl shadow-xl shadow-indigo-600/5 animate-bounce">
          <AlertCircle className="w-12 h-12" />
        </div>

        {/* --- Heading & Error Texts --- */}
        <div className="space-y-3">
          <h1 className="text-7xl sm:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white via-slate-200 to-slate-600 italic">
            404
          </h1>
          <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider">
            Page Under Construction or Not Found
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
        </div>

        {/* --- Interactive Action Buttons --- */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" /> Go To Dashboard
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
          >
            <Home className="w-4 h-4" /> Back Home
          </Link>
        </div>

        {/* --- Minimal Support Note --- */}
        <div className="pt-6 border-t border-slate-900/60 flex items-center justify-center gap-1.5 text-xs text-slate-600 font-bold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-slate-700" /> Need Help? Contact
          Support
        </div>
      </div>
    </div>
  );
}
