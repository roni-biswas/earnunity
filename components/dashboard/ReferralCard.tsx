"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, Share2, Gift, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface ReferralCardProps {
  referralCode: string;
}

export default function ReferralCard({ referralCode }: ReferralCardProps) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const shareUrl =
    referralCode && origin ? `${origin}/register?ref=${referralCode}` : "";

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Referral link copied successfully!", {
        description: "Share this link with your friends to earn milestones.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error: unknown) {
      toast.error("Failed to copy link. Please try manually.");
    }
  };

  return (
    <div className="relative overflow-hidden bg-linear-to-br from-indigo-600 via-indigo-700 to-slate-900 rounded-[2.5rem] p-8 shadow-2xl text-white h-full flex flex-col justify-between group">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl" />

      <div className="relative space-y-6">
        <div className="flex items-center justify-between">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
            <Gift className="w-6 h-6 text-indigo-200 animate-pulse" />
          </div>
          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
            <Sparkles className="w-3 h-3" /> 2-Tier Bonus Live
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black uppercase tracking-tight italic">
            Invite Friends & <br />
            Multiply Earnings
          </h2>
          <p className="text-xs text-indigo-200 font-medium max-w-sm">
            Get{" "}
            <span className="text-white font-bold">৳5.00 instant bonus</span>{" "}
            upon their registration and an additional{" "}
            <span className="text-white font-bold">
              ৳15.00 milestone reward
            </span>{" "}
            when they complete their first task.
          </p>
        </div>
      </div>

      <div className="relative mt-8 space-y-3">
        <p className="text-[10px] font-black uppercase text-indigo-200 tracking-widest pl-1">
          Your Unique Invitation Link
        </p>

        <div className="space-y-3 w-full">
          {/* URL Input Row (Always Full Width) */}
          <div className="w-full bg-slate-950/40 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3.5 min-w-0">
            <span className="text-xs font-mono text-indigo-100 block truncate select-all">
              {shareUrl || "Generating network link..."}
            </span>
          </div>

          {/* Actions Row (Always Side-by-Side 50/50 split) */}
          <div className="grid grid-cols-2 gap-2 w-full">
            {/* Referral Code Badge */}
            <div className="flex items-center justify-center text-[11px] font-black uppercase text-indigo-300 bg-indigo-950/60 py-3.5 rounded-2xl border border-indigo-800/50 whitespace-nowrap select-none text-center">
              {referralCode}
            </div>

            {/* Copy Link Button */}
            <button
              onClick={handleCopy}
              disabled={!shareUrl}
              className="bg-white hover:bg-indigo-50 text-slate-900 font-black text-xs py-3.5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-50 whitespace-nowrap"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-emerald-600">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-700 shrink-0" />
                  <span>COPY LINK</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
