import type Lenis from "lenis";

/** Wait after the last wheel input before settling on a snap point. */
const SETTLE_DELAY_MS = 90;

/** True when the element has CSS scroll snapping on the given axis. */
export function snapsOnAxis(element: HTMLElement, horizontal: boolean) {
    const [axis] = getComputedStyle(element).scrollSnapType.split(" ");
    if (!axis || axis === "none") return false;
    return (
        axis === "both" ||
        (horizontal
            ? axis === "x" || axis === "inline"
            : axis === "y" || axis === "block")
    );
}

/** `scroll-snap-align` for one axis ("start start" style values give block, inline). */
function alignOnAxis(value: string, horizontal: boolean) {
    const [block, inline = block] = value.split(" ");
    return horizontal ? inline : block;
}

/**
 * Scroll offsets at which each snap item lines up with the scroller, per
 * its CSS `scroll-snap-align`. Like CSS, items may sit at any depth.
 */
function snapPoints(element: HTMLElement, horizontal: boolean, limit: number) {
    const box = element.getBoundingClientRect();
    const edge = horizontal
        ? box.left + element.clientLeft
        : box.top + element.clientTop;
    const scroll = horizontal ? element.scrollLeft : element.scrollTop;
    const viewport = horizontal ? element.clientWidth : element.clientHeight;
    const points: number[] = [];
    for (const item of element.querySelectorAll<HTMLElement>("*")) {
        const align = alignOnAxis(
            getComputedStyle(item).scrollSnapAlign,
            horizontal,
        );
        if (align === "none") continue;
        const rect = item.getBoundingClientRect();
        const start = (horizontal ? rect.left : rect.top) - edge + scroll;
        const size = horizontal ? rect.width : rect.height;
        const point =
            align === "end"
                ? start + size - viewport
                : align === "center"
                  ? start + size / 2 - viewport / 2
                  : start;
        points.push(Math.min(limit, Math.max(0, Math.round(point))));
    }
    return points;
}

/**
 * Mandatory, direction-aware snapping on top of Lenis's glide. When wheel
 * input pauses, the glide is retargeted to the nearest snap point ahead in
 * the gesture's direction, so it never comes to rest between items. CSS
 * snapping still handles touch, keyboard and scrollbar input.
 */
export function snapToItems(
    lenis: Lenis,
    element: HTMLElement,
    horizontal: boolean,
) {
    let origin: number | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const settle = () => {
        const from = origin ?? lenis.targetScroll;
        const target = lenis.targetScroll;
        origin = null;
        const points = snapPoints(element, horizontal, lenis.limit);
        if (!points.length) return;
        const direction = Math.sign(target - from);
        const ahead = points.filter((p) => (p - from) * direction > 0);
        const candidates = direction && ahead.length ? ahead : points;
        const snap = candidates.reduce((best, p) =>
            Math.abs(p - target) < Math.abs(best - target) ? p : best,
        );
        if (snap !== target) lenis.scrollTo(snap);
    };

    // Emitted before Lenis applies the delta, so the first event of a
    // gesture still sees where the gesture started.
    const unsubscribe = lenis.on("virtual-scroll", () => {
        origin ??= lenis.targetScroll;
        clearTimeout(timer);
        timer = setTimeout(settle, SETTLE_DELAY_MS);
    });

    return () => {
        unsubscribe();
        clearTimeout(timer);
    };
}
