/**
 * @jest-environment node
 */
import type { User } from '@/lib/types';
import { createMockUser } from '@/test-utils/mocks/general.mocks';
import { DuplicateUserError } from '@/lib/errors';
import { withTestDatabase } from './test-database';

describe('PostgresUsers', () => {
  const { store, userId } = withTestDatabase();
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
      await store.findUserByIdentity('google', mockUser.providerAccountId)
    ).toEqual(mockUser);
  });

  it('returns undefined for an unknown provider account id', async () => {
    expect(
      await store.findUserByIdentity('google', userId('missing'))
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

  it('rejects a second insert of the same id', async () => {
    await expect(
      store.insertUser(
        createMockUser({ id: mockUser.id, providerAccountId: userId('sub-2') })
      )
    ).rejects.toThrow(DuplicateUserError);
  });
});
