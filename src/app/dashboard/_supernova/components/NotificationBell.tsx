"use client";

import { useApp } from "./AppProvider";
import { Icon } from "./ui";
import { useUnreadCount } from "../hooks/useUnreadCount";

/**
 * The navbar's notifications button. While any are unread it shows their
 * count, and the bell rings three times with a ripple round the button;
 * it rings again whenever the count changes.
 */
export default function NotificationBell() {
  const { navigate } = useApp();
  const unread = useUnreadCount();
  return (
    <button
      className={`sn-icon-button ${unread > 0 ? "has-unread" : ""}`}
      aria-label={`Notifications, ${unread} unread`}
      onClick={() => navigate("notifications")}
    >
      {/* Keyed by the count, so a new notification restarts the ring. */}
      <span className="sn-bell" key={unread}>
        <Icon name="notifications" />
      </span>
      {unread > 0 && <b>{unread > 99 ? "99+" : unread}</b>}
    </button>
  );
}
