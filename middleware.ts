import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // 1. Redirect authenticated users away from the landing page to the dashboard
    if (token && pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // 2. Role-based protection: Redirect non-admin users away from admin routes
    const isAdmin = token?.role === "admin";
    const isAdminPage = pathname.startsWith("/admin");

    if (isAdminPage && !isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Authorized callback handles the route accessibility logic
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow public access to the root landing page even if unauthenticated
        if (pathname === "/") {
          return true;
        }

        // Require authentication for all other matched routes (dashboard, admin, etc.)
        return !!token;
      },
    },
  },
);

export const config = {
  matcher: ["/", "/dashboard/:path*", "/admin/:path*"],
};
