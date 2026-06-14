"use client";
import { useEffect, useState } from "react";
import { Icon, Toggle, SectionHeader } from "@/components/ui";
import { formatRelativeTime, api } from "@/lib";
import type { AppNotification } from "@/types";

const typeIcons: Record<string, string> = {
  job_update: "assignment",
  message: "chat_bubble",
  rating: "star",
  system: "info",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const data = await api.notifications.list();
        setNotifications(data.notifications ?? []);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  async function markAllRead() {
    await api.notifications.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-xl">
      <div className="flex items-center justify-between">
        <SectionHeader title="Notifications" />
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="text-sm text-primary hover:underline font-mono"
          >
            Mark all read ({unreadCount})
          </button>
        )}
      </div>

      <div className="grid grid-cols-[1fr_296px] gap-xl items-start">
        {/* Notification list */}
        <div className="bg-surface border border-outline-variant rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-md space-y-sm">
              {[1, 2, 3].map((i) => (
                <div
                  key={`ns-${i}`}
                  className="h-16 bg-surface-container-high rounded animate-pulse"
                />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-xl text-center">
              <Icon
                name="notifications_none"
                className="text-on-surface-variant text-[48px]"
              />
              <p className="text-on-surface-variant text-sm mt-sm">
                No notifications yet
              </p>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-md flex items-start gap-md ${!n.read ? "bg-primary/5" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      !n.read
                        ? "bg-primary/20"
                        : "bg-surface-container-high"
                    }`}
                  >
                    <Icon
                      name={typeIcons[n.type] ?? "notifications"}
                      size={16}
                      className={
                        !n.read ? "text-primary" : "text-on-surface-variant"
                      }
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.read ? "font-semibold" : ""}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-on-surface-variant truncate">
                      {n.body}
                    </p>
                  </div>
                  <span className="text-xs text-on-surface-variant shrink-0">
                    {formatRelativeTime(n.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preferences sidebar */}
        <div className="sticky top-20 space-y-lg">
          <div className="bg-surface border border-outline-variant rounded-lg p-md space-y-md">
            <p className="font-mono text-xs text-on-surface-variant uppercase">
              Preferences
            </p>
            <Toggle
              label="Enable Sounds"
              checked={soundsEnabled}
              onChange={setSoundsEnabled}
            />
            <Toggle
              label="Push Notifications"
              checked={pushEnabled}
              onChange={setPushEnabled}
            />
          </div>

          <div className="bg-surface border border-outline-variant rounded-lg p-md space-y-sm">
            <p className="font-mono text-xs text-on-surface-variant uppercase">
              About
            </p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              You receive notifications for quest updates, new messages, ratings,
              and system announcements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
