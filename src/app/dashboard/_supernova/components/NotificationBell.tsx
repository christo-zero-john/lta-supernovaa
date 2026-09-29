"use client";

import { useApp } from "./AppProvider";
import { Icon } from "./ui";
import { useUnreadCount } from "../hooks/useUnreadCount";

/** The navbar's notifications button, with a dot while any are unread. */
export default function NotificationBell() {
  const { navigate } = useApp();
  const unread = useUnreadCount();
  return (
    <button
      className="sn-icon-button"
      aria-label={`Notifications, ${unread} unread`}
      onClick={() => navigate("notifications")}
    >
      <Icon name="notifications" />
      {unread > 0 && <i />}
    </button>
  );
}
