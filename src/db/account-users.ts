import type { Account, AccountUser } from '@/lib/account/types';
import type { AccountOwner } from './data-store';

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
  owner: AccountOwner
): AccountUser {
  return {
    accountId,
    userId: owner.userId,
    role: 'owner',
    addedAt: owner.addedAt,
  };
}

export function sortedByName(accounts: Account[]): Account[] {
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

  return sortedByName(accounts.filter((account) => accountIds.has(account.id)));
}
