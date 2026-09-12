import { JsonFileStore } from './json-file-store';
import { PostgresStore } from './postgres-store';
import type { DataStore } from './data-store';

const DEFAULT_PATH = 'src/db/data.json';

interface CachedStore {
  key: string;
  store: DataStore;
}

type Target =
  { kind: 'json'; path: string } | { kind: 'postgres'; url: string };

let cached: CachedStore | null = null;

export function getStore(): DataStore {
  const target = resolveTarget();
  const key = keyOf(target);

  if (cached?.key !== key) {
    cached = { key, store: buildStore(target) };
  }

  return cached.store;
}

function resolveTarget(): Target {
  return explicitJsonTarget() ?? postgresTarget() ?? defaultJsonTarget();
}

function explicitJsonTarget(): Target | undefined {
  const path = process.env.FUNSAVER_DATA_PATH;

  return path ? { kind: 'json', path } : undefined;
}

function postgresTarget(): Target | undefined {
  const url = resolveDatabaseUrl();

  return url ? { kind: 'postgres', url } : undefined;
}

function defaultJsonTarget(): Target {
  return { kind: 'json', path: DEFAULT_PATH };
}

function keyOf(target: Target): string {
  if (target.kind === 'json') {
    return `json:${target.path}`;
  }

  return `postgres:${target.url}`;
}

function buildStore(target: Target): DataStore {
  if (target.kind === 'json') {
    return new JsonFileStore(target.path);
  }

  return new PostgresStore(target.url);
}

function resolveDatabaseUrl(): string | undefined {
  if (process.env.NODE_ENV === 'development') {
    return process.env.DEV_DATABASE_URL;
  }

  return process.env.DATABASE_URL;
}
