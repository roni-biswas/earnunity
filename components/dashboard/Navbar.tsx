"use client";

import React, { useState, useEffect } from "react"; // Added useEffect
import { useSession } from "next-auth/react";
import { Bell, User, Menu, X } from "lucide-react";
import { DashboardSidebar } from "./Sidebar";

export function DashboardNavbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup to prevent scroll lock if component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="h-16 border-b bg-white flex items-center justify-between px-4 md:px-8 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            title="mobile menu button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden text-slate-600 p-2 hover:bg-slate-50 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-black italic text-indigo-600 tracking-tighter">
            EarnUnity
          </h1>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <button
            title="bell button"
            className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800">
                {session?.user?.name || "User"}
              </p>
              <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider">
                Active User
              </p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-2 border-indigo-50">
              <User className="text-indigo-600 w-6 h-6" />
            </div>
          </div>
        </div>
      </nav>

      {/* --- Mobile Sidebar Overlay --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-60 md:hidden">
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar Content */}
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h1 className="text-xl font-black italic text-indigo-600">
                EarnUnity
              </h1>
              <button
                title="mobile menu open button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div
              className="flex-1 overflow-y-auto"
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
