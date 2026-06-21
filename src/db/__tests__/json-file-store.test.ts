import { mkdtempSync, rmSync, existsSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { JsonFileStore } from '../json-file-store';
import { ACCOUNT } from '@/test-support/fixtures';
import type { Transaction, Wallet } from '@/lib/types';

const savings: Wallet = {
  id: 'w1',
  accountId: 'a1',
  name: 'savings',
  icon: '🐷',
  monthlyInterestRate: 0.15,
  openedAt: '2026-01-01',
  lastInterestDate: '2026-01-01',
};

const deposit: Transaction = {
  id: 't1',
  walletId: 'w1',
  type: 'deposit',
  amount: 5000,
  occurredAt: '2026-01-01',
};

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

  it('persists wallets and transactions across instances', async () => {
    const store = new JsonFileStore(filePath);
    await store.insertWallet(savings);
    await store.insertTransactions([deposit]);

    const reopened = new JsonFileStore(filePath);
    expect(
      (await reopened.listWalletsByAccount('a1')).map((w) => w.id)
    ).toEqual(['w1']);
    expect(
      (await reopened.listTransactionsByWallet('w1')).map((t) => t.id)
    ).toEqual(['t1']);
  });

  it('reads a legacy accounts-only file without wallets or transactions', async () => {
    writeFileSync(filePath, JSON.stringify({ accounts: [ACCOUNT] }), 'utf8');
    const store = new JsonFileStore(filePath);

    expect(await store.listAccounts()).toEqual([ACCOUNT]);
    expect(await store.listWalletsByAccount('a1')).toEqual([]);
    expect(await store.listTransactionsByWallet('w1')).toEqual([]);
  });
});
