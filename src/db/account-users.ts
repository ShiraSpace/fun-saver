import type { Account, AccountUser } from '@/lib/types';

export function findAccountUser(
  accountUsers: AccountUser[],
  accountId: string,
  userId: string
): AccountUser | undefined {
  return accountUsers.find(
    (accountUser) =>
      accountUser.accountId === accountId && accountUser.userId === userId
  );
}

export function ownerAccountUser(
  accountId: string,
  userId: string,
  addedAt: string
): AccountUser {
  return { accountId, userId, role: 'owner', addedAt };
}

export function accountsForUser(
  accountUsers: AccountUser[],
  accounts: Account[],
  userId: string
): Account[] {
  const accountIds = new Set(
    accountUsers
      .filter((accountUser) => accountUser.userId === userId)
      .map((accountUser) => accountUser.accountId)
  );

  return accounts
    .filter((account) => accountIds.has(account.id))
    .sort((left, right) => left.name.localeCompare(right.name));
}
