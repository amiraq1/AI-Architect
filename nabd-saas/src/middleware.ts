import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const userRole = req.auth?.user?.email === 'admin@nabd.ai' ? 'ADMIN' : 'USER'; // Mock Role (Replace with DB check in production)

    const isOnDashboard = req.nextUrl.pathname.startsWith("/chat");
    const isOnAdmin = req.nextUrl.pathname.startsWith("/admin");
    const isOnAuth = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/signup");

    // 1. Protect Admin Routes (RBAC)
    if (isOnAdmin) {
        if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.nextUrl));

        // If logged in but not admin, kick them out
        if (userRole !== 'ADMIN') {
            return NextResponse.redirect(new URL("/chat", req.nextUrl));
        }
        return NextResponse.next();
    }

    // 2. Protect Chat Routes
    if (isOnDashboard) {
        if (isLoggedIn) return NextResponse.next();
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    // 3. Handle Auth Pages (Redirect if already logged in)
    else if (isOnAuth) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL("/chat", req.nextUrl));
        }
    }

    return NextResponse.next();
});

export const config = {
    // Matched paths for middleware
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
