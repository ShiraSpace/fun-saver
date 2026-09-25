import type { DataStore } from '@/db/data-store';
import type { CreateAccountInput } from '@/lib/account/accounts-store';
import { AccountsStore } from '@/lib/account/accounts-store';
import type { Account } from '@/lib/account/types';
import type { User } from '@/lib/user/types';
import { mockCreateAccountInput } from '@/test-utils/mocks/account.mocks';
import { mockUser } from '@/test-utils/mocks/user.mocks';

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
