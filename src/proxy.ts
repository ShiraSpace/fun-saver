import { NextResponse, type NextRequest } from 'next/server';
import { LOGIN_PATH, SESSION_COOKIE_NAMES } from '@/lib/constants';

export const config = {
  matcher: ['/((?!login|api|_next/static|_next/image|.*\\..*).*)'],
};

export function proxy(request: NextRequest): NextResponse {
  if (hasSessionCookie(request)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
}

function hasSessionCookie(request: NextRequest): boolean {
  return SESSION_COOKIE_NAMES.some((name) => request.cookies.has(name));
}
