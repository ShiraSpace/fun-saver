import { InMemoryStore } from '@/db/memory-store';
import { DEFAULT_THEME_ID } from '@/theme/registry';
import { AccountsStore } from '../accounts-store';
import { today } from '../clock';
import { SAVINGS_MONTHLY_RATE } from '../constants';
import {
  mockCreateAccountInput,
  mockAccountEdits,
  mockUser,
} from '@/test-utils/mocks/general.mocks';
import type { Account } from '@/lib/types';

describe('AccountsStore', () => {
  let store: InMemoryStore;
  let accountsStore: AccountsStore;
  let account: Account;

  beforeEach(async () => {
    store = new InMemoryStore();
    await store.insertUser(mockUser);
    accountsStore = new AccountsStore(store);
    account = await accountsStore.createAccount({
      input: mockCreateAccountInput,
      ownerId: mockUser.id,
    });
  });

  it('creates an active account with the given name and avatar', () => {
    expect(typeof account.id).toBe('string');
    expect(account.id.length).toBeGreaterThan(0);
    expect(account).toMatchObject({
      name: mockCreateAccountInput.name,
      avatarId: mockCreateAccountInput.avatarId,
      isActive: true,
    });
  });

  it('seeds the three default wallets at their configured rate', () => {
    expect(account.wallets.map((wallet) => wallet.name).sort()).toEqual([
      'goodDeeds',
      'savings',
      'spending',
    ]);
    expect(
      account.wallets.find((wallet) => wallet.name === 'savings')
    ).toMatchObject({ monthlyInterestRate: SAVINGS_MONTHLY_RATE });
  });

  it('opens every wallet today', () => {
    const openedToday = account.wallets.filter(
      (wallet) =>
        wallet.openedAt === today() && wallet.lastInterestDate === today()
    );

    expect(openedToday).toEqual(account.wallets);
  });

  it('makes the given user the owner of the new account', async () => {
    expect(await store.getAccountUser(account.id, mockUser.id)).toMatchObject({
      accountId: account.id,
      userId: mockUser.id,
      role: 'owner',
    });
    expect(await store.listAccountsForUser(mockUser.id)).toEqual([account]);
  });

  it('gives a new account the default theme', () => {
    expect(account.themeId).toBe(DEFAULT_THEME_ID);
  });

  describe('edit account', () => {
    it('updates the name and avatar of an existing account', async () => {
      const updated = await accountsStore.updateAccount(
        account.id,
        mockAccountEdits
      );

      expect(updated).toMatchObject(mockAccountEdits);
    });

    it('returns undefined for an unknown id', async () => {
      expect(
        await accountsStore.updateAccount('missing', mockAccountEdits)
      ).toBeUndefined();
    });
  });
});
