import type { Account, AccountEdits } from '@/lib/account/types';
import { DuplicateAccountError } from '@/lib/account/errors';
import type { ThemeId } from '@/theme/registry';
import type { AccountRepository } from '../data-store';

export class MemoryAccounts implements AccountRepository {
  private readonly accounts: Account[] = [];

  async insert(account: Account): Promise<void> {
    if (this.find(account.id)) {
      throw new DuplicateAccountError(account.id);
    }

    this.accounts.push(account);
  }

  async list(): Promise<Account[]> {
    return [...this.accounts];
  }

  async get(id: string): Promise<Account | undefined> {
    return this.find(id);
  }

  async setTheme(id: string, themeId: ThemeId): Promise<Account | undefined> {
    const account = this.find(id);

    if (!account) {
      return;
    }

    account.themeId = themeId;

    return account;
  }

  async update(id: string, edits: AccountEdits): Promise<Account | undefined> {
    const account = this.find(id);

    if (!account) {
      return;
    }

    Object.assign(account, edits);

    return account;
  }

  private find(id: string): Account | undefined {
    return this.accounts.find((account) => account.id === id);
  }
}
