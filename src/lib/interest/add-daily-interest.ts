import type { Transaction, Wallet } from '../types';
import { addDays, eachDayInclusive } from '../dates';
import { newId } from '../ids';
import { interestForDay } from './interest-for-day';

export interface AddDailyInterestParams {
  wallet: Wallet;
  transactions: Transaction[];
  asOf: string;
  accountId: string;
}

function balanceDelta(transaction: Transaction): number {
  return transaction.type === 'withdrawal'
    ? -transaction.amount
    : transaction.amount;
}

function settledThrough(wallet: Wallet, transactions: Transaction[]): string {
  return transactions
    .filter((transaction) => transaction.type === 'interest')
    .reduce(
      (latest, transaction) =>
        transaction.occurredAt > latest ? transaction.occurredAt : latest,
      wallet.lastInterestDate
    );
}

function openingBalance(transactions: Transaction[], firstDay: string): number {
  return transactions
    .filter((transaction) => transaction.occurredAt < firstDay)
    .reduce((balance, transaction) => balance + balanceDelta(transaction), 0);
}

function principalChangeByDay(
  transactions: Transaction[],
  firstDay: string
): Map<string, number> {
  const changeByDay = new Map<string, number>();

  for (const transaction of transactions) {
    if (transaction.type === 'interest' || transaction.occurredAt < firstDay) {
      continue;
    }

    const changeSoFar = changeByDay.get(transaction.occurredAt) ?? 0;
    changeByDay.set(
      transaction.occurredAt,
      changeSoFar + balanceDelta(transaction)
    );
  }

  return changeByDay;
}

export function addDailyInterest({
  wallet,
  transactions,
  asOf,
  accountId,
}: AddDailyInterestParams): Transaction[] {
  const firstUnsettledDay = addDays(settledThrough(wallet, transactions), 1);

  if (firstUnsettledDay > asOf || wallet.monthlyInterestRate === 0) {
    return [];
  }

  const principalChange = principalChangeByDay(transactions, firstUnsettledDay);
  const accruedInterest: Transaction[] = [];

  let balance = openingBalance(transactions, firstUnsettledDay);

  for (const day of eachDayInclusive(firstUnsettledDay, asOf)) {
    const interestForToday = interestForDay(
      balance,
      wallet.monthlyInterestRate
    );

    if (interestForToday > 0) {
      accruedInterest.push({
        id: newId(),
        walletId: wallet.id,
        accountId,
        type: 'interest',
        amount: interestForToday,
        occurredAt: day,
      });
      balance += interestForToday;
    }

    balance += principalChange.get(day) ?? 0;
  }

  return accruedInterest;
}
