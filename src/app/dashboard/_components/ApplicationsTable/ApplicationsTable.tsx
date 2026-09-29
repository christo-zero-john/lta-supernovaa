"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import SmoothScrollArea from "@/components/SmoothScroll/SmoothScrollArea";
import "./ApplicationsTable.css";
import useStore from "@/store/useStore";
import { handleFetchApplications } from "@/actions/applications.actions";
import { Application } from "@/lib/services/applications.service";
import DownloadIcon from "@/app/dashboard/_components/DownloadIcon/DownloadIcon";
import DownloadDisabled from "@/app/dashboard/_components/DownloadDisabled/DownloadDisabled";

const APPLICATION_STATUS_COLORS: Record<string, string> = {
    pending: "#F59E0B",
    submitted: "#3B82F6",
    under_review: "#8B5CF6",
    confirmed: "#10B981",
    rejected: "#EF4444",
    waitlisted: "#F97316",
    withdrawn: "#6B7280",
};

const ADMISSION_STATUS_COLORS: Record<string, string> = {
    pending: "#F59E0B",
    accepted: "#10B981",
    rejected: "#EF4444",
    conditional: "#3B82F6",
    deferred: "#F97316",
    waitlisted: "#8B5CF6",
};

const StatusBadge: React.FC<{
    status: string;
    colorMap: Record<string, string>;
}> = ({ status, colorMap }) => {
    const color = colorMap[status?.toLowerCase()] || "#6B7280";
    const label = status?.replace(/_/g, " ") || "—";

    return (
        <span
            className="applications-table--badge"
            style={{
                backgroundColor: `${color}18`,
                color: color,
                border: `1px solid ${color}40`,
            }}
        >
      {label}
    </span>
    );
};

const handleViewFile = (file: string | null) => {
    if (!file) return;
    window.open(file, "_blank");
};

interface ApplicationsTableProps {
    prefetchedData: Application[];
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({ prefetchedData }) => {

    return (
        <div className="applications-table--container">
            <div className="applications-table--top">
                <p className="applications-table--title">Applications</p>
            </div>

            <SmoothScrollArea className="applications-table--wrapper" orientation="horizontal">
                <div className="applications-table--scroll">

                    {/* Header */}
                    <div className="applications-table--thead">
                        <div className="applications-table--th applications-table--col-main">
                            University & Course
                        </div>
                        <div className="applications-table--th applications-table--col">
                            Application Status
                        </div>
                        <div className="applications-table--th applications-table--col">
                            Admission Status
                        </div>
                        <div className="applications-table--th applications-table--col">
                            Documents
                        </div>
                    </div>

                    {/* Body */}
                    {prefetchedData.length === 0 ? (
                        <div className="applications-table--empty">
                            <p>No Applications Found</p>
                        </div>
                    ) : (
                        prefetchedData.map((app) => (
                            <div key={app.id} className="applications-table--row">

                                {/* University + Course */}
                                <div className="applications-table--td applications-table--col-main">
                                    <div className="applications-table--uni-wrapper">
                                        <div className="applications-table--logo-wrapper">
                                            {!app.update_viewed && (
                                                <span className="applications-table--update-dot" />
                                            )}
                                            {app.university_logo ? (
                                                <Image
                                                    src={app.university_logo}
                                                    alt={app.university_name}
                                                    width={44}
                                                    height={44}
                                                    className="applications-table--logo"
                                                />
                                            ) : (
                                                <div className="applications-table--logo-placeholder" />
                                            )}
                                        </div>
                                        <div className="applications-table--text-col">
                                            <p className="applications-table--main-text">
                                                {app.university_name}
                                            </p>
                                            <p className="applications-table--sub-text">
                                                {app.course_name}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Application Status */}
                                <div className="applications-table--td applications-table--col applications-table--center">
                                    <StatusBadge
                                        status={app.application_status}
                                        colorMap={APPLICATION_STATUS_COLORS}
                                    />
                                </div>

                                {/* Admission Status */}
                                <div className="applications-table--td applications-table--col applications-table--center">
                                    <StatusBadge
                                        status={app.admission_status}
                                        colorMap={ADMISSION_STATUS_COLORS}
                                    />
                                </div>

                                {/* Documents */}
                                <div className="applications-table--td applications-table--col applications-table--center">
                                    <div
                                        className={
                                            app.application_letter
                                                ? "applications-table--download-btn"
                                                : "applications-table--download-disabled"
                                        }
                                        onClick={() =>
                                            app.application_letter
                                                ? handleViewFile(app.application_letter)
                                                : undefined
                                        }
                                    >
                                        {app.application_letter ? (
                                            <DownloadIcon />
                                        ) : (
                                            <DownloadDisabled />
                                        )}
                                    </div>
                                </div>

                            </div>
                        ))
                    )}
                </div>
            </SmoothScrollArea>
        </div>
    );
};

export default ApplicationsTable;