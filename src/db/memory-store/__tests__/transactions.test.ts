import { InMemoryStore } from '../index';
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

const mockDeposit = createMockTransaction();

describe('InMemoryStore transactions', () => {
  it('lists transactions filtered by wallet', async () => {
    const store = new InMemoryStore();

    await store.insertTransactions([mockDeposit]);

    expect(
      (await store.listTransactionsByWallet('a1', 'w1')).map(
        (transaction) => transaction.id
      )
    ).toEqual(['t1']);
  });

  it('gathers every wallet of one child’s history, and none of another child’s', async () => {
    const store = new InMemoryStore();
    await store.insertTransactions([
      ...mockTransactions,
      createMockTransaction({ id: 't7', accountId: mockSiblingAccount.id }),
    ]);

    const listedTransactions = await store.listTransactionsByAccount(
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
    const store = new InMemoryStore();
    await store.insertTransactions([
      mockEveningTransaction,
      mockMorningTransaction,
    ]);

    const byAccount = store.listTransactionsByAccount(mockAccount.id);
    const byWallet = store.listTransactionsByWallet(
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
    let store: InMemoryStore;

    beforeEach(async () => {
      store = new InMemoryStore();
      await store.insertTransactions([mockDayOfInterest]);
      await store.insertTransactions([mockDayOfInterestCopy]);
    });

    it('keeps the day settled once', async () => {
      const transactions = await store.listTransactionsByAccount(
        mockAccount.id
      );

      expect(
        interestSettledOn(transactions, mockDayOfInterest.occurredAt)
      ).toEqual([mockDayOfInterest]);
    });
  });
});
