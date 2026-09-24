import { fireEvent, render, screen } from '@/test-utils/render';
import { Account } from './Account';
import { HEADER_TITLE_TEST_IDS } from '@/components/Header/HeaderTitle/constants';
import { BALANCE_BREAKDOWN_TEST_IDS } from './BalanceBreakdown/constants';
import { WALLET_LIST_TEST_IDS } from './WalletList/constants';
import { WALLET_CARD_TEST_IDS } from './WalletCard/constants';
import { TRANSACTION_DRAWER_TEST_IDS } from './TransactionDrawer/constants';
import { ACCOUNT_COPY, ACCOUNT_TEST_IDS } from './constants';
import {
  createMockAccount,
  mockAccountsContext,
  mockWalletSummaries,
  mockUser,
} from '@/test-utils/fixtures';
import type { AccountSummary } from '@/lib/types';

describe('Account', () => {
  const mockAccountId = 'account-1';
  const mockAccountName = 'יעל';
  const mockAvatarId = 'kid-01';

  const mockAccount: AccountSummary = {
    ...createMockAccount({
      id: mockAccountId,
      name: mockAccountName,
      avatarId: mockAvatarId,
    }),
    wallets: mockWalletSummaries,
  };

  beforeEach(() => {
    render(<Account account={mockAccount} />, {
      accounts: mockAccountsContext,
      user: mockUser,
    });
  });

  it('shows the account header with the account name', () => {
    expect(screen.getByTestId(HEADER_TITLE_TEST_IDS.title)).toHaveTextContent(
      mockAccountName
    );
  });

  it('shows the balance breakdown', () => {
    expect(
      screen.getByTestId(BALANCE_BREAKDOWN_TEST_IDS.card)
    ).toBeInTheDocument();
  });

  it('shows every wallet as a wallet card', () => {
    expect(screen.getByTestId(WALLET_LIST_TEST_IDS.label)).toBeInTheDocument();
    expect(screen.getAllByTestId(WALLET_CARD_TEST_IDS.card)).toHaveLength(3);
  });

  it('shows the new-transaction button', () => {
    const cta = screen.getByTestId(ACCOUNT_TEST_IDS.newTransaction);

    expect(cta.tagName).toBe('BUTTON');
    expect(cta).toHaveTextContent(ACCOUNT_COPY.newTransaction);
  });

  it('opens the transaction drawer when the CTA is clicked', () => {
    expect(
      screen.queryByTestId(TRANSACTION_DRAWER_TEST_IDS.drawer)
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId(ACCOUNT_TEST_IDS.newTransaction));

    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.drawer)
    ).toBeInTheDocument();
  });

  it('closes the drawer when the scrim is clicked', () => {
    fireEvent.click(screen.getByTestId(ACCOUNT_TEST_IDS.newTransaction));

    fireEvent.click(screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.scrim));

    expect(
      screen.queryByTestId(TRANSACTION_DRAWER_TEST_IDS.drawer)
    ).not.toBeInTheDocument();
  });
});
