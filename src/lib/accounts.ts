import type { DataStore } from '../db/data-store';
import { newId } from './ids';
import type { Account } from './types';

export interface CreateAccountInput {
  name: string;
  avatarId: string;
}

export async function createAccount(
  store: DataStore,
  input: CreateAccountInput
): Promise<Account> {
  const account: Account = {
    id: newId(),
    name: input.name,
    avatarId: input.avatarId,
    isActive: true,
  };
  await store.insertAccount(account);
  return account;
}
