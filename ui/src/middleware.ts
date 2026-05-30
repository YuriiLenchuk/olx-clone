import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPrefixes = ['/add', '/chats', '/auth/me', '/payment', '/admin', '/wish-list'];

function isTokenExpired(token: string) {
    try {
        const payload = JSON.parse(
            Buffer.from(token.split('.')[1] || '', 'base64').toString(),
        );

        if (!payload?.exp) return false;

        return payload.exp * 1000 <= Date.now();
    } catch {
        return true;
    }
}

export default function middleware(req: NextRequest) {
    const authToken = req.cookies.get('authToken')?.value;
    const { pathname } = req.nextUrl;

    const isProtectedRoute = protectedPrefixes.some(
        route => pathname === route || pathname.startsWith(`${route}/`),
    );

    if ((!authToken || isTokenExpired(authToken)) && isProtectedRoute) {
        const redirectUrl = req.nextUrl.clone();

        redirectUrl.pathname = '/registration';
        redirectUrl.searchParams.set('redirect', pathname);

        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/add/:path*',
        '/chats/:path*',
        '/auth/me/:path*',
        '/payment/:path*',
        '/admin/:path*',
        '/wish-list/:path*',
    ],
};