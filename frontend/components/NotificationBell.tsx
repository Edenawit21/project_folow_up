"use client";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

const mockNotifications = [
  { id: 1, message: "You’ve been assigned to Project Alpha", read: false },
  { id: 2, message: "New comment on Task X", read: false },
  { id: 3, message: "Project deadline updated", read: true },
];

export default function NotificationBell() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative cursor-pointer">
      <Bell className="text-gray-700 w-6 h-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5 font-semibold">
          {unreadCount}
        </span>
      )}
    </div>
  );
}
