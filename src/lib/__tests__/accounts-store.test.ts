import { InMemoryStore } from '@/db/memory-store';
import { AccountsStore } from '../accounts-store';
import { SAVINGS_MONTHLY_RATE } from '../constants';
import { mockCreateAccountInput } from '@/test-support/fixtures';

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
});
