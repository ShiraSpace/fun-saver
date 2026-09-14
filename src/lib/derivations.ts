import type { Transaction, TransactionType, WalletWithDerived } from './types';
import { PERCENT_TOTAL } from './constants';

function sumOf(transactions: Transaction[], type: TransactionType): number {
  return transactions
    .filter((transaction) => transaction.type === type)
    .reduce((total, transaction) => total + transaction.amount, 0);
}

export function deposits(transactions: Transaction[]): number {
  return sumOf(transactions, 'deposit');
}

export function withdrawals(transactions: Transaction[]): number {
  return sumOf(transactions, 'withdrawal');
}

export function principal(transactions: Transaction[]): number {
  return deposits(transactions) - withdrawals(transactions);
}

export function interestGain(transactions: Transaction[]): number {
  return sumOf(transactions, 'interest');
}

export function balance(transactions: Transaction[]): number {
  return principal(transactions) + interestGain(transactions);
}

export function totalBalance(
  wallets: Pick<WalletWithDerived, 'balance'>[]
): number {
  return wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
}

function noShare(balances: number[]): number[] {
  return balances.map(() => 0);
}

function exactShareOfTotal(balances: number[], total: number): number[] {
  return balances.map((balance) => (balance * PERCENT_TOTAL) / total);
}

function pointsLostToRounding(roundedShares: number[]): number {
  return PERCENT_TOTAL - roundedShares.reduce((sum, share) => sum + share, 0);
}

function walletsRoundedDownMost(exactShares: number[]): number[] {
  return exactShares
    .map((share, wallet) => ({ wallet, lostToRounding: share % 1 }))
    .sort((a, b) => b.lostToRounding - a.lostToRounding)
    .map(({ wallet }) => wallet);
}

export function walletShares(balances: number[]): number[] {
  const total = balances.reduce((sum, balance) => sum + balance, 0);

  if (total <= 0) {
    return noShare(balances);
  }

  const exactShares = exactShareOfTotal(balances, total);
  const shares = exactShares.map((share) => Math.floor(share));
  const unclaimedPoints = pointsLostToRounding(shares);
  const walletsOwedAPoint = walletsRoundedDownMost(exactShares).slice(
    0,
    unclaimedPoints
  );

  for (const wallet of walletsOwedAPoint) {
    shares[wallet] += 1;
  }

  return shares;
}

export function todayInterest(
  transactions: Transaction[],
  asOf: string
): number {
  return transactions
    .filter(
      (transaction) =>
        transaction.type === 'interest' && transaction.occurredAt === asOf
    )
    .reduce((total, transaction) => total + transaction.amount, 0);
}
