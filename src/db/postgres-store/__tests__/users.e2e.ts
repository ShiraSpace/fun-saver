/**
 * @jest-environment node
 */
import type { User } from '@/lib/types';
import { createMockUser } from '@/test-utils/fixtures';
import { DuplicateUserError } from '@/lib/errors';
import { withLiveStore } from './live-store';

describe('PostgresUsers', () => {
  const { store, userId } = withLiveStore();
  let user: User;

  beforeEach(async () => {
    user = createMockUser({
      id: userId('1'),
      providerAccountId: userId('sub'),
    });
    await store.insertUser(user);
  });

  it('finds an inserted user by its provider identity', async () => {
    expect(
      await store.findUserByProvider('google', user.providerAccountId)
    ).toEqual(user);
  });

  it('returns undefined for an unknown provider account id', async () => {
    expect(
      await store.findUserByProvider('google', userId('missing'))
    ).toBeUndefined();
  });

  it('rejects a second insert of the same provider identity', async () => {
    await expect(
      store.insertUser(
        createMockUser({
          id: userId('2'),
          providerAccountId: user.providerAccountId,
        })
      )
    ).rejects.toThrow(DuplicateUserError);
  });
});
