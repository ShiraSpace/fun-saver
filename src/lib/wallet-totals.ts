import type { Transaction, TransactionType, WalletSummary } from './types';
import { PERCENT_TOTAL, TRANSACTION_TYPE } from './constants';

function totalAmount(
  transactions: Transaction[],
  type: TransactionType
): number {
  return transactions
    .filter((transaction) => transaction.type === type)
    .reduce((total, transaction) => total + transaction.amount, 0);
}

function deposited(transactions: Transaction[]): number {
  return totalAmount(transactions, TRANSACTION_TYPE.deposit);
}

export function balanceChange(
  transaction: Pick<Transaction, 'type' | 'amount'>
): number {
  return transaction.type === TRANSACTION_TYPE.withdrawal
    ? -transaction.amount
    : transaction.amount;
}

export function withdrawn(transactions: Transaction[]): number {
  return totalAmount(transactions, TRANSACTION_TYPE.withdrawal);
}

export function principal(transactions: Transaction[]): number {
  return deposited(transactions) - withdrawn(transactions);
}

export function interestEarned(transactions: Transaction[]): number {
  return totalAmount(transactions, TRANSACTION_TYPE.interest);
}

export function balance(transactions: Transaction[]): number {
  return principal(transactions) + interestEarned(transactions);
}

export function totalBalance(
  wallets: Pick<WalletSummary, 'balance'>[]
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

function walletIndexesRoundedDownMost(exactShares: number[]): number[] {
  return exactShares
    .map((share, walletIndex) => ({ walletIndex, lostToRounding: share % 1 }))
    .sort((a, b) => b.lostToRounding - a.lostToRounding)
    .map(({ walletIndex }) => walletIndex);
}

export function walletShares(balances: number[]): number[] {
  const total = balances.reduce((sum, balance) => sum + balance, 0);

  if (total <= 0) {
    return noShare(balances);
  }

  const exactShares = exactShareOfTotal(balances, total);
  const shares = exactShares.map((share) => Math.floor(share));
  const unclaimedPoints = pointsLostToRounding(shares);
  const walletIndexesOwedAPoint = walletIndexesRoundedDownMost(
    exactShares
  ).slice(0, unclaimedPoints);

  for (const walletIndex of walletIndexesOwedAPoint) {
    shares[walletIndex] += 1;
  }

  return shares;
}

export function interestEarnedToday(
  transactions: Transaction[],
  asOf: string
): number {
  return transactions
    .filter(
      (transaction) =>
        transaction.type === TRANSACTION_TYPE.interest &&
        transaction.occurredAt === asOf
    )
    .reduce((total, transaction) => total + transaction.amount, 0);
}
