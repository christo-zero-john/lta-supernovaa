import { DEFAULT_PERSONA, parseNavigation } from "./model";
import type { PersonaId, ViewId } from "./types";

/** The dashboard; every view is a page under it. */
export const BASE_PATH = "/dashboard";

export type ViewRoute = {
  /** URL segment under BASE_PATH ("" is the dashboard itself). */
  slug: string;
  /** Sidebar label. */
  label: string;
  /** Sidebar group. */
  section: "main" | "suite";
};

/**
 * Every view's page and navigation entry — the single source of truth for
 * URLs and the sidebar. Typed against ViewId, so adding a view without a
 * route (or vice versa) fails to compile. Key order is sidebar order.
 */
export const VIEW_ROUTES = {
  dashboard: { slug: "", label: "Dashboard", section: "main" },
  documents: { slug: "documents", label: "Documents", section: "main" },
  notifications: {
    slug: "notifications",
    label: "Notifications",
    section: "main",
  },
  support: { slug: "support", label: "Support", section: "main" },
  zenna: { slug: "zenna", label: "Zenna", section: "suite" },
  connect: { slug: "connect", label: "LTA Connect", section: "suite" },
  cst: {
    slug: "course-shortlisting",
    label: "Course Shortlisting",
    section: "suite",
  },
  p004: { slug: "project004", label: "Project004", section: "suite" },
} as const satisfies Record<ViewId, ViewRoute>;

export const VIEWS = Object.keys(VIEW_ROUTES) as ViewId[];

export function viewsIn(section: ViewRoute["section"]) {
  return VIEWS.filter((view) => VIEW_ROUTES[view].section === section);
}

export function viewPath(view: ViewId) {
  const { slug } = VIEW_ROUTES[view];
  return slug ? `${BASE_PATH}/${slug}` : BASE_PATH;
}

/** A view's URL, keeping the persona (and an optional selected item). */
export function viewHref(view: ViewId, persona: PersonaId, item?: string) {
  const query = new URLSearchParams();
  if (persona !== DEFAULT_PERSONA) query.set("persona", persona);
  if (item) query.set("item", item);
  const search = query.toString();
  return search ? `${viewPath(view)}?${search}` : viewPath(view);
}

export function viewFromPathname(pathname: string): ViewId {
  const slug = pathname
    .slice(BASE_PATH.length)
    .replace(/^\/+|\/+$/g, "");
  return VIEWS.find((view) => VIEW_ROUTES[view].slug === slug) ?? "dashboard";
}

export function personaFromParams(params: URLSearchParams): PersonaId {
  return parseNavigation(params).persona;
}

