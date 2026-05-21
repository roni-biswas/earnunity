"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCircle2,
  XCircle,
  Zap,
  Users,
  Clock,
  ArrowRight,
  Loader2,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { INotificationPayload } from "@/providers/SocketProvider";
import { toast } from "sonner";

export default function NotificationsClientView() {
  const [notifications, setNotifications] = useState<INotificationPayload[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Pagination States
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const LIMIT = 10;

  const router = useRouter();

  // Fetch paginated data from server
  const fetchNotifications = async (pageNumber: number, append = false) => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await fetch(
        `/api/notifications/paginated?page=${pageNumber}&limit=${LIMIT}`,
      );
      const data = await res.json();

      if (data.success) {
        if (append) {
          setNotifications((prev) => [...prev, ...data.notifications]);
        } else {
          setNotifications(data.notifications);
        }
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
      toast.error("Could not sync notification history");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1, false);
  }, []);

  const loadMoreNotifications = () => {
    if (!hasMore || loadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage, true);
  };

  const getNotificationConfig = (type: string) => {
    switch (type) {
      case "task_approved":
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
          bg: "bg-emerald-500/10 border-emerald-500/20",
        };
      case "task_rejected":
        return {
          icon: <XCircle className="w-4 h-4 text-rose-500" />,
          bg: "bg-rose-500/10 border-rose-500/20",
        };
      case "referral":
        return {
          icon: <Users className="w-4 h-4 text-cyan-500" />,
          bg: "bg-cyan-500/10 border-cyan-500/20",
        };
      case "system":
      case "new_task_published":
        return {
          icon: <Zap className="w-4 h-4 text-amber-500" />,
          bg: "bg-amber-500/10 border-amber-500/20",
        };
      default:
        return {
          icon: <Bell className="w-4 h-4 text-indigo-500" />,
          bg: "bg-indigo-500/10 border-indigo-500/20",
        };
    }
  };

  const handleNotificationClick = async (notif: INotificationPayload) => {
    if (!notif.isRead) {
      try {
        setNotifications((prev) =>
          prev.map((item) =>
            item._id === notif._id ? { ...item, isRead: true } : item,
          ),
        );

        await fetch("/api/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: notif._id }),
        });
      } catch (err) {
        console.error("Error marking notification as read:", err);
      }
    }

    if (notif.path) {
      router.push(notif.path);
    }
  };

  const handleMarkAllRead = async () => {
    const hasUnread = notifications.some((n) => !n.isRead);
    if (!hasUnread) return;

    setActionLoading(true);
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      await fetch("/api/notifications/mark-read", { method: "PATCH" });
      toast.success("All updates marked as read");
    } catch (error) {
      console.error("Failed to mass update status:", error);
      toast.error("Operation failed");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto text-slate-100">
      <div className="space-y-6">
        {/* --- Header --- */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-500" /> Notifications
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-0.5">
              Manage your activity logs and system updates.
            </p>
          </div>

          {notifications.some((n) => !n.isRead) && (
            <button
              onClick={handleMarkAllRead}
              disabled={actionLoading}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-all duration-200 disabled:opacity-50"
            >
              {actionLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              Mark all read
            </button>
          )}
        </div>

        {/* --- Content Area --- */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-xs text-slate-500 animate-pulse">
              Loading notification logs...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/20 border border-slate-800/60 rounded-xl p-6">
            <p className="text-sm text-slate-400 font-medium">
              No notifications available
            </p>
            <p className="text-xs text-slate-500 mt-1">
              We will notify you when something happens.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => {
              const config = getNotificationConfig(notif.type || "system");
              return (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={cn(
                    "group relative p-4 rounded-xl border bg-[#0b0f1a]/40 transition-all duration-200 cursor-pointer flex items-center gap-3.5 hover:border-slate-700 hover:bg-slate-900/40",
                    notif.isRead
                      ? "border-slate-900 opacity-70"
                      : "border-indigo-500/20 bg-linear-to-r from-indigo-500/1 to-transparent shadow-xs",
                  )}
                >
                  {/* Left Indicator line */}
                  {!notif.isRead && (
                    <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-500 rounded-l-xl" />
                  )}

                  {/* Icon Wrapper */}
                  <div
                    className={cn("p-2 rounded-lg border shrink-0", config.bg)}
                  >
                    {config.icon}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={cn(
                          "text-sm font-semibold truncate",
                          notif.isRead
                            ? "text-slate-400"
                            : "text-slate-200 group-hover:text-indigo-400",
                        )}
                      >
                        {notif.title}
                      </h4>

                      {/* Compact Timestamp */}
                      <div className="flex items-center gap-1 text-slate-500 shrink-0 select-none text-[11px]">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(notif.createdAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 mt-1 leading-normal line-clamp-1">
                      {notif.message}
                    </p>
                  </div>

                  {/* Action Link Arrow */}
                  {notif.path && (
                    <div className="text-slate-600 group-hover:text-slate-300 transition-colors shrink-0 hidden sm:block">
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* --- Pagination Load More Button --- */}
            {hasMore && (
              <div className="pt-4 flex justify-center">
                <button
                  onClick={loadMoreNotifications}
                  disabled={loadingMore}
                  className="px-5 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                      Loading more...
                    </>
                  ) : (
                    "Load more history"
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
