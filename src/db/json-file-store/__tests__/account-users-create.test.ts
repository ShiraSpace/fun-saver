import { JsonFileStore } from '../index';
import { DuplicateAccountError, UnknownOwnerError } from '@/lib/account/errors';
import {
  mockAccount,
  mockAccountUser,
  mockOwner,
  mockSiblingAccount,
  mockStrangerOwner,
  mockUser,
} from '@/test-utils/mocks/general.mocks';
import { withTempStoreFile } from '@/test-utils/test-utils';

describe('JsonFileStore creating an account with an owner', () => {
  const file = withTempStoreFile();
  let store: JsonFileStore;

  beforeEach(async () => {
    store = new JsonFileStore(file.path);

    await store.insertUser(mockUser);
    await store.insertAccountWithOwner(mockAccount, mockOwner);
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

  it('persists the account across instances', async () => {
    expect(
      await new JsonFileStore(file.path).getAccount(mockAccount.id)
    ).toEqual(mockAccount);
  });

  it('persists the owner row across instances', async () => {
    expect(
      await new JsonFileStore(file.path).getAccountUser(
        mockAccount.id,
        mockUser.id
      )
    ).toEqual(mockAccountUser);
  });

  it('lists the account for its owner across instances', async () => {
    expect(
      await new JsonFileStore(file.path).listAccountsForUser(mockUser.id)
    ).toEqual([mockAccount]);
  });
});
