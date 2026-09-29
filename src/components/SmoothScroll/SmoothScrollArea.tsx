"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useSmoothScroll, type ScrollOrientation } from "./useSmoothScroll";

/** A `div` that scrolls on its own with the app-wide smooth scroll. */
export default function SmoothScrollArea({
    orientation = "vertical",
    ...props
}: ComponentPropsWithoutRef<"div"> & { orientation?: ScrollOrientation }) {
    const ref = useSmoothScroll<HTMLDivElement>(orientation);
    return <div ref={ref} {...props} />;
}
