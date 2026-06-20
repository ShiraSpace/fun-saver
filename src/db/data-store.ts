import type { Account } from '../lib/types';

export interface DataStore {
  insertAccount(account: Account): Promise<void>;
}
