import { neon } from '@neondatabase/serverless';
import { BaseStore } from '../base-store';
import { PostgresAccounts } from './accounts';
import { PostgresAccountUsers } from './account-users';
import { PostgresTransactions } from './transactions';
import { PostgresUsers } from './users';

export class PostgresStore extends BaseStore {
  constructor(databaseUrl: string) {
    const sql = neon(databaseUrl);
    const accounts = new PostgresAccounts(sql);

    super(
      accounts,
      new PostgresTransactions(sql),
      new PostgresUsers(sql),
      new PostgresAccountUsers(sql, accounts)
    );
  }
}
