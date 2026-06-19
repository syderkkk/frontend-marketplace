import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register'];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const userRole = request.cookies.get('userRole')?.value;

    const isPublicRoute = PUBLIC_ROUTES.some(r => pathname === r);

    if (isPublicRoute) {
        if (userRole) return NextResponse.redirect(new URL('/', request.url));
        return NextResponse.next();
    }

    if (!userRole) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.ico).*)'],
};
