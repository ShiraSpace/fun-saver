import type { Account, AccountEdits } from '@/lib/types';

function accountEndpoint(accountId: string): string {
  return `/api/accounts/${accountId}`;
}

interface AccountUpdater {
  updateAccount: (id: string, edits: AccountEdits) => Promise<Account>;
}

export function useUpdateAccount(): AccountUpdater {
  const updateAccount = async (
    id: string,
    edits: AccountEdits
  ): Promise<Account> => {
    const response = await fetch(accountEndpoint(id), {
      method: 'PUT',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(edits),
    });

    if (!response.ok) {
      throw new Error('failed to update account');
    }

    return response.json();
  };

  return { updateAccount };
}
