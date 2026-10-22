/**
 * @jest-environment node
 */
import NextAuth, { type NextAuthConfig } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import { getStore } from '@/db';
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

type JwtCallbackParams = Parameters<
  NonNullable<NonNullable<NextAuthConfig['callbacks']>['jwt']>
>[0];

const authConfig = jest.mocked(NextAuth).mock.calls[0][0] as NextAuthConfig;

const mockProfile = { sub: mockUser.providerAccountId, email: mockUser.email, name: mockUser.name };

async function sessionTokenAfter(params: Partial<JwtCallbackParams>): Promise<JWT | null> {
  return authConfig.callbacks!.jwt!(params as JwtCallbackParams);
}

describe('the session token', () => {
  withCleanEnv(['NODE_ENV']);
  withTempStoreEnv();

  describe('in development', () => {
    beforeEach(() => {
      mutableEnv.NODE_ENV = 'development';
    });

    it('finds its user in the store running now, though it signed in on another', async () => {
      await getStore().insertUser(mockUser);
      const mockTokenFromAnotherStore: JWT = {
        userId: 'user-id-in-another-store',
        identity: {
          providerAccountId: mockUser.providerAccountId,
          email: mockUser.email,
          name: mockUser.name,
        },
      };

      const token = await sessionTokenAfter({ token: mockTokenFromAnotherStore });

      expect(token?.userId).toBe(mockUser.id);
    });

    it('keeps the Google identity it signed in with', async () => {
      const token = await sessionTokenAfter({ token: {}, profile: mockProfile });

      expect(token?.identity?.providerAccountId).toBe(mockUser.providerAccountId);
    });
  });

  it('in production leaves the Google identity out', async () => {
    mutableEnv.NODE_ENV = 'production';

    const token = await sessionTokenAfter({ token: {}, profile: mockProfile });

    expect(token?.identity).toBeUndefined();
  });
});
