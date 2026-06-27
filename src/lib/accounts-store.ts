import type { DataStore } from '@/db/data-store';
import { newId } from './ids';
import { DEFAULT_WALLETS } from './constants';
import type { Account, Wallet } from './types';

export interface CreateAccountInput {
  name: string;
  avatarId: string;
}

export class AccountsStore {
  constructor(private readonly store: DataStore) {}

  async createAccount(
    { avatarId, name }: CreateAccountInput,
    asOf: string
  ): Promise<Account> {
    const account: Account = {
      id: newId(),
      name,
      avatarId,
      isActive: true,
      wallets: this.buildDefaultWallets(asOf),
    };

    await this.store.insertAccount(account);

    return account;
  }

  private buildDefaultWallets(asOf: string): Wallet[] {
    return DEFAULT_WALLETS.map((seed) => ({
      id: newId(),
      name: seed.name,
      icon: seed.icon,
      monthlyInterestRate: seed.monthlyInterestRate,
      openedAt: asOf,
      lastInterestDate: asOf,
    }));
  }
}
