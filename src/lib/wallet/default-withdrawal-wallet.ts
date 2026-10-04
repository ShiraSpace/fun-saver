import { DEFAULT_WITHDRAWAL_WALLET_NAMES } from './constants';
import type { WalletSummary } from './types';

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
