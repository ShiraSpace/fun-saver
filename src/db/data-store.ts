import type { Account, Transaction } from '../lib/types';

export interface StoreData {
  accounts: Account[];
  transactions: Transaction[];
}

export interface DataStore {
  insertAccount(account: Account): Promise<void>;
  listAccounts(): Promise<Account[]>;
  getAccount(id: string): Promise<Account | undefined>;
  insertTransactions(transactions: Transaction[]): Promise<void>;
  listTransactionsByWallet(walletId: string): Promise<Transaction[]>;
}
