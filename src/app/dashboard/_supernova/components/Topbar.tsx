"use client";

import { useApp } from "./AppProvider";
import DashboardSearch from "./DashboardSearch";
import UserAvatar from "./UserAvatar";
import DemoDataSwitch from "../demo/DemoDataSwitch";
import NotificationBell from "./NotificationBell";
import { Icon } from "./ui";

/** The section pages' top bar: search, dummy data, notifications, profile. */
export default function Topbar({ onMenu }: { onMenu: () => void }) {
  const { openDialog } = useApp();
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
        <NotificationBell />
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
