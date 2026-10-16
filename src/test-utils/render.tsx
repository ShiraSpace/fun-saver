import { ReactElement, ReactNode } from 'react';
import {
  render as renderWithRtl,
  renderHook as renderHookWithRtl,
  type RenderHookResult,
  type RenderResult,
} from '@testing-library/react';
import { AppThemeProvider } from '@/theme/AppThemeProvider';
import { DEFAULT_THEME_ID, type ThemeId } from '@/theme/registry';
import { AccountsProvider, type AccountsContextValue } from '@/components/Home/accounts-context';
import { SignedInUserProvider } from '@/components/Home/signed-in-user-context';
import { ViewModeProvider } from '@/components/Home/view-mode-context';
import { CollectedInterestProvider } from '@/components/Home/collected-interest-context';
import { LoaderProvider } from '@/hooks/loader-context';
import { VIEW_MODE, type ViewMode } from '@/lib/view-mode';
import {
  COLLECTED_INTEREST_COOKIE_PREFIX,
  collectedInterestCookie,
  VIEW_MODE_COOKIE,
} from '@/lib/cookies';
import type { CollectedInterestCookies } from '@/lib/interest/collected-interest';
import type { SignedInUser } from '@/lib/user/types';
import { setMockPathname } from '@mocks/next/navigation';

export interface RenderOptions {
  themeId?: ThemeId;
  user?: SignedInUser;
  accounts?: AccountsContextValue;
  route?: string;
  viewMode?: ViewMode;
  collectedInterest?: CollectedInterestCookies;
}

function withAccounts(element: ReactNode, accounts?: AccountsContextValue): ReactNode {
  if (!accounts) {
    return element;
  }

  return <AccountsProvider value={accounts}>{element}</AccountsProvider>;
}

function withUser(element: ReactNode, user?: SignedInUser): ReactNode {
  if (!user) {
    return element;
  }

  return <SignedInUserProvider value={user}>{element}</SignedInUserProvider>;
}

function setCollectedInterestCookies(collectedInterest: CollectedInterestCookies): void {
  document.cookie
    .split('; ')
    .filter((nameAndValue) => nameAndValue.startsWith(COLLECTED_INTEREST_COOKIE_PREFIX))
    .forEach((nameAndValue) => {
      document.cookie = `${nameAndValue.split('=')[0]}=; max-age=0`;
    });
  Object.entries(collectedInterest).forEach(([accountId, storedCollectedInterest]) => {
    document.cookie = `${collectedInterestCookie(accountId)}=${storedCollectedInterest}`;
  });
}

interface AppProvidersProps {
  children: ReactNode;
}

function appProviders({
  themeId = DEFAULT_THEME_ID,
  user,
  accounts,
  route,
  viewMode = VIEW_MODE.parent,
  collectedInterest = {},
}: RenderOptions): (props: AppProvidersProps) => ReactElement {
  if (route) {
    setMockPathname(route);
  }

  document.cookie = `${VIEW_MODE_COOKIE}=${viewMode}`;
  setCollectedInterestCookies(collectedInterest);

  return function AppProviders({ children }: AppProvidersProps): ReactElement {
    return (
      <AppThemeProvider initialThemeId={themeId}>
        <ViewModeProvider value={viewMode}>
          <CollectedInterestProvider value={collectedInterest}>
            <LoaderProvider>{withUser(withAccounts(children, accounts), user)}</LoaderProvider>
          </CollectedInterestProvider>
        </ViewModeProvider>
      </AppThemeProvider>
    );
  };
}

export function render(element: ReactElement, options: RenderOptions = {}): RenderResult {
  return renderWithRtl(element, { wrapper: appProviders(options) });
}

export function renderHook<Result>(
  hook: () => Result,
  options: RenderOptions = {}
): RenderHookResult<Result, void> {
  return renderHookWithRtl(hook, { wrapper: appProviders(options) });
}

export * from '@testing-library/react';
