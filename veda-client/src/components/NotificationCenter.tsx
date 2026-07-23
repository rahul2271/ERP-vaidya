"use client";

import { useEffect, useState } from "react";
import { Bell, X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationCenterProps {
  notifications?: Notification[];
  onNotificationRead?: (id: string) => void;
  onNotificationDismiss?: (id: string) => void;
}

export default function NotificationCenter({
  notifications = [],
  onNotificationRead,
  onNotificationDismiss,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayedNotifications, setDisplayedNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setDisplayedNotifications(notifications);
    setUnreadCount(notifications.filter((n) => !n.read).length);
  }, [notifications]);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onNotificationRead?.(notification.id);
    }
  };

  const handleDismiss = (id: string) => {
    setDisplayedNotifications((prev) => prev.filter((n) => n.id !== id));
    onNotificationDismiss?.(id);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle size={18} className="text-green-600" />;
      case "error":
        return <AlertCircle size={18} className="text-red-600" />;
      case "warning":
        return <AlertTriangle size={18} className="text-yellow-600" />;
      case "info":
        return <Info size={18} className="text-primary-600" />;
      default:
        return <Bell size={18} />;
    }
  };

  const getStyles = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-900";
      case "error":
        return "bg-red-50 border-red-200 text-red-900";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-900";
      case "info":
        return "bg-primary-50 border-primary-200 text-primary-900";
      default:
        return "bg-slate-50 border-slate-200 text-slate-900";
    }
  };

  const recentNotifications = displayedNotifications.slice(0, 5);

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {recentNotifications.length > 0 ? (
              <div className="space-y-2 p-2">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-3 rounded-lg border transition cursor-pointer ${getStyles(
                      notification.type
                    )} ${!notification.read ? "opacity-100" : "opacity-75"}`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{notification.title}</p>
                        <p className="text-xs mt-1 opacity-90">{notification.message}</p>
                        <div className="flex gap-2 mt-2 items-center">
                          <span className="text-[10px] opacity-75">
                            {notification.timestamp.toLocaleTimeString()}
                          </span>
                          {notification.action && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                notification.action?.onClick();
                              }}
                              className="text-[10px] font-bold opacity-90 hover:opacity-100 transition"
                            >
                              {notification.action.label}
                            </button>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDismiss(notification.id);
                        }}
                        className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400">
                <Bell size={32} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm font-medium">No notifications</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {displayedNotifications.length > 0 && (
            <div className="p-3 border-t border-slate-200 bg-slate-50 text-center">
              <button className="text-xs font-bold text-primary-600 hover:text-primary-700 transition">
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
