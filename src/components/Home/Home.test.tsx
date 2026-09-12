import { JSX } from 'react';
import { fireEvent, render, screen } from '@/test-utils/render';
import { useThemeId } from '@/theme/ThemeController';
import { Home } from './Home';
import { TITLE_TEST_IDS } from '@/components/Header/CrossfadeTitle/constants';
import { MENU_OVERLAY_TEST_IDS } from '@/components/Menu/MenuOverlay/constants';
import { ACCOUNTS_SECTION_TEST_IDS } from '@/components/Menu/AccountsSection/constants';
import { EMPTY_STATE_TEST_IDS } from '@/components/EmptyState/constants';
import { CREATE_ACCOUNT_TEST_IDS } from '@/components/CreateAccount/constants';
import {
  mockAccount,
  mockDerivedWallets,
  mockSecondAccount,
} from '@/test-utils/fixtures';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { openMenu, renderHome } from './home-test-helpers';

const mockRefresh = jest.fn();
const mockPush = jest.fn();
const mockPersist = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: (): { refresh: jest.Mock; push: jest.Mock } => ({
    refresh: mockRefresh,
    push: mockPush,
  }),
}));

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

  describe('selecting an account', () => {
    beforeEach(() => {
      renderHome();
      openMenu();
    });

    it('switches to and persists the tapped account, then closes the menu', () => {
      fireEvent.click(screen.getAllByTestId(ACCOUNTS_SECTION_TEST_IDS.chip)[1]);

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
          themeId: 'sunshine-quest',
          wallets: mockDerivedWallets,
        },
        {
          ...mockSecondAccount,
          themeId: 'midnight-blue',
          wallets: mockDerivedWallets,
        },
      ];

      render(
        <>
          <Home accounts={themedAccounts} initialAccountId={mockAccount.id} />
          <ThemeProbe />
        </>
      );
      openMenu();

      expect(screen.getByTestId(ACTIVE_THEME_TEST_ID)).toHaveTextContent(
        'sunshine-quest'
      );

      fireEvent.click(screen.getAllByTestId(ACCOUNTS_SECTION_TEST_IDS.chip)[1]);

      expect(screen.getByTestId(ACTIVE_THEME_TEST_ID)).toHaveTextContent(
        'midnight-blue'
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
