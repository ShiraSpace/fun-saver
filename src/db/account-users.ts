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

export function byAccountName(accounts: Account[]): Account[] {
  return [...accounts].sort(
    (left, right) =>
      left.name.localeCompare(right.name) || left.id.localeCompare(right.id)
  );
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

  return byAccountName(
    accounts.filter((account) => accountIds.has(account.id))
  );
}
