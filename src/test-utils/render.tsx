import { JSX, ReactElement } from 'react';
import {
  render as renderWithRtl,
  type RenderResult,
} from '@testing-library/react';
import { ThemeController } from '@/theme/ThemeController';
import { DEFAULT_THEME_ID } from '@/theme/registry';
import {
  AccountsProvider,
  type AccountsContextValue,
} from '@/components/Home/accounts-context';
import { mockDerivedAccount, mockSecondDerivedAccount } from './fixtures';

function withProviders(ui: ReactElement): JSX.Element {
  return (
    <ThemeController initialThemeId={DEFAULT_THEME_ID}>{ui}</ThemeController>
  );
}

export function render(ui: ReactElement): RenderResult {
  return renderWithRtl(withProviders(ui));
}

export const mockAccountsContext: AccountsContextValue = {
  accounts: [mockDerivedAccount, mockSecondDerivedAccount],
  currentAccount: mockDerivedAccount,
  selectAccount: () => {},
};

export function renderWithAccounts(
  ui: ReactElement,
  value: AccountsContextValue = mockAccountsContext
): RenderResult {
  return render(<AccountsProvider value={value}>{ui}</AccountsProvider>);
}

export * from '@testing-library/react';
