import type { DataStore } from '@/db/data-store';
import type { Account, WalletName, WalletWithDerived } from './types';
import { deriveWallet } from './derive-wallet';

const WALLET_ORDER: Record<WalletName, number> = {
  savings: 0,
  spending: 1,
  goodDeeds: 2,
};

export async function getWalletsForAccount(
  store: DataStore,
  account: Account,
  asOf: string
): Promise<WalletWithDerived[]> {
  const derived = await Promise.all(
    account.wallets.map(async (wallet) => {
      const transactions = await store.listTransactionsByWallet(wallet.id);
      return deriveWallet(wallet, transactions, asOf);
    })
  );
  return derived.sort((a, b) => WALLET_ORDER[a.name] - WALLET_ORDER[b.name]);
}
