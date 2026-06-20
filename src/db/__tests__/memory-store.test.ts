import { InMemoryStore } from '../memory-store';
import { ACCOUNT } from '@/test-support/fixtures';
import type { Transaction, Wallet } from '@/lib/types';

const savings: Wallet = {
  id: 'w1',
  accountId: 'a1',
  name: 'savings',
  icon: '🐷',
  monthlyInterestRate: 0.15,
  openedAt: '2026-01-01',
  lastInterestDate: '2026-01-01',
};

const otherAccountWallet: Wallet = {
  ...savings,
  id: 'w9',
  accountId: 'a2',
  name: 'spending',
};

const deposit: Transaction = {
  id: 't1',
  walletId: 'w1',
  type: 'deposit',
  amount: 5000,
  occurredAt: '2026-01-01',
};

describe('InMemoryStore', () => {
  it('lists inserted accounts', async () => {
    const store = new InMemoryStore();

    await store.insertAccount(ACCOUNT);

    expect(await store.listAccounts()).toEqual([ACCOUNT]);
  });

  it('lists wallets filtered by account', async () => {
    const store = new InMemoryStore();

    await store.insertWallet(savings);
    await store.insertWallet(otherAccountWallet);

    expect((await store.listWalletsByAccount('a1')).map((w) => w.id)).toEqual([
      'w1',
    ]);
  });

  it('lists transactions filtered by wallet', async () => {
    const store = new InMemoryStore();

    await store.insertTransactions([deposit]);

    expect(
      (await store.listTransactionsByWallet('w1')).map((t) => t.id)
    ).toEqual(['t1']);
  });
});
