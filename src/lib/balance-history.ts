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
  return entries.reduce<string | undefined>(
    (earliest, entry) =>
      earliest === undefined || entry.occurredAt < earliest
        ? entry.occurredAt
        : earliest,
    undefined
  );
}

function balanceChangeByDay(entries: LedgerEntry[]): Map<string, number> {
  const balanceChange = new Map<string, number>();

  for (const entry of entries) {
    balanceChange.set(
      entry.occurredAt,
      (balanceChange.get(entry.occurredAt) ?? 0) + signedAmount(entry)
    );
  }

  return balanceChange;
}

function runningBalance(days: string[], entries: LedgerEntry[]): number[] {
  const balanceChange = balanceChangeByDay(entries);
  const balances: number[] = [];
  let balance = 0;

  for (const day of days) {
    balance += balanceChange.get(day) ?? 0;
    balances.push(balance);
  }

  return balances;
}

function walletTransactions(
  name: WalletName,
  { wallets, entries }: BalanceHistoryInput
): LedgerEntry[] {
  const ids = new Set(
    wallets.filter((wallet) => wallet.name === name).map((wallet) => wallet.id)
  );

  return entries.filter((entry) => ids.has(entry.walletId));
}

function accountTotals(lines: WalletBalances, days: string[]): number[] {
  return days.map((_, index) =>
    WALLET_NAMES.reduce((sum, name) => sum + lines[name][index], 0)
  );
}

export function balanceHistory(input: BalanceHistoryInput): BalanceHistory {
  const start = firstTransactionDay(input.entries);
  const days = start === undefined ? [] : eachDayInclusive(start, input.asOf);
  const balanceOf = (name: WalletName): number[] =>
    runningBalance(days, walletTransactions(name, input));
  const wallets = {
    savings: balanceOf('savings'),
    spending: balanceOf('spending'),
    goodDeeds: balanceOf('goodDeeds'),
  };

  return { days, total: accountTotals(wallets, days), wallets };
}

export function balanceOverRange(
  history: BalanceHistory,
  rangeInDays: number
): BalanceHistory {
  const from = Math.max(0, history.days.length - 1 - rangeInDays);
  const fromRangeStart = <T>(values: T[]): T[] => values.slice(from);

  return {
    days: fromRangeStart(history.days),
    total: fromRangeStart(history.total),
    wallets: {
      savings: fromRangeStart(history.wallets.savings),
      spending: fromRangeStart(history.wallets.spending),
      goodDeeds: fromRangeStart(history.wallets.goodDeeds),
    },
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
