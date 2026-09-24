import { ValidationError } from '@/lib/errors';
import { JsonFileStore } from './json-file-store';
import { PostgresStore } from './postgres-store';
import type { DataStore } from './data-store';

const DEFAULT_PATH = 'src/db/data.json';

interface CachedStore {
  key: string;
  store: DataStore;
}

type StoreBackend =
  { kind: 'json'; path: string } | { kind: 'postgres'; url: string };

let cached: CachedStore | null = null;

export function getStore(): DataStore {
  const backend = configuredBackend();
  const key = backendKey(backend);

  if (cached?.key !== key) {
    cached = { key, store: storeFor(backend) };
  }

  return cached.store;
}

function configuredBackend(): StoreBackend {
  return jsonFileBackend() ?? postgresBackend() ?? defaultJsonFileBackend();
}

function jsonFileBackend(): StoreBackend | undefined {
  const path = process.env.FUNSAVER_DATA_PATH;

  return path ? { kind: 'json', path } : undefined;
}

function postgresBackend(): StoreBackend | undefined {
  const url = databaseUrl();

  return url ? { kind: 'postgres', url } : undefined;
}

function defaultJsonFileBackend(): StoreBackend {
  if (process.env.NODE_ENV === 'test') {
    throw new ValidationError(
      `no store configured: set FUNSAVER_DATA_PATH, or call withTempStoreEnv(), rather than writing to ${DEFAULT_PATH}`
    );
  }

  return { kind: 'json', path: DEFAULT_PATH };
}

function backendKey(backend: StoreBackend): string {
  if (backend.kind === 'json') {
    return `json:${backend.path}`;
  }

  return `postgres:${backend.url}`;
}

function storeFor(backend: StoreBackend): DataStore {
  if (backend.kind === 'json') {
    return new JsonFileStore(backend.path);
  }

  return new PostgresStore(backend.url);
}

function databaseUrl(): string | undefined {
  if (process.env.NODE_ENV === 'development') {
    return process.env.DEV_DATABASE_URL;
  }

  return process.env.DATABASE_URL;
}
