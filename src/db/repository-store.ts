import type { Account, AccountEdits, AccountUser } from '@/lib/account/types';
import type { AuthProvider, User } from '@/lib/types';
import type { Transaction } from '@/lib/transaction/types';
import type { ThemeId } from '@/theme/registry';
import type {
  AccountOwner,
  AccountRepository,
  AccountUserRepository,
  DataStore,
  TransactionRepository,
  UserRepository,
} from './data-store';

export class RepositoryStore implements DataStore {
  constructor(
    private readonly accounts: AccountRepository,
    private readonly transactions: TransactionRepository,
    private readonly users: UserRepository,
    private readonly accountUsers: AccountUserRepository
  ) {}

  insertAccount(account: Account): Promise<void> {
    return this.accounts.insert(account);
  }

  getAccount(id: string): Promise<Account | undefined> {
    return this.accounts.get(id);
  }

  setAccountTheme(id: string, themeId: ThemeId): Promise<Account | undefined> {
    return this.accounts.setTheme(id, themeId);
  }

  updateAccount(
    accountId: string,
    edits: AccountEdits
  ): Promise<Account | undefined> {
    return this.accounts.update(accountId, edits);
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

  listTransactionsByAccount(accountId: string): Promise<Transaction[]> {
    return this.transactions.listByAccount(accountId);
  }

  findUserByIdentity(
    provider: AuthProvider,
    providerAccountId: string
  ): Promise<User | undefined> {
    return this.users.findByIdentity(provider, providerAccountId);
  }

  insertUser(user: User): Promise<void> {
    return this.users.insert(user);
  }

  getAccountUser(
    accountId: string,
    userId: string
  ): Promise<AccountUser | undefined> {
    return this.accountUsers.get(accountId, userId);
  }

  listAccountsForUser(userId: string): Promise<Account[]> {
    return this.accountUsers.listAccountsForUser(userId);
  }

  insertAccountWithOwner(account: Account, owner: AccountOwner): Promise<void> {
    return this.accountUsers.insertAccountWithOwner(account, owner);
  }
}
