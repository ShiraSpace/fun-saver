import { neon } from '@neondatabase/serverless';
import { RepositoryStore } from '../repository-store';
import { PostgresAccounts } from './accounts';
import { PostgresAccountUsers } from './account-users';
import { PostgresTransactions } from './transactions';
import { PostgresUsers } from './users';

export class PostgresStore extends RepositoryStore {
  constructor(databaseUrl: string) {
    const sql = neon(databaseUrl);

    super(
      new PostgresAccounts(sql),
      new PostgresTransactions(sql),
      new PostgresUsers(sql),
      new PostgresAccountUsers(sql)
    );
  }
}
