import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/token";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Paths allowed for guests (unauthenticated users)
  const guestOnlyPaths = ["/login", "/signup"];

  // Paths that require any logged-in user
  const userOnlyPaths = ["/create-task", "/profile"];

  // Paths that require admin role
  const adminOnlyPaths = ["/admin-dashboard", "/manage-user"];

  const token = request.cookies.get("auth_token")?.value;

  // 🚫 Redirect logged-in users away from guest-only paths
  if (token && guestOnlyPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ✅ Public paths (anything not listed above)
  const isUserPath = userOnlyPaths.some(path => pathname.startsWith(path));
  const isAdminPath = adminOnlyPaths.some(path => pathname.startsWith(path));
  const isGuestPath = guestOnlyPaths.some(path => pathname.startsWith(path));

  if (!isUserPath && !isAdminPath && !isGuestPath) {
    return NextResponse.next(); // accessible to everyone
  }

  // 🔐 If trying to access user-only or admin-only path without login → redirect
  if (!token && (isUserPath || isAdminPath)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🛡️ Verify token and role for admin paths
  try {
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const role = payload.user?.role || payload.role;

    // Admin check
    if (isAdminPath && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
