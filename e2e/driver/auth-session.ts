import { encode } from 'next-auth/jwt';
import type { CookieData } from 'puppeteer';
import type { User } from '@/lib/user/types';

export const TEST_AUTH_SECRET = 'fun-saver-e2e-auth-secret';

export const SESSION_COOKIE_NAME = 'authjs.session-token';
const SESSION_COOKIE_DOMAIN = 'localhost';

export async function sessionCookie(
  user: User,
  secret: string
): Promise<CookieData> {
  const value = await encode({
    token: {
      sub: user.id,
      userId: user.id,
      name: user.name,
      email: user.email,
    },
    secret,
    salt: SESSION_COOKIE_NAME,
  });

  return {
    name: SESSION_COOKIE_NAME,
    value,
    domain: SESSION_COOKIE_DOMAIN,
    path: '/',
    httpOnly: true,
  };
}
