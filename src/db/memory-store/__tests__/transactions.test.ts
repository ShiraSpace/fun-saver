import { InMemoryStore } from '../index';
import {
  createMockTransaction,
  mockAccount,
  mockSecondAccount,
  mockTransactions,
} from '@/test-utils/fixtures';

const deposit = createMockTransaction();

describe('InMemoryStore transactions', () => {
  it('lists transactions filtered by wallet', async () => {
    const store = new InMemoryStore();

    await store.insertTransactions([deposit]);

    expect(
      (await store.listTransactionsByWallet('a1', 'w1')).map(
        (transaction) => transaction.id
      )
    ).toEqual(['t1']);
  });

  it('lists every wallet of the account, and nothing of anyone else', async () => {
    const store = new InMemoryStore();
    await store.insertTransactions([
      ...mockTransactions,
      createMockTransaction({ id: 't7', accountId: mockSecondAccount.id }),
    ]);

    const rows = await store.listTransactionsByAccount(mockAccount.id);

    expect(new Set(rows)).toEqual(new Set(mockTransactions));
  });
  it('returns a ledger oldest first, ties broken by write time', async () => {
    const evening = createMockTransaction({
      id: 'evening',
      createdAt: '2026-01-01T09:00:00.000Z',
    });
    const morning = createMockTransaction({
      id: 'morning',
      createdAt: '2026-01-01T08:00:00.000Z',
    });
    const store = new InMemoryStore();
    await store.insertTransactions([evening, morning]);

    const byAccount = store.listTransactionsByAccount(mockAccount.id);
    const byWallet = store.listTransactionsByWallet(
      mockAccount.id,
      evening.walletId
    );

    expect(await byAccount).toEqual([morning, evening]);
    expect(await byWallet).toEqual([morning, evening]);
  });
});
