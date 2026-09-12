import type { Account, AccountUser } from '@/lib/types';
import type { AccountUserRepository } from '../data-store';
import {
  toAccount,
  toAccountUser,
  type AccountRow,
  type AccountUserRow,
} from '../row-mappers';
import { selectRows, type Sql } from './query';

export class PostgresAccountUsers implements AccountUserRepository {
  constructor(private readonly sql: Sql) {}

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
}
