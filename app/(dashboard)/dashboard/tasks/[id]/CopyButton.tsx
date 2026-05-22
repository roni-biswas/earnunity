"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface CopyButtonProps {
  text: string;
}

export default function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Assignment link copied successfully!");

      // Reset icon state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast.error("Failed to copy link. Please select and copy manually.");
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="px-4 py-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-xs font-black uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 h-9 shrink-0 active:scale-95"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>Copy Link</span>
        </>
      )}
    </button>
  );
}
