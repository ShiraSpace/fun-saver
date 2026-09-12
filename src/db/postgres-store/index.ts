import { neon } from '@neondatabase/serverless';
import { BaseStore } from '../base-store';
import { PostgresAccounts } from './accounts';
import { PostgresTransactions } from './transactions';
import { PostgresUsers } from './users';

export class PostgresStore extends BaseStore {
  constructor(databaseUrl: string) {
    const sql = neon(databaseUrl);

    super(
      new PostgresAccounts(sql),
      new PostgresTransactions(sql),
      new PostgresUsers(sql)
    );
  }
}
