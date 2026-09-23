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

  it('lists the whole ledger again after a reopen, and nothing of anyone else', async () => {
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
});
