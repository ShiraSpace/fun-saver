import type { DataStore } from '@/db/data-store';
import { DEFAULT_THEME_ID } from '@/theme/registry';
import { now } from '@/lib/clock';
import { today } from '@/lib/clock';
import { newId } from '@/lib/ids';
import { DEFAULT_WALLETS } from '@/lib/wallet/constants';
import type { Account, AccountEdits } from './types';
import type { Wallet } from '@/lib/wallet/types';

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
