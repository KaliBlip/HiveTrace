import { auth } from "@/lib/auth";
import { getRoleHomePath } from "@/lib/helpers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const proxyMiddleware = async (req: NextRequest) => {
  const { nextUrl } = req;
  const session = await auth();
  const isLoggedIn = !!session;
  const userRole = (session?.user as any)?.role?.toLowerCase();
  
  const isAuthRoute = nextUrl.pathname.startsWith("/auth");
  const isDashboard = nextUrl.pathname.startsWith("/dashboard");
  const isAdmin = nextUrl.pathname.startsWith("/admin");
  const isConsumerOrders = nextUrl.pathname.startsWith("/consumer/orders");
  const isCheckout = nextUrl.pathname.startsWith("/checkout");

  // Redirect authenticated users away from auth pages (preserving the request origin)
  if (isAuthRoute && isLoggedIn) {
    const url = new URL(getRoleHomePath(userRole), req.url);
    return NextResponse.redirect(url);
  }

  // If not logged in, redirect to login for protected routes (preserving the request origin)
  if ((isDashboard || isAdmin || isConsumerOrders || isCheckout) && !isLoggedIn) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // Admin routes: admin only
  if (isAdmin && userRole !== "admin") {
    const url = new URL("/dashboard", req.url);
    return NextResponse.redirect(url);
  }

  // Dashboard routes: producer or admin only
  if (isDashboard && userRole !== "producer" && userRole !== "admin") {
    const url = new URL("/shop", req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
};

export const proxy = proxyMiddleware;
export default proxyMiddleware;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/consumer/orders",
    "/checkout/:path*",
    "/auth/:path*",
  ],
};
