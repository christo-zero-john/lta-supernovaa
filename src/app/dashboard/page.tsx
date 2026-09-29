"use client";

import React, {useEffect, useState} from "react";
import useStore from "@/store/useStore";
import PageLoader from "@/components/PageLoader/PageLoader";

import CourseShortlist from "@/app/dashboard/_components/CourseShortlist/CourseShortlist";
import LtaSuit from "@/app/dashboard/_components/LtaSuit/LtaSuit";
import Calendar from "@/app/dashboard/_components/Calendar/Calendar";
import Footer from "@/app/dashboard/_components/Footer/Footer";
import TestimonialCarousel from "@/app/dashboard/_components/Testimonials/TestimonialCarousel";
import MentorSessionCard from "@/app/dashboard/_components/MentorSessionCard/MentorSessionCard";
import Stats from "@/app/dashboard/_components/Stats/Stats";
import ApplicationsTable from "@/app/dashboard/_components/ApplicationsTable/ApplicationsTable";
import LtaPlane from "@/app/dashboard/_components/LtaPlane/LtaPlane";
import ZennaMascotShortlist from "@/app/dashboard/_components/ZennaMascotShortlist/ZennaMascotShortlist";

import {handleGetShortlistedCourses} from "@/actions/course.actions";
import {handleFetchApplications} from "@/actions/applications.actions";
import {handleFetchStats} from "@/actions/stats.actions";

import {ShortlistedCourse} from "@/lib/services/course.service";
import {Application} from "@/lib/services/applications.service";
import {StatsData} from "@/lib/services/stats.service";

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
}

interface DashboardData {
    courses: ShortlistedCourse[];
    applications: Application[];
    stats: StatsData | null;
}

// ─── Connect Layout ───────────────────────────────────────────────────────────
function ConnectLayout({
                           greeting,
                           data,
                       }: {
    greeting: string;
    data: DashboardData;
}) {
    return (
        <>
            <h2 className="main--header-style">{greeting}</h2>
            <div className="connect--lta-mentor-row">
                <LtaSuit/>
                <div className="common--flex-1">
                    <MentorSessionCard/>
                </div>
            </div>
            <TestimonialCarousel/>
            <div
                className="common--flex-col common--align-start common--justify-center common--gap-1 common--width-100 common--margin-top-auto">
                <div className="main--footer-caption">Hear from our family</div>
                <Footer/>
            </div>
        </>
    );
}

// ─── Zenna Layout ─────────────────────────────────────────────────────────────
function ZennaLayout({
                         greeting,
                         data,
                     }: {
    greeting: string;
    data: DashboardData;
}) {
    return (
        <>
            <div className="zenna--greeting-stats-row">
                <h2 className="main--header-style">{greeting}</h2>
                <Stats prefetchedData={data.stats}/>
            </div>
            <div className="zenna--suit-plane-row">
                <LtaSuit/>
                <LtaPlane/>
            </div>
            <ApplicationsTable prefetchedData={data.applications}/>
            <TestimonialCarousel/>
            <div
                className="common--flex-col common--align-start common--justify-center common--gap-1 common--width-100 common--margin-top-auto">
                <div className="main--footer-caption">Hear from our family</div>
                <Footer/>
            </div>
        </>
    );
}

// ─── Default Layout ───────────────────────────────────────────────────────────
function DefaultLayout({
                           greeting,
                           data,
                       }: {
    greeting: string;
    data: DashboardData;
}) {
    const hasCourses = data.courses.length > 0;

    return (
        <>
            <h2 className="main--header-style">{greeting}</h2>
            {hasCourses && (
                <div className="default--plane-shortlist-row">
                    <ZennaMascotShortlist/>
                    <CourseShortlist prefetchedData={data.courses}/>
                </div>
            )}
            <div className="default--suit-plane-row">
                <LtaSuit/>
                <LtaPlane/>
            </div>
            <Calendar/>
            <TestimonialCarousel/>
            <div
                className="common--flex-col common--align-start common--justify-center common--gap-1 common--width-100 common--margin-top-auto">
                <div className="main--footer-caption">Hear from our family</div>
                <Footer/>
            </div>
        </>
    );
}

// ─── Zenna + Connect Layout ───────────────────────────────────────────────────
function ZennaAndConnectLayout({
                                   greeting,
                                   data,
                               }: {
    greeting: string;
    data: DashboardData;
}) {
    return (
        <>
            <div className="zenna-connect--greeting-stats-row common--flex-row common--width-100 common--gap-1 common--align-start common--justify-between">
                <h2 className="main--header-style">{greeting}</h2>
                <Stats prefetchedData={data.stats}/>
            </div>
            <div className="zenna-connect--suit-session-row common--flex-row common--width-100 common--gap-1">
                <LtaSuit/>
                <MentorSessionCard/>
            </div>
            <ApplicationsTable prefetchedData={data.applications}/>
            <Calendar/>
            <TestimonialCarousel/>
            <div
                className="common--flex-col common--align-start common--justify-center common--gap-1 common--width-100 common--margin-top-auto">
                <div className="main--footer-caption">Hear from our family</div>
                <Footer/>
            </div>
        </>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DashboardPage(): React.ReactElement {
    const {user} = useStore();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DashboardData>({
        courses: [],
        applications: [],
        stats: null,
    });

    const platformType = user?.signup_platform_type || "dashboard";
    const isEmailVerified = user?.is_email_verified ?? false;
    const isOnboardingCompleted = user?.is_onboarding_completed ?? false;
    const isApproved = user?.is_approved ?? false;
    const hasAccess = isEmailVerified && isOnboardingCompleted && isApproved;
    const effectivePlatformType =
        hasAccess && platformType === "connect" ? "zenna_and_connect" : platformType;
    const firstName = user?.first_name?.split(" ")[0] || "";
    const greeting = `${getGreeting()}${firstName ? `, ${firstName}` : ""}!`;

    const preloadImage = (src: string): Promise<void> =>
        new Promise((resolve) => {
            const img = new window.Image();
            img.src = src;
            img.onload = () => resolve();
            img.onerror = () => resolve(); // resolve anyway so we don't block
        });


    useEffect(() => {
        if (!user?.id) return;

        const fetchAll = async () => {
            setLoading(true);

            const fetches: Promise<void>[] = [];

            const result: DashboardData = {
                courses: [],
                applications: [],
                stats: null,
            };

            // Only fetch what the current layout needs
            if (!hasAccess || effectivePlatformType === "dashboard") {
                fetches.push(
                    handleGetShortlistedCourses().then((r) => {
                        if (r.success && r.data) result.courses = r.data.results;
                    })
                );
            }

            if (
                hasAccess
                && (effectivePlatformType === "zenna" || effectivePlatformType === "zenna_and_connect")
            ) {
                fetches.push(
                    handleFetchApplications({id: user.id}).then((r) => {
                        if (r.success && r.data) result.applications = r.data.results;
                    }),
                    handleFetchStats().then((r) => {
                        if (r.success && r.data) result.stats = r.data;
                    })
                );
            }

            await Promise.all(fetches);
            await Promise.all([
                ...fetches,
                preloadImage("/assets/images/Technical_University_of_Munich.png"),
                preloadImage("/assets/images/suit-shortlisting.png"),
                preloadImage("/assets/images/suit-connect.png"),
                preloadImage("/assets/images/suit-zenna.png"),
                preloadImage("/assets/icons/loading-logo.png"),
                preloadImage("/assets/icons/loading-supernova.png"),
                // add any other images visible on first render
            ]);
            setData(result);
            setLoading(false);
        };

        fetchAll();
    }, [user?.id, effectivePlatformType, hasAccess]);

    if (loading) return <PageLoader/>;

    const layoutProps = {greeting, data};

    const renderLayout = () => {
        if (!hasAccess) {
            return <DefaultLayout {...layoutProps} />;
        }
        switch (effectivePlatformType) {
            case "connect":
                return <ConnectLayout {...layoutProps} />;
            case "zenna":
                return <ZennaLayout {...layoutProps} />;
            case "zenna_and_connect":
                return <ZennaAndConnectLayout {...layoutProps} />;
            case "dashboard":
            default:
                return <DefaultLayout {...layoutProps} />;
        }
    };

    return (
        <div className="main-section-container">
            {renderLayout()}
        </div>
    );
}
