import NextAuth from "next-auth";
import { authConfigBase } from "~/server/auth/config.base";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfigBase);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const user = req.auth?.user;

    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
    const isPublicRoute = ["/auth/signin", "/auth/signup", "/auth/accept-invitation"].includes(nextUrl.pathname);
    const isPublicApiRoute = ["/api/v1/auth/signup", "/api/v1/auth/accept-invitation"].includes(nextUrl.pathname);
    const isOnboardingRoute = nextUrl.pathname === "/onboarding";

    if (isApiAuthRoute || isPublicApiRoute) return NextResponse.next();

    // Special handling for root route: always redirect to app or login
    if (nextUrl.pathname === "/") {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL("/dashboard", nextUrl));
        }
        return NextResponse.redirect(new URL("/auth/signin", nextUrl));
    }

    if (isPublicRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL("/dashboard", nextUrl));
        }
        return NextResponse.next();
    }

    if (!isLoggedIn) {
        return NextResponse.redirect(new URL("/auth/signin", nextUrl));
    }

    // Redirect to onboarding if user belongs to no workspace (has no activeWorkspaceId)
    const isApiRoute = nextUrl.pathname.startsWith("/api");

    // Diagnostic log
    console.log("Middleware Check:", {
        path: nextUrl.pathname,
        isLoggedIn,
        activeWorkspaceId: user?.activeWorkspaceId
    });

    if (!user?.activeWorkspaceId && !isOnboardingRoute && !isApiRoute) {
        console.log("Redirecting to /onboarding because no workspace found");
        // The instruction to use window.location for onboarding redirect is client-side.
        // Middleware runs on the server, so NextResponse.redirect is the correct approach here.
        return NextResponse.redirect(new URL("/onboarding", nextUrl));
    }

    // Prevent accessing onboarding if already has a workspace
    if (user?.activeWorkspaceId && isOnboardingRoute) {
        console.log("Redirecting to /dashboard because workspace exists");
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
