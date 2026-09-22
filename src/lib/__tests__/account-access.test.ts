import { InMemoryStore } from '@/db/memory-store';
import {
  createMockAccountUser,
  mockSecondUser,
  mockUser,
} from '@/test-utils/fixtures';
import { createOwnedAccount } from '@/test-utils/owned-account';
import type { AccountUser } from '../types';
import { canEditAccount } from '../account-access';

describe('canEditAccount', () => {
  let store: InMemoryStore;
  let accountId: string;

  beforeEach(async () => {
    store = new InMemoryStore();
    accountId = (await createOwnedAccount(store)).id;
  });

  it('lets the owner of the account edit it', async () => {
    expect(await canEditAccount(store, mockUser.id, accountId)).toBe(true);
  });

  it('refuses a viewer, who may look at the account but not edit it', async () => {
    const viewerReader = {
      getAccountUser: async (): Promise<AccountUser> =>
        createMockAccountUser({
          accountId,
          userId: mockUser.id,
          role: 'viewer',
        }),
    };

    expect(await canEditAccount(viewerReader, mockUser.id, accountId)).toBe(
      false
    );
  });

  it('refuses a signed-in stranger with no membership row', async () => {
    expect(await canEditAccount(store, mockSecondUser.id, accountId)).toBe(
      false
    );
  });
});
