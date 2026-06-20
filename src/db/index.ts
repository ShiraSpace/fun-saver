import { JsonFileStore } from './json-file-store';
import type { DataStore } from './data-store';

const DEFAULT_PATH = 'src/db/data.json';

let cached: { path: string; store: DataStore } | null = null;

export function getStore(): DataStore {
  const path = process.env.FUNSAVER_DATA_PATH ?? DEFAULT_PATH;
  if (cached?.path !== path) {
    cached = { path, store: new JsonFileStore(path) };
  }
  return cached.store;
}

export type { DataStore } from './data-store';
