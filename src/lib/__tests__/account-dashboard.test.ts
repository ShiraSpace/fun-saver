import { InMemoryStore } from '@/db/memory-store';
import { getWalletsForAccount } from '../account-dashboard';
import {
  createMockAccount,
  createMockTransaction,
  createMockWallet,
} from '@/test-support/fixtures';
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

    const wallets = await getWalletsForAccount(store, account, '2026-01-03');

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

      const wallets = await getWalletsForAccount(
        store,
        accountWithUnsettledInterest,
        '2026-01-03'
      );

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
      const reread = await getWalletsForAccount(
        store,
        accountWithUnsettledInterest,
        '2026-01-03'
      );

      expect(reread[0].balance).toBe(8080);
      expect(await store.listTransactionsByWallet('w1')).toHaveLength(3);
    });
  });
});
