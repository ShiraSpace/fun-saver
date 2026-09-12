import type { Transaction } from '@/lib/types';
import type { TransactionRepository } from '../data-store';

export class MemoryTransactions implements TransactionRepository {
  private readonly transactions: Transaction[] = [];

  async insert(transactions: Transaction[]): Promise<void> {
    this.transactions.push(...transactions);
  }

  async listByWallet(
    accountId: string,
    walletId: string
  ): Promise<Transaction[]> {
    return this.transactions.filter(
      (transaction) =>
        transaction.accountId === accountId && transaction.walletId === walletId
    );
  }
}
