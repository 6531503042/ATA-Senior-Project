import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected and public paths
const PUBLIC_PATHS = ['/auth/login', '/auth/register', '/auth/forgot-password'];
const PROTECTED_PATHS = [
  '/dashboard',
  '/admin',
  '/admin/feedbacks',
  '/admin/projects',
  '/admin/questions',
  '/profile',
  '/projects'
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Get tokens from cookies
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;
    const userRole = request.cookies.get('user_role')?.value;

    // Allow public paths without authentication
    if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
        if (accessToken) {
            // If user is already authenticated, redirect to appropriate dashboard
            return NextResponse.redirect(
                new URL(userRole === 'ROLE_ADMIN' ? '/admin/dashboard' : '/dashboard', request.url)
            );
        }
        return NextResponse.next();
    }

    // Check authentication for protected paths
    if (PROTECTED_PATHS.some(path => pathname.startsWith(path))) {
        if (!accessToken) {
            // Store the attempted URL to redirect back after login
            const searchParams = new URLSearchParams({
                redirect: pathname + request.nextUrl.search
            });
            return NextResponse.redirect(
                new URL(`/auth/login?${searchParams.toString()}`, request.url)
            );
        }

        // Role-based access control
        if (pathname.startsWith('/admin') && userRole !== 'ROLE_ADMIN') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    // For API routes, ensure proper headers are set
    if (pathname.startsWith('/api')) {
        const headers = new Headers(request.headers);
        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`);
        }
        if (refreshToken) {
            headers.set('Refresh-Token', refreshToken);
        }
        
        const response = NextResponse.next({
            request: {
                headers
            }
        });

        // Enable CORS for API routes
        response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_FRONTEND_URL || '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Refresh-Token');
        response.headers.set('Access-Control-Allow-Credentials', 'true');

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all paths except:
         * 1. /api/auth/** (authentication endpoints)
         * 2. /_next/** (Next.js internals)
         * 3. /static/** (static files)
         * 4. /favicon.ico, /robots.txt (public files)
         */
        '/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt).*)',
    ],
}; 