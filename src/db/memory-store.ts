import type { Account, Transaction } from '../lib/types';
import type { ThemeId } from '@/theme/registry';
import type { BuildGuardedTransaction, DataStore } from './data-store';

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

  async setAccountTheme(
    id: string,
    themeId: ThemeId
  ): Promise<Account | undefined> {
    const account = this.accounts.find((candidate) => candidate.id === id);

    if (!account) {
      return;
    }

    account.themeId = themeId;

    return account;
  }

  async insertTransactions(transactions: Transaction[]): Promise<void> {
    this.transactions.push(...transactions);
  }

  async listTransactionsByWallet(walletId: string): Promise<Transaction[]> {
    return this.transactions.filter(
      (transaction) => transaction.walletId === walletId
    );
  }

  async insertTransactionWithGuard(
    walletId: string,
    build: BuildGuardedTransaction
  ): Promise<Transaction> {
    const walletTransactions = this.transactions.filter(
      (transaction) => transaction.walletId === walletId
    );

    const transaction = build(walletTransactions);
    this.transactions.push(transaction);

    return transaction;
  }
}
