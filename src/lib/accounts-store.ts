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
    };

    await this.store.insertAccount(account);
    await this.seedDefaultWallets(account.id, asOf);

    return account;
  }

  private async seedDefaultWallets(
    accountId: string,
    asOf: string
  ): Promise<void> {
    for (const seed of DEFAULT_WALLETS) {
      const wallet: Wallet = {
        id: newId(),
        accountId,
        name: seed.name,
        icon: seed.icon,
        monthlyInterestRate: seed.monthlyInterestRate,
        openedAt: asOf,
        lastInterestDate: asOf,
      };
      await this.store.insertWallet(wallet);
    }
  }
}
