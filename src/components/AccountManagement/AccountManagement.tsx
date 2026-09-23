'use client';

import { JSX, ReactNode, useEffect } from 'react';
import { CreateAccount } from '@/components/CreateAccount';
import { EditAccount } from '@/components/EditAccount';
import type { AccountNavigation } from '@/hooks/use-account-navigation';
import { THEME_COOKIE, writeCookie } from '@/lib/cookies';
import { useThemeId } from '@/theme/ThemeController';
import { AppModeProvider } from './app-mode-context';
import { Overlay } from './AccountManagement.styles';

interface AccountManagementProps {
  navigation: AccountNavigation;
  children: ReactNode;
}

export function AccountManagement({
  navigation,
  children,
}: AccountManagementProps): JSX.Element {
  const { mode, setMode, cancel } = navigation;
  const themeId = useThemeId();

  useEffect((): void => {
    writeCookie(THEME_COOKIE, themeId);
  }, [themeId]);

  return (
    <AppModeProvider value={{ mode, setMode }}>
      {children}
      {navigation.isCreating && (
        <Overlay>
          <CreateAccount
            onCreated={navigation.showNewAccount}
            onCancel={cancel}
          />
        </Overlay>
      )}
      {navigation.editingAccount && (
        <Overlay>
          <EditAccount
            key={navigation.editingAccount.id}
            account={navigation.editingAccount}
            onUpdated={navigation.finishEditing}
            onCancel={cancel}
          />
        </Overlay>
      )}
    </AppModeProvider>
  );
}
