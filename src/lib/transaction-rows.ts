import { totalBalanceByDay, type BalanceHistory } from './balance-history';
import { calendarMonth } from './dates';
import {
  dailyInterestRows,
  depositRows,
  monthlyInterestRows,
  walletNamesById,
  withdrawalRows,
  type TransactionListRowWithoutBalance,
} from './transaction-row-builders';
import { balanceChange } from './wallet-totals';
import { TRANSACTION_TYPE } from './constants';
import type { Transaction, TransactionType, Wallet, WalletName } from './types';

export type InterestMode = 'monthly' | 'daily';
export type TransactionTypeFilter = 'all' | TransactionType;

export interface TransactionListRow {
  key: string;
  type: TransactionType;
  walletName?: WalletName;
  day: string;
  balanceChange: number;
  balance: number;
  interestDays?: number;
  createdAt: string;
}

export interface MonthSection {
  month: string;
  rows: TransactionListRow[];
}

export interface TransactionListRowsInput {
  transactions: Omit<Transaction, 'id' | 'accountId'>[];
  wallets: Pick<Wallet, 'id' | 'name'>[];
  balanceHistory: BalanceHistory;
  interestMode: InterestMode;
}

type ListedTransaction = TransactionListRowsInput['transactions'][number];

function isInterest({ type }: Pick<Transaction, 'type'>): boolean {
  return type === TRANSACTION_TYPE.interest;
}

function dailyDepositsAndWithdrawals(
  transactions: ListedTransaction[]
): Map<string, number> {
  const depositsAndWithdrawalsByDay = new Map<string, number>();
  const depositsAndWithdrawals = transactions.filter(
    (transaction) => !isInterest(transaction)
  );

  for (const transaction of depositsAndWithdrawals) {
    const day = transaction.occurredAt;
    const balanceChangeSoFar = depositsAndWithdrawalsByDay.get(day) ?? 0;
    depositsAndWithdrawalsByDay.set(
      day,
      balanceChangeSoFar + balanceChange(transaction)
    );
  }

  return depositsAndWithdrawalsByDay;
}

function withBalances(
  rows: TransactionListRowWithoutBalance[],
  input: TransactionListRowsInput
): TransactionListRow[] {
  const endOfDayTotalBalanceByDay = totalBalanceByDay(input.balanceHistory);
  const depositsAndWithdrawalsByDay = dailyDepositsAndWithdrawals(
    input.transactions
  );

  return rows.map((row) => {
    const endOfDayTotalBalance = endOfDayTotalBalanceByDay.get(row.day) ?? 0;
    const depositsAndWithdrawalsThatDay =
      depositsAndWithdrawalsByDay.get(row.day) ?? 0;
    const balanceChangeLaterThatDay = isInterest(row)
      ? depositsAndWithdrawalsThatDay
      : 0;

    return {
      ...row,
      balance: endOfDayTotalBalance - balanceChangeLaterThatDay,
    };
  });
}

function interestRank(row: TransactionListRow): number {
  return isInterest(row) ? 1 : 0;
}

function newestFirst(a: TransactionListRow, b: TransactionListRow): number {
  const newerDayFirst = b.day.localeCompare(a.day);
  const interestLastWithinADay = interestRank(a) - interestRank(b);
  const laterCreatedFirst = b.createdAt.localeCompare(a.createdAt);

  return newerDayFirst || interestLastWithinADay || laterCreatedFirst;
}

export function transactionListRows(
  input: TransactionListRowsInput
): TransactionListRow[] {
  const walletNameById = walletNamesById(input.wallets);
  const listsEveryInterestDay = input.interestMode === 'daily';
  const interestRows = listsEveryInterestDay
    ? dailyInterestRows
    : monthlyInterestRows;

  const rows = [
    ...depositRows(input.transactions),
    ...withdrawalRows(input.transactions, walletNameById),
    ...interestRows(input.transactions, walletNameById),
  ];

  return withBalances(rows, input).sort(newestFirst);
}

export function filterByTransactionType(
  rows: TransactionListRow[],
  transactionTypeFilter: TransactionTypeFilter
): TransactionListRow[] {
  const listsEveryType = transactionTypeFilter === 'all';

  return listsEveryType
    ? rows
    : rows.filter((row) => row.type === transactionTypeFilter);
}

export function monthSections(rows: TransactionListRow[]): MonthSection[] {
  const sections: MonthSection[] = [];

  for (const row of rows) {
    const month = calendarMonth(row.day);
    const currentSection = sections[sections.length - 1];
    const belongsToCurrentSection = currentSection?.month === month;

    if (belongsToCurrentSection) {
      currentSection.rows.push(row);
    } else {
      sections.push({ month, rows: [row] });
    }
  }

  return sections;
}
