import { InMemoryStore } from '../index';
import { mockUser, createMockUser } from '@/test-utils/fixtures';
import { DuplicateUserError } from '@/lib/errors';

describe('InMemoryStore users', () => {
  let store: InMemoryStore;

  beforeEach(async () => {
    store = new InMemoryStore();
    await store.insertUser(mockUser);
  });

  it('finds an inserted user by its provider identity', async () => {
    expect(
      await store.findUserByProvider('google', mockUser.providerAccountId)
    ).toEqual(mockUser);
  });

  it('returns undefined for an unknown provider account id', async () => {
    expect(
      await store.findUserByProvider('google', 'unknown-sub')
    ).toBeUndefined();
  });

  it('rejects a second insert of the same provider identity', async () => {
    await expect(
      store.insertUser(createMockUser({ id: 'u2' }))
    ).rejects.toThrow(DuplicateUserError);
  });

  it('rejects a second insert of the same id', async () => {
    await expect(
      store.insertUser(createMockUser({ providerAccountId: 'google-sub-2' }))
    ).rejects.toThrow(DuplicateUserError);
  });
});
