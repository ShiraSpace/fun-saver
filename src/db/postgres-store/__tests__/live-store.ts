import { neon } from '@neondatabase/serverless';
import { PostgresStore } from '../index';

export const liveDatabaseUrl = process.env.TEST_DATABASE_URL;

export interface LiveStore {
  store: PostgresStore;
  accountId: (suffix: string) => string;
  txId: (suffix: string) => string;
}

export function withLiveStore(url: string): LiveStore {
  const runPrefix = `it-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const store = new PostgresStore(url);
  const cleanupSql = neon(url);

  afterEach(async () => {
    await cleanupSql`DELETE FROM transactions WHERE id LIKE ${runPrefix + '%'}`;
    await cleanupSql`DELETE FROM accounts WHERE id LIKE ${runPrefix + '%'}`;
  });

  return {
    store,
    accountId: (suffix: string): string => `${runPrefix}-a-${suffix}`,
    txId: (suffix: string): string => `${runPrefix}-t-${suffix}`,
  };
}
