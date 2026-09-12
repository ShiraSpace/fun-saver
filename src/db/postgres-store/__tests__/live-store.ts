import { neon } from '@neondatabase/serverless';
import { PostgresStore } from '../index';

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
  accountId: (suffix: string) => string;
  txId: (suffix: string) => string;
  userId: (suffix: string) => string;
}

export function withLiveStore(): LiveStore {
  const url = requiredDatabaseUrl();
  const runPrefix = `it-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const store = new PostgresStore(url);
  const cleanupSql = neon(url);

  afterEach(async () => {
    await cleanupSql`DELETE FROM transactions WHERE id LIKE ${runPrefix + '%'}`;
    await cleanupSql`DELETE FROM accounts WHERE id LIKE ${runPrefix + '%'}`;
    await cleanupSql`DELETE FROM users WHERE id LIKE ${runPrefix + '%'}`;
  });

  return {
    store,
    accountId: (suffix: string): string => `${runPrefix}-a-${suffix}`,
    txId: (suffix: string): string => `${runPrefix}-t-${suffix}`,
    userId: (suffix: string): string => `${runPrefix}-u-${suffix}`,
  };
}
