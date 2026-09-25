/**
 * @jest-environment node
 */
import type { Account } from '@/lib/account/types';
import type { User } from '@/lib/user/types';
import { createMockAccount } from '@/test-utils/mocks/account.mocks';
import { createMockUser } from '@/test-utils/mocks/user.mocks';
import { withTestDatabase } from './test-database';

const mockAddedAt = '2026-01-01T00:00:00.000Z';

describe('PostgresAccountUsers', () => {
  const { store, sql, accountId, userId } = withTestDatabase();
  let mockFirstAccount: Account;
  let mockLaterAccount: Account;
  let mockStrangersAccount: Account;
  let mockOwner: User;
  let mockStranger: User;

  beforeEach(async () => {
    mockFirstAccount = createMockAccount({
      id: accountId('1'),
      name: 'eitan',
    });
    mockLaterAccount = createMockAccount({
      id: accountId('2'),
      name: 'Noa',
    });
    mockStrangersAccount = createMockAccount({ id: accountId('3') });
    mockOwner = createMockUser({
      id: userId('1'),
      providerAccountId: userId('sub-1'),
    });
    mockStranger = createMockUser({
      id: userId('2'),
      providerAccountId: userId('sub-2'),
    });

    await store.insertAccount(mockLaterAccount);
    await store.insertAccount(mockFirstAccount);
    await store.insertAccount(mockStrangersAccount);
    await store.insertUser(mockOwner);
    await store.insertUser(mockStranger);
    await sql`
      INSERT INTO account_users (account_id, user_id, role, added_at)
      VALUES (${mockLaterAccount.id}, ${mockOwner.id}, 'owner', ${mockAddedAt}),
             (${mockFirstAccount.id}, ${mockOwner.id}, 'owner', ${mockAddedAt}),
             (${mockStrangersAccount.id}, ${mockStranger.id}, 'owner', ${mockAddedAt})
    `;
  });

  it('reads the row joining the account and the user', async () => {
    expect(
      await store.getAccountUser(mockFirstAccount.id, mockOwner.id)
    ).toEqual({
      accountId: mockFirstAccount.id,
      userId: mockOwner.id,
      role: 'owner',
      addedAt: mockAddedAt,
    });
  });

  it('returns undefined for a user who is not on the account', async () => {
    expect(
      await store.getAccountUser(mockFirstAccount.id, mockStranger.id)
    ).toBeUndefined();
  });

  it('lists only the accounts the user belongs to', async () => {
    expect(
      (await store.listAccountsForUser(mockOwner.id)).map(
        (account) => account.id
      )
    ).toEqual([mockFirstAccount.id, mockLaterAccount.id]);
  });

  it('orders the accounts by name regardless of letter case', async () => {
    expect(
      (await store.listAccountsForUser(mockOwner.id)).map(
        (account) => account.name
      )
    ).toEqual([mockFirstAccount.name, mockLaterAccount.name]);
  });
});
