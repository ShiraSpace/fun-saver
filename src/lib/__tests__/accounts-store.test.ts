import { InMemoryStore } from '@/db/memory-store';
import { DEFAULT_THEME_ID } from '@/theme/registry';
import { AccountsStore } from '../accounts-store';
import { today } from '../clock';
import { SAVINGS_MONTHLY_RATE } from '../constants';
import {
  mockCreateAccountInput,
  mockAccountEdit,
  mockUser,
} from '@/test-utils/fixtures';
import type { Account } from '@/lib/types';

async function ownedAccountsStore(): Promise<AccountsStore> {
  const store = new InMemoryStore();
  await store.insertUser(mockUser);

  return new AccountsStore(store);
}

describe('AccountsStore', () => {
  it('creates an active account with the given name and avatar', async () => {
    const accountsStore = await ownedAccountsStore();

    const account = await accountsStore.createAccount({
      input: mockCreateAccountInput,
      ownerId: mockUser.id,
    });

    expect(typeof account.id).toBe('string');
    expect(account.id.length).toBeGreaterThan(0);
    expect(account).toMatchObject({
      name: mockCreateAccountInput.name,
      avatarId: mockCreateAccountInput.avatarId,
      isActive: true,
    });
  });

  it('seeds the three default wallets at their configured rate', async () => {
    const accountsStore = await ownedAccountsStore();

    const account = await accountsStore.createAccount({
      input: mockCreateAccountInput,
      ownerId: mockUser.id,
    });

    expect(account.wallets.map((wallet) => wallet.name).sort()).toEqual([
      'goodDeeds',
      'savings',
      'spending',
    ]);
    expect(
      account.wallets.find((wallet) => wallet.name === 'savings')
    ).toMatchObject({ monthlyInterestRate: SAVINGS_MONTHLY_RATE });
  });

  it('opens every wallet today', async () => {
    const accountsStore = await ownedAccountsStore();

    const account = await accountsStore.createAccount({
      input: mockCreateAccountInput,
      ownerId: mockUser.id,
    });

    const openedToday = account.wallets.filter(
      (wallet) =>
        wallet.openedAt === today() && wallet.lastInterestDate === today()
    );

    expect(openedToday).toEqual(account.wallets);
  });

  it('makes the given user the owner of the new account', async () => {
    const store = new InMemoryStore();
    await store.insertUser(mockUser);

    const account = await new AccountsStore(store).createAccount({
      input: mockCreateAccountInput,
      ownerId: mockUser.id,
    });

    expect(await store.getAccountUser(account.id, mockUser.id)).toMatchObject({
      accountId: account.id,
      userId: mockUser.id,
      role: 'owner',
    });
    expect(await store.listAccountsForUser(mockUser.id)).toEqual([account]);
  });

  it('gives a new account the default theme', async () => {
    const accountsStore = await ownedAccountsStore();

    const account = await accountsStore.createAccount({
      input: mockCreateAccountInput,
      ownerId: mockUser.id,
    });

    expect(account.themeId).toBe(DEFAULT_THEME_ID);
  });

  describe('edit account', () => {
    let accountsStore: AccountsStore;
    let account: Account;

    beforeEach(async () => {
      accountsStore = await ownedAccountsStore();
      account = await accountsStore.createAccount({
        input: mockCreateAccountInput,
        ownerId: mockUser.id,
      });
    });

    it('updates the name and avatar of an existing account', async () => {
      const updated = await accountsStore.updateAccount(
        account.id,
        mockAccountEdit
      );

      expect(updated).toMatchObject(mockAccountEdit);
    });

    it('returns undefined for an unknown id', async () => {
      expect(
        await accountsStore.updateAccount('missing', mockAccountEdit)
      ).toBeUndefined();
    });
  });
});
