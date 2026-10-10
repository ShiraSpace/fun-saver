import { ReactElement, ReactNode } from 'react';
import {
  render as renderWithRtl,
  type RenderResult,
} from '@testing-library/react';
import { AppThemeProvider } from '@/theme/AppThemeProvider';
import { DEFAULT_THEME_ID, type ThemeId } from '@/theme/registry';
import {
  AccountsProvider,
  type AccountsContextValue,
} from '@/components/Home/accounts-context';
import { SignedInUserProvider } from '@/components/Home/signed-in-user-context';
import { ViewModeProvider } from '@/components/Home/view-mode-context';
import { NavigationProvider } from '@/components/Header/navigation-pending-context';
import { VIEW_MODE, type ViewMode } from '@/lib/view-mode';
import { VIEW_MODE_COOKIE } from '@/lib/cookies';
import type { SignedInUser } from '@/lib/user/types';
import { setMockPathname } from '@mocks/next/navigation';

export interface RenderOptions {
  themeId?: ThemeId;
  user?: SignedInUser;
  accounts?: AccountsContextValue;
  route?: string;
  viewMode?: ViewMode;
}

function withAccounts(
  element: ReactElement,
  accounts?: AccountsContextValue
): ReactElement {
  if (!accounts) {
    return element;
  }

  return <AccountsProvider value={accounts}>{element}</AccountsProvider>;
}

function withUser(element: ReactElement, user?: SignedInUser): ReactElement {
  if (!user) {
    return element;
  }

  return <SignedInUserProvider value={user}>{element}</SignedInUserProvider>;
}

interface AppProvidersProps {
  children: ReactNode;
}

export function render(
  element: ReactElement,
  {
    themeId = DEFAULT_THEME_ID,
    user,
    accounts,
    route,
    viewMode = VIEW_MODE.parent,
  }: RenderOptions = {}
): RenderResult {
  if (route) {
    setMockPathname(route);
  }

  document.cookie = `${VIEW_MODE_COOKIE}=${viewMode}`;

  const AppProviders = ({ children }: AppProvidersProps): ReactElement => (
    <AppThemeProvider initialThemeId={themeId}>
      <ViewModeProvider value={viewMode}>
        <NavigationProvider>
          {withUser(withAccounts(<>{children}</>, accounts), user)}
        </NavigationProvider>
      </ViewModeProvider>
    </AppThemeProvider>
  );

  return renderWithRtl(element, { wrapper: AppProviders });
}

export * from '@testing-library/react';
