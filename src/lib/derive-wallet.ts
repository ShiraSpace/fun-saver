import type { Transaction, Wallet, WalletWithDerived } from './types';
import { balance, interestGain, principal, todayInterest } from './derivations';

export interface DeriveWalletParams {
  wallet: Wallet;
  transactions: Transaction[];
  asOf: string;
}

export function deriveWallet({
  wallet,
  transactions,
  asOf,
}: DeriveWalletParams): WalletWithDerived {
  return {
    ...wallet,
    balance: balance(transactions),
    principal: principal(transactions),
    interestGain: interestGain(transactions),
    todayInterest: todayInterest(transactions, asOf),
  };
}
