import { ALL_TRANSACTION_TYPES, INTEREST_MODE, TRANSACTION_TYPE } from '../constants';
import {
  filterByTransactionType,
  monthSections,
  type InterestMode,
  type TransactionListRow,
} from '../transaction-rows';
import type { Transaction } from '../types';
import {
  createMockTransaction,
  mockMonthOfInterest,
  mockMonthOfInterestLastDay,
  mockOpeningDeposit,
  mockWalletDeposits,
} from '@/test-utils/mocks/transaction.mocks';
import {
  balanceHistoryFor,
  closingBalances,
  rowsOfType,
  transactionListRowsFor,
} from '@/test-utils/transaction-rows';
import {
  mockBusyDay,
  mockBusyDayTransactions,
  mockBusyDayWithdrawal,
} from '@/test-utils/mocks/transaction.mocks';

describe('what the transaction list shows', () => {
  describe('filtered by type', () => {
    let rows: TransactionListRow[];

    beforeEach(() => {
      rows = transactionListRowsFor(mockBusyDayTransactions, INTEREST_MODE.byPeriod, mockBusyDay);
    });

    it('shows every row under הכל', () => {
      expect(filterByTransactionType(rows, ALL_TRANSACTION_TYPES)).toEqual(rows);
    });

    it('shows only withdrawals under משיכות', () => {
      const withdrawalRows = filterByTransactionType(rows, TRANSACTION_TYPE.withdrawal);

      expect(withdrawalRows.map((row) => row.type)).toEqual([TRANSACTION_TYPE.withdrawal]);
    });

    it('keeps each row’s true balance', () => {
      const withdrawalRows = filterByTransactionType(rows, TRANSACTION_TYPE.withdrawal);
      const busyDayBalanceHistory = balanceHistoryFor(mockBusyDayTransactions, mockBusyDay);

      expect(withdrawalRows.map((row) => row.balance)).toEqual(
        closingBalances(withdrawalRows, busyDayBalanceHistory)
      );
    });
  });

  describe('a month of interest', () => {
    function interestRowsFor(
      interestMode: InterestMode,
      interest: Transaction[] = mockMonthOfInterest
    ): TransactionListRow[] {
      const rows = transactionListRowsFor(
        [mockOpeningDeposit, ...interest],
        interestMode,
        '2026-01-04'
      );

      return rowsOfType(rows, TRANSACTION_TYPE.interest);
    }

    describe('shown by period, with no transaction between its days', () => {
      let interestRow: TransactionListRow;

      beforeEach(() => {
        [interestRow] = interestRowsFor(INTEREST_MODE.byPeriod);
      });

      it('adds up every day in one row', () => {
        expect(interestRow.balanceChange).toBe(27);
      });

      it('counts the days interest was paid', () => {
        expect(interestRow.interestPeriod?.days).toBe(mockMonthOfInterest.length);
      });

      it('sits on the last day interest was paid', () => {
        expect(interestRow.day).toBe('2026-01-04');
      });
    });

    describe('shown by period, with a withdrawal between its days', () => {
      let interestRows: TransactionListRow[];

      beforeEach(() => {
        interestRows = rowsOfType(
          transactionListRowsFor(
            [...mockWalletDeposits, ...mockMonthOfInterest, mockBusyDayWithdrawal],
            INTEREST_MODE.byPeriod,
            mockMonthOfInterestLastDay
          ),
          TRANSACTION_TYPE.interest
        );
      });

      it('starts a new interest row after the withdrawal', () => {
        expect(interestRows.map((row) => row.day)).toEqual([
          mockMonthOfInterestLastDay,
          mockBusyDayWithdrawal.occurredAt,
        ]);
      });

      it('gives a single day of interest no period', () => {
        const singleDayRow = interestRows.find(
          (row) => row.day === mockBusyDayWithdrawal.occurredAt
        );

        expect(singleDayRow).toBeDefined();
        expect(singleDayRow).not.toHaveProperty('interestPeriod');
      });
    });

    it('lists every day on its own when shown daily', () => {
      expect(interestRowsFor(INTEREST_MODE.daily)).toHaveLength(mockMonthOfInterest.length);
    });

    it('keeps apart the months of two wallets it cannot name', () => {
      const mockUnnamedWalletsInterest = ['unlisted-wallet-a', 'unlisted-wallet-b'].map(
        (walletId) =>
          createMockTransaction({
            id: walletId,
            walletId,
            type: TRANSACTION_TYPE.interest,
            occurredAt: '2026-01-02',
          })
      );

      expect(interestRowsFor(INTEREST_MODE.byPeriod, mockUnnamedWalletsInterest)).toHaveLength(
        mockUnnamedWalletsInterest.length
      );
    });
  });

  describe('across the turn of a month', () => {
    const mockDecemberDeposit = createMockTransaction({
      id: 'december-deposit',
      occurredAt: '2025-12-30',
      createdAt: '2025-12-30T08:00:00.000Z',
    });
    const mockDecemberInterest = createMockTransaction({
      id: 'december-interest',
      type: TRANSACTION_TYPE.interest,
      amount: 9,
      occurredAt: '2025-12-31',
    });
    const mockTurnOfTheMonthTransactions = [
      mockDecemberDeposit,
      mockDecemberInterest,
      ...mockMonthOfInterest,
    ];
    const mockRows = transactionListRowsFor(
      mockTurnOfTheMonthTransactions,
      INTEREST_MODE.byPeriod,
      mockMonthOfInterestLastDay
    );

    it('ends an interest row with its month', () => {
      expect(rowsOfType(mockRows, TRANSACTION_TYPE.interest).map((row) => row.day)).toEqual([
        mockMonthOfInterestLastDay,
        mockDecemberInterest.occurredAt,
      ]);
    });

    it('adds up each month’s interest beside it', () => {
      const sections = monthSections(mockRows, mockTurnOfTheMonthTransactions);

      expect(sections.map((section) => section.interestEarned)).toEqual([27, 9]);
    });
  });

  it('groups rows under the month they happened in, newest month first', () => {
    const mockDecemberDeposit = createMockTransaction({
      id: 'december',
      occurredAt: '2025-12-31',
      createdAt: '2025-12-31T08:00:00.000Z',
    });
    const mockDeposits = [mockDecemberDeposit, mockOpeningDeposit];
    const rows = transactionListRowsFor(mockDeposits, INTEREST_MODE.byPeriod, '2026-01-01');

    expect(monthSections(rows, mockDeposits).map((section) => section.month)).toEqual([
      '2026-01',
      '2025-12',
    ]);
  });
});
