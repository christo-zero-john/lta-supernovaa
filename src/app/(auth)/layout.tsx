import React from "react";
import Image from "next/image";
import SmoothScrollArea from "@/components/SmoothScroll/SmoothScrollArea";
import "./auth.css";

export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <SmoothScrollArea className="layout-container-login">
            <div className="auth-bg" aria-hidden="true">
                <span className="auth-ellipse ellipse-1" />
                <span className="auth-ellipse ellipse-2" />
                <span className="auth-ellipse ellipse-3" />
                <span className="auth-ellipse ellipse-4" />
            </div>
            <div className="auth-shell">
                <div className="auth-shell-logo">
                    <Image
                        src="/assets/icons/white-logo.png"
                        alt="Letters to Abroad"
                        width={160}
                        height={48}
                        priority
                    />
                </div>
                {children}
            </div>
        </SmoothScrollArea>
    );
}
