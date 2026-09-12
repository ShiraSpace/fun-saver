import { JsonFileStore } from '../index';
import { mockUser } from '@/test-utils/fixtures';
import { withTempStoreFile } from '@/test-utils/test-utils';

describe('JsonFileStore users', () => {
  const file = withTempStoreFile();

  it('persists a user across instances', async () => {
    await new JsonFileStore(file.path).insertUser(mockUser);

    expect(
      await new JsonFileStore(file.path).findUserByProvider(
        'google',
        mockUser.providerAccountId
      )
    ).toEqual(mockUser);
  });
});
