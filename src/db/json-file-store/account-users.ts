import type { Account, AccountUser } from '@/lib/account/types';
import { DuplicateAccountError, UnknownOwnerError } from '@/lib/account/errors';
import type { AccountOwner, AccountUserRepository } from '../data-store';
import {
  accountsForUser,
  findAccountUser,
  ownerAccountUser,
} from '../account-users';
import { isKnownUser } from '../user-identity';
import { findAccount } from './accounts';
import type { FileSession } from './file-session';

export class JsonAccountUsers implements AccountUserRepository {
  constructor(private readonly session: FileSession) {}

  get(accountId: string, userId: string): Promise<AccountUser | undefined> {
    return this.session.read((contents): AccountUser | undefined =>
      findAccountUser(contents.accountUsers, accountId, userId)
    );
  }

  listAccountsForUser(userId: string): Promise<Account[]> {
    return this.session.read((contents): Account[] =>
      accountsForUser(contents.accountUsers, contents.accounts, userId)
    );
  }

  insertAccountWithOwner(account: Account, owner: AccountOwner): Promise<void> {
    return this.session.write(async (contents, save): Promise<void> => {
      const accountExists = Boolean(findAccount(contents, account.id));

      if (accountExists) {
        throw new DuplicateAccountError(account.id);
      }

      const ownerIsKnownUser = isKnownUser(contents.users, owner.userId);

      if (!ownerIsKnownUser) {
        throw new UnknownOwnerError(owner.userId);
      }

      contents.accounts.push(account);
      contents.accountUsers.push(ownerAccountUser(account.id, owner));
      await save();
    });
  }
}
