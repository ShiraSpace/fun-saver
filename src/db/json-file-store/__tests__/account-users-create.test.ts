import { JsonFileStore } from '../index';
import { mockAccount, mockAccountUser, mockUser } from '@/test-utils/fixtures';
import { withTempStoreFile } from '@/test-utils/test-utils';

const mockOwner = { userId: mockUser.id, addedAt: mockAccountUser.addedAt };

describe('JsonFileStore creating an account with an owner', () => {
  const file = withTempStoreFile();

  beforeEach(async () => {
    const store = new JsonFileStore(file.path);

    await store.insertUser(mockUser);
    await store.insertAccountWithOwner(mockAccount, mockOwner);
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
