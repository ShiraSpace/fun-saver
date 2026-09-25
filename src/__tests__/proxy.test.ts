/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import type { Session } from 'next-auth';
import { SIGN_IN_PATH } from '@/lib/user/constants';
import { mockUser } from '@/test-utils/mocks/general.mocks';
import { config, proxy } from '../proxy';

jest.mock('@/auth');

type ProxyAnswer = Awaited<ReturnType<typeof proxy>>;

const APP_ORIGIN = 'https://fun-saver.vercel.app';
const mockSessionExpiry = '2099-01-01T00:00:00.000Z';
const GATED_PATHS = [
  '/',
  '/method',
  '/nope',
  `${SIGN_IN_PATH}x`,
  '/apikeys',
  '/account/v1.2/edit',
  '/inspiration/idea.png',
  '/avatarsx',
];
const REACHABLE_PATHS = [
  SIGN_IN_PATH,
  `${SIGN_IN_PATH}/`,
  '/api/auth/callback/google',
  '/_next/static/chunk.js',
  '/_next/image',
  '/avatars/kid-01.svg',
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
): Promise<ProxyAnswer> {
  const auth = user ? { user, expires: mockSessionExpiry } : null;
  const request = Object.assign(new NextRequest(APP_ORIGIN), { auth });

  return proxy(request, { params: Promise.resolve({}) });
}

describe('proxy', () => {
  describe('a request with no session', () => {
    let response: ProxyAnswer;

    beforeEach(async () => {
      response = await proxyAnswerFor(undefined);
    });

    it('is sent to the sign-in page', () => {
      expect(response?.headers.get('location')).toBe(
        `${APP_ORIGIN}${SIGN_IN_PATH}`
      );
    });
  });

  describe('a signed-in session', () => {
    let response: ProxyAnswer;

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
    let response: ProxyAnswer;

    beforeEach(async () => {
      response = await proxyAnswerFor({ id: mockUser.id, name: mockUser.name });
    });

    it('is sent to the sign-in page', () => {
      expect(response?.headers.get('location')).toBe(
        `${APP_ORIGIN}${SIGN_IN_PATH}`
      );
    });
  });
});
