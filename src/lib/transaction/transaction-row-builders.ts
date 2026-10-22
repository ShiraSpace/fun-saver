import { calendarMonth } from '@/lib/dates';
import { TRANSACTION_TYPE } from './constants';
import { balanceChange } from '@/lib/wallet/balance';
import type {
  InterestPeriod,
  ListedTransaction,
  TransactionListRow,
  TransactionListRowsInput,
} from './transaction-rows';
import type { Transaction, TransactionType } from './types';
import type { WalletName } from '@/lib/wallet/types';

export type TransactionListRowWithoutBalance = Omit<TransactionListRow, 'balance'>;
export type WalletNameById = Map<string, WalletName>;
type InterestPeriodRow = TransactionListRowWithoutBalance & { interestPeriod: InterestPeriod };

export function walletNamesById(wallets: TransactionListRowsInput['wallets']): WalletNameById {
  return new Map(wallets.map((wallet) => [wallet.id, wallet.name]));
}

export function isInterest({ type }: Pick<Transaction, 'type'>): boolean {
  return type === TRANSACTION_TYPE.interest;
}

function transactionsOfType(
  transactions: ListedTransaction[],
  type: TransactionType
): ListedTransaction[] {
  return transactions.filter((transaction) => transaction.type === type);
}

function combinedByKey<Row extends TransactionListRowWithoutBalance>(
  rows: Row[],
  combine: (combinedRow: Row, row: Row) => Row
): Row[] {
  const combinedRowByKey = new Map<string, Row>();

  for (const row of rows) {
    const rowSoFar = combinedRowByKey.get(row.key);
    const combinedRow = rowSoFar ? combine(rowSoFar, row) : row;
    combinedRowByKey.set(row.key, combinedRow);
  }

  return [...combinedRowByKey.values()];
}

export function depositRows(transactions: ListedTransaction[]): TransactionListRowWithoutBalance[] {
  const walletDeposits = transactionsOfType(transactions, TRANSACTION_TYPE.deposit);
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
  const withdrawals = transactionsOfType(transactions, TRANSACTION_TYPE.withdrawal);

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
  const dailyInterest = transactionsOfType(transactions, TRANSACTION_TYPE.interest);

  return dailyInterest.map((transaction) => dailyInterestRow(transaction, walletNameById));
}

function depositAndWithdrawalDays(transactions: ListedTransaction[]): string[] {
  const days = transactions
    .filter((transaction) => !isInterest(transaction))
    .map((transaction) => transaction.occurredAt);

  return [...new Set(days)].sort();
}

function interestPeriodEnd(interestDay: string, periodEndDays: string[]): string {
  const month = calendarMonth(interestDay);
  const nextDepositOrWithdrawalDay = periodEndDays.find((day) => day >= interestDay);
  const periodEndsWithinTheMonth =
    nextDepositOrWithdrawalDay !== undefined && calendarMonth(nextDepositOrWithdrawalDay) === month;

  return periodEndsWithinTheMonth ? nextDepositOrWithdrawalDay : month;
}

function withoutSingleDayPeriod({
  interestPeriod,
  ...row
}: InterestPeriodRow): TransactionListRowWithoutBalance {
  const coversSeveralDays = interestPeriod.days > 1;

  return coversSeveralDays ? { ...row, interestPeriod } : row;
}

export function interestPeriodRows(
  transactions: ListedTransaction[],
  walletNameById: WalletNameById
): TransactionListRowWithoutBalance[] {
  const periodEndDays = depositAndWithdrawalDays(transactions);
  const dailyInterest = transactionsOfType(transactions, TRANSACTION_TYPE.interest);
  const dailyRows: InterestPeriodRow[] = dailyInterest.map((transaction) => ({
    ...dailyInterestRow(transaction, walletNameById),
    key: `interest:${transaction.walletId}:${interestPeriodEnd(transaction.occurredAt, periodEndDays)}`,
    interestPeriod: { firstDay: transaction.occurredAt, days: 1 },
  }));

  const periodRows = combinedByKey(dailyRows, (periodRow, dailyRow) => ({
    ...periodRow,
    balanceChange: periodRow.balanceChange + dailyRow.balanceChange,
    interestPeriod: {
      firstDay:
        dailyRow.day < periodRow.interestPeriod.firstDay
          ? dailyRow.day
          : periodRow.interestPeriod.firstDay,
      days: periodRow.interestPeriod.days + 1,
    },
    day: dailyRow.day > periodRow.day ? dailyRow.day : periodRow.day,
  }));

  return periodRows.map(withoutSingleDayPeriod);
}
