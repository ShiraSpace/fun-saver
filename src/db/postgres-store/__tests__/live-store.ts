import { neon } from '@neondatabase/serverless';
import { PostgresStore } from '../index';
import type { Sql } from '../query';

function requiredDatabaseUrl(): string {
  const url = process.env.TEST_DATABASE_URL;

  if (!url) {
    throw new Error(
      'TEST_DATABASE_URL is required — npm run test:db reads it from .env.local'
    );
  }

  return url;
}

export interface LiveStore {
  store: PostgresStore;
  sql: Sql;
  accountId: (suffix: string) => string;
  transactionId: (suffix: string) => string;
  userId: (suffix: string) => string;
}

export function withLiveStore(): LiveStore {
  const url = requiredDatabaseUrl();
  const runPrefix = `it-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const store = new PostgresStore(url);
  const sql = neon(url);

  afterEach(async () => {
    await sql`DELETE FROM account_users WHERE account_id LIKE ${runPrefix + '%'} OR user_id LIKE ${runPrefix + '%'}`;
    await sql`DELETE FROM transactions WHERE id LIKE ${runPrefix + '%'}`;
    await sql`DELETE FROM accounts WHERE id LIKE ${runPrefix + '%'}`;
    await sql`DELETE FROM users WHERE id LIKE ${runPrefix + '%'}`;
  });

  return {
    store,
    sql,
    accountId: (suffix: string): string => `${runPrefix}-a-${suffix}`,
    transactionId: (suffix: string): string => `${runPrefix}-t-${suffix}`,
    userId: (suffix: string): string => `${runPrefix}-u-${suffix}`,
  };
}
