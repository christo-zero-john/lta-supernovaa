"use client";

import React, { useState } from "react";
import Image from "next/image";
import "./Header.css";
import LtaIcon from "@/app/dashboard/_components/LtaIcon/LtaIcon";
import useStore from "@/store/useStore";
import DashboardSearch from "@/app/dashboard/_supernova/components/DashboardSearch";
import HeaderActions from "@/app/dashboard/_supernova/components/HeaderActions";

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }): React.ReactElement => {
    const { user } = useStore();
    const [failedSrc, setFailedSrc] = useState<string | null>(null);
    const placeholderSrc = "/assets/images/profile-placeholder.svg";
    const requestedSrc = user?.profile_picture || placeholderSrc;

    const profileSrc =
        requestedSrc === failedSrc ? placeholderSrc : requestedSrc;

    const ProfilePicture = (
        <div className="header--profile-image-wrapper">
            <Image
                src={profileSrc}
                alt={user?.first_name || "Profile"}
                fill
                sizes="36px"
                className="header--profile-image"
                priority
                onError={() => setFailedSrc(requestedSrc)}
            />
        </div>
    );

    // One responsive header (a single search box, so no duplicate ids).
    // Narrow screens: logo, search, menu — the profile picture moves into
    // the drawer's Profile item.
    return (
        <header className="header--container">
            <div className="header--logo">
                <LtaIcon />
            </div>
            <div className="supernova header--search">
                <DashboardSearch />
            </div>
            <div className="supernova header--actions">
                <HeaderActions />
            </div>
            <div className="header--profile-section">{ProfilePicture}</div>
            <button
                type="button"
                className="header--menu-btn"
                aria-label="Open navigation"
                onClick={onMenuClick}
            >
                <Image
                    src="/assets/icons/Menu_icon.svg"
                    alt=""
                    width={24}
                    height={24}
                />
            </button>
        </header>
    );
};

export default Header;
