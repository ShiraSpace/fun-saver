import type { DataStore } from '@/db/data-store';
import type { WalletName, WalletWithDerived } from './types';
import { deriveWallet } from './derive-wallet';

const WALLET_ORDER: Record<WalletName, number> = {
  savings: 0,
  spending: 1,
  goodDeeds: 2,
};

export async function getWalletsForAccount(
  store: DataStore,
  accountId: string,
  asOf: string
): Promise<WalletWithDerived[]> {
  const wallets = await store.listWalletsByAccount(accountId);
  const derived = await Promise.all(
    wallets.map(async (wallet) => {
      const txns = await store.listTransactionsByWallet(wallet.id);
      return deriveWallet(wallet, txns, asOf);
    })
  );
  return derived.sort((a, b) => WALLET_ORDER[a.name] - WALLET_ORDER[b.name]);
}
