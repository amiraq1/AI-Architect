import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
    theme: {
        logo: "https://next-auth.js.org/img/logo/logo-sm.png",
    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            name: "Demo Login",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                // ⚠️ DEMO: Accept any login for now until DB is connected
                // In production, verify against database hash
                if (credentials?.email === "admin@nabd.com" && credentials?.password === "admin123") {
                    return {
                        id: "1",
                        name: "Admin User",
                        email: "admin@nabd.com",
                        role: "admin",
                    };
                }

                if (credentials?.email && credentials?.password) {
                    return {
                        id: "2",
                        name: "Demo User",
                        email: credentials.email as string,
                        role: "user",
                    };
                }

                return null;
            },
        }),
    ],
    callbacks: {
        authorized({ request, auth }) {
            const { pathname } = request.nextUrl;
            if (pathname === "/marketing") return true;
            return !!auth; // Protect everything else by default if used in middleware
        },
        jwt({ token, user }) {
            if (user) { // User is available during sign-in
                token.role = (user as any).role;
            }
            return token;
        },
        session({ session, token }) {
            (session.user as any).role = token.role;
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
});
