/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import type { Session } from 'next-auth';
import { LOGIN_PATH } from '@/lib/constants';
import { mockUser } from '@/test-utils/fixtures';
import { config, proxy } from '../proxy';

jest.mock('@/auth', () => ({
  auth: (handler: unknown): unknown => handler,
}));

const APP_ORIGIN = 'https://fun-saver.vercel.app';
const SESSION_EXPIRY = '2099-01-01T00:00:00.000Z';
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

async function proxyAnswerFor(
  user: Partial<Session['user']> | undefined
): Promise<Response | null | undefined | void> {
  const auth = user ? { user, expires: SESSION_EXPIRY } : null;
  const request = Object.assign(new NextRequest(APP_ORIGIN), { auth });

  return proxy(request, { params: Promise.resolve({}) });
}

describe('proxy', () => {
  describe('a request with no session', () => {
    let response: Response | null | undefined | void;

    beforeEach(async () => {
      response = await proxyAnswerFor(undefined);
    });

    it('is sent to the login page', () => {
      expect(response?.headers.get('location')).toBe(
        `${APP_ORIGIN}${LOGIN_PATH}`
      );
    });
  });

  describe('a signed-in session', () => {
    let response: Response | null | undefined | void;

    beforeEach(async () => {
      response = await proxyAnswerFor({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
      });
    });

    it('is let through', () => {
      expect(response?.headers.get('x-middleware-next')).toBe('1');
    });
  });

  describe('a session that names no email', () => {
    let response: Response | null | undefined | void;

    beforeEach(async () => {
      response = await proxyAnswerFor({ id: mockUser.id, name: mockUser.name });
    });

    it('is sent to the login page', () => {
      expect(response?.headers.get('location')).toBe(
        `${APP_ORIGIN}${LOGIN_PATH}`
      );
    });
  });
});
