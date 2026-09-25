import {
  totalBalanceByDay,
  type BalanceHistory,
} from '@/lib/wallet/balance-history';
import { INTEREST_MODE, TRANSACTION_TYPE } from '../constants';
import type { TransactionListRow } from '../transaction-rows';
import { balanceChange } from '@/lib/wallet/balance';
import {
  createMockTransaction,
  mockOpeningDeposit,
} from '@/test-utils/mocks/transaction.mocks';
import { createMockWallets } from '@/test-utils/mocks/wallet.mocks';
import {
  balanceHistoryFor,
  closingBalances,
  rowsOfType,
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
        INTEREST_MODE.monthly,
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
      INTEREST_MODE.monthly,
      '2026-01-02'
    );

    expect(rows.map((row) => row.day)).toEqual(['2026-01-02', '2026-01-01']);
  });

  describe('a day with a deposit, a withdrawal and interest', () => {
    let rows: TransactionListRow[];
    let busyDayBalanceHistory: BalanceHistory;

    function busyDayRows(): TransactionListRow[] {
      return rows.filter((row) => row.day === mockBusyDay);
    }

    beforeEach(() => {
      rows = transactionListRowsFor(
        mockBusyDayTransactions,
        INTEREST_MODE.monthly,
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
      const [withdrawalRow] = rowsOfType(rows, TRANSACTION_TYPE.withdrawal);
      const busyDayDepositRow = rowsOfType(rows, TRANSACTION_TYPE.deposit).find(
        (row) => row.day === mockBusyDay
      );

      expect(withdrawalRow.balance).toBe(busyDayDepositRow?.balance);
    });

    it.each(Object.values(INTEREST_MODE))(
      'shows interest on the balance from before that day’s deposit and withdrawal, when shown %s',
      (interestMode) => {
        const [interestRow] = rowsOfType(
          transactionListRowsFor(
            mockBusyDayTransactions,
            interestMode,
            mockBusyDay
          ),
          TRANSACTION_TYPE.interest
        );
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
      const [withdrawalRow] = rowsOfType(rows, TRANSACTION_TYPE.withdrawal);

      expect(withdrawalRow.balanceChange).toBe(
        balanceChange(mockBusyDayWithdrawal)
      );
    });

    it('names the wallet a withdrawal came out of', () => {
      const [withdrawalRow] = rowsOfType(rows, TRANSACTION_TYPE.withdrawal);
      const withdrawalWallet = createMockWallets().find(
        (wallet) => wallet.id === mockBusyDayWithdrawal.walletId
      );

      expect(withdrawalRow.walletName).toBe(withdrawalWallet?.name);
    });
  });

  it('has nothing to list for an account with no transactions', () => {
    expect(
      transactionListRowsFor([], INTEREST_MODE.monthly, '2026-01-01')
    ).toEqual([]);
  });
});
