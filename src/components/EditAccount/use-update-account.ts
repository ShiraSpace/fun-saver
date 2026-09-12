import type { Account, AccountEdits } from '@/lib/types';
import { fetchJson } from '@/lib/fetch-json';

function accountEndpoint(accountId: string): string {
  return `/api/accounts/${accountId}`;
}

interface AccountUpdater {
  updateAccount: (id: string, edits: AccountEdits) => Promise<Account>;
}

export function useUpdateAccount(): AccountUpdater {
  const updateAccount = (id: string, edits: AccountEdits): Promise<Account> =>
    fetchJson<Account>({
      url: accountEndpoint(id),
      method: 'PUT',
      body: edits,
    });

  return { updateAccount };
}
