import type { DataStore } from '@/db/data-store';
import type {
  Account,
  AccountWithDerivedWallets,
  WalletName,
  WalletWithDerived,
} from './types';
import { deriveWallet } from './derive-wallet';
import { addDailyInterest } from './interest';

const WALLET_ORDER: Record<WalletName, number> = {
  savings: 0,
  spending: 1,
  goodDeeds: 2,
};

export async function listAccountsWithWallets(
  store: DataStore,
  asOf: string
): Promise<AccountWithDerivedWallets[]> {
  const accounts = await store.listAccounts();

  return Promise.all(
    accounts.map(async (account) => ({
      ...account,
      wallets: await getWalletsForAccount(store, account, asOf),
    }))
  );
}

export async function getWalletsForAccount(
  store: DataStore,
  account: Account,
  asOf: string
): Promise<WalletWithDerived[]> {
  const derived = await Promise.all(
    account.wallets.map(async (wallet) => {
      const transactions = await store.listTransactionsByWallet(
        account.id,
        wallet.id
      );
      const accrued = addDailyInterest({
        wallet,
        transactions,
        asOf,
        accountId: account.id,
      });

      if (accrued.length > 0) {
        await store.insertTransactions(accrued);
      }

      const settledTransactions = [...transactions, ...accrued];

      return deriveWallet({ wallet, transactions: settledTransactions, asOf });
    })
  );

  return derived.sort((a, b) => WALLET_ORDER[a.name] - WALLET_ORDER[b.name]);
}
