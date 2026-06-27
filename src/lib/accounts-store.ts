import type { DataStore } from '@/db/data-store';
import { DEFAULT_THEME_ID, type ThemeId } from '@/theme/registry';
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
      themeId: DEFAULT_THEME_ID,
      wallets: this.buildDefaultWallets(asOf),
    };

    await this.store.insertAccount(account);

    return account;
  }

  async setTheme(id: string, themeId: ThemeId): Promise<Account> {
    const account = await this.store.getAccount(id);

    if (!account) {
      throw new Error(`account "${id}" not found`);
    }

    await this.store.setAccountTheme(id, themeId);

    return { ...account, themeId };
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
