"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import { formatDistanceToNow } from "date-fns";
import {
  LayoutDashboard,
  Send,
  Users,
  Briefcase,
  CreditCard,
  Menu,
  Bell,
  PlusCircle,
  CheckCircle,
} from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SidebarContent from "@/components/dashboard/AdminSidebarContent";

const menuItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Create New Jobs", href: "/admin/jobs/create", icon: PlusCircle },
  { name: "Job List Management", href: "/admin/jobs", icon: Briefcase },
  { name: "Manage Users", href: "/admin/users", icon: Users },
  { name: "Withdraw Requests", href: "/admin/withdraws", icon: CreditCard },
  { name: "Submissions", href: "/admin/submissions", icon: Send },
];

interface INotification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  path: string;
  createdAt: string;
}

let socket: Socket;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter(); // router initiate holo
  const { data: session } = useSession(); // Accessing current auth session data
  const [open, setOpen] = useState(false);

  // --- Real-time Notification States ---
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // 1. Fetch initial notification list on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (data?.success) {
          setNotifications(data.notifications || []);
          const unread = (data.notifications || []).filter(
            (n: any) => !n.isRead,
          ).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error("Failed to load admin notifications:", err);
      }
    };

    if (session?.user?.id) {
      fetchNotifications();
    }
  }, [session]);

  // 2. Initialize live Socket.io network listeners
  useEffect(() => {
    if (!session?.user?.id) return;

    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000", {
      path: "/api/socket",
    });

    socket.on("connect", () => {
      socket.emit("join_room", session.user.id);
    });

    socket.on("new_notification", (newNotif: INotification) => {
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Sweet browser notification sound trigger
      const audio = new Audio("/sounds/notification.mp3");
      audio
        .play()
        .catch((err) => console.log("Audio auto-play safe blocked:", err));
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [session]);

  // 3. Mark all notifications as read inside the database layout thread
  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      const res = await fetch("/api/notifications/mark-read", {
        method: "PATCH",
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Error marking layout actions:", err);
    }
  };

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
            {/* --- Live Popover Notification Center --- */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={markAllAsRead}
                  className="rounded-full relative border-gray-200 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 sm:w-96 p-0 mt-2 mr-2"
                align="end"
              >
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-lg">
                  <h3 className="font-semibold text-sm text-gray-800">
                    Admin Alerts Center
                  </h3>
                  <span className="text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">
                    {unreadCount} New
                  </span>
                </div>
                <div className="max-h-87.5 overflow-y-auto divide-y divide-gray-50 custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-xs text-gray-400 flex flex-col items-center gap-2">
                      <CheckCircle size={24} className="text-gray-300" />
                      No operation updates yet.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        onClick={async () => {
                          if (!notif.isRead) {
                            try {
                              const res = await fetch("/api/notifications", {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ id: notif._id }),
                              });

                              if (res.ok) {
                                setNotifications((prev) =>
                                  prev.map((n) =>
                                    n._id === notif._id
                                      ? { ...n, isRead: true }
                                      : n,
                                  ),
                                );
                                setUnreadCount((prev) => Math.max(0, prev - 1));
                              }
                            } catch (err) {
                              console.error(
                                "Failed to mark single notification as read:",
                                err,
                              );
                            }
                          }
                          // notification path
                          if (notif.path) {
                            router.push(notif.path);
                          }
                        }}
                        className={`p-4 transition-colors hover:bg-gray-50/60 flex flex-col gap-1 cursor-pointer ${
                          !notif.isRead ? "bg-blue-50/20" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-xs font-semibold ${!notif.isRead ? "text-blue-900" : "text-gray-700"}`}
                          >
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap">
                            {formatDistanceToNow(new Date(notif.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Separator
              orientation="vertical"
              className="h-6 mx-1 hidden sm:block"
            />

            {/* --- Dynamic Session Profiles --- */}
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-none">
                  {session?.user?.name || "Super Admin"}
                </p>
                <p className="text-[10px] text-green-500 font-medium mt-1 uppercase tracking-tighter">
                  Online
                </p>
              </div>
              <Avatar className="h-10 w-10 ring-2 ring-blue-50 ring-offset-2">
                <AvatarImage
                  src={session?.user?.image || "https://github.com/shadcn.png"}
                />
                <AvatarFallback>
                  {session?.user?.name
                    ? session.user.name.slice(0, 2).toUpperCase()
                    : "AU"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* --- Main Content Area --- */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 lg:p-10 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
