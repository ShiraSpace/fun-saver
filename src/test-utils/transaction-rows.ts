import {
  balanceHistory,
  totalBalanceByDay,
  type BalanceHistory,
} from '@/lib/balance-history';
import {
  transactionListRows,
  type InterestMode,
  type TransactionListRow,
} from '@/lib/transaction-rows';
import type { Transaction } from '@/lib/types';
import { createMockWallets } from './mocks/general.mocks';

export function balanceHistoryFor(
  transactions: Transaction[],
  asOf: string
): BalanceHistory {
  return balanceHistory({ wallets: createMockWallets(), transactions, asOf });
}

export function transactionListRowsFor(
  transactions: Transaction[],
  interestMode: InterestMode,
  asOf: string
): TransactionListRow[] {
  return transactionListRows({
    transactions,
    wallets: createMockWallets(),
    balanceHistory: balanceHistoryFor(transactions, asOf),
    interestMode,
  });
}

export function closingBalances(
  rows: TransactionListRow[],
  accountBalanceHistory: BalanceHistory
): (number | undefined)[] {
  const endOfDayTotalBalance = totalBalanceByDay(accountBalanceHistory);

  return rows.map((row) => endOfDayTotalBalance.get(row.day));
}
