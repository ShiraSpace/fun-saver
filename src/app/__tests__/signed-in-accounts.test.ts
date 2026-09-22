/**
 * @jest-environment node
 */
import { redirect } from 'next/navigation';
import { signedInUserId } from '@/auth';
import { byAccountName } from '@/db/account-users';
import { getStore } from '@/db';
import { LOGIN_PATH } from '@/lib/constants';
import type { Account } from '@/lib/types';
import { mockSecondUser, mockUser } from '@/test-utils/fixtures';
import { createOwnedAccount } from '@/test-utils/owned-account';
import { withTempDataPath } from '@/test-utils/test-utils';
import { signedInAccounts } from '../signed-in-accounts';

interface SelectedAccountCookie {
  value: string;
}

interface CookieStore {
  get: () => SelectedAccountCookie | undefined;
}

let mockSelectedAccountCookie: SelectedAccountCookie | undefined;

jest.mock('@/auth', () => ({ signedInUserId: jest.fn() }));
jest.mock('next/navigation', () => ({ redirect: jest.fn() }));
jest.mock('next/headers', () => ({
  cookies: async (): Promise<CookieStore> => ({
    get: (): SelectedAccountCookie | undefined => mockSelectedAccountCookie,
  }),
}));

describe('signedInAccounts', () => {
  withTempDataPath();

  let owned: Account[];

  beforeEach(async () => {
    mockSelectedAccountCookie = undefined;
    jest.mocked(signedInUserId).mockResolvedValue(mockUser.id);

    owned = byAccountName([
      await createOwnedAccount(getStore(), {
        input: { name: 'נועה', avatarId: 'kid-01' },
      }),
      await createOwnedAccount(getStore(), {
        input: { name: 'מתן', avatarId: 'kid-08' },
      }),
    ]);
  });

  it('sends a visitor with no session to the login page', async () => {
    jest.mocked(signedInUserId).mockResolvedValue(undefined);

    await signedInAccounts();

    expect(redirect).toHaveBeenCalledWith(LOGIN_PATH);
  });

  it('selects the account the cookie names', async () => {
    mockSelectedAccountCookie = { value: owned[1].id };

    expect(await signedInAccounts()).toMatchObject({
      selectedAccountId: owned[1].id,
      themeId: owned[1].themeId,
    });
  });

  it('falls back to the first account when the cookie names nothing', async () => {
    mockSelectedAccountCookie = { value: 'not-an-account' };

    expect((await signedInAccounts()).selectedAccountId).toBe(owned[0].id);
  });

  it('leaves out an account belonging to somebody else', async () => {
    const theirs = await createOwnedAccount(getStore(), {
      input: { name: 'שירי', avatarId: 'kid-03' },
      owner: mockSecondUser,
    });

    const { accounts } = await signedInAccounts();

    expect(accounts).toEqual(owned);
    expect(accounts).not.toContainEqual(theirs);
  });
});
