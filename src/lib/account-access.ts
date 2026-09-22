import type { DataStore } from '@/db/data-store';
import { EDITING_ROLES } from '@/lib/constants';

export async function canEditAccount(
  store: DataStore,
  userId: string,
  accountId: string
): Promise<boolean> {
  const accountUser = await store.getAccountUser(accountId, userId);

  return Boolean(accountUser && EDITING_ROLES.includes(accountUser.role));
}
