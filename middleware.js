import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/token";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Define path groups
  const guestOnlyPaths = ["/login", "/signup"];
  const adminOnlyPaths = ["/admin-dashboard", "/manage-user, /manage-task"];
  const loggedInPaths = ["/create-task", "/profile"];

  const token = request.cookies.get("auth_token")?.value;

  // 1️⃣ Guest-only pages: redirect logged-in users away
  if (token && guestOnlyPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2️⃣ Public paths (not in admin or logged-in restricted lists)
  const isAdminPath = adminOnlyPaths.some(path => pathname.startsWith(path));
  const isLoggedInPath = loggedInPaths.some(path => pathname.startsWith(path));
  if (!isAdminPath && !isLoggedInPath) {
    return NextResponse.next();
  }

  // 3️⃣ Must be logged in to access admin or logged-in paths
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const role = payload.user?.role || payload.role;

    // 4️⃣ Admin-only pages
    if (isAdminPath && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // 5️⃣ Logged-in pages (admin or user are fine)
    return NextResponse.next();

  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
