import { writeFileSync } from 'node:fs';
import { JsonFileStore } from '../index';
import {
  createMockAccountUser,
  mockAccount,
  mockAccountUser,
  mockSiblingAccount,
  mockUser,
} from '@/test-utils/mocks/general.mocks';
import { withTempStoreFile } from '@/test-utils/test-utils';

const mockOtherUserId = 'u2';

describe('JsonFileStore account users', () => {
  const file = withTempStoreFile();
  let store: JsonFileStore;

  beforeEach(() => {
    writeFileSync(
      file.path,
      JSON.stringify({
        accounts: [mockAccount, mockSiblingAccount],
        accountUsers: [
          mockAccountUser,
          createMockAccountUser({
            accountId: mockSiblingAccount.id,
            userId: mockOtherUserId,
          }),
        ],
      }),
      'utf8'
    );
    store = new JsonFileStore(file.path);
  });

  it('reads the row joining the account and the user', async () => {
    expect(await store.getAccountUser(mockAccount.id, mockUser.id)).toEqual(
      mockAccountUser
    );
  });

  it('returns undefined for a user who is not on the account', async () => {
    expect(
      await store.getAccountUser(mockAccount.id, mockOtherUserId)
    ).toBeUndefined();
  });

  it('lists only the accounts the user belongs to', async () => {
    expect(await store.listAccountsForUser(mockUser.id)).toEqual([mockAccount]);
  });
});
