import { JsonFileStore } from '../index';
import {
  createMockTransaction,
  mockAccount,
  mockAccountUser,
  mockUser,
} from '@/test-utils/fixtures';
import { withTempStoreFile } from '@/test-utils/test-utils';

describe('FileSession write queue', () => {
  const file = withTempStoreFile();

  it('keeps every write when repositories write concurrently', async () => {
    const store = new JsonFileStore(file.path);

    await Promise.all([
      store.insertAccount(mockAccount),
      store.insertTransactions([createMockTransaction({ id: 'c1' })]),
      store.insertTransactions([createMockTransaction({ id: 'c2' })]),
      store.insertTransactions([createMockTransaction({ id: 'c3' })]),
    ]);

    expect(await store.listAccounts()).toEqual([mockAccount]);
    const ids = (await store.listTransactionsByWallet('a1', 'w1'))
      .map((transaction) => transaction.id)
      .sort();
    expect(ids).toEqual(['c1', 'c2', 'c3']);
  });

  it('keeps an account and its owner together when other writes race them', async () => {
    const store = new JsonFileStore(file.path);

    await store.insertUser(mockUser);

    await Promise.all([
      store.insertAccountWithOwner(mockAccount, {
        userId: mockUser.id,
        addedAt: mockAccountUser.addedAt,
      }),
      store.insertTransactions([createMockTransaction({ id: 'c1' })]),
    ]);

    expect(await store.getAccount(mockAccount.id)).toEqual(mockAccount);
    expect(await store.getAccountUser(mockAccount.id, mockUser.id)).toEqual(
      mockAccountUser
    );
  });
});
