import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_PAGES = [
  '/tenant/login', '/tenant/signup', '/tenant/verify-otp',
  '/tenant/forgot-password', '/tenant/forgot-verify-otp', '/tenant/reset-password',
  '/landlord/login', '/landlord/signup', '/landlord/verify-otp',
  '/landlord/forgot-password', '/landlord/forgot-verify-otp', '/landlord/reset-password',
  '/landlord/kyc-details', '/landlord/kyc-pending',
  '/admin/login',
  '/account-type',
];

const PROTECTED_PREFIXES = [
  '/tenant/dashboard', '/tenant/profile', '/tenant/profilepage',
  '/landlord/dashboard', '/landlord/profile',
  '/admin/dashboard', '/admin/tenant-listing-page', '/admin/landlord-listing-page',
];

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const pathname = request.nextUrl.pathname;

  const isAuthPage = AUTH_PAGES.some(route => pathname.startsWith(route));
  const isProtected = PROTECTED_PREFIXES.some(route => pathname.startsWith(route));

  // Logged-in user visiting auth page -> redirect to home (client handles role-based redirect)
  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Not logged in, visiting protected route -> redirect to login
  if (isProtected && !accessToken) {
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    if (pathname.startsWith('/landlord')) {
      return NextResponse.redirect(new URL('/landlord/login', request.url));
    }
    return NextResponse.redirect(new URL('/tenant/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/tenant/:path*',
    '/landlord/:path*',
    '/admin/:path*',
    '/account-type',
  ]
};