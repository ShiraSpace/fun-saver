import { totalBalanceByDay, type BalanceHistory } from '../balance-history';
import { TRANSACTION_TYPE } from '../constants';
import type { InterestMode, TransactionListRow } from '../transaction-rows';
import type { Transaction } from '../types';
import { balanceChange } from '../wallet-totals';
import {
  createMockTransaction,
  createMockWallets,
  mockOpeningDeposit,
} from '@/test-utils/mocks/general.mocks';
import {
  balanceHistoryFor,
  closingBalances,
  transactionListRowsFor,
} from '@/test-utils/transaction-rows';
import {
  mockBusyDay,
  mockBusyDayDeposit,
  mockBusyDayTransactions,
  mockBusyDayWithdrawal,
} from '@/test-utils/mocks/transaction.mocks';

describe('the transaction list rows', () => {
  describe('a deposit that lands in three wallets', () => {
    let rows: TransactionListRow[];

    beforeEach(() => {
      const mockWalletDeposits = createMockWallets().map((wallet, index) =>
        createMockTransaction({
          id: `deposit-${wallet.name}`,
          walletId: wallet.id,
          amount: 100 * (index + 1),
          createdAt: mockOpeningDeposit.createdAt,
        })
      );

      rows = transactionListRowsFor(
        mockWalletDeposits,
        'monthly',
        '2026-01-01'
      );
    });

    it('is listed as one deposit', () => {
      expect(rows.map((row) => row.type)).toEqual([TRANSACTION_TYPE.deposit]);
    });

    it('adds up what every wallet received', () => {
      expect(rows[0].balanceChange).toBe(600);
    });

    it('names no wallet, since it went into all three', () => {
      expect(rows[0]).not.toHaveProperty('walletName');
    });
  });

  it('keeps two deposits on different days apart', () => {
    const mockNextDayDeposit = createMockTransaction({
      id: 'next-day',
      occurredAt: '2026-01-02',
      createdAt: '2026-01-02T08:00:00.000Z',
    });

    const rows = transactionListRowsFor(
      [mockOpeningDeposit, mockNextDayDeposit],
      'monthly',
      '2026-01-02'
    );

    expect(rows.map((row) => row.day)).toEqual(['2026-01-02', '2026-01-01']);
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

    function interestRowsFor(interestMode: InterestMode): TransactionListRow[] {
      return transactionListRowsFor(
        [mockOpeningDeposit, ...mockMonthOfInterest],
        interestMode,
        '2026-01-04'
      ).filter((row) => row.type === TRANSACTION_TYPE.interest);
    }

    describe('shown monthly', () => {
      let interestRow: TransactionListRow;

      beforeEach(() => {
        [interestRow] = interestRowsFor('monthly');
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
      expect(interestRowsFor('daily')).toHaveLength(mockMonthOfInterest.length);
    });
  });

  describe('a day with a deposit, a withdrawal and interest', () => {
    let rows: TransactionListRow[];
    let busyDayBalanceHistory: BalanceHistory;

    function rowsOfType(type: Transaction['type']): TransactionListRow[] {
      return rows.filter((row) => row.type === type);
    }

    function busyDayRows(): TransactionListRow[] {
      return rows.filter((row) => row.day === mockBusyDay);
    }

    beforeEach(() => {
      rows = transactionListRowsFor(
        mockBusyDayTransactions,
        'monthly',
        mockBusyDay
      );
      busyDayBalanceHistory = balanceHistoryFor(
        mockBusyDayTransactions,
        mockBusyDay
      );
    });

    it('shows the balance the day closed on beside a deposit or a withdrawal', () => {
      const depositAndWithdrawalRows = rows.filter(
        (row) => row.type !== TRANSACTION_TYPE.interest
      );

      expect(depositAndWithdrawalRows.map((row) => row.balance)).toEqual(
        closingBalances(depositAndWithdrawalRows, busyDayBalanceHistory)
      );
    });

    it('gives a deposit and a withdrawal on the same day the same balance', () => {
      const [withdrawalRow] = rowsOfType(TRANSACTION_TYPE.withdrawal);
      const busyDayDepositRow = rowsOfType(TRANSACTION_TYPE.deposit).find(
        (row) => row.day === mockBusyDay
      );

      expect(withdrawalRow.balance).toBe(busyDayDepositRow?.balance);
    });

    it.each(['monthly', 'daily'] as const)(
      'shows interest on the balance from before that day’s deposit and withdrawal, when shown %s',
      (interestMode) => {
        const [interestRow] = transactionListRowsFor(
          mockBusyDayTransactions,
          interestMode,
          mockBusyDay
        ).filter((row) => row.type === TRANSACTION_TYPE.interest);
        const busyDayClosingBalance =
          totalBalanceByDay(busyDayBalanceHistory).get(mockBusyDay) ?? 0;
        const busyDayBalanceChange =
          balanceChange(mockBusyDayDeposit) +
          balanceChange(mockBusyDayWithdrawal);

        expect(interestRow.balance).toBe(
          busyDayClosingBalance - busyDayBalanceChange
        );
      }
    );

    it('puts that day’s interest below its deposit and withdrawal', () => {
      expect(busyDayRows().at(-1)?.type).toBe(TRANSACTION_TYPE.interest);
    });

    it('puts the later of two transactions on the same day first', () => {
      const busyDayTypes = busyDayRows().map((row) => row.type);

      expect(busyDayTypes.slice(0, 2)).toEqual([
        TRANSACTION_TYPE.withdrawal,
        TRANSACTION_TYPE.deposit,
      ]);
    });

    it('shows a withdrawal as money going out', () => {
      const [withdrawalRow] = rowsOfType(TRANSACTION_TYPE.withdrawal);

      expect(withdrawalRow.balanceChange).toBe(
        balanceChange(mockBusyDayWithdrawal)
      );
    });

    it('names the wallet a withdrawal came out of', () => {
      const [withdrawalRow] = rowsOfType(TRANSACTION_TYPE.withdrawal);

      expect(withdrawalRow.walletName).toBe('spending');
    });
  });

  it('has nothing to list for an account with no transactions', () => {
    expect(transactionListRowsFor([], 'monthly', '2026-01-01')).toEqual([]);
  });
});
