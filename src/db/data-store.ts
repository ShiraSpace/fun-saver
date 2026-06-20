import type { Account, Transaction, Wallet } from '../lib/types';

export interface StoreData {
  accounts: Account[];
  wallets: Wallet[];
  transactions: Transaction[];
}

export interface DataStore {
  insertAccount(account: Account): Promise<void>;
  listAccounts(): Promise<Account[]>;
  insertWallet(wallet: Wallet): Promise<void>;
  listWalletsByAccount(accountId: string): Promise<Wallet[]>;
  insertTransactions(transactions: Transaction[]): Promise<void>;
  listTransactionsByWallet(walletId: string): Promise<Transaction[]>;
}
