import type { Transaction, TransactionType, WalletWithDerived } from './types';
import { PERCENT_TOTAL } from './constants';

function sumOf(transactions: Transaction[], type: TransactionType): number {
  return transactions
    .filter((transaction) => transaction.type === type)
    .reduce((total, transaction) => total + transaction.amount, 0);
}

export function principal(transactions: Transaction[]): number {
  return sumOf(transactions, 'deposit') - sumOf(transactions, 'withdrawal');
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

export function walletShares(balances: number[]): number[] {
  const total = balances.reduce((sum, balance) => sum + balance, 0);

  if (total <= 0) {
    return balances.map(() => 0);
  }

  const exact = balances.map((balance) => (balance * PERCENT_TOTAL) / total);
  const shares = exact.map((share) => Math.floor(share));
  const missing = PERCENT_TOTAL - shares.reduce((sum, share) => sum + share, 0);
  const byRemainder = exact
    .map((share, index) => ({ index, remainder: share % 1 }))
    .sort((a, b) => b.remainder - a.remainder);

  for (const { index } of byRemainder.slice(0, missing)) {
    shares[index] += 1;
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
