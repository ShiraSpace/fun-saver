import type { Account } from '../lib/types';

export interface StoreData {
  accounts: Account[];
}

export interface DataStore {
  insertAccount(account: Account): Promise<void>;
  listAccounts(): Promise<Account[]>;
}
