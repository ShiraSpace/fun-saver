import type { DataStore } from '@/db/data-store';
import { EDITING_ROLES } from '@/lib/constants';

export type AccountUserReader = Pick<DataStore, 'getAccountUser'>;

interface CanEditAccountParams {
  store: AccountUserReader;
  userId: string;
  accountId: string;
}

export async function canEditAccount({
  store,
  userId,
  accountId,
}: CanEditAccountParams): Promise<boolean> {
  const accountUser = await store.getAccountUser(accountId, userId);

  return Boolean(accountUser && EDITING_ROLES.includes(accountUser.role));
}
