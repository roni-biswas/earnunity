"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Menu,
  X,
  Bell,
  User,
  LayoutGrid,
  CheckCircle2,
  Clock,
  ChevronDown,
} from "lucide-react";
import { DashboardSidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

export function DashboardNavbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Page scroll lock when mobile menu open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
  }, [isMobileMenuOpen]);

  // dummy notification data
  const notifications = [
    {
      id: 1,
      title: "Task Approved",
      msg: "Your photo edit task was approved!",
      time: "2m ago",
    },
    {
      id: 2,
      title: "New Referral",
      msg: "A friend joined using your link.",
      time: "1h ago",
    },
    {
      id: 3,
      title: "Payment Sent",
      msg: "Your withdrawal is processing.",
      time: "3h ago",
    },
  ];

  return (
    <>
      <nav className="h-20 border-b border-slate-800 bg-[#020617]/95 backdrop-blur-md flex items-center justify-between px-6 md:px-10 sticky top-0 z-60">
        {/* --- Left Side: Mobile Toggle & Status Badge --- */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            title="Open Mobile Menu"
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden text-slate-300 p-2.5 bg-slate-900 rounded-xl border border-slate-800 hover:bg-indigo-600 transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo Replacement: Workspace Badge */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl">
            <LayoutGrid className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">
              Workspace v2.0
            </span>
          </div>
        </div>

        {/* --- Right Side: Notifications & User Profile --- */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Notification Clickable Icon */}
          <div className="relative">
            <button
              type="button"
              title="Toggle Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              className={cn(
                "p-3 rounded-2xl transition-all duration-300 border relative group",
                showNotifications
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white",
              )}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#020617]"></span>
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-4 w-80 bg-[#0b0f1a] border border-slate-800 rounded-[1.5rem] shadow-2xl overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="p-5 border-b border-slate-800 bg-slate-900/30 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white uppercase italic">
                      Alerts Center
                    </h3>
                    <span className="text-[9px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-black">
                      NEW
                    </span>
                  </div>

                  <div className="max-h-87.5 overflow-y-auto no-scrollbar">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-all cursor-pointer group"
                      >
                        <div className="flex gap-4">
                          <div className="p-2 bg-indigo-500/10 rounded-lg h-fit group-hover:bg-indigo-600 transition-colors">
                            <CheckCircle2 className="w-4 h-4 text-indigo-500 group-hover:text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[13px] font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">
                              {n.title}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {n.msg}
                            </p>
                            <div className="flex items-center gap-1.5 mt-2 text-slate-600">
                              <Clock className="w-3 h-3" />
                              <span className="text-[9px] font-bold uppercase tracking-tighter">
                                {n.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="w-full py-4 text-[11px] font-black text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest border-t border-slate-800">
                    See All History
                  </button>
                </div>
              </>
            )}
          </div>

          {/* User Profile with Name */}
          <div className="flex items-center gap-3 pl-6 border-l border-slate-800 group cursor-pointer">
            <div className="text-right hidden sm:block transition-all group-hover:pr-1">
              <p className="text-xs font-black text-white uppercase tracking-tight italic">
                {session?.user?.name || "Roni Biswas"}
              </p>
              <div className="flex items-center justify-end gap-1.5">
                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
                <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">
                  Pro Agent
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="w-12 h-12 bg-slate-800 rounded-2xl border border-slate-700 p-0.5 shadow-xl transition-transform group-hover:scale-105">
                <div className="w-full h-full bg-linear-to-tr from-indigo-500 to-violet-600 rounded-[14px] flex items-center justify-center">
                  <User className="text-white w-6 h-6" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-0.5 border-2 border-[#020617] md:hidden">
                <ChevronDown className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* --- Mobile Sidebar Drawer --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-100 md:hidden overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-[85%] max-w-[320px] bg-[#020617] border-r border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-left duration-500">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <span className="text-white font-black">E</span>
                </div>
                <span className="text-xl font-black text-white italic tracking-tighter">
                  EarnUnity
                </span>
              </div>
              <button
                type="button"
                title="Close Sidebar"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-900 rounded-xl border border-transparent hover:border-slate-800 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div
              className="flex-1 overflow-y-auto no-scrollbar"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <DashboardSidebar />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
