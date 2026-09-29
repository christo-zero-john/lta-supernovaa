"use client";

import React, { Suspense, useEffect, useState, ViewTransition } from "react";
import Sidebar from "@/app/dashboard/_components/Sidebar/Sidebar";
import Header from "@/app/dashboard/_components/Header/Header";
import PageLoader from "@/components/PageLoader/PageLoader";
import { AppProvider } from "@/app/dashboard/_supernova/components/AppProvider";
import SupernovaOverlays from "@/app/dashboard/_supernova/components/SupernovaOverlays";
import axiosInstance from "@/lib/axios";
import useStore from "@/store/useStore";
import "./_supernova/supernova.css";
import "./_supernova/reference-fonts.css";
import "./_supernova/button-motion.css";
import "./dashboard-motion.css";

/**
 * The shell shared by every dashboard page: the sidebar, header, dialogs and
 * app state stay mounted while pages change, and only the page content
 * transitions.
 */
export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}): React.ReactElement {
    const { setUser } = useStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get("users/me/");
                if (response.data?.data) {
                    setUser(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
            } finally {

            }
        };

        fetchUser();
    }, [setUser]);

    return (
        // The app state reads the URL's query, so it renders under Suspense.
        <Suspense fallback={<PageLoader/>}>
            <AppProvider>
                <div className="sn-root layout-container">
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <div className="dashboard--main">
                        <Header onMenuClick={() => setSidebarOpen(true)} />
                        <ViewTransition name="dashboard-page" default="dashboard-page">
                            <div className="dashboard--page">{children}</div>
                        </ViewTransition>
                    </div>
                    <SupernovaOverlays/>
                </div>
            </AppProvider>
        </Suspense>
    );
}
