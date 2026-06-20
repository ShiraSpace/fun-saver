import type { Account, Transaction, Wallet } from '../lib/types';
import type { DataStore } from './data-store';

export class InMemoryStore implements DataStore {
  private readonly accounts: Account[] = [];
  private readonly wallets: Wallet[] = [];
  private readonly transactions: Transaction[] = [];

  async insertAccount(account: Account): Promise<void> {
    this.accounts.push(account);
  }

  async listAccounts(): Promise<Account[]> {
    return [...this.accounts];
  }

  async insertWallet(wallet: Wallet): Promise<void> {
    this.wallets.push(wallet);
  }

  async listWalletsByAccount(accountId: string): Promise<Wallet[]> {
    return this.wallets.filter((wallet) => wallet.accountId === accountId);
  }

  async insertTransactions(transactions: Transaction[]): Promise<void> {
    this.transactions.push(...transactions);
  }

  async listTransactionsByWallet(walletId: string): Promise<Transaction[]> {
    return this.transactions.filter((txn) => txn.walletId === walletId);
  }
}
