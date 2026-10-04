import type { Account, AccountEdits, AccountUser } from '@/lib/account/types';
import type { AuthProvider, User } from '@/lib/user/types';
import type { Transaction } from '@/lib/transaction/types';
import type { ThemeId } from '@/theme/registry';
import type { Goal, GoalEndRequest } from '@/lib/goal/types';
import type { ViewMode } from '@/lib/account/view-mode';
import type {
  AccountOwner,
  AccountRepository,
  AccountUserRepository,
  DataStore,
  GoalRepository,
  TransactionRepository,
  UserRepository,
} from './data-store';

export class RepositoryStore implements DataStore {
  constructor(
    private readonly accounts: AccountRepository,
    private readonly transactions: TransactionRepository,
    private readonly users: UserRepository,
    private readonly accountUsers: AccountUserRepository,
    private readonly goals: GoalRepository
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

  setAccountViewMode(
    id: string,
    viewMode: ViewMode
  ): Promise<Account | undefined> {
    return this.accounts.setViewMode(id, viewMode);
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

  insertGoal(goal: Goal): Promise<void> {
    return this.goals.insert(goal);
  }

  getActiveGoal(accountId: string): Promise<Goal | undefined> {
    return this.goals.getActive(accountId);
  }

  endGoal(endRequest: GoalEndRequest): Promise<Goal | undefined> {
    return this.goals.end(endRequest);
  }

  insertWithdrawalCompletingGoal(
    withdrawal: Transaction,
    goalId: string
  ): Promise<void> {
    return this.goals.insertWithdrawalCompleting(withdrawal, goalId);
  }
}
