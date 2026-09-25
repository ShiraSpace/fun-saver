import { JsonFileStore } from '../index';
import {
  createMockTransaction,
  mockDayOfInterest,
  mockDayOfInterestCopy,
  mockTransactions,
} from '@/test-utils/mocks/transaction.mocks';
import { interestSettledOn } from '@/test-utils/settled-interest';
import {
  mockAccount,
  mockSiblingAccount,
} from '@/test-utils/mocks/account.mocks';
import { withTempStoreFile } from '@/test-utils/test-utils';

const mockDeposit = createMockTransaction();

describe('JsonFileStore transactions', () => {
  const file = withTempStoreFile();

  it('persists transactions across instances', async () => {
    const store = new JsonFileStore(file.path);
    await store.insertAccount(mockAccount);
    await store.insertTransactions([mockDeposit]);

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
      createMockTransaction({ id: 't7', accountId: mockSiblingAccount.id }),
    ]);

    const reopened = new JsonFileStore(file.path);
    const listedTransactions = await reopened.listTransactionsByAccount(
      mockAccount.id
    );

    expect(new Set(listedTransactions)).toEqual(new Set(mockTransactions));
  });

  it('tells the history in the order it happened, same-day transactions in the order they were made', async () => {
    const mockEveningTransaction = createMockTransaction({
      id: 'evening',
      createdAt: '2026-01-01T09:00:00.000Z',
    });
    const mockMorningTransaction = createMockTransaction({
      id: 'morning',
      createdAt: '2026-01-01T08:00:00.000Z',
    });
    const store = new JsonFileStore(file.path);
    await store.insertAccount(mockAccount);
    await store.insertTransactions([
      mockEveningTransaction,
      mockMorningTransaction,
    ]);

    const reopened = new JsonFileStore(file.path);
    const byAccount = reopened.listTransactionsByAccount(mockAccount.id);
    const byWallet = reopened.listTransactionsByWallet(
      mockAccount.id,
      mockEveningTransaction.walletId
    );

    expect(await byAccount).toEqual([
      mockMorningTransaction,
      mockEveningTransaction,
    ]);
    expect(await byWallet).toEqual([
      mockMorningTransaction,
      mockEveningTransaction,
    ]);
  });

  describe('when a day of interest arrives a second time', () => {
    beforeEach(async () => {
      const store = new JsonFileStore(file.path);
      await store.insertAccount(mockAccount);
      await store.insertTransactions([mockDayOfInterest]);
      await store.insertTransactions([mockDayOfInterestCopy]);
    });

    it('keeps the day settled once, after a restart too', async () => {
      const reopened = new JsonFileStore(file.path);
      const transactions = await reopened.listTransactionsByAccount(
        mockAccount.id
      );

      expect(
        interestSettledOn(transactions, mockDayOfInterest.occurredAt)
      ).toEqual([mockDayOfInterest]);
    });
  });
});
