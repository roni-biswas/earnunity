"use client";
import React, { useState } from "react";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";

import {
  LayoutDashboard,
  Send,
  LogOut,
  Users,
  Briefcase,
  CreditCard,
  ChevronRight,
  PlusCircle,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";

const menuItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Create New Jobs", href: "/admin/jobs/create", icon: PlusCircle },
  { name: "Manage Users", href: "/admin/users", icon: Users },
  { name: "Job Tasks", href: "/admin/jobs", icon: Briefcase },
  { name: "Withdraw Requests", href: "/admin/withdraws", icon: CreditCard },
  { name: "Submissions", href: "/admin/submissions", icon: Send },
];

export default function SidebarContent() {
  const pathname = usePathname();
  const [, setOpen] = useState(false);
  return (
    // --- Sidebar Content Component ---

    <div className="flex flex-col h-full bg-white">
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
          <Briefcase className="text-white" size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 leading-none">
            EarnUnity
          </h2>
          <p className="text-[10px] uppercase tracking-widest text-blue-600 font-bold mt-1">
            Admin Console
          </p>
        </div>
      </div>

      <Separator className="mb-4 opacity-50" />

      {/* Navigation Links */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-6">
          <div>
            <p className="px-4 mb-3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
              Menu Highlights
            </p>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                        : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    <item.icon
                      size={20}
                      className={`${isActive ? "text-white" : "text-gray-400 group-hover:text-blue-600"}`}
                    />
                    <span className="flex-1">{item.name}</span>
                    {isActive ? (
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    ) : (
                      <ChevronRight
                        size={14}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </ScrollArea>

      {/* Bottom Profile Section */}
      <div className="p-4 mt-auto">
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-gray-900 truncate">
                Admin Account
              </span>
              <span className="text-[11px] text-gray-500 truncate">
                admin@earnunity.com
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => signOut()}
            className="w-full justify-start gap-3 text-red-500 hover:bg-red-100 hover:text-red-600 rounded-xl h-10 transition-all px-3"
          >
            <LogOut size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">
              Logout
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
