import { InMemoryStore } from '@/db/memory-store';
import { getWalletsForAccount, withDerivedWallets } from '../account-dashboard';
import {
  createMockAccount,
  createMockTransaction,
  createMockWallet,
} from '@/test-utils/fixtures';
import type { WalletWithDerived } from '../types';

const account = createMockAccount({
  wallets: [
    createMockWallet({
      id: 'w2',
      name: 'spending',
      icon: '🛍️',
      monthlyInterestRate: 0,
    }),
    createMockWallet({ lastInterestDate: '2026-01-03' }),
  ],
});

const transactions = [
  createMockTransaction({ id: 'd', amount: 8000 }),
  createMockTransaction({
    id: 'i',
    type: 'interest',
    amount: 500,
    occurredAt: '2026-01-03',
  }),
  createMockTransaction({ id: 'd2', walletId: 'w2', amount: 5000 }),
];

describe('getWalletsForAccount', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  it('returns derived wallets ordered savings-first', async () => {
    await store.insertTransactions(transactions);

    const wallets = await getWalletsForAccount({
      store,
      account,
      asOf: '2026-01-03',
    });

    expect(wallets.map((wallet) => wallet.name)).toEqual([
      'savings',
      'spending',
    ]);
    expect(wallets[0].balance).toBe(8500);
    expect(wallets[0].todayInterest).toBe(500);
    expect(wallets[1].balance).toBe(5000);
  });

  describe('when the savings wallet has interest unsettled up to asOf', () => {
    const accountWithUnsettledInterest = createMockAccount({
      wallets: [createMockWallet({ lastInterestDate: '2026-01-01' })],
    });

    let savingsWallet: WalletWithDerived;

    beforeEach(async () => {
      await store.insertTransactions([
        createMockTransaction({
          id: 'd',
          amount: 8000,
          occurredAt: '2026-01-01',
        }),
      ]);

      const wallets = await getWalletsForAccount({
        store,
        account: accountWithUnsettledInterest,
        asOf: '2026-01-03',
      });

      savingsWallet = wallets[0];
    });

    it('accrues the compounded interest gain', () => {
      expect(savingsWallet.interestGain).toBe(80);
    });

    it('reflects the accrued interest in the balance', () => {
      expect(savingsWallet.balance).toBe(8080);
    });

    it('credits the interest dated asOf to todayInterest', () => {
      expect(savingsWallet.todayInterest).toBe(40);
    });

    it('does not re-accrue interest on a second read', async () => {
      const reread = await getWalletsForAccount({
        store,
        account: accountWithUnsettledInterest,
        asOf: '2026-01-03',
      });

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
  const secondAccount = createMockAccount({
    id: 'a2',
    name: 'מתן',
    wallets: [createMockWallet({ id: 'w9', monthlyInterestRate: 0 })],
  });

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
