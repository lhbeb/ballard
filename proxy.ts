import { NextResponse, type NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const isAdmin = request.cookies.has('admin_session')

    // If visiting /admin and not logged in, redirect to login
    if (request.nextUrl.pathname.startsWith('/admin') && !isAdmin) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // If visiting /login and already logged in, redirect to admin
    if (request.nextUrl.pathname === '/login' && isAdmin) {
        return NextResponse.redirect(new URL('/admin', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/login'
    ],
}
