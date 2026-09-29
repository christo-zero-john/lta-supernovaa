"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./Sidebar.css";
import LtaIcon from "@/app/dashboard/_components/LtaIcon/LtaIcon";
import useStore from "@/store/useStore";
import { clearCookie } from "@/lib/cookies";

interface SidebarItem {
    id: number;
    label: string;
    icon: string;
}

interface SidebarOptionProps {
    icon: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const MENU_ITEMS: SidebarItem[] = [
    { id: 1, label: "Dashboard", icon: "/assets/icons/HomeIcon.svg" },
];

const BOTTOM_ITEMS: SidebarItem[] = [
    { id: 7, label: "Logout", icon: "/assets/icons/LogoutIcon.svg" },
];

const SidebarOption: React.FC<SidebarOptionProps> = ({
                                                         icon,
                                                         label,
                                                         isActive,
                                                         onClick,
                                                     }) => {
    return (
        <button
            type="button"
            className={`sidebar--menu-item ${isActive ? "active" : ""}`}
            aria-current={isActive ? "page" : undefined}
            onClick={onClick}
        >
            <span className="sidebar--icon-wrapper" aria-hidden="true">
                <span
                    className="sidebar--icon"
                    style={{
                        maskImage: `url(${icon})`,
                        WebkitMaskImage: `url(${icon})`,
                    } as React.CSSProperties}
                />
            </span>
            <span className="sidebar--menu-text">{label}</span>
        </button>
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
    activeId: number;
    onItemClick: (id: number) => void;
    onLogout: () => void;
    isMobile?: boolean;
}> = ({ activeId, onItemClick, onLogout, isMobile = false }) => (
    <>
        <div className="sidebar--logo-section">
            <LtaIcon />
        </div>

        <div className="sidebar--menu">
            <div>
                <p className="sidebar--menu-label">MAIN MENU</p>
                <nav className="sidebar--menu-list" aria-label="Main menu">
                    {MENU_ITEMS.map((item) => (
                        <SidebarOption
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            isActive={activeId === item.id}
                            onClick={() => onItemClick(item.id)}
                        />
                    ))}

                    {isMobile && (
                        <ProfileMenuItem
                            isActive={activeId === 5}
                            onClick={() => onItemClick(5)}
                        />
                    )}
                </nav>
            </div>

            <div className="sidebar--menu-list sidebar--bottom">
                {BOTTOM_ITEMS.map((item) =>
                    item.label === "Logout" ? (
                        <SidebarOption
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            isActive={false}
                            onClick={onLogout}
                        />
                    ) : (
                        <SidebarOption
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            isActive={activeId === item.id}
                            onClick={() => onItemClick(item.id)}
                        />
                    )
                )}
            </div>
        </div>
    </>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const [activeId, setActiveId] = useState<number>(1);
    const router = useRouter();

    const handleLogout = () => {
        clearCookie("token");
        clearCookie("refresh_token");
        router.push("/auth/login");
    };

    const handleItemClick = (id: number) => {
        setActiveId(id);
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
                    activeId={activeId}
                    onItemClick={setActiveId}
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
                    activeId={activeId}
                    onItemClick={handleItemClick}
                    onLogout={handleLogout}
                    isMobile
                />
            </div>
        </>
    );
};

export default Sidebar;
