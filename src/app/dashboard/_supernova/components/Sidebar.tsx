/* eslint-disable @next/next/no-img-element -- Local design assets retain their reference geometry. */
import type { CSSProperties } from "react";
import { useApp } from "./AppProvider";
import { PERSONAS, NOTIFICATIONS } from "../lib/fixtures";
import { hasAccess } from "../lib/model";
import type { ViewId } from "../lib/types";
import { Icon } from "./ui";

type NavIconName = ViewId | "settings" | "logout";

const main: [ViewId, string][] = [
  ["dashboard", "Dashboard"],
  ["documents", "Documents"],
  ["notifications", "Notifications"],
  ["support", "Support"],
];
const suite: [ViewId, string][] = [
  ["zenna", "Zenna"],
  ["connect", "LTA Connect"],
  ["cst", "Course Shortlisting"],
  ["p004", "Project004"],
];

// The first Figma dashboard's sidebar icons, at their intrinsic sizes.
// Items without a Figma icon fall back to the matching line icon.
const figmaIcons: Partial<
  Record<NavIconName, { src: string; width: number; height: number }>
> = {
  dashboard: { src: "/assets/icons/HomeIcon.svg", width: 20, height: 20 },
  documents: { src: "/assets/icons/DocumentsIcon.svg", width: 16, height: 16 },
  notifications: {
    src: "/assets/icons/NotificationIcon.svg",
    width: 20,
    height: 20,
  },
  support: { src: "/assets/icons/SupportIcon.svg", width: 16, height: 16 },
  settings: { src: "/assets/icons/SettingsIcon.svg", width: 16, height: 16 },
  logout: { src: "/assets/icons/LogoutIcon.svg", width: 17, height: 16 },
};

function NavIcon({ name }: { name: NavIconName }) {
  const icon = figmaIcons[name];
  return (
    <span className="sn-nav-icon" aria-hidden="true">
      {icon ? (
        <span
          className="sn-nav-glyph"
          style={
            {
              "--sn-glyph": `url("${icon.src}")`,
              width: icon.width,
              height: icon.height,
            } as CSSProperties
          }
        />
      ) : (
        <Icon name={name} />
      )}
    </span>
  );
}

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { persona, view, state, navigate, openDialog } = useApp();
  const p = state[persona];
  const unread = [...NOTIFICATIONS[persona], ...p.notices].filter(
    (n) => !p.read.includes(n.id),
  ).length;
  const list = (items: [ViewId, string][]) =>
    items.map(([id, label]) => (
      <button
        key={id}
        aria-current={view === id ? "page" : undefined}
        className={`sn-nav-item ${view === id ? "active" : ""} ${hasAccess(persona, id) ? "" : "locked"}`}
        onClick={() => {
          navigate(id);
          onClose();
        }}
      >
        <NavIcon name={id} />
        <span className="sn-nav-text">{label}</span>
        {id === "notifications" && unread > 0 && (
          <span className="sn-count">{unread}</span>
        )}
        {!hasAccess(persona, id) && <Icon name="lock" size={13} />}
      </button>
    ));
  return (
    <>
      <button
        aria-label="Close navigation backdrop"
        className={`sn-nav-backdrop ${open ? "show" : ""}`}
        onClick={onClose}
      />
      <aside
        className={`sn-sidebar ${open ? "open" : ""}`}
        aria-label="Main navigation"
      >
        <button
          className="sn-drawer-close"
          aria-label="Close navigation"
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
        <button
          className="sn-brand"
          aria-label="Letters to Abroad dashboard"
          onClick={() => {
            navigate("dashboard");
            onClose();
          }}
        >
          <img src="/assets/dashboard/1-515-imgFrame.svg" alt="" />
          <span>
            Letters
            <br />
            to Abroad
          </span>
        </button>
        <p className="sn-nav-label">Main menu</p>
        <nav aria-label="Main menu">{list(main)}</nav>
        <p className="sn-nav-label">My suite</p>
        <nav aria-label="My suite">{list(suite)}</nav>
        <div className="sn-sidebar-bottom">
          <button
            className="sn-nav-item"
            onClick={() => {
              openDialog({ kind: "settings" });
              onClose();
            }}
          >
            <NavIcon name="settings" />
            <span className="sn-nav-text">Settings</span>
          </button>
          <button
            className="sn-nav-item"
            onClick={() => {
              openDialog({ kind: "logout" });
              onClose();
            }}
          >
            <NavIcon name="logout" />
            <span className="sn-nav-text">Log out</span>
          </button>
          <button
            className="sn-user"
            onClick={() => openDialog({ kind: "settings" })}
          >
            <span className="sn-avatar">TS</span>
            <span>
              <b>Tino Sunny</b>
              <small>{PERSONAS[persona].role}</small>
            </span>
            <span className="sn-user-arrow">↗</span>
          </button>
        </div>
      </aside>
    </>
  );
}
