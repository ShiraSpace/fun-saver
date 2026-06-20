import type { Account } from '../lib/types';
import type { DataStore } from './data-store';

export class InMemoryStore implements DataStore {
  private readonly accounts: Account[] = [];

  async insertAccount(account: Account): Promise<void> {
    this.accounts.push(account);
  }
}
