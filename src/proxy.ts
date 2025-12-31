import { NextResponse, NextRequest } from 'next/server';
import { decrypt, isAdminAuthenticated } from '@/lib/auth-admin';

export default async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // 1. Define sensitive routes
    const isProtected = path.startsWith('/admin') && path !== '/admin/login' || path.startsWith('/faculty/dashboard');

    if (isProtected) {
        // 2. Check for session cookie
        const session = request.cookies.get('admin_session')?.value;
        let authenticated = false;

        if (session) {
            try {
                const decrypted = await decrypt(session);
                authenticated = isAdminAuthenticated(decrypted);
            } catch (e) {
                console.error("Session decryption failed:", e);
            }
        }

        // 3. Redirect to login if not authenticated
        if (!authenticated) {
            const url = new URL('/admin/login', request.url);
            url.searchParams.set('error', 'Authentication required');
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/faculty/dashboard/:path*'],
};
