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

    console.log("[MW] Request:", { path: nextUrl.pathname, logged: isLoggedIn, ws: user?.activeWorkspaceId });

    if (isApiAuthRoute || isPublicApiRoute) return NextResponse.next();

    // Special handling for root route: always redirect to app or login
    if (nextUrl.pathname === "/") {
        if (isLoggedIn) {
            if (!user?.activeWorkspaceId) {
                console.log("[MW] Root -> Onboarding (No WS)");
                return NextResponse.redirect(new URL("/onboarding", nextUrl));
            }
            console.log("[MW] Root -> Dashboard");
            return NextResponse.redirect(new URL("/dashboard", nextUrl));
        }
        return NextResponse.redirect(new URL("/auth/signin", nextUrl));
    }

    if (isPublicRoute) {
        if (isLoggedIn) {
            if (!user?.activeWorkspaceId) {
                console.log("[MW] Public -> Onboarding (No WS)");
                return NextResponse.redirect(new URL("/onboarding", nextUrl));
            }
            console.log("[MW] Public -> Dashboard");
            return NextResponse.redirect(new URL("/dashboard", nextUrl));
        }
        return NextResponse.next();
    }

    const isApiRoute = nextUrl.pathname.startsWith("/api");

    if (!isLoggedIn) {
        return NextResponse.redirect(new URL("/auth/signin", nextUrl));
    }

    if (!user?.activeWorkspaceId && !isOnboardingRoute && !isApiRoute) {
        return NextResponse.redirect(new URL("/onboarding", nextUrl));
    }

    // Prevent accessing onboarding if already has a workspace
    if (user?.activeWorkspaceId && isOnboardingRoute) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
