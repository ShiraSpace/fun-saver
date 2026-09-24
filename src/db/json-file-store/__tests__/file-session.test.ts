import { JsonFileStore } from '../index';
import { UnknownOwnerError } from '@/lib/errors';
import {
  createMockTransaction,
  mockAccount,
  mockAccountUser,
  mockOwner,
  mockUser,
} from '@/test-utils/mocks/general.mocks';
import { withTempStoreFile } from '@/test-utils/test-utils';

describe('FileSession write queue', () => {
  const file = withTempStoreFile();
  let store: JsonFileStore;

  beforeEach(() => {
    store = new JsonFileStore(file.path);
  });

  it('keeps every write when repositories write concurrently', async () => {
    await Promise.all([
      store.insertAccount(mockAccount),
      store.insertTransactions([createMockTransaction({ id: 'c1' })]),
      store.insertTransactions([createMockTransaction({ id: 'c2' })]),
      store.insertTransactions([createMockTransaction({ id: 'c3' })]),
    ]);

    expect(await store.getAccount(mockAccount.id)).toEqual(mockAccount);
    const ids = (await store.listTransactionsByWallet('a1', 'w1'))
      .map((transaction) => transaction.id)
      .sort();
    expect(ids).toEqual(['c1', 'c2', 'c3']);
  });

  it('keeps an account and its owner together when other writes race them', async () => {
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

  it('writes the owner when its user is queued first', async () => {
    await Promise.all([
      store.insertUser(mockUser),
      store.insertAccountWithOwner(mockAccount, mockOwner),
    ]);

    expect(await store.getAccountUser(mockAccount.id, mockUser.id)).toEqual(
      mockAccountUser
    );
  });

  it('rejects the account when its user is queued second', async () => {
    const [account] = await Promise.allSettled([
      store.insertAccountWithOwner(mockAccount, mockOwner),
      store.insertUser(mockUser),
    ]);

    expect(account).toMatchObject({ reason: expect.any(UnknownOwnerError) });
  });
});
