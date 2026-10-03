"use client";

import React, { Suspense, useEffect } from "react";
import PageLoader from "@/components/PageLoader/PageLoader";
import { AppProvider } from "@/app/dashboard/_supernova/components/AppProvider";
import AppShell from "@/app/dashboard/_supernova/components/AppShell";
import SupernovaOverlays from "@/app/dashboard/_supernova/components/SupernovaOverlays";
import { DemoDataProvider } from "@/app/dashboard/_supernova/demo/DemoDataProvider";
import axiosInstance from "@/lib/axios";
import useStore from "@/store/useStore";
import "./_supernova/supernova.css";
import "./_supernova/reference-fonts.css";
import "./_supernova/button-motion.css";

/**
 * The shell shared by every dashboard page: the sidebar, dialogs and app
 * state stay mounted while pages change, and only the page transitions.
 */
export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}): React.ReactElement {
    const { setUser } = useStore();

    useEffect(() => {
        let cancelled = false;

        // A slow or dropped connection gets two more tries before giving up.
        const fetchUser = async () => {
            for (let attempt = 1; attempt <= 3 && !cancelled; attempt++) {
                try {
                    const response = await axiosInstance.get("users/me/", {timeout: 15000});
                    if (response.data?.data && !cancelled) {
                        setUser(response.data.data);
                    }
                    return;
                } catch (error) {
                    console.error(`Failed to fetch user profile (attempt ${attempt}):`, error);
                }
            }
        };

        fetchUser();
        return () => {
            cancelled = true;
        };
    }, [setUser]);

    return (
        // The app state reads the URL's query, so it renders under Suspense.
        <Suspense fallback={<PageLoader/>}>
            <DemoDataProvider>
                <AppProvider>
                    <div className="sn-root">
                        <AppShell>{children}</AppShell>
                        <SupernovaOverlays/>
                    </div>
                </AppProvider>
            </DemoDataProvider>
        </Suspense>
    );
}
