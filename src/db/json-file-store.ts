import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { Account, Transaction } from '../lib/types';
import type { DataStore, StoreData } from './data-store';

function emptyData(): StoreData {
  return { accounts: [], transactions: [] };
}

export class JsonFileStore implements DataStore {
  constructor(private readonly filePath: string) {}

  async insertAccount(account: Account): Promise<void> {
    const data = await this.read();
    data.accounts.push(account);
    await this.persist(data);
  }

  async listAccounts(): Promise<Account[]> {
    return (await this.read()).accounts;
  }

  async getAccount(id: string): Promise<Account | undefined> {
    return (await this.read()).accounts.find((account) => account.id === id);
  }

  async insertTransactions(transactions: Transaction[]): Promise<void> {
    const data = await this.read();
    data.transactions.push(...transactions);
    await this.persist(data);
  }

  async listTransactionsByWallet(walletId: string): Promise<Transaction[]> {
    return (await this.read()).transactions.filter(
      (transaction) => transaction.walletId === walletId
    );
  }

  private async read(): Promise<StoreData> {
    try {
      const raw = await readFile(this.filePath, 'utf8');
      return { ...emptyData(), ...(JSON.parse(raw) as Partial<StoreData>) };
    } catch {
      const empty = emptyData();
      await this.persist(empty);
      return empty;
    }
  }

  private async persist(data: StoreData): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }
}
