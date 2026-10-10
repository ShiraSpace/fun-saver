import {
  fireEvent,
  render,
  screen,
  waitFor,
  type RenderResult,
} from '@/test-utils/render';
import { Account } from './Account';
import { HEADER_TITLE_TEST_IDS } from '@/components/Header/HeaderTitle/constants';
import { BALANCE_BREAKDOWN_TEST_IDS } from './BalanceBreakdown/constants';
import { WALLET_LIST_TEST_IDS } from './WalletList/constants';
import { WALLET_CARD_TEST_IDS } from './WalletCard/constants';
import { TRANSACTION_DRAWER_TEST_IDS } from './TransactionDrawer/constants';
import { AMOUNT_KEYPAD_TEST_IDS } from './TransactionDrawer/AmountKeypad/constants';
import { ACCOUNT_COPY, ACCOUNT_TEST_IDS } from './constants';
import {
  createMockAccount,
  mockAccountsContext,
} from '@/test-utils/mocks/account.mocks';
import { mockWalletSummaries } from '@/test-utils/mocks/wallet.mocks';
import { mockUser } from '@/test-utils/mocks/user.mocks';
import type { AccountSummary } from '@/lib/account/types';
import { mockRouter } from '@mocks/next/navigation';

jest.mock('./TransactionDrawer/use-add-transaction');

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

  let view: RenderResult;

  beforeEach(() => {
    mockRouter.refresh.mockClear();
    view = render(<Account account={mockAccount} />, {
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

  describe('once a deposit is saved', () => {
    beforeEach(async () => {
      fireEvent.click(screen.getByTestId(ACCOUNT_TEST_IDS.newTransaction));
      fireEvent.click(screen.getByTestId(AMOUNT_KEYPAD_TEST_IDS.key('5')));
      fireEvent.click(screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.submit));
      await waitFor(() => expect(mockRouter.refresh).toHaveBeenCalled());
    });

    it('closes the drawer', () => {
      expect(
        screen.queryByTestId(TRANSACTION_DRAWER_TEST_IDS.drawer)
      ).not.toBeInTheDocument();
    });

    it('loads the new balances once', () => {
      expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the new balances arrive', () => {
    it('redraws the balance breakdown for a new total', () => {
      const breakdownBefore = screen.getByTestId(
        BALANCE_BREAKDOWN_TEST_IDS.card
      );
      const mockDepositAgorot = 500;
      const [savings, ...otherWallets] = mockWalletSummaries;
      const mockAccountAfterDeposit: AccountSummary = {
        ...mockAccount,
        wallets: [
          { ...savings, balance: savings.balance + mockDepositAgorot },
          ...otherWallets,
        ],
      };

      view.rerender(<Account account={mockAccountAfterDeposit} />);

      expect(screen.getByTestId(BALANCE_BREAKDOWN_TEST_IDS.card)).not.toBe(
        breakdownBefore
      );
    });

    it('leaves the balance breakdown alone when the total is the same', () => {
      const breakdownBefore = screen.getByTestId(
        BALANCE_BREAKDOWN_TEST_IDS.card
      );

      view.rerender(<Account account={{ ...mockAccount }} />);

      expect(screen.getByTestId(BALANCE_BREAKDOWN_TEST_IDS.card)).toBe(
        breakdownBefore
      );
    });
  });
});
