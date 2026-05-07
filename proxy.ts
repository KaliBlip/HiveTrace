import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = ((req.auth?.user as any)?.role as string)?.toLowerCase();
  const isAuthRoute = nextUrl.pathname.startsWith("/auth");
  const isDashboard = nextUrl.pathname.startsWith("/dashboard");
  const isAdmin = nextUrl.pathname.startsWith("/admin");
  const isConsumerOrders = nextUrl.pathname.startsWith("/consumer/orders");
  const isCheckout = nextUrl.pathname.startsWith("/checkout");

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // If not logged in, redirect to login for protected routes
  if ((isDashboard || isAdmin || isConsumerOrders || isCheckout) && !isLoggedIn) {
    const loginUrl = new URL("/auth/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin routes: admin only
  if (isAdmin && userRole !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Dashboard routes: producer or admin only
  if (isDashboard && userRole !== "producer" && userRole !== "admin") {
    return NextResponse.redirect(new URL("/shop", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/consumer/orders",
    "/checkout/:path*",
    "/auth/:path*",
  ],
};
