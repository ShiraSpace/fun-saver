import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccounts } from '@/components/Home/accounts-context';
import { useSetThemeId, useThemeId } from '@/theme/AppThemeProvider';
import type { ThemeId } from '@/theme/registry';
import { fetchJson } from '@/lib/fetch-json';
import { useOnMenuClose } from '../use-menu-state';

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
  const { currentAccount } = useAccounts();
  const router = useRouter();
  const [saveFailed, setSaveFailed] = useState(false);

  useOnMenuClose((): void => setSaveFailed(false));

  const chooseTheme = (themeId: ThemeId): void => {
    const themeBeforeChange = activeThemeId;

    applyTheme(themeId);
    setSaveFailed(false);

    void rememberOnAccount();

    async function rememberOnAccount(): Promise<void> {
      try {
        await fetchJson({
          url: accountThemeEndpoint(currentAccount.id),
          method: 'PUT',
          body: { themeId },
        });

        router.refresh();
      } catch {
        applyTheme(themeBeforeChange);
        setSaveFailed(true);
      }
    }
  };

  return { activeThemeId, chooseTheme, saveFailed };
}
