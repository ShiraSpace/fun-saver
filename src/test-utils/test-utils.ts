import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export const mutableEnv = process.env as Record<string, string | undefined>;

export function withCleanEnv(keys: readonly string[]): void {
  let originalEnv: Record<string, string | undefined>;

  const clearKeys = (): void => {
    keys.forEach((key) => delete mutableEnv[key]);
  };

  beforeEach(() => {
    originalEnv = { ...mutableEnv };
    clearKeys();
  });

  afterEach(() => {
    clearKeys();
    Object.assign(mutableEnv, originalEnv);
  });
}

export function withTempDataPath(): void {
  let directory: string;

  beforeEach(() => {
    directory = mkdtempSync(join(tmpdir(), 'funsaver-'));
    mutableEnv.FUNSAVER_DATA_PATH = join(directory, 'data.json');
  });

  afterEach(() => {
    delete mutableEnv.FUNSAVER_DATA_PATH;
    rmSync(directory, { recursive: true, force: true });
  });
}

export interface TempStoreFile {
  path: string;
}

export function withTempStoreFile(): TempStoreFile {
  const file: TempStoreFile = { path: '' };
  let directory: string;

  beforeEach(() => {
    directory = mkdtempSync(join(tmpdir(), 'funsaver-'));
    file.path = join(directory, 'data.json');
  });

  afterEach(() => rmSync(directory, { recursive: true, force: true }));

  return file;
}
