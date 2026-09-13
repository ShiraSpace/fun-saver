/**
 * @jest-environment node
 */
import type { Account, User } from '@/lib/types';
import {
  createMockAccount,
  createMockUser,
  mockAccountUser,
} from '@/test-utils/fixtures';
import { withLiveStore } from './live-store';

describe('PostgresAccountUsers creating an account with an owner', () => {
  const { store, accountId, userId } = withLiveStore();
  let mockNewAccount: Account;
  let mockOwner: User;

  beforeEach(async () => {
    mockNewAccount = createMockAccount({ id: accountId('1') });
    mockOwner = createMockUser({
      id: userId('1'),
      providerAccountId: userId('sub-1'),
    });
    await store.insertUser(mockOwner);
    await store.insertAccountWithOwner(mockNewAccount, {
      userId: mockOwner.id,
      addedAt: mockAccountUser.addedAt,
    });
  });

  it('writes the account', async () => {
    expect(await store.getAccount(mockNewAccount.id)).toEqual(mockNewAccount);
  });

  it('writes an owner row for the account', async () => {
    expect(await store.getAccountUser(mockNewAccount.id, mockOwner.id)).toEqual(
      {
        accountId: mockNewAccount.id,
        userId: mockOwner.id,
        role: 'owner',
        addedAt: mockAccountUser.addedAt,
      }
    );
  });

  it('lists the account for its owner', async () => {
    expect(await store.listAccountsForUser(mockOwner.id)).toEqual([
      mockNewAccount,
    ]);
  });

  describe('when the owner row cannot be written', () => {
    let mockOrphanAccount: Account;

    beforeEach(async () => {
      mockOrphanAccount = createMockAccount({ id: accountId('2') });

      await expect(
        store.insertAccountWithOwner(mockOrphanAccount, {
          userId: userId('never-inserted'),
          addedAt: mockAccountUser.addedAt,
        })
      ).rejects.toThrow();
    });

    it('leaves no account behind', async () => {
      expect(await store.getAccount(mockOrphanAccount.id)).toBeUndefined();
    });
  });
});
