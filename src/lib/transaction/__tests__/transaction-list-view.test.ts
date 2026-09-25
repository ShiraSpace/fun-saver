import {
  ALL_TRANSACTION_TYPES,
  INTEREST_MODE,
  TRANSACTION_TYPE,
} from '../constants';
import {
  filterByTransactionType,
  monthSections,
  type InterestMode,
  type TransactionListRow,
} from '../transaction-rows';
import type { Transaction } from '../types';
import {
  createMockTransaction,
  mockOpeningDeposit,
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
} from '@/test-utils/mocks/transaction.mocks';

describe('what the transaction list shows', () => {
  describe('filtered by type', () => {
    let rows: TransactionListRow[];

    beforeEach(() => {
      rows = transactionListRowsFor(
        mockBusyDayTransactions,
        INTEREST_MODE.monthly,
        mockBusyDay
      );
    });

    it('shows every row under הכל', () => {
      expect(filterByTransactionType(rows, ALL_TRANSACTION_TYPES)).toEqual(
        rows
      );
    });

    it('shows only withdrawals under משיכות', () => {
      const withdrawalRows = filterByTransactionType(
        rows,
        TRANSACTION_TYPE.withdrawal
      );

      expect(withdrawalRows.map((row) => row.type)).toEqual([
        TRANSACTION_TYPE.withdrawal,
      ]);
    });

    it('keeps each row’s true balance', () => {
      const withdrawalRows = filterByTransactionType(
        rows,
        TRANSACTION_TYPE.withdrawal
      );
      const busyDayBalanceHistory = balanceHistoryFor(
        mockBusyDayTransactions,
        mockBusyDay
      );

      expect(withdrawalRows.map((row) => row.balance)).toEqual(
        closingBalances(withdrawalRows, busyDayBalanceHistory)
      );
    });
  });

  describe('a month of interest', () => {
    const mockMonthOfInterest = ['2026-01-02', '2026-01-03', '2026-01-04'].map(
      (occurredAt) =>
        createMockTransaction({
          id: occurredAt,
          type: TRANSACTION_TYPE.interest,
          amount: 9,
          occurredAt,
        })
    );

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

    describe('shown monthly', () => {
      let interestRow: TransactionListRow;

      beforeEach(() => {
        [interestRow] = interestRowsFor(INTEREST_MODE.monthly);
      });

      it('adds up the whole month in one row', () => {
        expect(interestRow.balanceChange).toBe(27);
      });

      it('counts the days interest was paid', () => {
        expect(interestRow.interestDays).toBe(mockMonthOfInterest.length);
      });

      it('sits on the last day interest was paid', () => {
        expect(interestRow.day).toBe('2026-01-04');
      });
    });

    it('lists every day on its own when shown daily', () => {
      expect(interestRowsFor(INTEREST_MODE.daily)).toHaveLength(
        mockMonthOfInterest.length
      );
    });

    it('keeps apart the months of two wallets it cannot name', () => {
      const mockUnnamedWalletsInterest = [
        'unlisted-wallet-a',
        'unlisted-wallet-b',
      ].map((walletId) =>
        createMockTransaction({
          id: walletId,
          walletId,
          type: TRANSACTION_TYPE.interest,
          occurredAt: '2026-01-02',
        })
      );

      expect(
        interestRowsFor(INTEREST_MODE.monthly, mockUnnamedWalletsInterest)
      ).toHaveLength(mockUnnamedWalletsInterest.length);
    });
  });

  it('groups rows under the month they happened in, newest month first', () => {
    const mockDecemberDeposit = createMockTransaction({
      id: 'december',
      occurredAt: '2025-12-31',
      createdAt: '2025-12-31T08:00:00.000Z',
    });
    const rows = transactionListRowsFor(
      [mockDecemberDeposit, mockOpeningDeposit],
      INTEREST_MODE.monthly,
      '2026-01-01'
    );

    expect(monthSections(rows).map((section) => section.month)).toEqual([
      '2026-01',
      '2025-12',
    ]);
  });
});
