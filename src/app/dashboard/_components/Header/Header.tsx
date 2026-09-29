"use client";

import React, { useState } from "react";
import Image from "next/image";
import "./Header.css";
import LtaIcon from "@/app/dashboard/_components/LtaIcon/LtaIcon";
import useStore from "@/store/useStore";

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

    return (
        <>
            {/* Desktop */}
            <div className="header--main-container-large-screen">
                <div className="header--search-container">
                    <input
                        type="text"
                        className="header--search-input"
                        placeholder="Search"
                        aria-label="Search"
                    />
                </div>
                <div className="header--profile-section">{ProfilePicture}</div>
            </div>

            {/* Mobile — profile picture removed */}
            <div className="header--main-container-mobile-screen">
                <div>
                    <LtaIcon />
                </div>
                <div className="header--search-container">
                    <input
                        type="text"
                        className="header--search-input"
                        placeholder="Search"
                        aria-label="Search"
                    />
                </div>
                <button
                    type="button"
                    className="header--menu-btn"
                    aria-label="Open navigation"
                    onClick={onMenuClick}
                >
                    <Image
                        src="/assets/icons/Menu_icon.svg"
                        alt="Menu"
                        width={24}
                        height={24}
                    />
                </button>
            </div>
        </>
    );
};

export default Header;
