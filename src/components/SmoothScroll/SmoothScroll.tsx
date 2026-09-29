"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { SMOOTH_SCROLL_OPTIONS } from "./smoothScrollOptions";

/**
 * Smooths page (window) scrolling everywhere. Mounted once in the root
 * layout; renders nothing. Pages that scroll inside a fixed-height box use
 * `SmoothScrollArea` for that box.
 */
export default function SmoothScroll() {
    useEffect(() => {
        const lenis = new Lenis({ ...SMOOTH_SCROLL_OPTIONS, anchors: true });
        return () => lenis.destroy();
    }, []);

    return null;
}
