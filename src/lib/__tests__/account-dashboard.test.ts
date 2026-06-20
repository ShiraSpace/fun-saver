import { InMemoryStore } from '@/db/memory-store';
import { getWalletsForAccount } from '../account-dashboard';
import type { Transaction, Wallet } from '../types';

const savings: Wallet = {
  id: 'w1',
  accountId: 'a1',
  name: 'savings',
  icon: '🐷',
  monthlyInterestRate: 0.15,
  openedAt: '2026-01-01',
  lastInterestDate: '2026-01-03',
};

const spending: Wallet = {
  id: 'w2',
  accountId: 'a1',
  name: 'spending',
  icon: '🛍️',
  monthlyInterestRate: 0,
  openedAt: '2026-01-01',
  lastInterestDate: '2026-01-01',
};

const txns: Transaction[] = [
  {
    id: 'd',
    walletId: 'w1',
    type: 'deposit',
    amount: 8000,
    occurredAt: '2026-01-01',
  },
  {
    id: 'i',
    walletId: 'w1',
    type: 'interest',
    amount: 500,
    occurredAt: '2026-01-03',
  },
  {
    id: 'd2',
    walletId: 'w2',
    type: 'deposit',
    amount: 5000,
    occurredAt: '2026-01-01',
  },
];

describe('getWalletsForAccount', () => {
  it('returns derived wallets ordered savings-first', async () => {
    const store = new InMemoryStore();
    await store.insertWallet(spending);
    await store.insertWallet(savings);
    await store.insertTransactions(txns);

    const wallets = await getWalletsForAccount(store, 'a1', '2026-01-03');

    expect(wallets.map((w) => w.name)).toEqual(['savings', 'spending']);
    expect(wallets[0].balance).toBe(8500);
    expect(wallets[0].todayInterest).toBe(500);
    expect(wallets[1].balance).toBe(5000);
  });
});
