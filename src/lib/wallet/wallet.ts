import type { Transaction } from '@/lib/transaction/types';
import { withoutAgorot } from '@/lib/money';
import type { Wallet, WalletName, WalletSummary } from './types';
import { DEFAULT_WITHDRAWAL_WALLET_NAMES, WALLET_NAMES } from './constants';
import {
  balance,
  interestEarned,
  principal,
  interestEarnedToday,
  withdrawn,
} from './balance';

type NamedWallet<Candidate, Name extends WalletName> = Candidate & {
  name: Name;
};

export function walletNamed<
  Candidate extends Pick<Wallet, 'name'>,
  Name extends WalletName,
>(
  wallets: readonly Candidate[],
  name: Name
): NamedWallet<Candidate, Name> | undefined {
  return wallets.find(
    (wallet): wallet is NamedWallet<Candidate, Name> => wallet.name === name
  );
}

export function savingsFirst<Candidate extends Pick<Wallet, 'name'>>(
  wallets: readonly Candidate[]
): Candidate[] {
  const savings = walletNamed(wallets, WALLET_NAMES.savings);
  const otherWallets = wallets.filter(
    (wallet) => wallet.name !== WALLET_NAMES.savings
  );

  return savings ? [savings, ...otherWallets] : otherWallets;
}

export function defaultWithdrawalWallet(
  wallets: WalletSummary[]
): WalletSummary | undefined {
  const withdrawalCandidates = DEFAULT_WITHDRAWAL_WALLET_NAMES.flatMap(
    (walletName) => wallets.filter((wallet) => wallet.name === walletName)
  );

  return (
    withdrawalCandidates.find((wallet) => wallet.balance > 0) ??
    withdrawalCandidates[0]
  );
}

export interface SavingsWithoutAgorot {
  balance: number;
  principal: number;
  interestEarned: number;
}

export function savingsWithoutAgorot(
  savings: Pick<WalletSummary, 'balance' | 'interestEarned'>
): SavingsWithoutAgorot {
  const balanceWithoutAgorot = withoutAgorot(savings.balance);
  const interestEarnedWithoutAgorot = Math.min(
    withoutAgorot(savings.interestEarned),
    balanceWithoutAgorot
  );

  return {
    balance: balanceWithoutAgorot,
    principal: balanceWithoutAgorot - interestEarnedWithoutAgorot,
    interestEarned: interestEarnedWithoutAgorot,
  };
}

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
