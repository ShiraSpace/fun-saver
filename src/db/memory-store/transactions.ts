import type { Transaction } from '@/lib/transaction/types';
import type { TransactionRepository } from '../data-store';
import { inOrderOfOccurrence } from '../transaction-order';
import { withoutInterestAlreadySettled } from '../settled-interest';

export class MemoryTransactions implements TransactionRepository {
  private readonly transactions: Transaction[] = [];

  async insert(transactions: Transaction[]): Promise<void> {
    this.transactions.push(
      ...withoutInterestAlreadySettled(this.transactions, transactions)
    );
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
