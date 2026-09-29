import type { LenisOptions } from "lenis";

/**
 * The app-wide scroll feel, shared by the page and every scroll area.
 * Lenis eases wheel and trackpad input; touch keeps native momentum, and
 * users who prefer reduced motion get instant scrolling (Lenis's built-in
 * `respectReducedMotion`).
 */
export const SMOOTH_SCROLL_OPTIONS: LenisOptions = {
    lerp: 0.08, // lower glides longer; Lenis's default is 0.1
    smoothWheel: true,
    syncTouch: false,
    // Dropdowns, dialogs and small panels that scroll on their own stay native.
    allowNestedScroll: true,
    stopInertiaOnNavigate: true,
    autoRaf: true,
    // Shift+wheel means "scroll sideways"; leave it to horizontal areas.
    virtualScroll: ({ event }) => !event.shiftKey,
};
