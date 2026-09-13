import type { Account, AccountUser } from '@/lib/types';
import type { AccountRepository, AccountUserRepository } from '../data-store';
import { accountsForUser, findAccountUser } from '../account-users';

export class MemoryAccountUsers implements AccountUserRepository {
  private readonly accountUsers: AccountUser[] = [];

  constructor(private readonly accounts: AccountRepository) {}

  async get(
    accountId: string,
    userId: string
  ): Promise<AccountUser | undefined> {
    return findAccountUser(this.accountUsers, accountId, userId);
  }

  async listAccountsForUser(userId: string): Promise<Account[]> {
    return accountsForUser(
      this.accountUsers,
      await this.accounts.list(),
      userId
    );
  }
}
