import type { Account, AccountUser } from '@/lib/types';
import type { AccountOwner } from './data-store';
import { ownerAccountUser } from './account-users';

export interface AssignOwnersParams {
  accounts: Account[];
  accountUsers: AccountUser[];
  owner: AccountOwner;
}

export function assignOwners({
  accounts,
  accountUsers,
  owner,
}: AssignOwnersParams): AccountUser[] {
  const claimedAccountIds = new Set(
    accountUsers.map((accountUser) => accountUser.accountId)
  );

  return accounts
    .filter((account) => !claimedAccountIds.has(account.id))
    .map((account) => ownerAccountUser(account.id, owner));
}
