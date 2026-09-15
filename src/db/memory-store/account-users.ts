import type { Account, AccountUser } from '@/lib/types';
import { UnknownOwnerError } from '@/lib/errors';
import type {
  AccountOwner,
  AccountRepository,
  AccountUserRepository,
} from '../data-store';
import {
  accountsForUser,
  findAccountUser,
  ownerAccountUser,
} from '../account-users';
import type { MemoryUsers } from './users';

export class MemoryAccountUsers implements AccountUserRepository {
  private readonly accountUsers: AccountUser[] = [];

  constructor(
    private readonly accounts: AccountRepository,
    private readonly users: MemoryUsers
  ) {}

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

  async insertAccountWithOwner(
    account: Account,
    owner: AccountOwner
  ): Promise<void> {
    const ownerIsKnownUser = this.users.isKnown(owner.userId);

    if (!ownerIsKnownUser) {
      throw new UnknownOwnerError(owner.userId);
    }

    await this.accounts.insert(account);
    this.accountUsers.push(ownerAccountUser(account.id, owner));
  }
}
