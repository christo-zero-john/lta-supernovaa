"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/app/dashboard/_components/Sidebar/Sidebar";
import Header from "@/app/dashboard/_components/Header/Header";
import axiosInstance from "@/lib/axios";
import useStore from "@/store/useStore";
import "./dashboard-motion.css";

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
        <div className="layout-container">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="dashboard--main">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                {children}
            </div>
        </div>
    );
}