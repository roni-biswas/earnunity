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
} from "lucide-react";
import { signOut } from "next-auth/react";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Overview",
    href: "/dashboard",
    color: "text-blue-600",
  },
  {
    icon: ClipboardList,
    label: "Available Tasks",
    href: "/dashboard/tasks",
    color: "text-emerald-600",
  },
  {
    icon: Wallet,
    label: "Withdraw",
    href: "/dashboard/withdraw",
    color: "text-amber-600",
  },
  {
    icon: Users,
    label: "My Referrals",
    href: "/dashboard/referrals",
    color: "text-purple-600",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/dashboard/settings",
    color: "text-slate-600",
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full p-4">
      <div className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
              pathname === item.href
                ? "bg-blue-50 text-blue-700 shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <item.icon
              className={`w-5 h-5 ${pathname === item.href ? "text-blue-600" : item.color}`}
            />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
