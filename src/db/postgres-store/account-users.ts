import type { Account, AccountUser } from '@/lib/types';
import type { AccountOwner, AccountUserRepository } from '../data-store';
import { byAccountName, ownerAccountUser } from '../account-users';
import {
  toAccount,
  toAccountUser,
  type AccountRow,
  type AccountUserRow,
} from '../row-mappers';
import { PostgresAccounts } from './accounts';
import { toAccountWriteError } from './errors';
import { selectRows, type Sql } from './query';

export class PostgresAccountUsers implements AccountUserRepository {
  private readonly accounts: PostgresAccounts;

  constructor(private readonly sql: Sql) {
    this.accounts = new PostgresAccounts(sql);
  }

  async get(
    accountId: string,
    userId: string
  ): Promise<AccountUser | undefined> {
    const rows = await selectRows<AccountUserRow>(
      this.sql,
      'SELECT * FROM account_users WHERE account_id = $1 AND user_id = $2',
      [accountId, userId]
    );

    return rows[0] ? toAccountUser(rows[0]) : undefined;
  }

  async listAccountsForUser(userId: string): Promise<Account[]> {
    const rows = await selectRows<AccountRow>(
      this.sql,
      `SELECT accounts.* FROM accounts
       JOIN account_users ON account_users.account_id = accounts.id
       WHERE account_users.user_id = $1`,
      [userId]
    );

    return byAccountName(rows.map(toAccount));
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
      throw toAccountWriteError(error, {
        accountId: account.id,
        ownerId: owner.userId,
      });
    }
  }
}
