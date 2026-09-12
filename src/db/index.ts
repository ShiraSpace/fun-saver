import { JsonFileStore } from './json-file-store';
import { PostgresStore } from './postgres-store';
import type { DataStore } from './data-store';

const DEFAULT_PATH = 'src/db/data.json';

let cached: { key: string; store: DataStore } | null = null;

export function getStore(): DataStore {
  const explicitJsonPath = process.env.FUNSAVER_DATA_PATH;
  const databaseUrl = explicitJsonPath ? undefined : resolveDatabaseUrl();
  const jsonPath = explicitJsonPath ?? DEFAULT_PATH;
  const key = databaseUrl ? `postgres:${databaseUrl}` : `json:${jsonPath}`;

  if (cached?.key !== key) {
    const store = databaseUrl
      ? new PostgresStore(databaseUrl)
      : new JsonFileStore(jsonPath);
    cached = { key, store };
  }
  return cached.store;
}

function resolveDatabaseUrl(): string | undefined {
  if (process.env.NODE_ENV === 'development') {
    return process.env.DEV_DATABASE_URL;
  }
  return process.env.DATABASE_URL;
}
