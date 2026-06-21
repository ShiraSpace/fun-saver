import { InMemoryStore } from '@/db/memory-store';
import { AccountsStore } from '../accounts-store';
import { SAVINGS_MONTHLY_RATE } from '../constants';
import { CREATE_ACCOUNT_INPUT } from '@/test-support/fixtures';

const ASOF = '2026-01-01';

describe('AccountsStore', () => {
  it('creates an active account with the given name and avatar', async () => {
    const accountsStore = new AccountsStore(new InMemoryStore());

    const account = await accountsStore.createAccount(
      CREATE_ACCOUNT_INPUT,
      ASOF
    );

    expect(typeof account.id).toBe('string');
    expect(account.id.length).toBeGreaterThan(0);
    expect(account).toMatchObject({
      name: CREATE_ACCOUNT_INPUT.name,
      avatarId: CREATE_ACCOUNT_INPUT.avatarId,
      isActive: true,
    });
  });

  it('seeds the three default wallets opened on the given day', async () => {
    const store = new InMemoryStore();
    const accountsStore = new AccountsStore(store);

    const account = await accountsStore.createAccount(
      CREATE_ACCOUNT_INPUT,
      ASOF
    );
    const wallets = await store.listWalletsByAccount(account.id);

    expect(wallets.map((wallet) => wallet.name).sort()).toEqual([
      'goodDeeds',
      'savings',
      'spending',
    ]);
    expect(wallets.every((wallet) => wallet.accountId === account.id)).toBe(
      true
    );

    const savings = wallets.find((wallet) => wallet.name === 'savings');
    expect(savings).toMatchObject({
      monthlyInterestRate: SAVINGS_MONTHLY_RATE,
      openedAt: ASOF,
      lastInterestDate: ASOF,
    });
  });
});
