import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { Account } from '../lib/types';
import type { DataStore, StoreData } from './data-store';

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

  private async read(): Promise<StoreData> {
    try {
      const raw = await readFile(this.filePath, 'utf8');
      return JSON.parse(raw) as StoreData;
    } catch {
      const empty: StoreData = { accounts: [] };
      await this.persist(empty);
      return empty;
    }
  }

  private async persist(data: StoreData): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }
}
