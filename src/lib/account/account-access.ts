import type { DataStore } from '@/db/data-store';
import { EDITING_ROLES } from './constants';

export type AccountUserReader = Pick<DataStore, 'getAccountUser'>;

export interface AccountAccessParams {
  store: AccountUserReader;
  userId: string;
  accountId: string;
}

export async function canEditAccount({
  store,
  userId,
  accountId,
}: AccountAccessParams): Promise<boolean> {
  const accountUser = await store.getAccountUser(accountId, userId);

  return Boolean(accountUser && EDITING_ROLES.includes(accountUser.role));
}

export async function isAccountUser({
  store,
  userId,
  accountId,
}: AccountAccessParams): Promise<boolean> {
  return Boolean(await store.getAccountUser(accountId, userId));
}
