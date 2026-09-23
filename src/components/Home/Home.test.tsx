import { JSX } from 'react';
import { fireEvent, render, screen } from '@/test-utils/render';
import { useThemeId } from '@/theme/ThemeController';
import { THEME_ID } from '@/theme/registry';
import { Home } from './Home';
import { TITLE_TEST_IDS } from '@/components/Header/CrossfadeTitle/constants';
import { MENU_OVERLAY_TEST_IDS } from '@/components/Menu/MenuOverlay/constants';
import { ACCOUNT_LIST_TEST_IDS } from '@/components/Menu/AccountList/constants';
import { EMPTY_STATE_TEST_IDS } from '@/components/EmptyState/constants';
import { CREATE_ACCOUNT_TEST_IDS } from '@/components/CreateAccount/constants';
import {
  mockAccount,
  mockDerivedWallets,
  mockSecondAccount,
  mockUser,
} from '@/test-utils/fixtures';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { openAccountPicker } from '@/test-utils/account-picker';
import { openMenu, renderHome } from './home-test-helpers';

const mockPersist = jest.fn();

jest.mock('./selected-account-cookie', () => ({
  persistSelectedAccount: (accountId: string): void => mockPersist(accountId),
}));

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('viewing mode', () => {
    it('renders the account named by initialAccountId', () => {
      renderHome({ initialAccountId: mockSecondAccount.id });

      expect(screen.getByTestId(TITLE_TEST_IDS.title)).toHaveTextContent(
        mockSecondAccount.name
      );
    });

    it('renders the empty state when there are no accounts', () => {
      renderHome({ accounts: [], initialAccountId: '' });

      expect(
        screen.getByTestId(EMPTY_STATE_TEST_IDS.container)
      ).toBeInTheDocument();
    });
  });

  describe('reopening the menu after picking an account', () => {
    beforeEach(() => {
      renderHome();
      openMenu();
      openAccountPicker();
      fireEvent.click(screen.getAllByTestId(ACCOUNT_LIST_TEST_IDS.row)[1]);
      openMenu();
    });

    it('opens on the account it is showing rather than the whole list', () => {
      expect(
        screen.queryByTestId(ACCOUNT_LIST_TEST_IDS.list)
      ).not.toBeInTheDocument();
    });
  });

  describe('selecting an account', () => {
    beforeEach(() => {
      renderHome();
      openMenu();
      openAccountPicker();
    });

    it('switches to and persists the tapped account, then closes the menu', () => {
      fireEvent.click(screen.getAllByTestId(ACCOUNT_LIST_TEST_IDS.row)[1]);

      expect(screen.getByTestId(TITLE_TEST_IDS.title)).toHaveTextContent(
        mockSecondAccount.name
      );
      expect(mockPersist).toHaveBeenCalledWith(mockSecondAccount.id);
      expect(screen.getByTestId(MENU_OVERLAY_TEST_IDS.overlay)).toHaveAttribute(
        'data-open',
        'false'
      );
    });
  });

  describe('account theme', () => {
    const ACTIVE_THEME_TEST_ID = 'active-theme';

    function ThemeProbe(): JSX.Element {
      return <span data-testid={ACTIVE_THEME_TEST_ID}>{useThemeId()}</span>;
    }

    it('applies the tapped account theme', () => {
      const themedAccounts: AccountWithDerivedWallets[] = [
        {
          ...mockAccount,
          themeId: THEME_ID.sunshineQuest,
          wallets: mockDerivedWallets,
        },
        {
          ...mockSecondAccount,
          themeId: THEME_ID.midnightBlue,
          wallets: mockDerivedWallets,
        },
      ];

      render(
        <>
          <Home accounts={themedAccounts} initialAccountId={mockAccount.id} />
          <ThemeProbe />
        </>,
        { user: mockUser }
      );
      openMenu();
      openAccountPicker();

      expect(screen.getByTestId(ACTIVE_THEME_TEST_ID)).toHaveTextContent(
        THEME_ID.sunshineQuest
      );

      fireEvent.click(screen.getAllByTestId(ACCOUNT_LIST_TEST_IDS.row)[1]);

      expect(screen.getByTestId(ACTIVE_THEME_TEST_ID)).toHaveTextContent(
        THEME_ID.midnightBlue
      );
    });
  });

  it('opens the create overlay from the empty-state call to action', () => {
    renderHome({ accounts: [], initialAccountId: '' });

    fireEvent.click(screen.getByTestId(EMPTY_STATE_TEST_IDS.createAccount));
    fireEvent.animationEnd(screen.getByTestId(EMPTY_STATE_TEST_IDS.pig));

    expect(
      screen.getByTestId(CREATE_ACCOUNT_TEST_IDS.container)
    ).toBeInTheDocument();
  });
});
