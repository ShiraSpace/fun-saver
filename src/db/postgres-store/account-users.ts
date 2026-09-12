import type { Account, AccountUser } from '@/lib/types';
import type { AccountUserRepository } from '../data-store';
import { ownerAccountUser } from '../account-users';
import {
  toAccount,
  toAccountUser,
  type AccountUserRow,
  type AccountRow,
} from '../row-mappers';
import { PostgresAccounts } from './accounts';
import { selectRows, type Sql } from './query';

export class PostgresAccountUsers implements AccountUserRepository {
  constructor(
    private readonly sql: Sql,
    private readonly accounts: PostgresAccounts
  ) {}

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
       WHERE account_users.user_id = $1
       ORDER BY accounts.name`,
      [userId]
    );

    return rows.map(toAccount);
  }

  async insertAccountWithOwner(
    account: Account,
    ownerId: string,
    addedAt: string
  ): Promise<void> {
    const owner = ownerAccountUser(account.id, ownerId, addedAt);

    await this.sql.transaction([
      this.accounts.insertQuery(account),
      this.sql`
        INSERT INTO account_users (account_id, user_id, role, added_at)
        VALUES (${owner.accountId}, ${owner.userId}, ${owner.role}, ${owner.addedAt})
      `,
    ]);
  }
}
