import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getStore } from '../index';
import { mockAccount } from '@/test-support/fixtures';

describe('getStore', () => {
  let directory: string;
  const originalPath = process.env.FUNSAVER_DATA_PATH;

  beforeEach(() => {
    directory = mkdtempSync(join(tmpdir(), 'funsaver-'));
    process.env.FUNSAVER_DATA_PATH = join(directory, 'data.json');
  });

  afterEach(() => {
    process.env.FUNSAVER_DATA_PATH = originalPath;
    rmSync(directory, { recursive: true, force: true });
  });

  it('returns a file-backed store at FUNSAVER_DATA_PATH', async () => {
    await getStore().insertAccount(mockAccount);

    expect(existsSync(process.env.FUNSAVER_DATA_PATH as string)).toBe(true);
    expect(
      (await getStore().listAccounts()).map((account) => account.id)
    ).toEqual([mockAccount.id]);
  });

  it('memoizes one store per path', () => {
    expect(getStore()).toBe(getStore());
  });
});
