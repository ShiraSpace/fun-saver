/**
 * @jest-environment node
 */
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { redirect } from 'next/navigation';
import { signedInUserId } from '@/auth';
import { byAccountName } from '@/db/account-users';
import { getStore } from '@/db';
import { AccountsStore } from '@/lib/accounts-store';
import { LOGIN_PATH } from '@/lib/constants';
import type { Account } from '@/lib/types';
import { mockSecondUser, mockUser } from '@/test-utils/fixtures';
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
  let dir: string;
  let owned: Account[];

  beforeEach(async () => {
    dir = mkdtempSync(join(tmpdir(), 'funsaver-scope-'));
    process.env.FUNSAVER_DATA_PATH = join(dir, 'data.json');
    mockSelectedAccountCookie = undefined;
    jest.mocked(signedInUserId).mockResolvedValue(mockUser.id);

    const store = getStore();
    await store.insertUser(mockUser);
    const accountsStore = new AccountsStore(store);
    owned = byAccountName([
      await accountsStore.createAccount({
        input: { name: 'נועה', avatarId: 'kid-01' },
        ownerId: mockUser.id,
      }),
      await accountsStore.createAccount({
        input: { name: 'מתן', avatarId: 'kid-08' },
        ownerId: mockUser.id,
      }),
    ]);
  });

  afterEach(() => {
    delete process.env.FUNSAVER_DATA_PATH;
    rmSync(dir, { recursive: true, force: true });
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
    const store = getStore();
    await store.insertUser(mockSecondUser);
    const theirs = await new AccountsStore(store).createAccount({
      input: { name: 'שירי', avatarId: 'kid-03' },
      ownerId: mockSecondUser.id,
    });

    const { accounts } = await signedInAccounts();

    expect(accounts).toEqual(owned);
    expect(accounts).not.toContainEqual(theirs);
  });
});
