"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import "./SmoothScroll.css";
import { SMOOTH_SCROLL_OPTIONS } from "./smoothScrollOptions";

/**
 * Smooths page (window) scrolling everywhere. Mounted once in the root
 * layout; renders nothing. Anything that scrolls inside its own box —
 * fixed-height pages, carousels, wide tables — uses `SmoothScrollArea`.
 */
export default function SmoothScroll() {
    useEffect(() => {
        const lenis = new Lenis({ ...SMOOTH_SCROLL_OPTIONS, anchors: true });
        return () => lenis.destroy();
    }, []);

    return null;
}
