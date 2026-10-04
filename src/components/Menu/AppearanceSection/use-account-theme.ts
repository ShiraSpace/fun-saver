import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccounts } from '@/components/Home/accounts-context';
import { useSetThemeId, useThemeId } from '@/theme/AppThemeProvider';
import type { ThemeId } from '@/theme/registry';
import { fetchJson } from '@/lib/fetch-json';
import { REQUEST_STATE, type RequestState } from '@/lib/request-state';
import { useOnMenuClose } from '../use-menu-state';

interface AccountTheme {
  activeThemeId: ThemeId;
  chooseTheme: (themeId: ThemeId) => void;
  requestState: RequestState;
}

function accountThemeEndpoint(accountId: string): string {
  return `/api/accounts/${accountId}/theme`;
}

export function useAccountTheme(): AccountTheme {
  const activeThemeId = useThemeId();
  const applyTheme = useSetThemeId();
  const { currentAccount } = useAccounts();
  const router = useRouter();
  const [requestState, setRequestState] = useState<RequestState>(
    REQUEST_STATE.idle
  );

  useOnMenuClose((): void =>
    setRequestState((current) =>
      current === REQUEST_STATE.failed ? REQUEST_STATE.idle : current
    )
  );

  const chooseTheme = (themeId: ThemeId): void => {
    const themeBeforeChange = activeThemeId;

    applyTheme(themeId);
    setRequestState(REQUEST_STATE.pending);

    void rememberOnAccount();

    async function rememberOnAccount(): Promise<void> {
      try {
        await fetchJson({
          url: accountThemeEndpoint(currentAccount.id),
          method: 'PUT',
          body: { themeId },
        });

        setRequestState(REQUEST_STATE.idle);
        router.refresh();
      } catch {
        applyTheme(themeBeforeChange);
        setRequestState(REQUEST_STATE.failed);
      }
    }
  };

  return { activeThemeId, chooseTheme, requestState };
}
