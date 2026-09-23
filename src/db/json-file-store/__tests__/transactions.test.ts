import { JsonFileStore } from '../index';
import {
  createMockTransaction,
  mockAccount,
  mockSecondAccount,
  mockTransactions,
} from '@/test-utils/fixtures';
import { withTempStoreFile } from '@/test-utils/test-utils';

const deposit = createMockTransaction();

describe('JsonFileStore transactions', () => {
  const file = withTempStoreFile();

  it('persists transactions across instances', async () => {
    const store = new JsonFileStore(file.path);
    await store.insertAccount(mockAccount);
    await store.insertTransactions([deposit]);

    const reopened = new JsonFileStore(file.path);
    expect(
      (await reopened.listTransactionsByWallet('a1', 'w1')).map(
        (transaction) => transaction.id
      )
    ).toEqual(['t1']);
  });

  it('still holds a child’s whole history after a restart, and none of another child’s', async () => {
    const store = new JsonFileStore(file.path);
    await store.insertAccount(mockAccount);
    await store.insertTransactions([
      ...mockTransactions,
      createMockTransaction({ id: 't7', accountId: mockSecondAccount.id }),
    ]);

    const reopened = new JsonFileStore(file.path);
    const rows = await reopened.listTransactionsByAccount(mockAccount.id);

    expect(new Set(rows)).toEqual(new Set(mockTransactions));
  });

  it('tells the history in the order it happened, same-day entries in the order they were made', async () => {
    const evening = createMockTransaction({
      id: 'evening',
      createdAt: '2026-01-01T09:00:00.000Z',
    });
    const morning = createMockTransaction({
      id: 'morning',
      createdAt: '2026-01-01T08:00:00.000Z',
    });
    const store = new JsonFileStore(file.path);
    await store.insertAccount(mockAccount);
    await store.insertTransactions([evening, morning]);

    const reopened = new JsonFileStore(file.path);
    const byAccount = reopened.listTransactionsByAccount(mockAccount.id);
    const byWallet = reopened.listTransactionsByWallet(
      mockAccount.id,
      evening.walletId
    );

    expect(await byAccount).toEqual([morning, evening]);
    expect(await byWallet).toEqual([morning, evening]);
  });
});
