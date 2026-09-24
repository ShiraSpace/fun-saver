import type { DataStore } from '@/db/data-store';
import type { CreateAccountInput } from '@/lib/accounts-store';
import { AccountsStore } from '@/lib/accounts-store';
import type { Account, User } from '@/lib/types';
import { mockCreateAccountInput, mockUser } from './fixtures';

export interface CreateOwnedAccountOptions {
  input?: CreateAccountInput;
  owner?: User;
}

export async function createOwnedAccount(
  store: DataStore,
  {
    input = mockCreateAccountInput,
    owner = mockUser,
  }: CreateOwnedAccountOptions = {}
): Promise<Account> {
  const existing = await store.findUserByIdentity(
    owner.provider,
    owner.providerAccountId
  );

  if (!existing) {
    await store.insertUser(owner);
  }

  return new AccountsStore(store).createAccount({ input, ownerId: owner.id });
}
