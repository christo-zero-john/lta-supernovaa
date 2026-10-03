"use client";

import React, {useEffect, useState} from "react";
import useStore from "@/store/useStore";
import PageLoader from "@/components/PageLoader/PageLoader";
import Dashboard from "@/app/dashboard/_supernova/home/Dashboard";

import {handleGetShortlistedCourses} from "@/actions/course.actions";
import {ShortlistedCourse} from "@/lib/services/course.service";

// Morning until noon, afternoon until 5 PM, evening from then through the night.
function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
}

// Images on the home page's first screen, loaded behind the page loader.
const FIRST_SCREEN_IMAGES = [
    "/assets/dashboard/1-632-imgWhatsAppImage20240426At22913.png",
    "/assets/dashboard/1-644-imgFrame2147228681.png",
    "/assets/dashboard/1-683-imgFrame2147228688.png",
    "/assets/dashboard/1-720-imgFrame2147228722.png",
    "/assets/dashboard/1-799-imgFrame2147228693.png",
    "/assets/dashboard/1-799-imgFrame2147228692.png",
    "/assets/dashboard/1-799-imgFrame2147225052.png",
    "/assets/icons/loading-logo.png",
    "/assets/icons/loading-supernova.png",
];

// The last user's courses, kept while the dashboard stays open, so coming
// back to the home page does not show the full-screen loader again.
let loaded: {userId: number | string; courses: ShortlistedCourse[]} | null = null;

export default function DashboardPage(): React.ReactElement {
    const {user} = useStore();
    const cached = loaded && loaded.userId === user?.id ? loaded.courses : null;
    const [loading, setLoading] = useState(!cached);
    const [courses, setCourses] = useState<ShortlistedCourse[]>(cached ?? []);

    // Without a name on the account, greet the user by their email.
    const displayName = user?.first_name?.trim().split(" ")[0] || user?.email || "";
    const greeting = `${getGreeting()}${displayName ? `, ${displayName}` : ""}!`;

    const preloadImage = (src: string): Promise<void> =>
        new Promise((resolve) => {
            const img = new window.Image();
            img.src = src;
            img.onload = () => resolve();
            img.onerror = () => resolve(); // resolve anyway so we don't block
        });

    useEffect(() => {
        if (!user?.id) return;
        const userId = user.id;
        const firstVisit = loaded?.userId !== userId;

        // A return visit refreshes the courses quietly behind the page.
        const fetchAll = async () => {
            if (firstVisit) setLoading(true);
            let result: ShortlistedCourse[] = [];

            await Promise.all([
                handleGetShortlistedCourses().then((r) => {
                    if (r.success && r.data) result = r.data.results;
                }),
                ...FIRST_SCREEN_IMAGES.map(preloadImage),
            ]);
            loaded = {userId, courses: result};
            setCourses(result);
            setLoading(false);
        };

        fetchAll();
    }, [user?.id]);

    if (loading) return <PageLoader/>;

    return <Dashboard greeting={greeting} courses={courses}/>;
}
