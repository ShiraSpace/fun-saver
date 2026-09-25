import type { Account, AccountEdits } from '@/lib/account/types';
import { fetchJson } from '@/lib/fetch-json';

function accountEndpoint(accountId: string): string {
  return `/api/accounts/${accountId}`;
}

interface AccountUpdater {
  updateAccount: (accountId: string, edits: AccountEdits) => Promise<Account>;
}

export function useUpdateAccount(): AccountUpdater {
  const updateAccount = (
    accountId: string,
    edits: AccountEdits
  ): Promise<Account> =>
    fetchJson<Account>({
      url: accountEndpoint(accountId),
      method: 'PUT',
      body: edits,
    });

  return { updateAccount };
}
