import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccounts } from '@/components/Home/accounts-context';
import type { AppViewMode } from '@/lib/account/view-mode';
import { fetchJson } from '@/lib/fetch-json';
import { useMenu, useOnMenuClose } from '../use-menu-state';

interface AccountViewMode {
  chooseViewMode: (viewMode: AppViewMode) => void;
  saveFailed: boolean;
}

function accountViewModeEndpoint(accountId: string): string {
  return `/api/accounts/${accountId}/view-mode`;
}

export function useAccountViewMode(): AccountViewMode {
  const { currentAccount } = useAccounts();
  const { closeMenu } = useMenu();
  const router = useRouter();
  const [saveFailed, setSaveFailed] = useState(false);

  useOnMenuClose((): void => setSaveFailed(false));

  const chooseViewMode = (viewMode: AppViewMode): void => {
    setSaveFailed(false);

    void saveOnAccount();

    async function saveOnAccount(): Promise<void> {
      try {
        await fetchJson({
          url: accountViewModeEndpoint(currentAccount.id),
          method: 'PUT',
          body: { viewMode },
        });

        closeMenu();
        router.refresh();
      } catch {
        setSaveFailed(true);
      }
    }
  };

  return { chooseViewMode, saveFailed };
}
