import type { DataStore } from '@/db/data-store';
import type { CreateAccountRequest } from '@/lib/account/types';
import { AccountsStore } from '@/lib/account/accounts-store';
import type { Account } from '@/lib/account/types';
import type { User } from '@/lib/user/types';
import { mockCreateAccountRequest } from '@/test-utils/mocks/account.mocks';
import { mockUser } from '@/test-utils/mocks/user.mocks';

export interface CreateOwnedAccountOptions {
  input?: CreateAccountRequest;
  owner?: User;
}

export async function createOwnedAccount(
  store: DataStore,
  { input = mockCreateAccountRequest, owner = mockUser }: CreateOwnedAccountOptions = {}
): Promise<Account> {
  const existing = await store.findUserByIdentity(owner.provider, owner.providerAccountId);

  if (!existing) {
    await store.insertUser(owner);
  }

  return new AccountsStore(store).createAccount({ input, ownerId: owner.id });
}
