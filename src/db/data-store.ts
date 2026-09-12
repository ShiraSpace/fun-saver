import type { Account, AccountEdits, Transaction } from '@/lib/types';
import type { ThemeId } from '@/theme/registry';

export interface StoreData {
  accounts: Account[];
  transactions: Transaction[];
}

export interface AccountRepository {
  insert(account: Account): Promise<void>;
  list(): Promise<Account[]>;
  get(id: string): Promise<Account | undefined>;
  setTheme(id: string, themeId: ThemeId): Promise<Account | undefined>;
  update(id: string, edits: AccountEdits): Promise<Account | undefined>;
}

export interface TransactionRepository {
  insert(transactions: Transaction[]): Promise<void>;
  listByWallet(accountId: string, walletId: string): Promise<Transaction[]>;
}

export interface DataStore {
  insertAccount(account: Account): Promise<void>;
  listAccounts(): Promise<Account[]>;
  getAccount(id: string): Promise<Account | undefined>;
  setAccountTheme(id: string, themeId: ThemeId): Promise<Account | undefined>;
  updateAccount(id: string, edits: AccountEdits): Promise<Account | undefined>;
  insertTransactions(transactions: Transaction[]): Promise<void>;
  listTransactionsByWallet(
    accountId: string,
    walletId: string
  ): Promise<Transaction[]>;
}
