"use client";

import { useApp } from "./AppProvider";
import DashboardSearch from "./DashboardSearch";
import UserAvatar from "./UserAvatar";
import { Icon } from "./ui";
import { useUnreadCount } from "../hooks/useUnreadCount";

/** The section pages' top bar: search, WhatsApp, notifications, profile. */
export default function Topbar({ onMenu }: { onMenu: () => void }) {
  const { persona, state, navigate, openDialog } = useApp();
  const unread = useUnreadCount();
  const whatsapp = state[persona].whatsapp;
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
        <button
          className={`sn-whatsapp ${whatsapp ? "" : "off"}`}
          onClick={() => openDialog({ kind: "settings" })}
        >
          <span />
          WhatsApp {whatsapp ? "ON" : "OFF"}
        </button>
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
