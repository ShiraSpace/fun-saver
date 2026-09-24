import type { Transaction, Wallet, WalletSummary } from './types';
import {
  balance,
  interestEarned,
  principal,
  interestEarnedToday,
  withdrawn,
} from './wallet-totals';

export interface SummarizeWalletParams {
  wallet: Wallet;
  transactions: Transaction[];
  asOf: string;
}

export function summarizeWallet({
  wallet,
  transactions,
  asOf,
}: SummarizeWalletParams): WalletSummary {
  return {
    ...wallet,
    balance: balance(transactions),
    principal: principal(transactions),
    withdrawn: withdrawn(transactions),
    interestEarned: interestEarned(transactions),
    interestEarnedToday: interestEarnedToday(transactions, asOf),
  };
}
