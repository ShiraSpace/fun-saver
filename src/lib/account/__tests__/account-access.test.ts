import { InMemoryStore } from '@/db/memory-store';
import {
  createMockAccountUser,
  mockCoParent,
  mockUser,
} from '@/test-utils/mocks/general.mocks';
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
    expect(
      await canEditAccount({ store, userId: mockUser.id, accountId })
    ).toBe(true);
  });

  it('refuses a viewer, who may look at the account but not edit it', async () => {
    const mockViewerReader = {
      getAccountUser: async (): Promise<AccountUser> =>
        createMockAccountUser({
          accountId,
          userId: mockUser.id,
          role: 'viewer',
        }),
    };

    expect(
      await canEditAccount({
        store: mockViewerReader,
        userId: mockUser.id,
        accountId,
      })
    ).toBe(false);
  });

  it('refuses a signed-in stranger with no membership row', async () => {
    expect(
      await canEditAccount({
        store,
        userId: mockCoParent.id,
        accountId,
      })
    ).toBe(false);
  });
});
