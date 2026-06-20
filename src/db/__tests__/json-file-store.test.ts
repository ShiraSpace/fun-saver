import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { JsonFileStore } from '../json-file-store';
import { ACCOUNT } from '@/test-support/fixtures';

describe('JsonFileStore', () => {
  let directory: string;
  let filePath: string;

  beforeEach(() => {
    directory = mkdtempSync(join(tmpdir(), 'funsaver-'));
    filePath = join(directory, 'data.json');
  });

  afterEach(() => rmSync(directory, { recursive: true, force: true }));

  it('bootstraps an empty store file and lists no accounts', async () => {
    const store = new JsonFileStore(filePath);

    expect(await store.listAccounts()).toEqual([]);
    expect(existsSync(filePath)).toBe(true);
  });

  it('persists inserted accounts across instances', async () => {
    await new JsonFileStore(filePath).insertAccount(ACCOUNT);

    expect(await new JsonFileStore(filePath).listAccounts()).toEqual([ACCOUNT]);
  });
});
