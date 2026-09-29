# Figma dashboard reference

Route: `/figma/dashoard` (the originally requested spelling). `/figma/dashboard` redirects to it.

Source: [Figma frame 1:514](https://www.figma.com/design/lnOH0IYXWcqSfk8e4jobzq/lta-dev-ref?node-id=1-514), 1425 × 1770.846.

## Implementation

The route is public for visual review, with the same deterministic profile and content as the design. It does not call the account API or change login state. Only this exact route and its `/figma/dashboard` alias bypass authentication; the existing dashboard stays protected. Metadata disables indexing.

`src/app/figma/dashoard` contains the route, scoped styles, and components. Figma source images and SVGs are local in `public/assets/figma/dashboard`. Fonts are downloaded and self-hosted by `next/font`; they do not depend on browser requests to Google Fonts.

The 247px sidebar, 12px outer spacing, 24px content padding, 32px section spacing, 325px recommendations row, university card compositing, product imagery, event fixtures, calendar excerpt, testimonial gradients and footer follow the source context. Native exported SVG dimensions are retained. Suitable existing document, support, settings and logout icons are reused.

Recommendations retain their native 273 × 317 proportions and never stretch beyond that size. Complete cards scale as a unit, including their text and images, and the mascot and speech bubble scale together. From 1024 CSS pixels upwards, the entire 1425px desktop frame scales uniformly to fit the viewport width, capped at its native size. Fonts, sidebar, artwork and spacing scale together, matching the prototype's Fit width setting. At least three complete university cards remain visible; smaller screens use two or one. The source's horizontal gallery is keyboard-scrollable without adding a next button. The sidebar stays at the viewport top while the main page scrolls.

Following the requested overflow correction, testimonial badges and quotes wrap within each card, and cards grow from their original 277.682px minimum height to show all text. This deliberately corrects the fixed-width text overhang in the source. Narrow screens reflow the testimonials, event panel and footer. Calendar cells below 600px of calendar width separate date numbers from the entire session label. These responsive states adapt the single desktop frame; they are not separate Figma-designed breakpoints.

## Interactions

Calendar hover uses the observed pale gray fill with a 150ms ease-out dissolve, including session cells; no purple inset outline is added. MainCTA hover changes its base color from #6B5A89 to #5B4B7A with the source 200ms ease-out smart animation, without movement or scale. These were read from the live prototype and its component properties (calendar 1:971; CTA 1:1052, library hover 6992:10532).

- Search has no border or focus border effect and filters the local university fixtures; an empty result state is explicit.
- University cards open details including admission percentage, days remaining, course, location, duration and starting cost; the same details are available to screen readers.
- Calendar arrows navigate complete months; the initial three-week excerpt and its session highlights reproduce the reference, including its source weekday/date alignment. Session cells open their date-specific details; other cells show the selected date and its empty schedule.
- Watch-video buttons open a native modal dialog using the existing LTA introduction video. Escape, close and backdrop clicks dismiss it.
- Booking, chat, account/sidebar and event buttons open informational reference dialogs. These are demo interactions; they do not submit bookings, send messages or mutate account data.
- Try Connect opens the existing LTA Connect destination. LinkedIn and Instagram use the public website's linked accounts; the YouTube icon opens the LTA video preview.

## Verification

With a server already running:

```powershell
pnpm.cmd test:figma
pnpm.cmd exec eslint src/app/figma/dashoard scripts/test-figma-dashboard.mjs src/middleware.ts next.config.ts
pnpm.cmd exec tsc --noEmit
```

Playwright checks anonymous and session access, image loading, page and section overflow at ten CSS viewport widths, eight desktop zoom equivalents, three complete desktop cards, native card geometry, testimonial glyph containment, borderless search, calendar/CTA hover colors and timing, sticky sidebar, calendar text/date overlap, search, keyboard carousel access, complete month navigation, date/session-specific dialogs, video/booking dialogs, and narrow-screen navigation dismissal by Escape and its close button. Screenshots go to ignored `.codex/artifacts/figma-dashboard/`. The browser always closes in a `finally` block.

For production verification alongside a running dev server:

```powershell
$env:NEXT_DIST_DIR = '.next-codex'
pnpm.cmd build
Remove-Item Env:NEXT_DIST_DIR
```

The output directory is ignored. Next may add its generated type paths to `tsconfig.json`; avoid committing incidental changes from this isolated check.

Desktop zoom was checked with equivalent CSS viewport dimensions and device pixel ratios at 50%, 67%, 80%, 100%, 125%, 150%, 175%, and 200%. This validates the browser layout effects of zoom, rather than an operating-system zoom shortcut.

Repository-wide lint has existing failures outside the reference route in action return types, `src/lib/axios.ts`, and the original `LtaSuit` navigation handler. Keep those distinct from route-specific validation.
