import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected paths and their required roles
const ROLE_PATHS = {
  ADMIN: ['/admin', '/admin/dashboard', '/admin/feedbacks', '/admin/projects', '/admin/questions'],
  USER: ['/employee', '/employee/feedback', '/employee/profile'],
};

const PUBLIC_PATHS = ['/auth/login', '/auth/register', '/auth/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get tokens and role from cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  const userRole = request.cookies.get('user_role')?.value;

  // Allow public paths without authentication
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    if (accessToken) {
      // If already authenticated, redirect to appropriate dashboard
      return NextResponse.redirect(
        new URL(userRole === 'ROLE_ADMIN' ? '/admin/dashboard' : '/employee', request.url)
      );
    }
    return NextResponse.next();
  }

  // Check authentication for protected paths
  if (!accessToken) {
    const searchParams = new URLSearchParams({
      redirect: pathname + request.nextUrl.search
    });
    return NextResponse.redirect(
      new URL(`/auth/login?${searchParams.toString()}`, request.url)
    );
  }

  // Handle role-based access
  if (pathname === '/dashboard') {
    // Redirect from generic dashboard to role-specific dashboard
    return NextResponse.redirect(
      new URL(userRole === 'ROLE_ADMIN' ? '/admin/dashboard' : '/employee', request.url)
    );
  }

  // Check admin routes
  if (ROLE_PATHS.ADMIN.some(path => pathname.startsWith(path))) {
    if (userRole !== 'ROLE_ADMIN') {
      return NextResponse.redirect(new URL('/employee', request.url));
    }
  }

  // Check employee routes
  if (ROLE_PATHS.USER.some(path => pathname.startsWith(path))) {
    if (userRole !== 'ROLE_USER') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  // For API routes, ensure proper headers
  if (pathname.startsWith('/api')) {
    const headers = new Headers(request.headers);
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    
    const response = NextResponse.next({
      request: {
        headers
      }
    });

    // Enable CORS
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_FRONTEND_URL || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt).*)',
  ],
}; 