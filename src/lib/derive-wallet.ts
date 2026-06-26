import type { Transaction, Wallet, WalletWithDerived } from './types';
import { balance, interestGain, principal, todayInterest } from './derivations';

export function deriveWallet(
  wallet: Wallet,
  transactions: Transaction[],
  asOf: string
): WalletWithDerived {
  return {
    ...wallet,
    balance: balance(transactions),
    principal: principal(transactions),
    interestGain: interestGain(transactions),
    todayInterest: todayInterest(transactions, asOf),
  };
}
