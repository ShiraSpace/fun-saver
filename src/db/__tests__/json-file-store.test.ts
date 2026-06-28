import {
  mkdtempSync,
  rmSync,
  existsSync,
  writeFileSync,
  readFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { JsonFileStore } from '../json-file-store';
import { mockAccount, createMockTransaction } from '@/test-support/fixtures';

const deposit = createMockTransaction();

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

  it('persists accounts with embedded wallets across instances', async () => {
    await new JsonFileStore(filePath).insertAccount(mockAccount);

    const reopened = new JsonFileStore(filePath);
    expect(await reopened.listAccounts()).toEqual([mockAccount]);
    expect(
      (await reopened.getAccount('a1'))?.wallets.map((wallet) => wallet.id)
    ).toEqual(['w1', 'w2', 'w3']);
  });

  it('persists transactions across instances', async () => {
    const store = new JsonFileStore(filePath);
    await store.insertAccount(mockAccount);
    await store.insertTransactions([deposit]);

    const reopened = new JsonFileStore(filePath);
    expect(
      (await reopened.listTransactionsByWallet('w1')).map(
        (transaction) => transaction.id
      )
    ).toEqual(['t1']);
  });

  it('persists an account theme change across instances', async () => {
    await new JsonFileStore(filePath).insertAccount(mockAccount);

    await new JsonFileStore(filePath).setAccountTheme('a1', 'midnight-blue');

    expect((await new JsonFileStore(filePath).getAccount('a1'))?.themeId).toBe(
      'midnight-blue'
    );
  });

  it('keeps every transaction when inserts run concurrently', async () => {
    const store = new JsonFileStore(filePath);
    await store.insertAccount(mockAccount);

    await Promise.all([
      store.insertTransactions([createMockTransaction({ id: 'c1' })]),
      store.insertTransactions([createMockTransaction({ id: 'c2' })]),
      store.insertTransactions([createMockTransaction({ id: 'c3' })]),
    ]);

    const ids = (await store.listTransactionsByWallet('w1'))
      .map((transaction) => transaction.id)
      .sort();
    expect(ids).toEqual(['c1', 'c2', 'c3']);
  });

  it('never erases existing data when a read hits an unparsable file', async () => {
    const store = new JsonFileStore(filePath);
    await store.insertAccount(mockAccount);

    writeFileSync(filePath, '{ "accounts": [partial', 'utf8');

    await expect(store.listAccounts()).rejects.toThrow();
    expect(readFileSync(filePath, 'utf8')).toContain('partial');
  });

  it('reads a file missing the transactions array', async () => {
    writeFileSync(
      filePath,
      JSON.stringify({ accounts: [mockAccount] }),
      'utf8'
    );
    const store = new JsonFileStore(filePath);

    expect(await store.listAccounts()).toEqual([mockAccount]);
    expect(await store.listTransactionsByWallet('w1')).toEqual([]);
  });
});
