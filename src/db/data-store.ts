import type {
  Account,
  AccountEdits,
  AccountUser,
  AuthProvider,
  Transaction,
  User,
} from '@/lib/types';
import type { ThemeId } from '@/theme/registry';

export interface StoreData {
  accounts: Account[];
  transactions: Transaction[];
  users: User[];
  accountUsers: AccountUser[];
}

export interface AccountRepository {
  insert(account: Account): Promise<void>;
  list(): Promise<Account[]>;
  get(id: string): Promise<Account | undefined>;
  setTheme(id: string, themeId: ThemeId): Promise<Account | undefined>;
  update(id: string, edits: AccountEdits): Promise<Account | undefined>;
}

export interface TransactionRepository {
  insert(transactions: Transaction[]): Promise<void>;
  listByWallet(accountId: string, walletId: string): Promise<Transaction[]>;
  listByAccount(accountId: string): Promise<Transaction[]>;
}

export interface UserRepository {
  findByProvider(
    provider: AuthProvider,
    providerAccountId: string
  ): Promise<User | undefined>;
  insert(user: User): Promise<void>;
}

export interface AccountOwner {
  userId: string;
  addedAt: string;
}

export interface AccountUserRepository {
  get(accountId: string, userId: string): Promise<AccountUser | undefined>;
  listAccountsForUser(userId: string): Promise<Account[]>;
  insertAccountWithOwner(account: Account, owner: AccountOwner): Promise<void>;
}

export interface DataStore {
  insertAccount(account: Account): Promise<void>;
  getAccount(id: string): Promise<Account | undefined>;
  setAccountTheme(id: string, themeId: ThemeId): Promise<Account | undefined>;
  updateAccount(id: string, edits: AccountEdits): Promise<Account | undefined>;
  insertTransactions(transactions: Transaction[]): Promise<void>;
  listTransactionsByWallet(
    accountId: string,
    walletId: string
  ): Promise<Transaction[]>;
  listTransactionsByAccount(accountId: string): Promise<Transaction[]>;
  findUserByProvider(
    provider: AuthProvider,
    providerAccountId: string
  ): Promise<User | undefined>;
  insertUser(user: User): Promise<void>;
  getAccountUser(
    accountId: string,
    userId: string
  ): Promise<AccountUser | undefined>;
  listAccountsForUser(userId: string): Promise<Account[]>;
  insertAccountWithOwner(account: Account, owner: AccountOwner): Promise<void>;
}
