/**
 * @jest-environment node
 */
import { createMockAccount } from '@/test-utils/mocks/account.mocks';
import {
  createMockTransaction,
  mockDayOfInterest,
  mockDayOfInterestCopy,
} from '@/test-utils/mocks/transaction.mocks';
import { interestSettledOn } from '@/test-utils/settled-interest';
import { settleInterest } from '@/lib/interest/interest-settlement';
import type { Transaction } from '@/lib/transaction/types';
import { withTestDatabase } from './test-database';

describe('PostgresTransactions storing each day of interest once', () => {
  const { store, accountId, transactionId } = withTestDatabase();
  const mockAccountA = createMockAccount({ id: accountId('a') });
  const mockAccountB = createMockAccount({ id: accountId('b') });

  beforeEach(async () => {
    await store.insertAccount(mockAccountA);
    await store.insertAccount(mockAccountB);
  });

  describe('a day of interest', () => {
    const mockDay = mockDayOfInterest.occurredAt;

    async function interestSettledForAccount(
      settledAccountId: string
    ): Promise<Transaction[]> {
      return interestSettledOn(
        await store.listTransactionsByAccount(settledAccountId),
        mockDay
      );
    }

    describe('when it arrives a second time', () => {
      beforeEach(async () => {
        await store.insertTransactions([
          {
            ...mockDayOfInterest,
            id: transactionId('interest'),
            accountId: mockAccountA.id,
          },
        ]);
        await store.insertTransactions([
          {
            ...mockDayOfInterestCopy,
            id: transactionId('interest-copy'),
            accountId: mockAccountA.id,
          },
        ]);
      });

      it('keeps the day settled once', async () => {
        const settledInterest = await interestSettledForAccount(
          mockAccountA.id
        );

        expect(settledInterest.map((transaction) => transaction.id)).toEqual([
          transactionId('interest'),
        ]);
      });
    });

    describe('for two children whose wallets have the same id', () => {
      beforeEach(async () => {
        await store.insertTransactions([
          {
            ...mockDayOfInterest,
            id: transactionId('interest-a'),
            accountId: mockAccountA.id,
          },
          {
            ...mockDayOfInterestCopy,
            id: transactionId('interest-b'),
            accountId: mockAccountB.id,
          },
        ]);
      });

      it('settles the day for the second child too', async () => {
        const settledInterest = await interestSettledForAccount(
          mockAccountB.id
        );

        expect(settledInterest.map((transaction) => transaction.id)).toEqual([
          transactionId('interest-b'),
        ]);
      });
    });

    describe('when a deposit is made on a day whose interest is already settled', () => {
      beforeEach(async () => {
        await store.insertTransactions([
          {
            ...mockDayOfInterest,
            id: transactionId('interest'),
            accountId: mockAccountA.id,
          },
        ]);
        await store.insertTransactions([
          createMockTransaction({
            id: transactionId('same-day-deposit'),
            accountId: mockAccountA.id,
            walletId: mockDayOfInterest.walletId,
            occurredAt: mockDay,
          }),
        ]);
      });

      it('keeps the deposit', async () => {
        const transactions = await store.listTransactionsByAccount(
          mockAccountA.id
        );

        expect(transactions.map((transaction) => transaction.id)).toContain(
          transactionId('same-day-deposit')
        );
      });
    });

    describe('when page loads all read it as unsettled before any of them settles it', () => {
      const pageLoadCount = 4;

      function afterEveryPageLoadHasRead(): () => Promise<void> {
        let readCount = 0;
        let releasePageLoads: () => void = () => {};
        const everyPageLoadHasRead = new Promise<void>((resolve) => {
          releasePageLoads = resolve;
        });

        return async (): Promise<void> => {
          readCount += 1;
          if (readCount === pageLoadCount) {
            releasePageLoads();
          }
          await everyPageLoadHasRead;
        };
      }

      beforeEach(async () => {
        await store.insertTransactions([
          createMockTransaction({
            id: transactionId('deposit'),
            accountId: mockAccountA.id,
          }),
        ]);
        const listTransactionsByAccount =
          store.listTransactionsByAccount.bind(store);
        const waitForEveryRead = afterEveryPageLoadHasRead();
        jest
          .spyOn(store, 'listTransactionsByAccount')
          .mockImplementation(async (id) => {
            const transactions = await listTransactionsByAccount(id);
            await waitForEveryRead();
            return transactions;
          });
        const pageLoads = Array.from({ length: pageLoadCount }, () =>
          settleInterest({ store, accounts: [mockAccountA], asOf: mockDay })
        );
        await Promise.all(pageLoads);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('is settled once', async () => {
        const settledInterest = await interestSettledForAccount(
          mockAccountA.id
        );

        expect(settledInterest).toHaveLength(1);
      });
    });
  });
});
