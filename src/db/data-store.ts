import type { Account, Transaction } from '@/lib/types';
import type { ThemeId } from '@/theme/registry';

export interface StoreData {
  accounts: Account[];
  transactions: Transaction[];
}

export type BuildGuardedTransaction = (
  walletTransactions: Transaction[]
) => Transaction;

export interface DataStore {
  insertAccount(account: Account): Promise<void>;
  listAccounts(): Promise<Account[]>;
  getAccount(id: string): Promise<Account | undefined>;
  setAccountTheme(id: string, themeId: ThemeId): Promise<Account | undefined>;
  insertTransactions(transactions: Transaction[]): Promise<void>;
  listTransactionsByWallet(walletId: string): Promise<Transaction[]>;
  insertTransactionWithGuard(
    walletId: string,
    build: BuildGuardedTransaction
  ): Promise<Transaction>;
}
