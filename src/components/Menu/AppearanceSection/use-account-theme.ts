import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccounts } from '@/components/AccountSwitcher/accounts-context';
import { useSetThemeId, useThemeId } from '@/theme/ThemeController';
import type { ThemeId } from '@/theme/registry';

interface AccountTheme {
  activeThemeId: ThemeId;
  chooseTheme: (themeId: ThemeId) => void;
  saveFailed: boolean;
}

function accountThemeEndpoint(accountId: string): string {
  return `/api/accounts/${accountId}/theme`;
}

export function useAccountTheme(): AccountTheme {
  const activeThemeId = useThemeId();
  const applyTheme = useSetThemeId();
  const { selectedAccountId } = useAccounts();
  const router = useRouter();
  const [saveFailed, setSaveFailed] = useState(false);

  const chooseTheme = (themeId: ThemeId): void => {
    const themeBeforeChange = activeThemeId;

    applyTheme(themeId);
    setSaveFailed(false);

    void rememberOnAccount();

    async function rememberOnAccount(): Promise<void> {
      try {
        const response = await fetch(accountThemeEndpoint(selectedAccountId), {
          method: 'PUT',
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ themeId }),
        });

        if (!response.ok) {
          throw new Error('failed to save account theme');
        }

        router.refresh();
      } catch {
        applyTheme(themeBeforeChange);
        setSaveFailed(true);
      }
    }
  };

  return { activeThemeId, chooseTheme, saveFailed };
}
