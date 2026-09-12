import { JsonFileStore } from './json-file-store';
import { PostgresStore } from './postgres-store';
import type { DataStore } from './data-store';

const DEFAULT_PATH = 'src/db/data.json';

let cached: { key: string; store: DataStore } | null = null;

export function getStore(): DataStore {
  const isDev = process.env.NODE_ENV === 'development';
  const databaseUrl =
    (isDev && process.env.DEV_DATABASE_URL) || process.env.DATABASE_URL;

  if (databaseUrl) {
    const key = `postgres:${databaseUrl}`;
    if (cached?.key !== key) {
      cached = { key, store: new PostgresStore(databaseUrl) };
    }
    return cached.store;
  }

  const path = process.env.FUNSAVER_DATA_PATH ?? DEFAULT_PATH;
  const key = `json:${path}`;
  if (cached?.key !== key) {
    cached = { key, store: new JsonFileStore(path) };
  }
  return cached.store;
}
