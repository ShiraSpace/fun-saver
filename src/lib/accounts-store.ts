import type { DataStore } from '@/db/data-store';
import { newId } from './ids';
import type { Account } from './types';

export interface CreateAccountInput {
  name: string;
  avatarId: string;
}

export class AccountsStore {
  constructor(private readonly store: DataStore) {}

  async createAccount({
    avatarId,
    name,
  }: CreateAccountInput): Promise<Account> {
    const account: Account = {
      id: newId(),
      name,
      avatarId,
      isActive: true,
    };

    await this.store.insertAccount(account);

    return account;
  }
}
