"use client";

import React from "react";
import { Monitor, ShieldCheck, AlertTriangle } from "lucide-react";

interface DeviceStatusProps {
  deviceId: string;
}

export default function DeviceStatus({ deviceId }: DeviceStatusProps) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-6 shadow-xl text-white space-y-6">
      <div>
        <h3 className="text-lg font-black uppercase tracking-tight italic">
          Device Protection
        </h3>
        <p className="text-xs text-slate-400">
          Hardware binding configuration for multi-account prevention.
        </p>
      </div>

      <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-2xl flex items-start gap-4">
        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 shrink-0">
          <Monitor className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-white">Registered Device ID</p>
          <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5 select-all">
            {deviceId || "No device bound"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 px-2 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
        <ShieldCheck className="w-4 h-4 shrink-0" />
        <span className="text-[10px] font-black uppercase tracking-wider">
          Hardware Sync Active & Secured
        </span>
      </div>

      <p className="text-[10px] text-slate-500 font-medium leading-relaxed pl-1">
        <AlertTriangle className="w-3 h-3 inline mr-1 text-amber-500/70" />
        Warning: Creating multiple accounts using different browser profiles on
        this device will result in permanent suspension.
      </p>
    </div>
  );
}
