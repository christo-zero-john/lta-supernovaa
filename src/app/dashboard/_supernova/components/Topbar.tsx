"use client";

import { useApp } from "./AppProvider";
import DashboardSearch from "./DashboardSearch";
import UserAvatar from "./UserAvatar";
import DemoDataSwitch from "../demo/DemoDataSwitch";
import { Icon } from "./ui";
import { useUnreadCount } from "../hooks/useUnreadCount";

/** The section pages' top bar: search, dummy data, notifications, profile. */
export default function Topbar({ onMenu }: { onMenu: () => void }) {
  const { navigate, openDialog } = useApp();
  const unread = useUnreadCount();
  return (
    <header className="sn-topbar">
      <button
        className="sn-mobile-toggle sn-icon-button"
        aria-label="Open navigation"
        onClick={onMenu}
      >
        <Icon name="menu" />
      </button>
      <DashboardSearch />
      <div className="sn-topbar-right">
        <DemoDataSwitch />
        <button
          className="sn-icon-button"
          aria-label={`Notifications, ${unread} unread`}
          onClick={() => navigate("notifications")}
        >
          <Icon name="notifications" />
          {unread > 0 && <i />}
        </button>
        <button
          className="sn-avatar"
          aria-label="View profile"
          onClick={() => openDialog({ kind: "settings" })}
        >
          <UserAvatar />
        </button>
      </div>
    </header>
  );
}
