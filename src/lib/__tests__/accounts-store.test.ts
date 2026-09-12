import { InMemoryStore } from '@/db/memory-store';
import { DEFAULT_THEME_ID } from '@/theme/registry';
import { AccountsStore } from '../accounts-store';
import { SAVINGS_MONTHLY_RATE } from '../constants';
import {
  mockCreateAccountInput,
  mockAccountEdit,
} from '@/test-support/fixtures';
import type { Account } from '@/lib/types';

const ASOF = '2026-01-01';

describe('AccountsStore', () => {
  it('creates an active account with the given name and avatar', async () => {
    const accountsStore = new AccountsStore(new InMemoryStore());

    const account = await accountsStore.createAccount(
      mockCreateAccountInput,
      ASOF
    );

    expect(typeof account.id).toBe('string');
    expect(account.id.length).toBeGreaterThan(0);
    expect(account).toMatchObject({
      name: mockCreateAccountInput.name,
      avatarId: mockCreateAccountInput.avatarId,
      isActive: true,
    });
  });

  it('seeds the three default wallets opened on the given day', async () => {
    const accountsStore = new AccountsStore(new InMemoryStore());

    const account = await accountsStore.createAccount(
      mockCreateAccountInput,
      ASOF
    );

    expect(account.wallets.map((wallet) => wallet.name).sort()).toEqual([
      'goodDeeds',
      'savings',
      'spending',
    ]);

    const savings = account.wallets.find((wallet) => wallet.name === 'savings');
    expect(savings).toMatchObject({
      monthlyInterestRate: SAVINGS_MONTHLY_RATE,
      openedAt: ASOF,
      lastInterestDate: ASOF,
    });
  });

  it('gives a new account the default theme', async () => {
    const accountsStore = new AccountsStore(new InMemoryStore());

    const account = await accountsStore.createAccount(
      mockCreateAccountInput,
      ASOF
    );

    expect(account.themeId).toBe(DEFAULT_THEME_ID);
  });

  describe('edit account', () => {
    let accountsStore: AccountsStore;
    let account: Account;

    beforeEach(async () => {
      accountsStore = new AccountsStore(new InMemoryStore());
      account = await accountsStore.createAccount(mockCreateAccountInput, ASOF);
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
