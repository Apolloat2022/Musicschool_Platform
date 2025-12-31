import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { decrypt, isAdminAuthenticated } from "@/lib/auth-admin";
import type { NextRequest } from "next/server";

// 1. Define routes that should be protected by custom Admin logic
const isAdminPath = (path: string) =>
    (path.startsWith('/admin') && path !== '/admin/login') ||
    path.startsWith('/faculty/dashboard');

export default clerkMiddleware(async (auth, req: NextRequest) => {
    const path = req.nextUrl.pathname;

    // Handle custom Admin Authentication
    if (isAdminPath(path)) {
        const session = req.cookies.get('admin_session')?.value;
        let authenticated = false;

        if (session) {
            try {
                const decrypted = await decrypt(session);
                authenticated = isAdminAuthenticated(decrypted);
            } catch (e) {
                console.error("Session decryption failed in middleware:", e);
            }
        }

        if (!authenticated) {
            const url = new URL('/admin/login', req.url);
            url.searchParams.set('error', 'Authentication required');
            return NextResponse.redirect(url);
        }
    }

    // Fallback to normal Clerk behavior
    return NextResponse.next();
});

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};
