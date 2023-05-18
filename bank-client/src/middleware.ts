import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server'

// export { default } from "next-auth/middleware";
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|deposit.svg|withdraw.svg).*)',
    ]
};

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    const session = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    if (!session && (path !== "/register") && path !== "/login" && path !== "/") {
        return NextResponse.redirect(new URL('/login', req.url))
    } else if (session && (path === '/login' || path === '/register')) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.next()
}