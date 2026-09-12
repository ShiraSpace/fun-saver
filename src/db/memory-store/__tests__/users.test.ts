import { InMemoryStore } from '../index';
import { mockUser } from '@/test-utils/fixtures';

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
});
