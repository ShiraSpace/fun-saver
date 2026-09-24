import { TRANSACTION_TYPE } from '../constants';
import {
  filterByTransactionType,
  monthSections,
  type TransactionListRow,
} from '../transaction-rows';
import {
  createMockTransaction,
  mockOpeningDeposit,
} from '@/test-utils/mocks/general.mocks';
import {
  balanceHistoryFor,
  closingBalances,
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
        'monthly',
        mockBusyDay
      );
    });

    it('shows every row under הכל', () => {
      expect(filterByTransactionType(rows, 'all')).toEqual(rows);
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

  it('groups rows under the month they happened in, newest month first', () => {
    const mockDecemberDeposit = createMockTransaction({
      id: 'december',
      occurredAt: '2025-12-31',
      createdAt: '2025-12-31T08:00:00.000Z',
    });
    const rows = transactionListRowsFor(
      [mockDecemberDeposit, mockOpeningDeposit],
      'monthly',
      '2026-01-01'
    );

    expect(monthSections(rows).map((section) => section.month)).toEqual([
      '2026-01',
      '2025-12',
    ]);
  });
});
