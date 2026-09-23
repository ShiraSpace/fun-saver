import { JSX } from 'react';
import { render, screen } from '@/test-utils/render';
import { mockAccountsContext } from '@/test-utils/fixtures';
import { missingProviderMessage } from '@/hooks/create-required-context';
import { useAccounts, useOptionalAccounts } from './accounts-context';

const NAME_TESTID = 'current-account-name';
const OPTIONAL_TESTID = 'optional-account-name';
const NOTHING = 'nothing';

function CurrentAccountName(): JSX.Element {
  const { currentAccount } = useAccounts();

  return <span data-testid={NAME_TESTID}>{currentAccount.name}</span>;
}

function OptionalAccountName(): JSX.Element {
  const accounts = useOptionalAccounts();

  return (
    <span data-testid={OPTIONAL_TESTID}>
      {accounts ? accounts.currentAccount.name : NOTHING}
    </span>
  );
}

describe('useAccounts', () => {
  it('hands the account in view to whoever asks', () => {
    render(<CurrentAccountName />, { accounts: mockAccountsContext });

    expect(screen.getByTestId(NAME_TESTID)).toHaveTextContent(
      mockAccountsContext.currentAccount.name
    );
  });

  it('refuses to guess when no provider is above it', () => {
    expect(() => render(<CurrentAccountName />)).toThrow(
      missingProviderMessage('AccountsProvider')
    );
  });
});

describe('useOptionalAccounts', () => {
  it('hands over the same accounts when a provider is above it', () => {
    render(<OptionalAccountName />, { accounts: mockAccountsContext });

    expect(screen.getByTestId(OPTIONAL_TESTID)).toHaveTextContent(
      mockAccountsContext.currentAccount.name
    );
  });

  it('answers that there are none rather than throwing, so the empty state can ask', () => {
    render(<OptionalAccountName />);

    expect(screen.getByTestId(OPTIONAL_TESTID)).toHaveTextContent(NOTHING);
  });
});
