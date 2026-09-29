import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { SMOOTH_SCROLL_OPTIONS } from "./smoothScrollOptions";

/**
 * Applies the app-wide smooth scroll to an element that scrolls on its own.
 * It attaches after mount, so Lenis's classes never touch server-rendered
 * markup before hydration. At either end, wheel input hands off to the
 * next scroller out, like native scroll chaining.
 */
export function useSmoothScroll<T extends HTMLElement>() {
    const ref = useRef<T>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const lenis = new Lenis({
            ...SMOOTH_SCROLL_OPTIONS,
            wrapper: element,
            content: element,
        });

        // A fixed-height box doesn't resize when its content grows, so
        // watch its children to keep Lenis's scroll limit current.
        const content = new ResizeObserver(() => lenis.resize());
        const observeChildren = () => {
            content.disconnect();
            for (const child of element.children) content.observe(child);
        };
        const children = new MutationObserver(observeChildren);
        observeChildren();
        children.observe(element, { childList: true });

        return () => {
            children.disconnect();
            content.disconnect();
            lenis.destroy();
        };
    }, []);

    return ref;
}
