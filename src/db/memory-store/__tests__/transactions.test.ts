import { InMemoryStore } from '../index';
import { createMockTransaction } from '@/test-utils/fixtures';

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
});
