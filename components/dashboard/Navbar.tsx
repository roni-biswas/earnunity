"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Loader2,
  Check,
  Zap,
} from "lucide-react";
import { DashboardSidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSocket, INotificationPayload } from "@/providers/SocketProvider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export function DashboardNavbar() {
  const { data: session } = { data: useSession().data };
  const { socket } = useSocket();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // Real-time notification states
  const [notifications, setNotifications] = useState<INotificationPayload[]>(
    [],
  );
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Create a ref for the entire notification wrapper (button + panel)
  const notificationRef = useRef<HTMLDivElement>(null);

  /* Click outside handler to close notification dropdown */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  /* Page scroll lock when mobile menu open */
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
  }, [isMobileMenuOpen]);

  /* Fetch notification history from MongoDB instance on component layout setup */
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications);
          const unread = data.notifications.filter(
            (n: INotificationPayload) => !n.isRead,
          ).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error("Failed to sync client notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  /* Attach asynchronous event boundary to catch incoming events from global io context */
  useEffect(() => {
    if (!socket) return;

    socket.on("new_notification", (newNotification: INotificationPayload) => {
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    socket.on(
      "new_task_published",
      (data: { title: string; message: string; path: string }) => {
        toast.success(data.title, {
          description: data.message,
          duration: 6000,
          icon: (
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
          ),
          action: {
            label: "Earn Now 💰",
            onClick: () => router.push(data.path),
          },
        });
      },
    );

    return () => {
      socket.off("new_notification");
      socket.off("new_task_published");
    };
  }, [socket, router]);

  /* Push batch update parameters to database endpoint via safe async handlers */
  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;

    try {
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

      await fetch("/api/notifications/mark-read", { method: "PATCH" });
    } catch (error) {
      console.error("Mass status update operation failure:", error);
    }
  };

  return (
    <>
      <nav className="h-20 border-b border-slate-800 bg-[#020617]/95 backdrop-blur-md flex items-center justify-between px-6 md:px-10 sticky top-0 z-50">
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

          {/* Workspace Badge */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl">
            <LayoutGrid className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">
              Workspace v2.0
            </span>
          </div>
        </div>

        {/* --- Right Side: Notifications & User Profile --- */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Notification Container wrapped with ref for outside click tracking */}
          <div className="relative" ref={notificationRef}>
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
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-rose-500 rounded-full border-2 border-[#020617] text-[9px] font-black text-white flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-4 w-80 bg-[#0b0f1a] border border-slate-800 rounded-[1.5rem] shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="p-5 border-b border-slate-800 bg-slate-900/30 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white uppercase italic">
                    Alert Center
                  </h3>
                  {unreadCount > 0 ? (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-[10px] text-indigo-400 font-black hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
                    >
                      <Check className="w-3 h-3" /> Mark all read
                    </button>
                  ) : (
                    <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-black">
                      SYNCED
                    </span>
                  )}
                </div>

                {/* Dynamic Notification Wrapper */}
                <div className="max-h-87.5 overflow-y-auto no-scrollbar">
                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-xs text-slate-500 font-medium">
                        No updates available
                      </p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        onClick={async () => {
                          setShowNotifications(false);

                          if (!n.isRead) {
                            try {
                              const res = await fetch("/api/notifications", {
                                method: "PATCH",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ id: n._id }),
                              });

                              if (res.ok) {
                                setNotifications((prev) =>
                                  prev.map((item) =>
                                    item._id === n._id
                                      ? { ...item, isRead: true }
                                      : item,
                                  ),
                                );
                                setUnreadCount((prev) => Math.max(0, prev - 1));
                              }
                            } catch (err) {
                              console.error(
                                "Single notification mark read error:",
                                err,
                              );
                            }
                          }

                          if (n.path) {
                            router.push(n.path);
                          }
                        }}
                        className={cn(
                          "p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-all cursor-pointer group",
                          !n.isRead && "bg-indigo-600/5",
                        )}
                      >
                        <div className="flex gap-4">
                          <div
                            className={cn(
                              "p-2 rounded-lg h-fit transition-colors border",
                              n.isRead
                                ? "bg-slate-900 border-slate-800 text-slate-500"
                                : "bg-indigo-500/10 border-indigo-500/20 text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white",
                            )}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <p
                              className={cn(
                                "text-[13px] font-bold transition-colors",
                                n.isRead
                                  ? "text-slate-400 group-hover:text-slate-300"
                                  : "text-slate-200 group-hover:text-indigo-400",
                              )}
                            >
                              {n.title}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                              {n.message}
                            </p>
                            <div className="flex items-center gap-1.5 mt-2 text-slate-600">
                              <Clock className="w-3 h-3" />
                              <span className="text-[9px] font-bold uppercase tracking-tighter">
                                {new Date(n.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Fixed "See All History" Button inside dropdown */}
                <Link
                  href="/dashboard/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="block w-full py-4 text-center text-[11px] font-black text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest border-t border-slate-800 bg-[#0b0f1a]"
                >
                  See All History
                </Link>
              </div>
            )}
          </div>

          {/* User Profile Info */}
          <div className="flex items-center gap-3 pl-6 border-l border-slate-800 group cursor-pointer">
            <div className="text-right hidden sm:block transition-all group-hover:pr-1">
              <p className="text-xs font-black text-white uppercase tracking-tight italic">
                {session?.user?.name || "User"}
              </p>
              <div className="flex items-center justify-end gap-1.5">
                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
                <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">
                  Pro Agent
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="w-12 h-12 bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl transition-transform group-hover:scale-105 flex items-center justify-center">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="User Avatar"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-tr from-indigo-500 to-violet-600 flex items-center justify-center">
                    <User className="text-white w-6 h-6" />
                  </div>
                )}
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
