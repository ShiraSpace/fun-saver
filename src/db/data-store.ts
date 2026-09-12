import type { Account, Transaction } from '@/lib/types';
import type { ThemeId } from '@/theme/registry';

export interface StoreData {
  accounts: Account[];
  transactions: Transaction[];
}

export type BuildGuardedTransaction = (
  walletTransactions: Transaction[]
) => Transaction;

export interface GuardedTransactionInput {
  accountId: string;
  walletId: string;
  build: BuildGuardedTransaction;
}

export interface DataStore {
  insertAccount(account: Account): Promise<void>;
  listAccounts(): Promise<Account[]>;
  getAccount(id: string): Promise<Account | undefined>;
  setAccountTheme(id: string, themeId: ThemeId): Promise<Account | undefined>;
  insertTransactions(transactions: Transaction[]): Promise<void>;
  listTransactionsByWallet(
    accountId: string,
    walletId: string
  ): Promise<Transaction[]>;
  insertTransactionWithGuard(
    input: GuardedTransactionInput
  ): Promise<Transaction>;
}
