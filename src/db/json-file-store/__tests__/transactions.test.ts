import { JsonFileStore } from '../index';
import { createMockTransaction, mockAccount } from '@/test-utils/fixtures';
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
});
