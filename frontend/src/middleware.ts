import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes: Record<string, string[]> = {
  '/cliente': ['cliente'],
  '/admin': ['admin'],
  '/repartidor': ['repartidor'],
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get('gerco-auth')?.value;

  if (token) {
    const url = request.nextUrl.clone();
    const pathname = url.pathname;

    for (const routePrefix in protectedRoutes) {
      if (pathname.startsWith(routePrefix)) {
        try {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          const userRole = decoded.role;

          if (!protectedRoutes[routePrefix].includes(userRole)) {
            url.pathname = '/login';
            return NextResponse.redirect(url);
          }
        } catch {
          url.pathname = '/login';
          return NextResponse.redirect(url);
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/cliente/:path*', '/admin/:path*', '/repartidor/:path*'],
};