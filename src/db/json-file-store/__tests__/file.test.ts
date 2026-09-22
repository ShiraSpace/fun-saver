import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { JsonFileStore } from '../index';
import { mockAccount } from '@/test-utils/fixtures';
import { withTempStoreFile } from '@/test-utils/test-utils';

describe('JsonFileStore file handling', () => {
  const file = withTempStoreFile();

  describe('a file that does not exist yet', () => {
    let store: JsonFileStore;

    beforeEach(() => {
      store = new JsonFileStore(file.path);
    });

    it('has no accounts', async () => {
      expect(await store.getAccount(mockAccount.id)).toBeUndefined();
    });

    it('bootstraps the store file on the first read', async () => {
      await store.getAccount(mockAccount.id);

      expect(existsSync(file.path)).toBe(true);
    });
  });

  it('never erases existing data when a read hits an unparsable file', async () => {
    const store = new JsonFileStore(file.path);
    await store.insertAccount(mockAccount);

    writeFileSync(file.path, '{ "accounts": [partial', 'utf8');

    await expect(store.getAccount(mockAccount.id)).rejects.toThrow();
    expect(readFileSync(file.path, 'utf8')).toContain('partial');
  });

  describe('a file written before transactions, users and account users existed', () => {
    let store: JsonFileStore;

    beforeEach(() => {
      writeFileSync(
        file.path,
        JSON.stringify({ accounts: [mockAccount] }),
        'utf8'
      );
      store = new JsonFileStore(file.path);
    });

    it('reads the accounts it does have', async () => {
      expect(await store.getAccount(mockAccount.id)).toEqual(mockAccount);
    });

    it('defaults the missing transactions', async () => {
      expect(await store.listTransactionsByWallet('a1', 'w1')).toEqual([]);
    });

    it('defaults the missing users', async () => {
      expect(
        await store.findUserByProvider('google', 'any-sub')
      ).toBeUndefined();
    });

    it('defaults the missing account users', async () => {
      expect(await store.listAccountsForUser('u1')).toEqual([]);
    });
  });
});
