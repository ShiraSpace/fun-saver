import type { Account, AccountUser } from '@/lib/types';
import type { AccountOwner, AccountUserRepository } from '../data-store';
import { sortedByName, ownerAccountUser } from '../account-users';
import {
  accountFromRow,
  accountUserFromRow,
  type AccountRow,
  type AccountUserRow,
} from '../rows';
import { PostgresAccounts } from './accounts';
import { accountWriteError } from './errors';
import { queryRows, type Sql } from './query';

export class PostgresAccountUsers implements AccountUserRepository {
  private readonly accounts: PostgresAccounts;

  constructor(private readonly sql: Sql) {
    this.accounts = new PostgresAccounts(sql);
  }

  async get(
    accountId: string,
    userId: string
  ): Promise<AccountUser | undefined> {
    const rows = await queryRows<AccountUserRow>(
      this.sql,
      'SELECT * FROM account_users WHERE account_id = $1 AND user_id = $2',
      [accountId, userId]
    );

    return rows[0] ? accountUserFromRow(rows[0]) : undefined;
  }

  async listAccountsForUser(userId: string): Promise<Account[]> {
    const rows = await queryRows<AccountRow>(
      this.sql,
      `SELECT accounts.* FROM accounts
       JOIN account_users ON account_users.account_id = accounts.id
       WHERE account_users.user_id = $1`,
      [userId]
    );

    return sortedByName(rows.map(accountFromRow));
  }

  async insertAccountWithOwner(
    account: Account,
    owner: AccountOwner
  ): Promise<void> {
    const accountUser = ownerAccountUser(account.id, owner);

    try {
      await this.sql.transaction([
        this.accounts.insertStatement(account),
        this.sql`
          INSERT INTO account_users (account_id, user_id, role, added_at)
          VALUES (${accountUser.accountId}, ${accountUser.userId}, ${accountUser.role}, ${accountUser.addedAt})
        `,
      ]);
    } catch (error) {
      throw accountWriteError(error, {
        accountId: account.id,
        ownerId: owner.userId,
      });
    }
  }
}
