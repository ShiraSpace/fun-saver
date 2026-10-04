import { InMemoryStore } from '@/db/memory-store';
import { createMockViewer } from '@/test-utils/mocks/account.mocks';
import { mockCoParent, mockUser } from '@/test-utils/mocks/user.mocks';
import { createOwnedAccount } from '@/test-utils/owned-account';
import type { AccountUser } from '../types';
import { canEditAccount, isAccountUser } from '../account-access';

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
        createMockViewer(accountId),
    };

    expect(
      await canEditAccount({
        store: mockViewerReader,
        userId: mockCoParent.id,
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

describe('isAccountUser', () => {
  let store: InMemoryStore;
  let accountId: string;

  beforeEach(async () => {
    store = new InMemoryStore();
    accountId = (await createOwnedAccount(store)).id;
  });

  it('lets the owner of the account in', async () => {
    expect(await isAccountUser({ store, userId: mockUser.id, accountId })).toBe(
      true
    );
  });

  it('lets a viewer in, who may look at the account', async () => {
    const mockViewerReader = {
      getAccountUser: async (): Promise<AccountUser> =>
        createMockViewer(accountId),
    };

    expect(
      await isAccountUser({
        store: mockViewerReader,
        userId: mockCoParent.id,
        accountId,
      })
    ).toBe(true);
  });

  it('refuses a signed-in stranger with no membership row', async () => {
    expect(
      await isAccountUser({ store, userId: mockCoParent.id, accountId })
    ).toBe(false);
  });
});
