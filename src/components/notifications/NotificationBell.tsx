"use client";

import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck, X } from "lucide-react";

import { addNotification } from "@/features/notification/notificationSlice";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/features/notification/notificationThunk";
import type { Notification } from "@/features/notification/types";
import { getSocket } from "@/lib/socket";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const TYPE_ICON: Record<string, string> = {
  lease_sent: "📄",
  lease_viewed: "👁️",
  lease_signed: "✍️",
  lease_active: "✅",
  deposit_paid: "💰",
  rent_paid: "💸",
  rent_due: "🔔",
  late_fee: "⚠️",
  lease_expiring: "⏰",
  inquiry_received: "💬",
  visit_booked: "📅",
};

export default function NotificationBell() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { notifications, unreadCount, isLoading } = useAppSelector(
    (s) => s.notification,
  );

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"unread" | "all">("unread");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handler = (notification: Notification) => {
      dispatch(addNotification(notification));
    };

    socket.on("notification:new", handler);
    return () => {
      socket.off("notification:new", handler);
    };
  }, [dispatch]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClick = async (n: Notification) => {
    if (!n.isRead) {
      await dispatch(markNotificationRead(n._id));
    }
    if (n.link) {
      router.push(n.link);
      setOpen(false);
    }
  };

  const handleMarkAll = () => {
    void dispatch(markAllNotificationsRead());
  };

  const displayed =
    activeTab === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition"
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-slate-700" />
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Notifications
                </p>
                {unreadCount > 0 && (
                  <p className="text-xs text-slate-400">
                    {unreadCount} unread notification
                    {unreadCount > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  title="Mark all as read"
                  className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-emerald-50 text-emerald-600 transition"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-50">
            <button
              onClick={() => setActiveTab("unread")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "unread"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === "unread"
                      ? "bg-white text-emerald-600"
                      : "bg-emerald-100 text-emerald-600"
                  }`}
                >
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "all"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              All
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-slate-50">
            {isLoading ? (
              <div className="py-10 text-center text-slate-400 text-sm">
                Loading...
              </div>
            ) : displayed.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">
                  {activeTab === "unread"
                    ? "No unread notifications"
                    : "No notifications yet"}
                </p>
              </div>
            ) : (
              displayed.map((n) => (
                <div
                  key={n._id}
                  className={`flex items-start gap-3 px-5 py-4 hover:bg-slate-50 transition ${
                    !n.isRead ? "bg-emerald-50/40" : ""
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center flex-shrink-0 text-base">
                    {TYPE_ICON[n.type] ?? "🔔"}
                  </div>

                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => void handleClick(n)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm leading-snug ${!n.isRead ? "font-semibold text-slate-900" : "font-medium text-slate-700"}`}
                      >
                        {n.title}
                      </p>
                      {!n.isRead && (
                        <span className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                      {n.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatDistanceToNow(new Date(n.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>

                  {!n.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        void dispatch(markNotificationRead(n._id));
                      }}
                      title="Mark as read"
                      className="flex-shrink-0 px-2 py-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition mt-0.5"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
