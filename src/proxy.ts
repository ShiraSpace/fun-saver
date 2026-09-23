import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { toSignedInUser } from '@/lib/signed-in-user';
import { LOGIN_PATH } from '@/lib/constants';

export const config = {
  matcher: ['/((?!login(?:/|$)|api(?:/|$)|_next(?:/|$)|avatars/).*)'],
};

export const proxy = auth((request): NextResponse => {
  if (toSignedInUser(request.auth)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
});
