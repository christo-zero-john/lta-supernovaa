import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = [
  "/signup",
  "/signup-otp",
  "/login",
  "/verify-otp",
  "/set-password",
];

export async function middleware(request: NextRequest) {
  // A deterministic design reference; it never reads or mutates account data.
  if (
    request.nextUrl.pathname === "/figma/dashoard" ||
    request.nextUrl.pathname === "/figma/dashboard"
  ) {
    return NextResponse.next();
  }
  const token = request.cookies.get("token")?.value || "";
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.some((route) =>
      pathname.startsWith(route)
  );

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/signup", request.url));
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|assets|api).*)"],
};
