/**
 * @jest-environment node
 */
import { NextRequest, type NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { LOGIN_PATH } from '@/lib/constants';
import { config, proxy } from '../proxy';

const APP_ORIGIN = 'https://fun-saver.vercel.app';
const SESSION_COOKIES = [
  ['secure (production)', '__Secure-authjs.session-token'],
  ['unprefixed (dev and e2e)', 'authjs.session-token'],
] as const;
const GATED_PATHS = [
  '/',
  '/method',
  '/nope',
  `${LOGIN_PATH}x`,
  '/apikeys',
  '/account/v1.2/edit',
];
const REACHABLE_PATHS = [
  LOGIN_PATH,
  `${LOGIN_PATH}/`,
  '/api/auth/callback/google',
  '/_next/static/chunk.js',
  '/_next/image',
];

function isGated(path: string): boolean {
  return new RegExp(`^${config.matcher[0]}$`).test(path);
}

describe('the matcher', () => {
  it.each(GATED_PATHS)('gates %s', (path) => {
    expect(isGated(path)).toBe(true);
  });

  it.each(REACHABLE_PATHS)('leaves %s reachable', (path) => {
    expect(isGated(path)).toBe(false);
  });
});

describe('proxy', () => {
  describe('a request with no session cookie', () => {
    let response: NextResponse;

    beforeEach(() => {
      response = proxy(new NextRequest(APP_ORIGIN));
    });

    it('is redirected', () => {
      expect(response.status).toBe(StatusCodes.TEMPORARY_REDIRECT);
    });

    it('is sent to the login page', () => {
      expect(response.headers.get('location')).toBe(
        `${APP_ORIGIN}${LOGIN_PATH}`
      );
    });
  });

  describe.each(SESSION_COOKIES)(
    'a request carrying the %s session cookie',
    (_, cookieName) => {
      let response: NextResponse;

      beforeEach(() => {
        response = proxy(
          new NextRequest(APP_ORIGIN, {
            headers: { cookie: `${cookieName}=a-signed-token` },
          })
        );
      });

      it('is let through', () => {
        expect(response.headers.get('x-middleware-next')).toBe('1');
      });
    }
  );
});
