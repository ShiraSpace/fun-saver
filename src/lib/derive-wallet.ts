import type { Transaction, Wallet, WalletWithDerived } from './types';
import { balance, interestGain, principal, todayInterest } from './derivations';

export function deriveWallet(
  wallet: Wallet,
  txns: Transaction[],
  asOf: string
): WalletWithDerived {
  return {
    ...wallet,
    balance: balance(txns),
    principal: principal(txns),
    interestGain: interestGain(txns),
    todayInterest: todayInterest(txns, asOf),
  };
}
