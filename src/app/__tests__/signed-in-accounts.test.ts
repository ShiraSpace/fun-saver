/**
 * @jest-environment node
 */
import { redirect } from 'next/navigation';
import { signedInUser } from '@/auth';
import { sortedByName } from '@/db/account-users';
import { getStore } from '@/db';
import { SIGN_IN_PATH } from '@/lib/constants';
import type { Account } from '@/lib/account/types';
import { mockCoParent, mockUser } from '@/test-utils/mocks/general.mocks';
import { createOwnedAccount } from '@/test-utils/owned-account';
import { withTempStoreEnv } from '@/test-utils/test-utils';
import { signedInAccounts } from '../signed-in-accounts';

interface CurrentAccountCookie {
  value: string;
}

interface CookieStore {
  get: () => CurrentAccountCookie | undefined;
}

let mockCurrentAccountCookie: CurrentAccountCookie | undefined;

jest.mock('@/auth', () => ({ signedInUser: jest.fn() }));
jest.mock('next/navigation', () => ({
  redirect: jest.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));
jest.mock('next/headers', () => ({
  cookies: async (): Promise<CookieStore> => ({
    get: (): CurrentAccountCookie | undefined => mockCurrentAccountCookie,
  }),
}));

describe('signedInAccounts', () => {
  withTempStoreEnv();

  let owned: Account[];

  beforeEach(async () => {
    mockCurrentAccountCookie = undefined;
    jest.mocked(signedInUser).mockResolvedValue(mockUser);

    owned = sortedByName([
      await createOwnedAccount(getStore(), {
        input: { name: 'נועה', avatarId: 'kid-01' },
      }),
      await createOwnedAccount(getStore(), {
        input: { name: 'מתן', avatarId: 'kid-08' },
      }),
    ]);
  });

  it('sends a visitor with no session to the sign-in page', async () => {
    jest.mocked(signedInUser).mockResolvedValue(undefined);
    const mockListAccountsForUser = jest.spyOn(
      getStore(),
      'listAccountsForUser'
    );

    await expect(signedInAccounts()).rejects.toThrow();

    expect(redirect).toHaveBeenCalledWith(SIGN_IN_PATH);
    expect(mockListAccountsForUser).not.toHaveBeenCalled();
  });

  it('selects the account the cookie names', async () => {
    mockCurrentAccountCookie = { value: owned[1].id };

    expect(await signedInAccounts()).toMatchObject({
      currentAccountId: owned[1].id,
      themeId: owned[1].themeId,
    });
  });

  it('falls back to the first account when the cookie names nothing', async () => {
    mockCurrentAccountCookie = { value: 'not-an-account' };

    expect((await signedInAccounts()).currentAccountId).toBe(owned[0].id);
  });

  it('leaves out an account belonging to somebody else', async () => {
    const theirs = await createOwnedAccount(getStore(), {
      input: { name: 'שירי', avatarId: 'kid-03' },
      owner: mockCoParent,
    });

    const { accounts } = await signedInAccounts();

    expect(accounts).toEqual(owned);
    expect(accounts).not.toContainEqual(theirs);
  });
});
