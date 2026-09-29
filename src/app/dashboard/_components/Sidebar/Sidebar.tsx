"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "./Sidebar.css";
import LtaIcon from "@/app/dashboard/_components/LtaIcon/LtaIcon";
import useStore from "@/store/useStore";
import { clearCookie } from "@/lib/cookies";
import { useApp } from "@/app/dashboard/_supernova/components/AppProvider";
import { Icon } from "@/app/dashboard/_supernova/components/ui";
import { useUnreadCount } from "@/app/dashboard/_supernova/hooks/useUnreadCount";
import { hasAccess } from "@/app/dashboard/_supernova/lib/model";
import {
    VIEW_ROUTES,
    viewHref,
    viewsIn,
} from "@/app/dashboard/_supernova/lib/routes";
import type { ViewId } from "@/app/dashboard/_supernova/lib/types";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

// Icon files drawn as masks (so the active item can recolour them). Views
// without a file use the matching line icon.
const ICON_FILES: Partial<Record<ViewId | "settings" | "logout", string>> = {
    dashboard: "/assets/icons/HomeIcon.svg",
    documents: "/assets/icons/DocumentsIcon.svg",
    notifications: "/assets/icons/NotificationIcon.svg",
    support: "/assets/icons/SupportIcon.svg",
    settings: "/assets/icons/SettingsIcon.svg",
    logout: "/assets/icons/LogoutIcon.svg",
};

const SidebarIcon: React.FC<{ name: ViewId | "settings" | "logout" }> = ({
                                                                            name,
                                                                        }) => {
    const file = ICON_FILES[name];
    return (
        <span className="sidebar--icon-wrapper" aria-hidden="true">
            {file ? (
                <span
                    className="sidebar--icon"
                    style={{
                        maskImage: `url(${file})`,
                        WebkitMaskImage: `url(${file})`,
                    } as React.CSSProperties}
                />
            ) : (
                <Icon name={name} />
            )}
        </span>
    );
};

const ProfileMenuItem: React.FC<{
    isActive: boolean;
    onClick: () => void;
}> = ({ isActive, onClick }) => {
    const { user } = useStore();
    const [failedSrc, setFailedSrc] = useState<string | null>(null);
    const placeholderSrc = "/assets/images/profile-placeholder.svg";
    const requestedSrc = user?.profile_picture || placeholderSrc;

    const profileSrc =
        requestedSrc === failedSrc ? placeholderSrc : requestedSrc;

    return (
        <button
            type="button"
            className={`sidebar--menu-item ${isActive ? "active" : ""}`}
            aria-label="Profile"
            onClick={onClick}
        >
            <span className="sidebar--icon-wrapper">
                <span className="sidebar--profile-avatar">
                    <Image
                        src={profileSrc}
                        alt={user?.first_name || "Profile"}
                        fill
                        sizes="20px"
                        className="sidebar--profile-avatar-img"
                        onError={() => setFailedSrc(requestedSrc)}
                    />
                </span>
            </span>
            {/*<span className="sidebar--menu-text">Profile</span>*/}
        </button>
    );
};

const SidebarContent: React.FC<{
    profileActive: boolean;
    onNavigate: () => void;
    onProfile: () => void;
    onSettings: () => void;
    onLogout: () => void;
    isMobile?: boolean;
}> = ({
          profileActive,
          onNavigate,
          onProfile,
          onSettings,
          onLogout,
          isMobile = false,
      }) => {
    const { persona, view } = useApp();
    const unread = useUnreadCount();

    const links = (views: ViewId[]) =>
        views.map((id) => {
            const isActive = !profileActive && view === id;
            const locked = !hasAccess(persona, id);
            return (
                <Link
                    key={id}
                    href={viewHref(id, persona)}
                    className={`sidebar--menu-item ${isActive ? "active" : ""} ${locked ? "locked" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={onNavigate}
                >
                    <SidebarIcon name={id} />
                    <span className="sidebar--menu-text">
                        {VIEW_ROUTES[id].label}
                    </span>
                    {id === "notifications" && unread > 0 && (
                        <span className="sidebar--count">{unread}</span>
                    )}
                    {locked && (
                        <span className="sidebar--lock" aria-label="Locked">
                            <Icon name="lock" size={13} />
                        </span>
                    )}
                </Link>
            );
        });

    return (
        <>
            <div className="sidebar--logo-section">
                <LtaIcon />
            </div>

            <div className="sidebar--menu">
                <div>
                    <p className="sidebar--menu-label">MAIN MENU</p>
                    <nav className="sidebar--menu-list" aria-label="Main menu">
                        {links(viewsIn("main"))}

                        {isMobile && (
                            <ProfileMenuItem
                                isActive={profileActive}
                                onClick={onProfile}
                            />
                        )}
                    </nav>
                    <p className="sidebar--menu-label">MY SUITE</p>
                    <nav className="sidebar--menu-list" aria-label="My suite">
                        {links(viewsIn("suite"))}
                    </nav>
                </div>

                <div className="sidebar--menu-list sidebar--bottom">
                    <button
                        type="button"
                        className="sidebar--menu-item"
                        onClick={onSettings}
                    >
                        <SidebarIcon name="settings" />
                        <span className="sidebar--menu-text">Settings</span>
                    </button>
                    <button
                        type="button"
                        className="sidebar--menu-item"
                        onClick={onLogout}
                    >
                        <SidebarIcon name="logout" />
                        <span className="sidebar--menu-text">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { openDialog } = useApp();
    // The mobile Profile item stays highlighted until the next navigation.
    const [profileActiveOn, setProfileActiveOn] = useState<string | null>(null);
    const profileActive = profileActiveOn === pathname;

    const handleLogout = () => {
        clearCookie("token");
        clearCookie("refresh_token");
        router.push("/auth/login");
    };

    const handleSettings = () => {
        openDialog({ kind: "settings" });
        onClose();
    };

    const handleProfile = () => {
        setProfileActiveOn(pathname);
        onClose();
    };

    return (
        <>
            {/* Desktop */}
            <aside
                className="sidebar--container-large-screen"
                aria-label="Main navigation"
            >
                <SidebarContent
                    profileActive={profileActive}
                    onNavigate={() => undefined}
                    onProfile={handleProfile}
                    onSettings={handleSettings}
                    onLogout={handleLogout}
                />
            </aside>

            {/* Mobile overlay backdrop */}
            {isOpen && <div className="sidebar--overlay" onClick={onClose} />}

            {/* Mobile drawer */}
            <div
                className={`sidebar--container-mobile-screen ${isOpen ? "open" : ""}`}
                inert={!isOpen}
            >
                <SidebarContent
                    profileActive={profileActive}
                    onNavigate={onClose}
                    onProfile={handleProfile}
                    onSettings={handleSettings}
                    onLogout={handleLogout}
                    isMobile
                />
            </div>
        </>
    );
};

export default Sidebar;
