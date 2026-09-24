import { DEFAULT_WALLETS } from './constants';
import { eachDayInclusive } from './dates';
import { signedAmount } from './derivations';
import type { LedgerEntry, Wallet, WalletName } from './types';

export type WalletBalances = Record<WalletName, number[]>;

export interface BalanceHistory {
  days: string[];
  total: number[];
  wallets: WalletBalances;
}

export interface BalanceHistoryInput {
  wallets: Pick<Wallet, 'id' | 'name'>[];
  entries: LedgerEntry[];
  asOf: string;
}

const WALLET_NAMES: readonly WalletName[] = DEFAULT_WALLETS.map(
  (wallet) => wallet.name
);

function firstTransactionDay(entries: LedgerEntry[]): string | undefined {
  const transactionDays = entries.map((entry) => entry.occurredAt).sort();

  return transactionDays[0];
}

function balanceChangeByDay(entries: LedgerEntry[]): Map<string, number> {
  const changeByDay = new Map<string, number>();

  for (const entry of entries) {
    const changeSoFar = changeByDay.get(entry.occurredAt) ?? 0;
    changeByDay.set(entry.occurredAt, changeSoFar + signedAmount(entry));
  }

  return changeByDay;
}

function runningBalance(days: string[], entries: LedgerEntry[]): number[] {
  const changeByDay = balanceChangeByDay(entries);
  const balances: number[] = [];
  let balance = 0;

  for (const day of days) {
    balance += changeByDay.get(day) ?? 0;
    balances.push(balance);
  }

  return balances;
}

function walletTransactions(
  name: WalletName,
  { wallets, entries }: BalanceHistoryInput
): LedgerEntry[] {
  const wallet = wallets.find((candidate) => candidate.name === name);

  return entries.filter((entry) => entry.walletId === wallet?.id);
}

function accountTotals(
  walletBalances: WalletBalances,
  days: string[]
): number[] {
  const totalOn = (dayIndex: number): number =>
    WALLET_NAMES.reduce(
      (total, name) => total + walletBalances[name][dayIndex],
      0
    );

  return days.map((_, dayIndex) => totalOn(dayIndex));
}

function perWallet(balancesOf: (name: WalletName) => number[]): WalletBalances {
  return {
    savings: balancesOf('savings'),
    spending: balancesOf('spending'),
    goodDeeds: balancesOf('goodDeeds'),
  };
}

export function balanceHistory(input: BalanceHistoryInput): BalanceHistory {
  const firstDay = firstTransactionDay(input.entries);
  const hasNoTransactions = firstDay === undefined;
  const days = hasNoTransactions ? [] : eachDayInclusive(firstDay, input.asOf);
  const wallets = perWallet((name) =>
    runningBalance(days, walletTransactions(name, input))
  );

  return { days, total: accountTotals(wallets, days), wallets };
}

export function balanceOverRange(
  history: BalanceHistory,
  rangeInDays: number
): BalanceHistory {
  const todayIndex = history.days.length - 1;
  const rangeStartIndex = Math.max(0, todayIndex - rangeInDays);
  const fromRangeStart = <T>(values: T[]): T[] => values.slice(rangeStartIndex);

  return {
    days: fromRangeStart(history.days),
    total: fromRangeStart(history.total),
    wallets: perWallet((name) => fromRangeStart(history.wallets[name])),
  };
}

function closingBalance(values: number[]): number {
  return values[values.length - 1] ?? 0;
}

function openingBalance(values: number[]): number {
  return values[0] ?? 0;
}

export function latestTotal(history: BalanceHistory): number {
  return closingBalance(history.total);
}

export function changeOverRange(range: BalanceHistory): number {
  return closingBalance(range.total) - openingBalance(range.total);
}

export function totalByDay(history: BalanceHistory): Map<string, number> {
  return new Map(history.days.map((day, index) => [day, history.total[index]]));
}
