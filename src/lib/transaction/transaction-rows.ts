import { totalBalanceByDay, type BalanceHistory } from '@/lib/wallet/balance-history';
import { calendarMonth } from '@/lib/dates';
import { interestEarned } from '@/lib/wallet/balance';
import {
  dailyInterestRows,
  depositRows,
  interestPeriodRows,
  isInterest,
  walletNamesById,
  withdrawalRows,
  type TransactionListRowWithoutBalance,
} from './transaction-row-builders';
import { ALL_TRANSACTION_TYPES, INTEREST_MODE } from './constants';
import type { Transaction, TransactionType } from './types';
import type { Wallet, WalletName } from '@/lib/wallet/types';

export type InterestMode = (typeof INTEREST_MODE)[keyof typeof INTEREST_MODE];
export type TransactionTypeFilter = typeof ALL_TRANSACTION_TYPES | TransactionType;

export interface InterestPeriod {
  firstDay: string;
  days: number;
}

export interface TransactionListRow {
  key: string;
  type: TransactionType;
  walletName?: WalletName;
  day: string;
  balanceChange: number;
  balance: number;
  interestPeriod?: InterestPeriod;
  createdAt: string;
}

export interface MonthSection {
  month: string;
  rows: TransactionListRow[];
  interestEarned: number;
}

export interface TransactionListRowsInput {
  transactions: Omit<Transaction, 'id' | 'accountId'>[];
  wallets: Pick<Wallet, 'id' | 'name'>[];
  balanceHistory: BalanceHistory;
  interestMode: InterestMode;
}

export type ListedTransaction = TransactionListRowsInput['transactions'][number];

function withBalances(
  rowsNewestFirst: TransactionListRowWithoutBalance[],
  balanceHistory: BalanceHistory
): TransactionListRow[] {
  const endOfDayTotalBalanceByDay = totalBalanceByDay(balanceHistory);
  const rowsWithBalances: TransactionListRow[] = [];

  for (const row of rowsNewestFirst) {
    const newerRow = rowsWithBalances.at(-1);
    const balance =
      newerRow?.day === row.day
        ? newerRow.balance - newerRow.balanceChange
        : (endOfDayTotalBalanceByDay.get(row.day) ?? 0);

    rowsWithBalances.push({ ...row, balance });
  }

  return rowsWithBalances;
}

function interestRank(row: TransactionListRowWithoutBalance): number {
  return isInterest(row) ? 1 : 0;
}

function newestFirst(
  a: TransactionListRowWithoutBalance,
  b: TransactionListRowWithoutBalance
): number {
  const newerDayFirst = b.day.localeCompare(a.day);
  const interestLastWithinADay = interestRank(a) - interestRank(b);
  const laterCreatedFirst = b.createdAt.localeCompare(a.createdAt);

  return newerDayFirst || interestLastWithinADay || laterCreatedFirst;
}

export function transactionListRows(input: TransactionListRowsInput): TransactionListRow[] {
  const walletNameById = walletNamesById(input.wallets);
  const listsEveryInterestDay = input.interestMode === INTEREST_MODE.daily;
  const interestRows = listsEveryInterestDay ? dailyInterestRows : interestPeriodRows;

  const rows = [
    ...depositRows(input.transactions),
    ...withdrawalRows(input.transactions, walletNameById),
    ...interestRows(input.transactions, walletNameById),
  ];

  return withBalances(rows.sort(newestFirst), input.balanceHistory);
}

export function filterByTransactionType(
  rows: TransactionListRow[],
  transactionTypeFilter: TransactionTypeFilter
): TransactionListRow[] {
  const listsEveryType = transactionTypeFilter === ALL_TRANSACTION_TYPES;

  return listsEveryType ? rows : rows.filter((row) => row.type === transactionTypeFilter);
}

function interestEarnedIn(month: string, transactions: ListedTransaction[]): number {
  const transactionsThatMonth = transactions.filter(
    (transaction) => calendarMonth(transaction.occurredAt) === month
  );

  return interestEarned(transactionsThatMonth);
}

export function monthSections(
  rows: TransactionListRow[],
  transactions: ListedTransaction[]
): MonthSection[] {
  const sections: MonthSection[] = [];

  for (const row of rows) {
    const month = calendarMonth(row.day);
    const currentSection = sections[sections.length - 1];
    const belongsToCurrentSection = currentSection?.month === month;

    if (belongsToCurrentSection) {
      currentSection.rows.push(row);
    } else {
      sections.push({ month, rows: [row], interestEarned: interestEarnedIn(month, transactions) });
    }
  }

  return sections;
}
