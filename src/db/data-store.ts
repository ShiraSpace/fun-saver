import type {
  Account,
  AccountEdits,
  AuthProvider,
  Transaction,
  User,
} from '@/lib/types';
import type { ThemeId } from '@/theme/registry';

export interface StoreData {
  accounts: Account[];
  transactions: Transaction[];
  users: User[];
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
}

export interface UserRepository {
  findByProvider(
    provider: AuthProvider,
    providerAccountId: string
  ): Promise<User | undefined>;
  /** Throws `DuplicateUserError` if the provider identity already has a user. */
  insert(user: User): Promise<void>;
}

export interface DataStore {
  insertAccount(account: Account): Promise<void>;
  listAccounts(): Promise<Account[]>;
  getAccount(id: string): Promise<Account | undefined>;
  setAccountTheme(id: string, themeId: ThemeId): Promise<Account | undefined>;
  updateAccount(id: string, edits: AccountEdits): Promise<Account | undefined>;
  insertTransactions(transactions: Transaction[]): Promise<void>;
  listTransactionsByWallet(
    accountId: string,
    walletId: string
  ): Promise<Transaction[]>;
  findUserByProvider(
    provider: AuthProvider,
    providerAccountId: string
  ): Promise<User | undefined>;
  insertUser(user: User): Promise<void>;
}
