"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Send,
  Users,
  Briefcase,
  CreditCard,
  Menu,
  Bell,
  PlusCircle,
} from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SidebarContent from "@/components/dashboard/AdminSidebarContent";

const menuItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Create New Jobs", href: "/admin/jobs/create", icon: PlusCircle },
  { name: "Manage Users", href: "/admin/users", icon: Users },
  { name: "Job Tasks", href: "/admin/jobs", icon: Briefcase },
  { name: "Withdraw Requests", href: "/admin/withdraws", icon: CreditCard },
  { name: "Submissions", href: "/admin/submissions", icon: Send },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* --- Desktop Sidebar --- */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-gray-100 shadow-sm z-20">
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* --- Top Header --- */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden rounded-full hover:bg-gray-100"
                >
                  <Menu size={22} className="text-gray-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 border-none">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            <div className="hidden lg:block">
              <h1 className="text-lg font-bold text-gray-800">
                {menuItems.find((i) => i.href === pathname)?.name ||
                  "Admin Dashboard"}
              </h1>
              <p className="text-xs text-gray-400">
                Welcome back, Managing all operations
              </p>
            </div>
          </div>

          {/* Right side tools */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full relative border-gray-200 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </Button>
            <Separator
              orientation="vertical"
              className="h-6 mx-1 hidden sm:block"
            />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-none">
                  Super Admin
                </p>
                <p className="text-[10px] text-green-500 font-medium mt-1 uppercase tracking-tighter">
                  Online
                </p>
              </div>
              <Avatar className="h-10 w-10 ring-2 ring-blue-50 ring-offset-2">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AU</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* --- Main Content Area --- */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 lg:p-10 max-w-7xl mx-auto">
            {/* Page Transition Wrapper can be added here */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
