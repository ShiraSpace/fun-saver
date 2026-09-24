import type { DataStore } from '@/db/data-store';
import { DEFAULT_THEME_ID } from '@/theme/registry';
import { now } from './clock';
import { today } from './clock';
import { newId } from './ids';
import { DEFAULT_WALLETS } from './constants';
import type { Account, AccountEdits, Wallet } from './types';

export interface CreateAccountInput {
  name: string;
  avatarId: string;
}

export interface CreateAccountParams {
  input: CreateAccountInput;
  ownerId: string;
}

export class AccountsStore {
  constructor(private readonly store: DataStore) {}

  async createAccount({
    input: { avatarId, name },
    ownerId,
  }: CreateAccountParams): Promise<Account> {
    const account: Account = {
      id: newId(),
      name,
      avatarId,
      isActive: true,
      themeId: DEFAULT_THEME_ID,
      wallets: this.openDefaultWallets(),
    };

    await this.store.insertAccountWithOwner(account, {
      userId: ownerId,
      addedAt: now(),
    });

    return account;
  }

  async updateAccount(
    id: string,
    edits: AccountEdits
  ): Promise<Account | undefined> {
    return this.store.updateAccount(id, edits);
  }

  private openDefaultWallets(): Wallet[] {
    const openedAt = today();

    return DEFAULT_WALLETS.map((defaultWallet) => ({
      id: defaultWallet.name,
      name: defaultWallet.name,
      icon: defaultWallet.icon,
      monthlyInterestRate: defaultWallet.monthlyInterestRate,
      openedAt,
      lastInterestDate: openedAt,
    }));
  }
}
