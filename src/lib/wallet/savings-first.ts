import type { Wallet } from './types';
import { WALLET_NAMES } from './constants';
import { walletNamed } from './wallet-named';

export function savingsFirst<Candidate extends Pick<Wallet, 'name'>>(
  wallets: readonly Candidate[]
): Candidate[] {
  const savings = walletNamed(wallets, WALLET_NAMES.savings);
  const otherWallets = wallets.filter(
    (wallet) => wallet.name !== WALLET_NAMES.savings
  );

  return savings ? [savings, ...otherWallets] : otherWallets;
}
