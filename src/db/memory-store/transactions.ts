import type { Transaction } from '@/lib/transaction/types';
import type { TransactionRepository } from '../data-store';
import { inOrderOfOccurrence } from '../transaction-order';

export class MemoryTransactions implements TransactionRepository {
  private readonly transactions: Transaction[] = [];

  async insert(transactions: Transaction[]): Promise<void> {
    this.transactions.push(...transactions);
  }

  async listByWallet(
    accountId: string,
    walletId: string
  ): Promise<Transaction[]> {
    return inOrderOfOccurrence(
      this.transactions.filter(
        (transaction) =>
          transaction.accountId === accountId &&
          transaction.walletId === walletId
      )
    );
  }

  async listByAccount(accountId: string): Promise<Transaction[]> {
    return inOrderOfOccurrence(
      this.transactions.filter(
        (transaction) => transaction.accountId === accountId
      )
    );
  }
}
