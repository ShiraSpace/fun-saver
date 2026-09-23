import { NextResponse } from 'next/server';
import { auth, toSignedInUser } from '@/auth';
import { LOGIN_PATH } from '@/lib/constants';

export const config = {
  matcher: ['/((?!login(?:/|$)|api(?:/|$)|_next(?:/|$)).*)'],
};

export const proxy = auth((request): NextResponse => {
  if (toSignedInUser(request.auth)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
});
