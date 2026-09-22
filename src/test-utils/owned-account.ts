import type { DataStore } from '@/db/data-store';
import type { CreateAccountInput } from '@/lib/accounts-store';
import { AccountsStore } from '@/lib/accounts-store';
import type { Account } from '@/lib/types';
import { mockCreateAccountInput, mockUser } from './fixtures';

export async function createOwnedAccount(
  store: DataStore,
  input: CreateAccountInput = mockCreateAccountInput
): Promise<Account> {
  await store.insertUser(mockUser);

  return new AccountsStore(store).createAccount({
    input,
    ownerId: mockUser.id,
  });
}
