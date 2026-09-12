import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { JsonFileStore } from '../index';
import { mockAccount } from '@/test-utils/fixtures';
import { withTempStoreFile } from '@/test-utils/test-utils';

describe('JsonFileStore file handling', () => {
  const file = withTempStoreFile();

  it('bootstraps an empty store file and lists no accounts', async () => {
    const store = new JsonFileStore(file.path);

    expect(await store.listAccounts()).toEqual([]);
    expect(existsSync(file.path)).toBe(true);
  });

  it('never erases existing data when a read hits an unparsable file', async () => {
    const store = new JsonFileStore(file.path);
    await store.insertAccount(mockAccount);

    writeFileSync(file.path, '{ "accounts": [partial', 'utf8');

    await expect(store.listAccounts()).rejects.toThrow();
    expect(readFileSync(file.path, 'utf8')).toContain('partial');
  });

  it('reads a file missing the transactions array', async () => {
    writeFileSync(
      file.path,
      JSON.stringify({ accounts: [mockAccount] }),
      'utf8'
    );
    const store = new JsonFileStore(file.path);

    expect(await store.listAccounts()).toEqual([mockAccount]);
    expect(await store.listTransactionsByWallet('a1', 'w1')).toEqual([]);
  });
});
