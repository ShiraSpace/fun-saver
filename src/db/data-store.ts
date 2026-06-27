import type { Account, Transaction } from '@/lib/types';
import type { ThemeId } from '@/theme/registry';

export interface StoreData {
  accounts: Account[];
  transactions: Transaction[];
}

export interface DataStore {
  insertAccount(account: Account): Promise<void>;
  listAccounts(): Promise<Account[]>;
  getAccount(id: string): Promise<Account | undefined>;
  setAccountTheme(id: string, themeId: ThemeId): Promise<void>;
  insertTransactions(transactions: Transaction[]): Promise<void>;
  listTransactionsByWallet(walletId: string): Promise<Transaction[]>;
}
