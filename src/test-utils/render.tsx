import { ReactElement } from 'react';
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

  return renderWithRtl(
    <AppThemeProvider initialThemeId={themeId}>
      <ViewModeProvider value={viewMode}>
        {withUser(withAccounts(element, accounts), user)}
      </ViewModeProvider>
    </AppThemeProvider>
  );
}

export * from '@testing-library/react';
