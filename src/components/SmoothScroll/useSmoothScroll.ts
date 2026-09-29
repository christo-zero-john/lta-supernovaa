import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { SMOOTH_SCROLL_OPTIONS } from "./smoothScrollOptions";
import { snapToItems, snapsOnAxis } from "./snap";

export type ScrollOrientation = "vertical" | "horizontal";

/**
 * Applies the app-wide smooth scroll to an element that scrolls on its own.
 * It attaches after mount, so Lenis's classes never touch server-rendered
 * markup before hydration. At either end, wheel input hands off to the
 * next scroller out, like native scroll chaining.
 *
 * Horizontal areas only take sideways gestures (trackpad swipes,
 * Shift+wheel); vertical ones pass through to the page. Areas with CSS
 * scroll snapping keep snapping, with the same easing.
 */
export function useSmoothScroll<T extends HTMLElement>(
    orientation: ScrollOrientation = "vertical",
) {
    const ref = useRef<T>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        const horizontal = orientation === "horizontal";

        const lenis = new Lenis({
            ...SMOOTH_SCROLL_OPTIONS,
            wrapper: element,
            content: element,
            orientation,
            // Horizontal areas take sideways swipes and Shift+wheel (which
            // browsers report as a vertical delta); anything else passes
            // through to the page. "both" lets Shift+wheel's delta count.
            ...(horizontal && {
                gestureOrientation: "both",
                virtualScroll: ({ deltaX, deltaY, event }) =>
                    event.shiftKey || Math.abs(deltaX) > Math.abs(deltaY),
            }),
        });

        // A fixed-size box doesn't resize when its content grows, so
        // watch its children to keep Lenis's scroll limit current.
        const content = new ResizeObserver(() => lenis.resize());
        const observeChildren = () => {
            content.disconnect();
            for (const child of element.children) content.observe(child);
        };
        const children = new MutationObserver(observeChildren);
        observeChildren();
        children.observe(element, { childList: true });

        const stopSnapping = snapsOnAxis(element, horizontal)
            ? snapToItems(lenis, element, horizontal)
            : undefined;

        return () => {
            stopSnapping?.();
            children.disconnect();
            content.disconnect();
            lenis.destroy();
        };
    }, [orientation]);

    return ref;
}
