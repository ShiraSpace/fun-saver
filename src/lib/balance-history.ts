import { DEFAULT_WALLETS } from './constants';
import { eachDayInclusive } from './dates';
import { balanceChange } from './wallet-totals';
import type { Transaction, Wallet, WalletName } from './types';

export type WalletBalances = Record<WalletName, number[]>;

export interface BalanceHistory {
  days: string[];
  totalBalance: number[];
  wallets: WalletBalances;
}

export interface BalanceHistoryInput {
  wallets: Pick<Wallet, 'id' | 'name'>[];
  transactions: Pick<
    Transaction,
    'walletId' | 'type' | 'amount' | 'occurredAt'
  >[];
  asOf: string;
}

const WALLET_NAMES: readonly WalletName[] = DEFAULT_WALLETS.map(
  (wallet) => wallet.name
);

function firstTransactionDay(
  transactions: Pick<Transaction, 'occurredAt'>[]
): string | undefined {
  const transactionDays = transactions
    .map((transaction) => transaction.occurredAt)
    .sort();

  return transactionDays[0];
}

function dailyBalanceChanges(
  transactions: Pick<Transaction, 'type' | 'amount' | 'occurredAt'>[]
): Map<string, number> {
  const balanceChangeByDay = new Map<string, number>();

  for (const transaction of transactions) {
    const day = transaction.occurredAt;
    const changeSoFar = balanceChangeByDay.get(day) ?? 0;
    balanceChangeByDay.set(day, changeSoFar + balanceChange(transaction));
  }

  return balanceChangeByDay;
}

function runningBalance(
  days: string[],
  transactions: BalanceHistoryInput['transactions']
): number[] {
  const balanceChangeByDay = dailyBalanceChanges(transactions);
  const balances: number[] = [];
  let balance = 0;

  for (const day of days) {
    balance += balanceChangeByDay.get(day) ?? 0;
    balances.push(balance);
  }

  return balances;
}

function walletTransactions(
  walletName: WalletName,
  { wallets, transactions }: BalanceHistoryInput
): BalanceHistoryInput['transactions'] {
  const wallet = wallets.find((candidate) => candidate.name === walletName);

  return transactions.filter(
    (transaction) => transaction.walletId === wallet?.id
  );
}

function totalBalances(
  walletBalances: WalletBalances,
  days: string[]
): number[] {
  const totalBalanceOn = (dayIndex: number): number =>
    WALLET_NAMES.reduce(
      (totalBalance, walletName) =>
        totalBalance + walletBalances[walletName][dayIndex],
      0
    );

  return days.map((_, dayIndex) => totalBalanceOn(dayIndex));
}

function perWallet(
  balancesOf: (walletName: WalletName) => number[]
): WalletBalances {
  return {
    savings: balancesOf('savings'),
    spending: balancesOf('spending'),
    goodDeeds: balancesOf('goodDeeds'),
  };
}

export function balanceHistory(input: BalanceHistoryInput): BalanceHistory {
  const firstDay = firstTransactionDay(input.transactions);
  const hasNoTransactions = firstDay === undefined;
  const days = hasNoTransactions ? [] : eachDayInclusive(firstDay, input.asOf);
  const wallets = perWallet((walletName) =>
    runningBalance(days, walletTransactions(walletName, input))
  );

  return { days, totalBalance: totalBalances(wallets, days), wallets };
}

function carriedInDayIndex(
  history: BalanceHistory,
  rangeInDays: number
): number {
  const todayIndex = history.days.length - 1;

  return todayIndex - rangeInDays;
}

export function balanceOverRange(
  history: BalanceHistory,
  rangeInDays: number
): BalanceHistory {
  const rangeStartIndex = Math.max(0, carriedInDayIndex(history, rangeInDays));
  const fromRangeStart = <T>(values: T[]): T[] => values.slice(rangeStartIndex);

  return {
    days: fromRangeStart(history.days),
    totalBalance: fromRangeStart(history.totalBalance),
    wallets: perWallet((walletName) =>
      fromRangeStart(history.wallets[walletName])
    ),
  };
}

function closingBalance(values: number[]): number {
  return values[values.length - 1] ?? 0;
}

export function todaysTotalBalance(history: BalanceHistory): number {
  return closingBalance(history.totalBalance);
}

export function totalBalanceChange(
  history: BalanceHistory,
  rangeInDays: number
): number {
  const carriedInDay = carriedInDayIndex(history, rangeInDays);
  const accountIsYoungerThanRange = carriedInDay < 0;
  const carriedInTotalBalance = accountIsYoungerThanRange
    ? 0
    : history.totalBalance[carriedInDay];

  return todaysTotalBalance(history) - carriedInTotalBalance;
}

export function totalBalanceByDay(
  history: BalanceHistory
): Map<string, number> {
  return new Map(
    history.days.map((day, dayIndex) => [day, history.totalBalance[dayIndex]])
  );
}
