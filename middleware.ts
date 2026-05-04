import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "admin";
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

    if (isAdminPage && !isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
