/**
 * @jest-environment node
 */
import type { User } from '@/lib/types';
import { createMockUser } from '@/test-utils/fixtures';
import { DuplicateUserError } from '@/lib/errors';
import { withLiveStore } from './live-store';

describe('PostgresUsers', () => {
  const { store, userId } = withLiveStore();
  let mockUser: User;

  beforeEach(async () => {
    mockUser = createMockUser({
      id: userId('1'),
      providerAccountId: userId('sub'),
    });
    await store.insertUser(mockUser);
  });

  it('finds an inserted user by its provider identity', async () => {
    expect(
      await store.findUserByProvider('google', mockUser.providerAccountId)
    ).toEqual(mockUser);
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
          providerAccountId: mockUser.providerAccountId,
        })
      )
    ).rejects.toThrow(DuplicateUserError);
  });
});
