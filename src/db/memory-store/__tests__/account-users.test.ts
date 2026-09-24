import { InMemoryStore } from '../index';
import { DuplicateAccountError, UnknownOwnerError } from '@/lib/errors';
import {
  mockAccount,
  mockAccountUser,
  mockOwner,
  mockSiblingAccount,
  mockCoParent,
  mockStrangerOwner,
  mockUser,
} from '@/test-utils/fixtures';

describe('InMemoryStore account users', () => {
  let store: InMemoryStore;

  beforeEach(async () => {
    store = new InMemoryStore();
    await store.insertUser(mockUser);
    await store.insertUser(mockCoParent);
    await store.insertAccountWithOwner(mockAccount, mockOwner);
  });

  it('writes the account', async () => {
    expect(await store.getAccount(mockAccount.id)).toEqual(mockAccount);
  });

  it('writes an owner row for the account', async () => {
    expect(await store.getAccountUser(mockAccount.id, mockUser.id)).toEqual(
      mockAccountUser
    );
  });

  it('lists the account for its owner', async () => {
    expect(await store.listAccountsForUser(mockUser.id)).toEqual([mockAccount]);
  });

  it('does not list the account for anyone else', async () => {
    expect(await store.listAccountsForUser(mockCoParent.id)).toEqual([]);
  });

  it('rejects a second account with the same id', async () => {
    await expect(
      store.insertAccountWithOwner(mockAccount, mockOwner)
    ).rejects.toThrow(DuplicateAccountError);
  });

  it('rejects an owner that has no user row', async () => {
    await expect(
      store.insertAccountWithOwner(mockSiblingAccount, mockStrangerOwner)
    ).rejects.toThrow(UnknownOwnerError);
  });

  it('reports the duplicate account when the owner is also unknown', async () => {
    await expect(
      store.insertAccountWithOwner(mockAccount, mockStrangerOwner)
    ).rejects.toThrow(DuplicateAccountError);
  });

  it('keeps accounts owned by different users apart', async () => {
    await store.insertAccountWithOwner(mockSiblingAccount, {
      userId: mockCoParent.id,
      addedAt: mockAccountUser.addedAt,
    });

    expect(await store.listAccountsForUser(mockUser.id)).toEqual([mockAccount]);
  });
});
