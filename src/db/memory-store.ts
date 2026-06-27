import type { Account, Transaction } from '../lib/types';
import type { ThemeId } from '@/theme/registry';
import type { DataStore } from './data-store';

export class InMemoryStore implements DataStore {
  private readonly accounts: Account[] = [];
  private readonly transactions: Transaction[] = [];

  async insertAccount(account: Account): Promise<void> {
    this.accounts.push(account);
  }

  async listAccounts(): Promise<Account[]> {
    return [...this.accounts];
  }

  async getAccount(id: string): Promise<Account | undefined> {
    return this.accounts.find((account) => account.id === id);
  }

  async setAccountTheme(id: string, themeId: ThemeId): Promise<void> {
    const account = this.accounts.find((candidate) => candidate.id === id);

    if (account) {
      account.themeId = themeId;
    }
  }

  async insertTransactions(transactions: Transaction[]): Promise<void> {
    this.transactions.push(...transactions);
  }

  async listTransactionsByWallet(walletId: string): Promise<Transaction[]> {
    return this.transactions.filter(
      (transaction) => transaction.walletId === walletId
    );
  }
}
