/* eslint-disable @next/next/no-img-element -- Local design assets retain their reference geometry. */
import { useApp } from "./AppProvider";
import { PERSONAS, NOTIFICATIONS } from "../_lib/fixtures";
import { hasAccess } from "../_lib/model";
import type { ViewId } from "../_lib/types";
import { Icon } from "./ui";
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
        <Icon name={id} />
        <span>{label}</span>
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
          onClick={() => {
            navigate("dashboard");
            onClose();
          }}
        >
          <img src="/assets/figma/dashboard/1-515-imgFrame.svg" alt="" />
          <span>
            Letters
            <br />
            to Abroad<small>Supernova · One Account</small>
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
            <Icon name="settings" />
            Settings
          </button>
          <button
            className="sn-nav-item"
            onClick={() => {
              openDialog({ kind: "logout" });
              onClose();
            }}
          >
            <Icon name="logout" />
            Log out
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
