import { InMemoryStore } from '@/db/memory-store';
import { getWalletsForAccount } from '../account-dashboard';
import {
  createMockAccount,
  createMockTransaction,
  createMockWallet,
} from '@/test-support/fixtures';

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

  it('accrues and persists daily interest up to asOf, idempotently', async () => {
    const freshAccount = createMockAccount({
      wallets: [createMockWallet({ lastInterestDate: '2026-01-01' })],
    });
    await store.insertTransactions([
      createMockTransaction({
        id: 'd',
        amount: 8000,
        occurredAt: '2026-01-01',
      }),
    ]);

    const first = await getWalletsForAccount(store, freshAccount, '2026-01-03');

    expect(first[0].interestGain).toBe(80);
    expect(first[0].balance).toBe(8080);
    expect(first[0].todayInterest).toBe(40);

    const second = await getWalletsForAccount(
      store,
      freshAccount,
      '2026-01-03'
    );

    expect(second[0].balance).toBe(8080);
    expect(await store.listTransactionsByWallet('w1')).toHaveLength(3);
  });
});
