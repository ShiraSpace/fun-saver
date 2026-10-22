/**
 * @jest-environment node
 */
import NextAuth, { type NextAuthConfig } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import { getStore } from '@/db';
import { googleIdentity } from '@/lib/user/user-provisioning';
import { mockUser } from '@/test-utils/mocks/user.mocks';
import { mutableEnv, withCleanEnv, withTempStoreEnv } from '@/test-utils/test-utils';
import '../auth';

jest.mock('next-auth', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    handlers: {},
    auth: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
  })),
}));
jest.mock('next-auth/providers/google', () => ({ __esModule: true, default: jest.fn() }));

type JwtCallback = NonNullable<NonNullable<NextAuthConfig['callbacks']>['jwt']>;
type SignInMoment = Pick<Parameters<JwtCallback>[0], 'token' | 'profile'>;

function registeredJwtCallback(): JwtCallback {
  const config = jest.mocked(NextAuth).mock.calls[0][0];
  const jwtCallback = typeof config === 'function' ? undefined : config.callbacks?.jwt;

  if (!jwtCallback) {
    throw new Error('auth.ts registered no jwt callback');
  }

  return jwtCallback;
}

async function sessionTokenAfter({ token, profile }: SignInMoment): Promise<JWT | null> {
  return registeredJwtCallback()({ token, profile, user: {}, account: null });
}

describe('the session token', () => {
  withCleanEnv(['NODE_ENV']);
  withTempStoreEnv();

  const mockProfile = {
    sub: mockUser.providerAccountId,
    email: mockUser.email,
    name: mockUser.name,
  };

  describe('in development', () => {
    beforeEach(() => {
      mutableEnv.NODE_ENV = 'development';
    });

    it('finds its user in the store running now, though it signed in on another', async () => {
      await getStore().insertUser(mockUser);
      const mockTokenFromAnotherStore: JWT = {
        userId: 'user-id-in-another-store',
        identity: googleIdentity(mockProfile),
      };

      const token = await sessionTokenAfter({ token: mockTokenFromAnotherStore });

      expect(token?.userId).toBe(mockUser.id);
    });

    it('keeps the Google identity it signed in with', async () => {
      const token = await sessionTokenAfter({ token: {}, profile: mockProfile });

      expect(token?.identity?.providerAccountId).toBe(mockUser.providerAccountId);
    });

    it('keeps its user when the cookie carries no Google identity yet', async () => {
      const token = await sessionTokenAfter({ token: { userId: mockUser.id } });

      expect(token?.userId).toBe(mockUser.id);
    });
  });

  it('in production leaves the Google identity out', async () => {
    mutableEnv.NODE_ENV = 'production';

    const token = await sessionTokenAfter({ token: {}, profile: mockProfile });

    expect(token?.identity).toBeUndefined();
  });
});
