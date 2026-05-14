"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Wallet,
  Users,
  Settings,
  LogOut,
  UserCircle,
  BellRing,
  ShieldCheck,
  FileText,
  Gem,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils"; // shadcn utility function

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Overview",
    href: "/dashboard",
    color: "text-blue-400",
  },
  {
    icon: ClipboardList,
    label: "Earning Tasks",
    href: "/dashboard/tasks",
    color: "text-emerald-400",
  },
  {
    icon: Wallet,
    label: "My Wallet",
    href: "/dashboard/withdraw",
    color: "text-amber-400",
  },
  {
    icon: Users,
    label: "Referrals",
    href: "/dashboard/referrals",
    color: "text-purple-400",
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex flex-col h-full bg-[#030712] border-r border-slate-800/60 p-6 text-slate-300 w-full overflow-hidden">
      {/* --- Section 1: User Identity Card --- */}
      <div className="mb-10 p-4 bg-slate-900/40 border border-slate-800 rounded-2xl relative overflow-hidden group">
        <div className="absolute -right-2 -top-2 opacity-10 group-hover:rotate-12 transition-transform duration-500">
          <Gem className="w-12 h-12 text-indigo-500" />
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 bg-linear-to-tr from-indigo-600 to-violet-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0">
            <UserCircle className="text-white w-7 h-7" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[13px] font-black text-white truncate uppercase tracking-tight">
              {session?.user?.name || "Roni Biswas"}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest">
                Verified Agent
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- Section 2: Scrollable Navigation Area --- */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-9">
        {/* Core Menu */}
        <div>
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-5">
            Main Analytics
          </p>
          <div className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={`Navigate to ${item.label}`}
                  className={cn(
                    "flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden whitespace-nowrap",
                    isActive
                      ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20"
                      : "hover:bg-slate-800/60 hover:text-white",
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-4.5 h-4.5 transition-transform group-hover:scale-110",
                      isActive ? "text-white" : item.color,
                    )}
                  />
                  <span className="font-bold text-[13px] tracking-wide">
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute right-0 w-1 h-6 bg-white/30 rounded-l-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Legal & System Section */}
        <div>
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-5">
            System & Support
          </p>
          <div className="space-y-2">
            <Link
              href="/dashboard/notifications"
              className={cn(
                "flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all group whitespace-nowrap",
                pathname === "/dashboard/notifications"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40",
              )}
            >
              <BellRing className="w-4.5 h-4.5 group-hover:rotate-12 transition-transform" />
              <span className="font-bold text-[13px]">Notifications</span>
            </Link>

            <Link
              href="/dashboard/privacy"
              className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all text-slate-400 hover:text-white hover:bg-slate-800/40 group whitespace-nowrap"
            >
              <ShieldCheck className="w-4.5 h-4.5 group-hover:text-indigo-400" />
              <span className="font-bold text-[13px]">Privacy Policy</span>
            </Link>

            <Link
              href="/dashboard/terms"
              className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all text-slate-400 hover:text-white hover:bg-slate-800/40 group whitespace-nowrap"
            >
              <FileText className="w-4.5 h-4.5 group-hover:text-indigo-400" />
              <span className="font-bold text-[13px]">Terms & Conditions</span>
            </Link>

            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all text-slate-400 hover:text-white hover:bg-slate-800/40 group whitespace-nowrap"
            >
              <Settings className="w-4.5 h-4.5 group-hover:spin-slow" />
              <span className="font-bold text-[13px]">Account Settings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* --- Section 3: Logout Footer --- */}
      <div className="pt-6 mt-6 border-t border-slate-800/60">
        <button
          type="button"
          title="Sign out from dashboard"
          onClick={() => signOut()}
          className="flex items-center gap-3.5 px-5 py-4 w-full text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 rounded-2xl transition-all font-black text-[13px] group border border-rose-500/10"
        >
          <LogOut className="w-4.5 h-4.5 group-hover:-translate-x-1 transition-transform" />
          <span className="uppercase tracking-tighter">Terminate Session</span>
        </button>
      </div>
    </div>
  );
}
