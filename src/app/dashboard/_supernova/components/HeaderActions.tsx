"use client";

import { useApp } from "./AppProvider";
import { Icon } from "./ui";
import { useUnreadCount } from "../hooks/useUnreadCount";

/** WhatsApp preference and the notifications bell, shown in the header. */
export default function HeaderActions() {
  const { persona, state, navigate, openDialog } = useApp();
  const unread = useUnreadCount();
  const whatsapp = state[persona].whatsapp;
  return (
    <div className="sn-topbar-right">
      <button
        type="button"
        className={`sn-whatsapp ${whatsapp ? "" : "off"}`}
        onClick={() => openDialog({ kind: "settings" })}
      >
        <span />
        WhatsApp {whatsapp ? "ON" : "OFF"}
      </button>
      <button
        type="button"
        className="sn-icon-button"
        aria-label={`Notifications, ${unread} unread`}
        onClick={() => navigate("notifications")}
      >
        <Icon name="notifications" />
        {unread > 0 && <i />}
      </button>
    </div>
  );
}
