import { JsonFileStore } from '../index';
import { mockUser, createMockUser } from '@/test-utils/fixtures';
import { DuplicateUserError } from '@/lib/errors';
import { withTempStoreFile } from '@/test-utils/test-utils';

describe('JsonFileStore users', () => {
  const file = withTempStoreFile();

  it('persists a user across instances', async () => {
    await new JsonFileStore(file.path).insertUser(mockUser);

    expect(
      await new JsonFileStore(file.path).findUserByIdentity(
        'google',
        mockUser.providerAccountId
      )
    ).toEqual(mockUser);
  });

  it('rejects a second insert of the same provider identity', async () => {
    const store = new JsonFileStore(file.path);
    await store.insertUser(mockUser);

    await expect(
      store.insertUser(createMockUser({ id: 'u2' }))
    ).rejects.toThrow(DuplicateUserError);
  });

  it('rejects a second insert of the same id', async () => {
    const store = new JsonFileStore(file.path);
    await store.insertUser(mockUser);

    await expect(
      store.insertUser(createMockUser({ providerAccountId: 'google-sub-2' }))
    ).rejects.toThrow(DuplicateUserError);
  });
});
