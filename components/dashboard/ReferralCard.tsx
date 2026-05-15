"use client";

import React from "react";
import { Users } from "lucide-react";
import { toast } from "sonner";

export default function ReferralCard({ link }: { link: string }) {
  const handleCopy = () => {
    if (!link) return;

    navigator.clipboard.writeText(link);

    // Professional Toast Notification
    toast.success("Referral link copied!", {
      description: "You can now share it with your friends.",
      duration: 3000,
    });
  };

  return (
    <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden group shadow-2xl">
      <div className="relative z-10">
        <h4 className="text-xl font-black mb-2 italic">Refer & Earn</h4>
        <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
          Invite friends and get bonuses from their lifetime earnings.
        </p>
        <div className="bg-white/10 border border-white/20 p-4 rounded-2xl backdrop-blur-sm">
          <p className="text-[10px] font-bold uppercase text-indigo-200 mb-1">
            Your Link
          </p>
          <p className="text-xs font-mono font-bold truncate">{link}</p>
        </div>
        <button
          onClick={handleCopy}
          className="w-full mt-6 py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase hover:bg-indigo-50 transition-all active:scale-95"
        >
          Copy Link
        </button>
      </div>
      <Users className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
    </div>
  );
}
