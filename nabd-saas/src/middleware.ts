import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isOnDashboard = req.nextUrl.pathname.startsWith("/chat");
    const isOnAdmin = req.nextUrl.pathname.startsWith("/admin");
    const isOnAuth = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/signup");

    if (isOnDashboard || isOnAdmin) {
        if (isLoggedIn) return NextResponse.next();
        return NextResponse.redirect(new URL("/login", req.nextUrl)); // Redirect unauthenticated users to login page
    } else if (isOnAuth) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL("/chat", req.nextUrl)); // Redirect authenticated users to chat
        }
    }

    return NextResponse.next();
});

export const config = {
    // Matched paths for middleware
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
