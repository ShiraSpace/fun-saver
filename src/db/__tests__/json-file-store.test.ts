import { mkdtempSync, rmSync, existsSync, writeFileSync } from 'node:fs';
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
