"use client";

/* eslint-disable @next/next/no-img-element -- Local design assets retain their reference geometry. */
import type { CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearCookie } from "@/lib/cookies";
import { useApp } from "./AppProvider";
import { PERSONAS } from "../lib/fixtures";
import { hasAccess } from "../lib/model";
import { VIEW_ROUTES, viewHref, viewsIn } from "../lib/routes";
import type { ViewId } from "../lib/types";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { Icon } from "./ui";
import UserAvatar from "./UserAvatar";
import { useSmoothScroll } from "@/components/SmoothScroll/useSmoothScroll";

type NavIconName = ViewId | "settings" | "logout";

// The first Figma dashboard's sidebar icons, at their intrinsic sizes.
// Items without a Figma icon fall back to the matching line icon.
const figmaIcons: Partial<
  Record<NavIconName, { src: string; width: number; height: number }>
> = {
  dashboard: { src: "/assets/icons/HomeIcon.svg", width: 20, height: 20 },
  documents: { src: "/assets/icons/DocumentsIcon.svg", width: 16, height: 16 },
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
  const router = useRouter();
  // The sidebar scrolls smoothly on its own; the page's scroller ignores
  // wheel input over it (data-lenis-prevent), so the page never moves.
  const scrollRef = useSmoothScroll<HTMLElement>();
  const { persona, view, openDialog } = useApp();
  const { name } = useCurrentUser();

  const handleLogout = () => {
    clearCookie("token");
    clearCookie("refresh_token");
    router.push("/auth/login");
  };

  const list = (items: ViewId[]) =>
    items.map((id) => (
      <Link
        key={id}
        href={viewHref(id, persona)}
        aria-current={view === id ? "page" : undefined}
        className={`sn-nav-item ${view === id ? "active" : ""} ${hasAccess(persona, id) ? "" : "locked"}`}
        onClick={onClose}
      >
        <NavIcon name={id} />
        <span className="sn-nav-text">{VIEW_ROUTES[id].label}</span>
        {!hasAccess(persona, id) && <Icon name="lock" size={13} />}
      </Link>
    ));
  return (
    <>
      <button
        aria-label="Close navigation backdrop"
        className={`sn-nav-backdrop ${open ? "show" : ""}`}
        onClick={onClose}
      />
      <aside
        ref={scrollRef}
        data-lenis-prevent
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
        <Link
          className="sn-brand"
          aria-label="Letters to Abroad dashboard"
          href={viewHref("dashboard", persona)}
          onClick={onClose}
        >
          <img src="/assets/dashboard/1-515-imgFrame.svg" alt="" />
          <span>
            Letters
            <br />
            to Abroad
          </span>
        </Link>
        <p className="sn-nav-label">Main menu</p>
        <nav aria-label="Main menu">
          {/* Notifications open from the navbar's bell instead. */}
          {list(viewsIn("main").filter((id) => id !== "notifications"))}
        </nav>
        <p className="sn-nav-label">My suite</p>
        <nav aria-label="My suite">{list(viewsIn("suite"))}</nav>
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
          <button className="sn-nav-item" onClick={handleLogout}>
            <NavIcon name="logout" />
            <span className="sn-nav-text">Log out</span>
          </button>
          <button
            className="sn-user"
            onClick={() => openDialog({ kind: "settings" })}
          >
            <span className="sn-avatar">
              <UserAvatar />
            </span>
            <span>
              <b>{name}</b>
              <small>{PERSONAS[persona].role}</small>
            </span>
            <span className="sn-user-arrow">↗</span>
          </button>
        </div>
      </aside>
    </>
  );
}
