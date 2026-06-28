import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { Account, Transaction } from '../lib/types';
import type { ThemeId } from '@/theme/registry';
import type { DataStore, StoreData } from './data-store';

function emptyData(): StoreData {
  return { accounts: [], transactions: [] };
}

let writeSequence = 0;

export class JsonFileStore implements DataStore {
  private queue: Promise<unknown> = Promise.resolve();

  constructor(private readonly filePath: string) {}

  insertAccount(account: Account): Promise<void> {
    return this.enqueue(async (): Promise<void> => {
      const data = await this.readFromDisk();
      data.accounts.push(account);
      await this.persist(data);
    });
  }

  listAccounts(): Promise<Account[]> {
    return this.enqueue(
      async (): Promise<Account[]> => (await this.readFromDisk()).accounts
    );
  }

  getAccount(id: string): Promise<Account | undefined> {
    return this.enqueue(
      async (): Promise<Account | undefined> =>
        (await this.readFromDisk()).accounts.find(
          (account) => account.id === id
        )
    );
  }

  setAccountTheme(id: string, themeId: ThemeId): Promise<Account | undefined> {
    return this.enqueue(async (): Promise<Account | undefined> => {
      const data = await this.readFromDisk();
      const account = data.accounts.find((candidate) => candidate.id === id);

      if (!account) {
        return undefined;
      }

      account.themeId = themeId;
      await this.persist(data);

      return account;
    });
  }

  insertTransactions(transactions: Transaction[]): Promise<void> {
    return this.enqueue(async (): Promise<void> => {
      const data = await this.readFromDisk();
      data.transactions.push(...transactions);
      await this.persist(data);
    });
  }

  listTransactionsByWallet(walletId: string): Promise<Transaction[]> {
    return this.enqueue(
      async (): Promise<Transaction[]> =>
        (await this.readFromDisk()).transactions.filter(
          (transaction) => transaction.walletId === walletId
        )
    );
  }

  private enqueue<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.queue.then(operation, operation);
    this.queue = result.then(
      (): undefined => undefined,
      (): undefined => undefined
    );
    return result;
  }

  private async readFromDisk(): Promise<StoreData> {
    try {
      const raw = await readFile(this.filePath, 'utf8');
      return { ...emptyData(), ...(JSON.parse(raw) as Partial<StoreData>) };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        const empty = emptyData();
        await this.persist(empty);
        return empty;
      }

      throw error;
    }
  }

  private async persist(data: StoreData): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    const temporaryPath = `${this.filePath}.${process.pid}.${writeSequence++}.tmp`;
    await writeFile(temporaryPath, JSON.stringify(data, null, 2), 'utf8');
    await rename(temporaryPath, this.filePath);
  }
}
