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
import type { SignedInUser } from '@/lib/types';
import { setMockPathname } from '@mocks/next/navigation';

interface RenderOptions {
  themeId?: ThemeId;
  user?: SignedInUser;
  accounts?: AccountsContextValue;
  route?: string;
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
  { themeId = DEFAULT_THEME_ID, user, accounts, route }: RenderOptions = {}
): RenderResult {
  if (route) {
    setMockPathname(route);
  }

  return renderWithRtl(
    <AppThemeProvider initialThemeId={themeId}>
      {withUser(withAccounts(element, accounts), user)}
    </AppThemeProvider>
  );
}

export * from '@testing-library/react';
