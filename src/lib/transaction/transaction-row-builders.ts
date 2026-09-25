import { calendarMonth } from '@/lib/dates';
import { TRANSACTION_TYPE } from './constants';
import { balanceChange } from '@/lib/wallet/balance';
import type {
  ListedTransaction,
  TransactionListRow,
  TransactionListRowsInput,
} from './transaction-rows';
import type { TransactionType } from './types';
import type { WalletName } from '@/lib/wallet/types';

export type TransactionListRowWithoutBalance = Omit<
  TransactionListRow,
  'balance'
>;
export type WalletNameById = Map<string, WalletName>;

export function walletNamesById(
  wallets: TransactionListRowsInput['wallets']
): WalletNameById {
  return new Map(wallets.map((wallet) => [wallet.id, wallet.name]));
}

function transactionsOfType(
  transactions: ListedTransaction[],
  type: TransactionType
): ListedTransaction[] {
  return transactions.filter((transaction) => transaction.type === type);
}

function combinedByKey(
  rows: TransactionListRowWithoutBalance[],
  combine: (
    combinedRow: TransactionListRowWithoutBalance,
    row: TransactionListRowWithoutBalance
  ) => TransactionListRowWithoutBalance
): TransactionListRowWithoutBalance[] {
  const combinedRowByKey = new Map<string, TransactionListRowWithoutBalance>();

  for (const row of rows) {
    const rowSoFar = combinedRowByKey.get(row.key);
    const combinedRow = rowSoFar ? combine(rowSoFar, row) : row;
    combinedRowByKey.set(row.key, combinedRow);
  }

  return [...combinedRowByKey.values()];
}

export function depositRows(
  transactions: ListedTransaction[]
): TransactionListRowWithoutBalance[] {
  const walletDeposits = transactionsOfType(
    transactions,
    TRANSACTION_TYPE.deposit
  );
  const walletDepositRows = walletDeposits.map((transaction) => ({
    key: `deposit:${transaction.createdAt}`,
    type: TRANSACTION_TYPE.deposit,
    day: transaction.occurredAt,
    balanceChange: balanceChange(transaction),
    createdAt: transaction.createdAt,
  }));

  return combinedByKey(walletDepositRows, (depositRow, walletDepositRow) => ({
    ...depositRow,
    balanceChange: depositRow.balanceChange + walletDepositRow.balanceChange,
  }));
}

export function withdrawalRows(
  transactions: ListedTransaction[],
  walletNameById: WalletNameById
): TransactionListRowWithoutBalance[] {
  const withdrawals = transactionsOfType(
    transactions,
    TRANSACTION_TYPE.withdrawal
  );

  return withdrawals.map((transaction) => ({
    key: `withdrawal:${transaction.walletId}:${transaction.createdAt}`,
    type: TRANSACTION_TYPE.withdrawal,
    walletName: walletNameById.get(transaction.walletId),
    day: transaction.occurredAt,
    balanceChange: balanceChange(transaction),
    createdAt: transaction.createdAt,
  }));
}

function dailyInterestRow(
  transaction: ListedTransaction,
  walletNameById: WalletNameById
): TransactionListRowWithoutBalance {
  return {
    key: `interest:${transaction.walletId}:${transaction.occurredAt}`,
    type: TRANSACTION_TYPE.interest,
    walletName: walletNameById.get(transaction.walletId),
    day: transaction.occurredAt,
    balanceChange: balanceChange(transaction),
    createdAt: transaction.createdAt,
  };
}

export function dailyInterestRows(
  transactions: ListedTransaction[],
  walletNameById: WalletNameById
): TransactionListRowWithoutBalance[] {
  const dailyInterest = transactionsOfType(
    transactions,
    TRANSACTION_TYPE.interest
  );

  return dailyInterest.map((transaction) =>
    dailyInterestRow(transaction, walletNameById)
  );
}

export function monthlyInterestRows(
  transactions: ListedTransaction[],
  walletNameById: WalletNameById
): TransactionListRowWithoutBalance[] {
  const dailyInterest = transactionsOfType(
    transactions,
    TRANSACTION_TYPE.interest
  );
  const dailyRows = dailyInterest.map((transaction) => ({
    ...dailyInterestRow(transaction, walletNameById),
    key: `interest:${transaction.walletId}:${calendarMonth(transaction.occurredAt)}`,
    interestDays: 1,
  }));

  return combinedByKey(dailyRows, (monthlyRow, dailyRow) => {
    const interestDaysSoFar = monthlyRow.interestDays ?? 0;
    const lastInterestDay =
      dailyRow.day > monthlyRow.day ? dailyRow.day : monthlyRow.day;

    return {
      ...monthlyRow,
      balanceChange: monthlyRow.balanceChange + dailyRow.balanceChange,
      interestDays: interestDaysSoFar + 1,
      day: lastInterestDay,
    };
  });
}
