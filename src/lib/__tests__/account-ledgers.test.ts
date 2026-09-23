import { InMemoryStore } from '@/db/memory-store';
import { settledLedgers, withDerivedWallets } from '../account-ledgers';
import {
  createMockAccount,
  createMockTransaction,
  createMockWallet,
  createMockWallets,
  mockSecondAccount,
} from '@/test-utils/fixtures';
import type { Account, WalletWithDerived } from '../types';

const [savings, spending] = createMockWallets();

const account = createMockAccount({
  wallets: [spending, { ...savings, lastInterestDate: '2026-01-03' }],
});

const transactions = [
  createMockTransaction(),
  createMockTransaction({
    id: 'i',
    type: 'interest',
    amount: 500,
    occurredAt: '2026-01-03',
  }),
  createMockTransaction({ id: 'd2', walletId: 'w2', amount: 5000 }),
];

describe('settledLedgers', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  async function walletsOf(
    ledgerAccount: Account,
    asOf: string
  ): Promise<WalletWithDerived[]> {
    const [ledger] = await settledLedgers({
      store,
      accounts: [ledgerAccount],
      asOf,
    });

    return ledger.account.wallets;
  }

  it('lists savings before spending, the order the dashboard lays its wallets out in', async () => {
    await store.insertTransactions(transactions);

    const wallets = await walletsOf(account, '2026-01-03');

    expect(wallets.map((wallet) => wallet.name)).toEqual([
      'savings',
      'spending',
    ]);
    expect(wallets[0].balance).toBe(8500);
    expect(wallets[0].todayInterest).toBe(500);
    expect(wallets[1].balance).toBe(5000);
  });

  it('shows a brand-new child’s wallets at zero', async () => {
    const wallets = await walletsOf(account, '2026-01-03');

    expect(wallets.map((wallet) => wallet.balance)).toEqual([0, 0]);
  });

  it('includes the interest just paid in, in the order it happened, so the first visit reads like every later one', async () => {
    const owing = createMockAccount({ wallets: [createMockWallet()] });
    await store.insertTransactions([
      createMockTransaction(),
      createMockTransaction({
        id: 't2',
        occurredAt: '2026-01-03',
        createdAt: '2026-01-03T00:00:00.000Z',
      }),
    ]);

    const [ledger] = await settledLedgers({
      store,
      accounts: [owing],
      asOf: '2026-01-03',
    });
    const saved = await store.listTransactionsByAccount(owing.id);

    expect(ledger.transactions).toEqual(saved);
  });

  it('writes nothing when no interest is owed, so opening a page never rewrites the saved data', async () => {
    await store.insertTransactions([createMockTransaction()]);
    const insert = jest.spyOn(store, 'insertTransactions');

    await walletsOf(account, '2026-01-03');

    expect(insert).not.toHaveBeenCalled();
  });

  describe('when interest has built up since it was last paid in', () => {
    const accountWithUnsettledInterest = createMockAccount({
      wallets: [createMockWallet()],
    });

    let savingsWallet: WalletWithDerived;

    beforeEach(async () => {
      await store.insertTransactions([createMockTransaction()]);

      const wallets = await walletsOf(
        accountWithUnsettledInterest,
        '2026-01-03'
      );

      savingsWallet = wallets[0];
    });

    it('pays each missed day’s interest on top of the day before', () => {
      expect(savingsWallet.interestGain).toBe(80);
    });

    it('counts the interest just paid in as part of the balance', () => {
      expect(savingsWallet.balance).toBe(8080);
    });

    it('shows the interest earned today as today’s interest', () => {
      expect(savingsWallet.todayInterest).toBe(40);
    });

    it('pays missed interest once, however often the page is opened', async () => {
      const reread = await walletsOf(
        accountWithUnsettledInterest,
        '2026-01-03'
      );

      expect(reread[0].balance).toBe(8080);
      expect(
        await store.listTransactionsByWallet(
          accountWithUnsettledInterest.id,
          'w1'
        )
      ).toHaveLength(3);
    });
  });
});

describe('withDerivedWallets', () => {
  const secondAccount = {
    ...mockSecondAccount,
    wallets: [createMockWallet({ id: 'w9', monthlyInterestRate: 0 })],
  };

  let store: InMemoryStore;

  beforeEach(async () => {
    store = new InMemoryStore();
    await store.insertTransactions([
      ...transactions,
      createMockTransaction({
        id: 'd3',
        accountId: secondAccount.id,
        walletId: 'w9',
        amount: 2500,
      }),
    ]);
  });

  it('keeps every account it was handed', async () => {
    const derived = await withDerivedWallets({
      store,
      accounts: [account, secondAccount],
      asOf: '2026-01-03',
    });

    expect(derived.map((each) => each.id)).toEqual([
      account.id,
      secondAccount.id,
    ]);
  });

  it('gives each account the balances of its own wallets', async () => {
    const [first, second] = await withDerivedWallets({
      store,
      accounts: [account, secondAccount],
      asOf: '2026-01-03',
    });

    expect(first.wallets.map((wallet) => wallet.name)).toEqual([
      'savings',
      'spending',
    ]);
    expect(first.wallets[0].balance).toBe(8500);
    expect(second.wallets.map((wallet) => wallet.id)).toEqual(['w9']);
    expect(second.wallets[0].balance).toBe(2500);
  });

  it('has nothing to derive for nobody', async () => {
    expect(
      await withDerivedWallets({ store, accounts: [], asOf: '2026-01-03' })
    ).toEqual([]);
  });
});
