import type { Transaction } from '@/lib/types';
import type { TransactionRepository } from '../data-store';
import { byOccurrence } from '../transactions';
import type { FileSession } from './file-session';

export class JsonTransactions implements TransactionRepository {
  constructor(private readonly session: FileSession) {}

  insert(transactions: Transaction[]): Promise<void> {
    return this.session.write(async (data, save): Promise<void> => {
      data.transactions.push(...transactions);
      await save();
    });
  }

  listByWallet(accountId: string, walletId: string): Promise<Transaction[]> {
    return this.session.read((data): Transaction[] =>
      byOccurrence(
        data.transactions.filter(
          (transaction) =>
            transaction.accountId === accountId &&
            transaction.walletId === walletId
        )
      )
    );
  }

  listByAccount(accountId: string): Promise<Transaction[]> {
    return this.session.read((data): Transaction[] =>
      byOccurrence(
        data.transactions.filter(
          (transaction) => transaction.accountId === accountId
        )
      )
    );
  }
}
