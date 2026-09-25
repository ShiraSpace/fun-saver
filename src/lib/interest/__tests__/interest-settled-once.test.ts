import { InMemoryStore } from '@/db/memory-store';
import { settleInterest } from '../interest-settlement';
import { createMockAccount } from '@/test-utils/mocks/account.mocks';
import { createMockTransaction } from '@/test-utils/mocks/transaction.mocks';
import { interestSettledOn } from '@/test-utils/settled-interest';

const mockAccount = createMockAccount();
const mockDay = '2026-01-02';

describe('a day of interest', () => {
  let store: InMemoryStore;

  function settleDay(): Promise<unknown> {
    return settleInterest({ store, accounts: [mockAccount], asOf: mockDay });
  }

  beforeEach(async () => {
    store = new InMemoryStore();
    await store.insertTransactions([createMockTransaction()]);
  });

  describe('when two page loads settle it at the same time', () => {
    beforeEach(async () => {
      await Promise.all([settleDay(), settleDay()]);
    });

    it('is settled once', async () => {
      const transactions = await store.listTransactionsByAccount(
        mockAccount.id
      );

      expect(interestSettledOn(transactions, mockDay)).toHaveLength(1);
    });
  });

  describe('when a page load works from transactions read before the day was settled', () => {
    beforeEach(async () => {
      const transactionsBeforeSettling = await store.listTransactionsByAccount(
        mockAccount.id
      );
      await settleDay();
      jest
        .spyOn(store, 'listTransactionsByAccount')
        .mockResolvedValueOnce(transactionsBeforeSettling);
      await settleDay();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('is not settled again', async () => {
      const transactions = await store.listTransactionsByAccount(
        mockAccount.id
      );

      expect(interestSettledOn(transactions, mockDay)).toHaveLength(1);
    });
  });
});
