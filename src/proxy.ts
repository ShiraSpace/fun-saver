import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sessionUser } from '@/lib/session-user';
import { SIGN_IN_PATH } from '@/lib/constants';

export const config = {
  matcher: ['/((?!login(?:/|$)|api(?:/|$)|_next(?:/|$)|avatars/).*)'],
};

export const proxy = auth((request): NextResponse => {
  if (sessionUser(request.auth)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(SIGN_IN_PATH, request.url));
});
