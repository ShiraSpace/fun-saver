import type { Account, AccountUser } from '@/lib/types';
import type { AccountOwner, AccountUserRepository } from '../data-store';
import {
  accountsForUser,
  findAccountUser,
  ownerAccountUser,
} from '../account-users';
import type { FileSession } from './file-session';

export class JsonAccountUsers implements AccountUserRepository {
  constructor(private readonly session: FileSession) {}

  get(accountId: string, userId: string): Promise<AccountUser | undefined> {
    return this.session.read((data): AccountUser | undefined =>
      findAccountUser(data.accountUsers, accountId, userId)
    );
  }

  listAccountsForUser(userId: string): Promise<Account[]> {
    return this.session.read((data): Account[] =>
      accountsForUser(data.accountUsers, data.accounts, userId)
    );
  }

  insertAccountWithOwner(account: Account, owner: AccountOwner): Promise<void> {
    return this.session.write(async (data, save): Promise<void> => {
      data.accounts.push(account);
      data.accountUsers.push(ownerAccountUser(account.id, owner));
      await save();
    });
  }
}
