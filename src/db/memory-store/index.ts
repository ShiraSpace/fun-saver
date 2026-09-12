import type { Account, AccountEdits, Transaction } from '@/lib/types';
import type { ThemeId } from '@/theme/registry';
import type { DataStore } from '../data-store';
import { MemoryAccounts } from './accounts';
import { MemoryTransactions } from './transactions';

export class InMemoryStore implements DataStore {
  private readonly accounts = new MemoryAccounts();
  private readonly transactions = new MemoryTransactions();

  insertAccount(account: Account): Promise<void> {
    return this.accounts.insert(account);
  }

  listAccounts(): Promise<Account[]> {
    return this.accounts.list();
  }

  getAccount(id: string): Promise<Account | undefined> {
    return this.accounts.get(id);
  }

  setAccountTheme(id: string, themeId: ThemeId): Promise<Account | undefined> {
    return this.accounts.setTheme(id, themeId);
  }

  updateAccount(id: string, edits: AccountEdits): Promise<Account | undefined> {
    return this.accounts.update(id, edits);
  }

  insertTransactions(transactions: Transaction[]): Promise<void> {
    return this.transactions.insert(transactions);
  }

  listTransactionsByWallet(
    accountId: string,
    walletId: string
  ): Promise<Transaction[]> {
    return this.transactions.listByWallet(accountId, walletId);
  }
}
