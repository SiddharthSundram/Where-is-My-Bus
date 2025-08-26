// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Get the session cookie from the request
  const sessionCookie = req.cookies.get('auth_session');
  const { pathname } = req.nextUrl;

  // If the session cookie doesn't exist, redirect to the login page
  if (!sessionCookie) {
    // We are adding the pathname as a query param to redirect back after login
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If the cookie exists, allow the request to proceed
  return NextResponse.next();
}

// This config ensures the middleware runs on the specified routes
export const config = {
  matcher: [
    '/find/:path*',
    '/journey/:path*',
    '/tickets/:path*',
    '/notifications/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/admin/:path*',
  ],
};