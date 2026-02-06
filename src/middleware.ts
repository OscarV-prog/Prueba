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
            console.log("[MW] Root -> Dashboard");
            return NextResponse.redirect(new URL("/dashboard", nextUrl));
        }
        console.log("[MW] Root -> Sign-in");
        return NextResponse.redirect(new URL("/auth/signin", nextUrl));
    }

    if (isPublicRoute) {
        if (isLoggedIn) {
            console.log("[MW] Public -> Dashboard (Logged in)");
            return NextResponse.redirect(new URL("/dashboard", nextUrl));
        }
        return NextResponse.next();
    }

    if (!isLoggedIn) {
        console.log("[MW] Redirecting to sign-in (Not logged in)");
        return NextResponse.redirect(new URL("/auth/signin", nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
