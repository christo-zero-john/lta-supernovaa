"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useSmoothScroll } from "./useSmoothScroll";

/** A `div` that scrolls on its own with the app-wide smooth scroll. */
export default function SmoothScrollArea(
    props: ComponentPropsWithoutRef<"div">,
) {
    const ref = useSmoothScroll<HTMLDivElement>();
    return <div ref={ref} {...props} />;
}
